import { useEffect, useState } from 'react'

const AuthCallback = () => {
  const [message, setMessage] = useState('Signing you in...')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const error = params.get('error')

    if (error) {
      setMessage(decodeURIComponent(error))
      return
    }

    if (token) {
      localStorage.setItem('token', token)
      sessionStorage.removeItem('token')
      window.location.href = '/'
      return
    }

    setMessage('Unable to complete sign-in. Please try again.')
  }, [])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-elegant font-bold text-dark-900 dark:text-white">
          {message}
        </h1>
        <p className="text-sm text-dark-500 dark:text-dark-300">
          You can close this page if you are not redirected automatically.
        </p>
      </div>
    </div>
  )
}

export default AuthCallback
