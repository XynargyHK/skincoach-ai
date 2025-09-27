'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface UserRegistrationProps {
  onComplete: () => void
}

const UserRegistrationComponent = ({ onComplete }: UserRegistrationProps) => {
  const { user } = useAuth()
  const [step, setStep] = useState<'info' | 'verify'>('info')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    countryCode: '+1'
  })
  const [verificationCode, setVerificationCode] = useState('')
  const [sentCode, setSentCode] = useState('')
  const [error, setError] = useState('')

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Name is required')
      }

      if (!formData.mobile.trim()) {
        throw new Error('Mobile number is required')
      }

      // Format phone number
      const fullPhoneNumber = `${formData.countryCode}${formData.mobile.replace(/[^0-9]/g, '')}`

      // Send verification code
      const response = await fetch('/api/sms/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: fullPhoneNumber,
          name: formData.name
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send verification code')
      }

      setSentCode(result.code) // In development, we might return the code
      setStep('verify')

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!verificationCode.trim()) {
        throw new Error('Verification code is required')
      }

      // Verify the code
      const response = await fetch('/api/sms/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: `${formData.countryCode}${formData.mobile.replace(/[^0-9]/g, '')}`,
          code: verificationCode,
          name: formData.name,
          userId: user?.id
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Invalid verification code')
      }

      // Save quiz data if available
      const quizData = localStorage.getItem('skincoach_quiz_data')
      if (quizData && result.name && result.phone) {
        try {
          const parsedQuizData = JSON.parse(quizData)

          // Create anonymous user session with contact info for plan generation
          localStorage.setItem('skincoach_user_session', JSON.stringify({
            name: result.name,
            phone: result.phone,
            verified: true,
            quiz_data: parsedQuizData,
            registered_at: new Date().toISOString()
          }))

          // Clear the temporary quiz data
          localStorage.removeItem('skincoach_quiz_data')
        } catch (e) {
          console.error('Error processing quiz data:', e)
        }
      }

      // Successfully verified, proceed to personalized plan
      onComplete()

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return value
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 10) {
      setFormData({ ...formData, mobile: cleaned })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        {step === 'info' ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h1>
              <p className="text-slate-300">
                We need your contact information to provide personalized skincare coaching
              </p>
            </div>

            <form onSubmit={handleInfoSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Mobile Number *
                </label>
                <div className="flex gap-3">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className="px-3 py-3 rounded-xl bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+86">🇨🇳 +86</option>
                    <option value="+91">🇮🇳 +91</option>
                  </select>
                  <input
                    type="tel"
                    value={formatPhoneNumber(formData.mobile)}
                    onChange={handlePhoneChange}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
                <p className="text-slate-400 text-sm mt-2">
                  We'll send you a verification code via SMS
                </p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Verify Your Phone</h1>
              <p className="text-slate-300">
                We sent a verification code to {formatPhoneNumber(formData.mobile)}
              </p>
              {process.env.NODE_ENV === 'development' && (
                <p className="text-yellow-300 text-sm mt-2 font-bold">
                  🔧 Development Mode: Use code <span className="text-white bg-yellow-600 px-2 py-1 rounded">123456</span>
                </p>
              )}
            </div>

            <form onSubmit={handleVerificationSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('info')}
                  className="w-full bg-white/20 text-white py-3 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300"
                >
                  Back to Edit Info
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default UserRegistrationComponent