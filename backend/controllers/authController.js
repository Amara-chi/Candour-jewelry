import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import cookie from 'cookie';
import { sendPasswordResetEmail } from '../utils/emailService.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const OAUTH_STATE_COOKIE = 'google_oauth_state';
const OAUTH_NONCE_COOKIE = 'google_oauth_nonce';
const OAUTH_COOKIE_MAX_AGE_MS = 10 * 60 * 1000;
const GOOGLE_CERTS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const GOOGLE_ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];
const googleCertCache = {
  certs: null,
  expiresAt: 0
};

const getCookieSigningSecret = () => {
  return process.env.JWT_SECRET;
};

const signCookieValue = (value, secret) => {
  const signature = crypto
    .createHmac('sha256', secret)
    .update(value)
    .digest('base64url');
  return `${value}.${signature}`;
};

const verifySignedCookieValue = (signedValue, secret) => {
  if (!signedValue || !secret) {
    return null;
  }

  const parts = signedValue.split('.');
  if (parts.length !== 2) {
    return null;
  }

  const [value, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(value)
    .digest('base64url');

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  return value;
};

const getGoogleCerts = async () => {
  if (googleCertCache.certs && Date.now() < googleCertCache.expiresAt) {
    return googleCertCache.certs;
  }

  const response = await fetch(GOOGLE_CERTS_URL);
  if (!response.ok) {
    throw new Error('Unable to fetch Google certs.');
  }

  const cacheControl = response.headers.get('cache-control') || '';
  const match = cacheControl.match(/max-age=(\d+)/);
  const maxAgeSeconds = match ? Number(match[1]) : 300;

  const certs = await response.json();
  googleCertCache.certs = certs;
  googleCertCache.expiresAt = Date.now() + maxAgeSeconds * 1000;

  return certs;
};

const decodeJwtSegment = (segment) => {
  return JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'));
};

const verifyGoogleIdToken = async (idToken, clientId) => {
  const segments = idToken.split('.');
  if (segments.length !== 3) {
    throw new Error('Invalid ID token format.');
  }

  const [headerSegment, payloadSegment, signatureSegment] = segments;
  const header = decodeJwtSegment(headerSegment);
  const payload = decodeJwtSegment(payloadSegment);

  const certs = await getGoogleCerts();
  const cert = certs[header.kid];

  if (!cert) {
    throw new Error('Unable to find matching Google cert.');
  }

  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(`${headerSegment}.${payloadSegment}`);
  verifier.end();

  const signature = Buffer.from(signatureSegment, 'base64url');
  const validSignature = verifier.verify(cert, signature);

  if (!validSignature) {
    throw new Error('Invalid ID token signature.');
  }

  if (payload.aud !== clientId) {
    throw new Error('Invalid ID token audience.');
  }

  if (!GOOGLE_ISSUERS.includes(payload.iss)) {
    throw new Error('Invalid ID token issuer.');
  }

  if (!payload.exp || payload.exp * 1000 <= Date.now()) {
    throw new Error('Expired ID token.');
  }

  return payload;
};

const buildGoogleAuthUrl = ({ state, nonce }) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri || !state) {
    return null;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: [
      'openid',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state
  });

  if (nonce) {
    params.set('nonce', nonce);
  }

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

const getFrontendUrl = (req) => {
  return (
    process.env.FRONTEND_URL ||
    req.headers.origin ||
    'https://candour-jewelry.vercel.app'
  );
};

const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  const resetTokenExpires = new Date(Date.now() + 30 * 60 * 1000);

  return { resetToken, resetTokenHash, resetTokenExpires };
};

// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        },
        message: 'User registered successfully'
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        },
        message: 'Login successful'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      const { resetToken, resetTokenHash, resetTokenExpires } = generateResetToken();
      user.resetPasswordToken = resetTokenHash;
      user.resetPasswordExpires = resetTokenExpires;
      await user.save();

      const resetUrl = `${getFrontendUrl(req)}/reset-password/${resetToken}`;
      await sendPasswordResetEmail(user.email, resetUrl);
    }

    return res.json({
      success: true,
      message: 'If an account exists, we sent password reset instructions to your email.'
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is required.'
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and confirm password are required.'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.'
      });
    }

    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is invalid or has expired.'
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({
      success: true,
      message: 'Password reset successful.'
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const googleAuth = async (req, res) => {
  if (!process.env.FRONTEND_URL) {
    return res.status(501).json({
      success: false,
      message: 'Google OAuth is not configured. Set FRONTEND_URL.'
    });
  }

  const signingSecret = getCookieSigningSecret();
  if (!signingSecret) {
    return res.status(500).json({
      success: false,
      message: 'Google OAuth is not configured. Set JWT_SECRET.'
    });
  }

  const state = crypto.randomBytes(32).toString('hex');
  const nonce = crypto.randomBytes(32).toString('hex');
  const authUrl = buildGoogleAuthUrl({ state, nonce });

  if (!authUrl) {
    return res.status(501).json({
      success: false,
      message: 'Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_REDIRECT_URI.'
    });
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: OAUTH_COOKIE_MAX_AGE_MS,
    path: '/api/auth'
  };

  res.cookie(OAUTH_STATE_COOKIE, signCookieValue(state, signingSecret), cookieOptions);
  res.cookie(OAUTH_NONCE_COOKIE, signCookieValue(nonce, signingSecret), cookieOptions);

  return res.redirect(authUrl);
};

export const googleCallback = async (req, res) => {
  const code = req.query.code;
  const returnedState = req.query.state;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  const signingSecret = getCookieSigningSecret();

  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Missing OAuth code.'
    });
  }

  if (!clientId || !clientSecret || !redirectUri) {
    return res.status(501).json({
      success: false,
      message: 'Google OAuth is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI.'
    });
  }

  if (!process.env.FRONTEND_URL) {
    return res.status(501).json({
      success: false,
      message: 'Google OAuth is not configured. Set FRONTEND_URL.'
    });
  }

  if (!signingSecret) {
    return res.status(500).json({
      success: false,
      message: 'Google OAuth is not configured. Set JWT_SECRET.'
    });
  }

  const frontendUrl = getFrontendUrl(req);
  const cookies = cookie.parse(req.headers.cookie || '');
  const storedState = verifySignedCookieValue(cookies[OAUTH_STATE_COOKIE], signingSecret);
  const storedNonce = verifySignedCookieValue(cookies[OAUTH_NONCE_COOKIE], signingSecret);

  res.clearCookie(OAUTH_STATE_COOKIE, { path: '/api/auth' });
  res.clearCookie(OAUTH_NONCE_COOKIE, { path: '/api/auth' });

  if (!storedState || !storedNonce || !returnedState || storedState !== returnedState) {
    return res.redirect(
      `${frontendUrl}/auth/callback?error=${encodeURIComponent('Invalid OAuth state.')}`
    );
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenResponse.ok) {
      await tokenResponse.text();
      return res.redirect(
        `${frontendUrl}/auth/callback?error=${encodeURIComponent('Unable to authenticate with Google.')}`
      );
    }

    const tokenData = await tokenResponse.json();
    const idToken = tokenData.id_token;

    if (!idToken) {
      return res.redirect(
        `${frontendUrl}/auth/callback?error=${encodeURIComponent('Missing Google ID token.')}`
      );
    }

    const profile = await verifyGoogleIdToken(idToken, clientId);

    if (profile.nonce !== storedNonce) {
      return res.redirect(
        `${frontendUrl}/auth/callback?error=${encodeURIComponent('Invalid OAuth nonce.')}`
      );
    }

    if (!profile?.email) {
      return res.redirect(
        `${frontendUrl}/auth/callback?error=${encodeURIComponent('Unable to retrieve Google profile.')}`
      );
    }

    let user = await User.findOne({ email: profile.email });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      user = await User.create({
        name: profile.name || profile.email.split('@')[0],
        email: profile.email,
        password: randomPassword,
        avatar: profile.picture || ''
      });
    }

    const token = generateToken(user._id);

    return res.redirect(
      `${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}`
    );
  } catch {
    return res.redirect(
      `${frontendUrl}/auth/callback?error=${encodeURIComponent('Google login failed.')}`
    );
  }
};

// Get current logged in user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update user details
export const updateDetails = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
