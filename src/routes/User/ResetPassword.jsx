import { useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { API_URL } from '../../config/api'

const ResetPassword = () => {
  const { token } = useParams({ from: '/reset-password/$token' })
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [status, setStatus] = useState({ loading: false, message: '', success: false })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ loading: true, message: '', success: false })

    try {
      const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Unable to reset password.')
      }

      setStatus({
        loading: false,
        message: data?.message || 'Password reset successfully.',
        success: true
      })
    } catch (error) {
      setStatus({
        loading: false,
        message: error.message || 'Unable to reset password.',
        success: false
      })
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <p className="text-sm uppercase tracking-widest text-dark-400">Account Recovery</p>
          <h1 className="text-3xl font-elegant font-bold text-dark-900 dark:text-white">
            Reset Your Password
          </h1>
          <p className="text-sm text-dark-500 dark:text-dark-300 mt-2">
            Enter a new password below. Passwords must be at least 6 characters.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-2" htmlFor="password">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full rounded-lg border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-900 px-4 py-3 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-400"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-200 mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="w-full rounded-lg border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-900 px-4 py-3 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-400"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {status.message ? (
            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                status.success
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-200'
                  : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-200'
              }`}
            >
              {status.message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={status.loading}
            className="w-full rounded-lg bg-gold-500 text-white font-semibold py-3 transition hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status.loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-dark-500 dark:text-dark-300">
          Remember your password?{' '}
          <Link to="/" className="text-gold-600 hover:text-gold-500 font-semibold">
            Return to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
