'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Package, Calendar, MessageCircle, Sparkles } from 'lucide-react'

const SuccessComponent = () => {
  const router = useRouter()
  const [subscriptionData, setSubscriptionData] = useState<any>(null)

  useEffect(() => {
    // Load subscription data
    const data = localStorage.getItem('skincoach_subscription')
    if (data) {
      setSubscriptionData(JSON.parse(data))
    }
  }, [])

  const nextSteps = [
    {
      icon: Package,
      title: "Your Products Are Being Prepared",
      description: "Our lab is customizing your personalized formulas based on your skin analysis and selected boosters.",
      timeframe: "1-2 business days"
    },
    {
      icon: CheckCircle,
      title: "Quality Check & Packaging",
      description: "Each product goes through rigorous quality testing before being carefully packaged for you.",
      timeframe: "1 business day"
    },
    {
      icon: Calendar,
      title: "Shipping & Delivery",
      description: "Your skincare routine will be shipped and should arrive at your doorstep soon!",
      timeframe: "2-3 business days"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to SkinCoach.ai!
          </h1>

          <p className="text-xl text-slate-300 mb-2">
            🎉 Your subscription is confirmed!
          </p>

          {subscriptionData?.savedPlan?.userName && (
            <p className="text-lg text-cyan-300">
              Hi {subscriptionData.savedPlan.userName}, your skincare transformation starts now!
            </p>
          )}
        </div>

        {/* Subscription Summary */}
        {subscriptionData && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Your Subscription</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                  {subscriptionData.plan?.name}
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  {subscriptionData.plan?.description}
                </p>

                <div className="text-2xl font-bold text-white">
                  ${subscriptionData.plan?.price}
                  <span className="text-sm text-slate-300 ml-1">
                    /{subscriptionData.billingCycle}
                  </span>
                </div>
              </div>

              {subscriptionData.savedPlan?.userConcerns && (
                <div>
                  <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                    Your Skin Concerns
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {subscriptionData.savedPlan.userConcerns.slice(0, 4).map((concern: string, index: number) => (
                      <span
                        key={index}
                        className="bg-cyan-500/20 text-cyan-100 px-3 py-1 rounded-full text-sm"
                      >
                        {concern}
                      </span>
                    ))}
                    {subscriptionData.savedPlan.userConcerns.length > 4 && (
                      <span className="bg-slate-500/20 text-slate-300 px-3 py-1 rounded-full text-sm">
                        +{subscriptionData.savedPlan.userConcerns.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* What Happens Next */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">What Happens Next?</h2>

          <div className="space-y-6">
            {nextSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="flex gap-4">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-full flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-slate-300 text-sm mb-2">
                      {step.description}
                    </p>
                    <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                      {step.timeframe}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-6 h-6 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">Need Help?</h3>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              Our AI Coach is always available to answer questions about your routine, products, or progress.
            </p>
            <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
              Chat with AI Coach →
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Track Progress</h3>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              Once your products arrive, start tracking your skin's transformation with our progress tools.
            </p>
            <button
              onClick={() => router.push('/plan')}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
            >
              View My Plan →
            </button>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
          <h3 className="text-xl font-bold text-white mb-3">Important Information</h3>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-cyan-300 mb-2">Shipping Updates</h4>
              <p className="text-slate-300">
                You'll receive tracking information via email once your order ships.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-cyan-300 mb-2">30-Day Guarantee</h4>
              <p className="text-slate-300">
                Not satisfied? Get a full refund within 30 days, no questions asked.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-cyan-300 mb-2">Flexible Subscription</h4>
              <p className="text-slate-300">
                Pause, modify, or cancel your subscription anytime from your account.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => router.push('/plan')}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
          >
            View My Routine
          </button>

          <button
            onClick={() => router.push('/')}
            className="bg-white/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessComponent