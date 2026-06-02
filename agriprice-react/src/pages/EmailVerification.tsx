import React, { useState, useEffect } from 'react'
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

type VerificationStep = 'verifying' | 'success' | 'error' | 'resend'

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState<VerificationStep>('verifying')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    // Auto-verify on mount
    const verifyEmail = async () => {
      const token = searchParams.get('token')
      if (!token) {
        setStep('error')
        setError('No verification token provided')
        return
      }

      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setStep('success')
        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } catch (err) {
        setStep('error')
        setError('Verification failed. Token may have expired.')
      } finally {
        setIsLoading(false)
      }
    }

    verifyEmail()
  }, [searchParams])

  const handleResendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email')
      return
    }

    setIsLoading(true)
    setResendCooldown(60)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStep('resend')
      setError('')

      // Countdown
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err) {
      setError('Failed to resend email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Verifying Step */}
        {step === 'verifying' && (
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <Loader className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Verifying Email</h2>
            <p className="text-slate-600">Please wait while we verify your email address...</p>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Email Verified!</h2>
            <p className="text-slate-600 mb-6">Your email has been successfully verified. Redirecting to login...</p>
            <div className="inline-block">
              <Loader className="w-5 h-5 text-blue-600 animate-spin" />
            </div>
          </div>
        )}

        {/* Error Step */}
        {step === 'error' && (
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h2>
            <p className="text-slate-600 mb-6">{error || 'Unable to verify your email. The link may have expired.'}</p>
            <button
              onClick={() => setStep('resend')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
            >
              Resend Verification Email
            </button>
            <a
              href="/login"
              className="block text-blue-600 hover:text-blue-700 font-medium mt-4"
            >
              Back to Login
            </a>
          </div>
        )}

        {/* Resend Step */}
        {step === 'resend' && (
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Resend Verification Email</h2>
            <p className="text-slate-600 mb-6">Enter your email address to receive a new verification link.</p>

            <form onSubmit={handleResendEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || resendCooldown > 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Send Verification Email'}
              </button>
            </form>

            <a
              href="/login"
              className="block text-center text-blue-600 hover:text-blue-700 font-medium mt-4"
            >
              Back to Login
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailVerification
