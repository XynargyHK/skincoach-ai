'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, CreditCard, Shield, Truck, ArrowLeft } from 'lucide-react'

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  originalPrice?: number
  features: string[]
  popular?: boolean
  description: string
}

interface SavedPlan {
  userName?: string
  userConcerns: string[]
  selectedBoosters: any
  planType: string
}

const CheckoutComponent = () => {
  const router = useRouter()
  const [savedPlan, setSavedPlan] = useState<SavedPlan | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [isLoading, setIsLoading] = useState(false)

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'essential',
      name: 'Essential Plan',
      price: billingCycle === 'monthly' ? 29 : 290,
      originalPrice: billingCycle === 'annual' ? 348 : undefined,
      description: 'Perfect for skincare beginners',
      features: [
        'Basic cleanser, moisturizer & sunscreen',
        'AI skin analysis',
        'Monthly plan adjustments',
        'Email support',
        'Basic boosters (up to 2 per product)'
      ]
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: billingCycle === 'monthly' ? 49 : 490,
      originalPrice: billingCycle === 'annual' ? 588 : undefined,
      description: 'Most popular for visible results',
      popular: true,
      features: [
        'Complete routine with serums & treatments',
        'Advanced AI analysis & tracking',
        'Weekly plan adjustments',
        'Priority chat support',
        'Premium boosters (up to 4 per product)',
        'Climate adaptation',
        'Progress photos & analytics'
      ]
    },
    {
      id: 'concierge',
      name: 'Concierge Plan',
      price: billingCycle === 'monthly' ? 89 : 890,
      originalPrice: billingCycle === 'annual' ? 1068 : undefined,
      description: 'Ultimate personalized experience',
      features: [
        'Everything in Pro Plan',
        'Live dermatologist consultations (2/month)',
        'Custom formulation adjustments',
        'Priority shipping (2-day delivery)',
        'Unlimited boosters',
        'Personal skincare coach',
        '24/7 expert support',
        'Advanced diagnostic tools'
      ]
    }
  ]

  useEffect(() => {
    // Load saved plan data from localStorage
    const planData = localStorage.getItem('skincoach_saved_plan')
    const userSession = localStorage.getItem('skincoach_user_session')

    if (planData) {
      const parsed = JSON.parse(planData)
      setSavedPlan(parsed)

      // Auto-select recommended plan based on saved data
      const recommendedPlan = getRecommendedPlan(parsed)
      setSelectedPlan(subscriptionPlans.find(p => p.id === recommendedPlan) || subscriptionPlans[1])
    } else if (userSession) {
      const session = JSON.parse(userSession)
      setSavedPlan({
        userName: session.name,
        userConcerns: session.quiz_data?.primary_concern || [],
        selectedBoosters: {},
        planType: 'basic'
      })
      setSelectedPlan(subscriptionPlans[1]) // Default to Pro
    }
  }, [billingCycle])

  const getRecommendedPlan = (planData: SavedPlan): string => {
    const concernCount = planData.userConcerns?.length || 0
    const boosterCount = Object.values(planData.selectedBoosters || {})
      .reduce((total: number, productBoosters: any) => {
        return total + Object.values(productBoosters || {})
          .reduce((sum: number, boosters: any) => sum + (boosters?.length || 0), 0)
      }, 0)

    if (concernCount >= 4 || boosterCount >= 8) return 'concierge'
    if (concernCount >= 2 || boosterCount >= 4) return 'pro'
    return 'essential'
  }

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
  }

  const handleSubscribe = async () => {
    if (!selectedPlan) return

    setIsLoading(true)

    try {
      // Store subscription choice
      const subscriptionData = {
        plan: selectedPlan,
        billingCycle,
        savedPlan,
        timestamp: new Date().toISOString()
      }

      localStorage.setItem('skincoach_subscription', JSON.stringify(subscriptionData))

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Navigate to success/confirmation page
      router.push('/success')

    } catch (error) {
      console.error('Subscription error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getSavings = (plan: SubscriptionPlan) => {
    if (billingCycle === 'annual' && plan.originalPrice) {
      return plan.originalPrice - plan.price
    }
    return 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Plan
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Plan{savedPlan?.userName ? `, ${savedPlan.userName}` : ''}
          </h1>
          <p className="text-slate-300 text-lg">
            Complete your skincare transformation with our AI-powered subscription
          </p>

          {savedPlan?.userConcerns && (
            <div className="mt-4 inline-block bg-white/10 rounded-full px-4 py-2">
              <span className="text-cyan-300 text-sm">
                Addressing: {savedPlan.userConcerns.slice(0, 3).join(', ')}
                {savedPlan.userConcerns.length > 3 && ` +${savedPlan.userConcerns.length - 3} more`}
              </span>
            </div>
          )}
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 rounded-full p-1 flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900'
                  : 'text-white hover:text-cyan-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'annual'
                  ? 'bg-white text-slate-900'
                  : 'text-white hover:text-cyan-300'
              }`}
            >
              Annual
              <span className="ml-1 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs">Save 17%</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {subscriptionPlans.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id
            const savings = getSavings(plan)

            return (
              <div
                key={plan.id}
                className={`relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border transition-all cursor-pointer hover:scale-105 ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/25'
                    : 'border-white/20 hover:border-white/40'
                } ${plan.popular ? 'ring-2 ring-cyan-400' : ''}`}
                onClick={() => handlePlanSelect(plan)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-300 text-sm">{plan.description}</p>

                  <div className="mt-4">
                    {savings > 0 && (
                      <div className="text-slate-400 line-through text-sm">
                        ${plan.originalPrice}/{billingCycle === 'annual' ? 'year' : 'month'}
                      </div>
                    )}
                    <div className="text-4xl font-bold text-white">
                      ${plan.price}
                      <span className="text-lg text-slate-300">
                        /{billingCycle === 'annual' ? 'year' : 'month'}
                      </span>
                    </div>
                    {savings > 0 && (
                      <div className="text-green-400 text-sm font-medium">
                        Save ${savings}/year
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {isSelected && (
                  <div className="absolute inset-0 bg-cyan-500/10 rounded-2xl pointer-events-none"></div>
                )}
              </div>
            )
          })}
        </div>

        {/* Selected Plan Summary & Subscribe */}
        {selectedPlan && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Ready to start with {selectedPlan.name}?
                </h3>
                <p className="text-slate-300">
                  Your personalized skincare routine will be prepared and shipped within 2-3 business days.
                </p>

                {/* Trust Indicators */}
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-sm">30-day guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Truck className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">Free shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">Secure payment</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : `Subscribe for $${selectedPlan.price}/${billingCycle === 'annual' ? 'year' : 'month'}`}
                </button>

                <p className="text-slate-400 text-xs text-center mt-2">
                  Cancel anytime • No hidden fees
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckoutComponent