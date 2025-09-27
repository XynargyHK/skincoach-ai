'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface Booster {
  id: string
  name: string
  description: string
  category: string
  target_concerns: string[]
  price: number
  key_ingredients?: string
}

interface BaseProduct {
  id: string
  name: string
  description: string
  skin_types: string[]
  concerns: string[]
  price: number
}

interface RoutineStep {
  product: BaseProduct
  boosters: Booster[]
}

interface PersonalizedPlan {
  amRoutine: RoutineStep[]
  pmRoutine: RoutineStep[]
  userConcerns: string[]
  availableBoosters: Booster[]
  userName?: string
}

const PersonalizedPlanComponent = () => {
  const { user } = useAuth()
  const [plan, setPlan] = useState<PersonalizedPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedBoosters, setSelectedBoosters] = useState<{[key: string]: string[]}>({})

  useEffect(() => {
    generatePersonalizedPlan()
  }, [user])

  const generatePersonalizedPlan = async () => {
    try {
      let userResponse = null
      let userConcerns = []
      let userName = ''

      // First try to get data from authenticated user
      if (user) {
        const { data: quizData, error: quizError } = await supabase
          .from('quiz_responses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)

        if (!quizError && quizData?.length > 0) {
          userResponse = quizData[0]
          userConcerns = Array.isArray(userResponse.skin_concerns)
            ? userResponse.skin_concerns
            : [userResponse.skin_concerns]
        }
      }

      // If no database data, try localStorage for anonymous users
      if (!userResponse) {
        const sessionData = localStorage.getItem('skincoach_user_session')
        if (sessionData) {
          try {
            const session = JSON.parse(sessionData)
            if (session.quiz_data) {
              userResponse = {
                skin_type: session.quiz_data.skin_type,
                // Map quiz data structure to database structure
                skin_concerns: session.quiz_data.primary_concern
              }
              userConcerns = Array.isArray(session.quiz_data.primary_concern)
                ? session.quiz_data.primary_concern
                : [session.quiz_data.primary_concern]
              userName = session.name || ''
            }
          } catch (e) {
            console.error('Error parsing session data:', e)
          }
        }
      }

      if (!userResponse) {
        console.error('No quiz data found')
        setLoading(false)
        return
      }

      // Get base products
      const { data: baseProducts, error: baseError } = await supabase
        .from('base_products')
        .select('*')
        .eq('active', true)

      if (baseError) {
        console.error('Error fetching base products:', baseError)
        setLoading(false)
        return
      }

      // Get relevant boosters based on user concerns
      const { data: boosters, error: boosterError } = await supabase
        .from('boosters')
        .select('*')
        .eq('active', true)

      if (boosterError) {
        console.error('Error fetching boosters:', boosterError)
        setLoading(false)
        return
      }

      // Filter boosters by user concerns
      const relevantBoosters = boosters?.filter(booster => {
        if (!booster.target_concerns) return false
        const concerns = Array.isArray(booster.target_concerns)
          ? booster.target_concerns
          : [booster.target_concerns]
        return concerns.some(concern =>
          userConcerns.some(userConcern =>
            concern.toLowerCase().includes(userConcern.toLowerCase()) ||
            userConcern.toLowerCase().includes(concern.toLowerCase())
          )
        )
      }) || []

      // Create AM routine: Cleanser + Day Cream + Serum
      const cleanser = baseProducts?.find(p => p.name.toLowerCase().includes('cleanser'))
      const dayCream = baseProducts?.find(p => p.name.toLowerCase().includes('day'))
      const serum = baseProducts?.find(p => p.name.toLowerCase().includes('serum'))

      // Create PM routine: Cleanser + Night Cream + Serum
      const nightCream = baseProducts?.find(p => p.name.toLowerCase().includes('night'))

      const amRoutine: RoutineStep[] = []
      const pmRoutine: RoutineStep[] = []

      if (cleanser) {
        amRoutine.push({ product: cleanser, boosters: [] })
        pmRoutine.push({ product: cleanser, boosters: [] })
      }

      if (serum) {
        amRoutine.push({ product: serum, boosters: [] })
        pmRoutine.push({ product: serum, boosters: [] })
      }

      if (dayCream) {
        amRoutine.push({ product: dayCream, boosters: [] })
      }

      if (nightCream) {
        pmRoutine.push({ product: nightCream, boosters: [] })
      }

      setPlan({
        amRoutine,
        pmRoutine,
        userConcerns,
        availableBoosters: relevantBoosters,
        userName
      })

      setLoading(false)

    } catch (error) {
      console.error('Error generating plan:', error)
      setLoading(false)
    }
  }

  const handleBoosterSelection = (productId: string, boosterId: string, selected: boolean) => {
    setSelectedBoosters(prev => {
      const productBoosters = prev[productId] || []

      if (selected) {
        // Add booster if less than 5 boosters for this product
        if (productBoosters.length < 5) {
          return {
            ...prev,
            [productId]: [...productBoosters, boosterId]
          }
        }
      } else {
        // Remove booster
        return {
          ...prev,
          [productId]: productBoosters.filter(id => id !== boosterId)
        }
      }

      return prev
    })
  }

  const isBoosterSelected = (productId: string, boosterId: string) => {
    return selectedBoosters[productId]?.includes(boosterId) || false
  }

  const getBoosterCount = (productId: string) => {
    return selectedBoosters[productId]?.length || 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 flex items-center justify-center">
        <div className="text-white text-xl">Generating your personalized plan...</div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 flex items-center justify-center">
        <div className="text-white text-xl">Please complete the skin assessment first</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {plan.userName ? `${plan.userName}'s` : 'Your'} Personalized Plan
          </h1>
          <p className="text-slate-300 text-lg">
            Based on your concerns: {plan.userConcerns.join(', ')}
          </p>
        </div>

        {/* AM & PM Routines */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* AM Routine */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">☀️ Morning Routine</h2>

            {plan.amRoutine.map((step, index) => (
              <div key={step.product.id} className="mb-6">
                <div className="bg-white/20 rounded-xl p-4 mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {index + 1}. {step.product.name}
                  </h3>
                  <p className="text-slate-300 text-sm">{step.product.description}</p>
                </div>

                {/* Booster Selection for this product */}
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-white font-medium">Add Boosters</h4>
                    <span className="text-cyan-300 text-sm">
                      {getBoosterCount(step.product.id)}/5 selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {plan.availableBoosters.map(booster => (
                      <label
                        key={booster.id}
                        className="flex items-start gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isBoosterSelected(step.product.id, booster.id)}
                          onChange={(e) => handleBoosterSelection(step.product.id, booster.id, e.target.checked)}
                          disabled={!isBoosterSelected(step.product.id, booster.id) && getBoosterCount(step.product.id) >= 5}
                          className="mt-1 rounded border-slate-400 text-cyan-500 focus:ring-cyan-500"
                        />
                        <div className="flex-1">
                          <div className="text-white font-medium text-sm">{booster.name}</div>
                          <div className="text-slate-400 text-xs">{booster.category}</div>
                          <div className="text-slate-400 text-xs mt-1">
                            Targets: {Array.isArray(booster.target_concerns)
                              ? booster.target_concerns.slice(0, 2).join(', ')
                              : booster.target_concerns}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PM Routine */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">🌙 Evening Routine</h2>

            {plan.pmRoutine.map((step, index) => (
              <div key={step.product.id} className="mb-6">
                <div className="bg-white/20 rounded-xl p-4 mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {index + 1}. {step.product.name}
                  </h3>
                  <p className="text-slate-300 text-sm">{step.product.description}</p>
                </div>

                {/* Booster Selection for this product */}
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-white font-medium">Add Boosters</h4>
                    <span className="text-cyan-300 text-sm">
                      {getBoosterCount(step.product.id + '_pm')}/5 selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {plan.availableBoosters.map(booster => (
                      <label
                        key={booster.id}
                        className="flex items-start gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isBoosterSelected(step.product.id + '_pm', booster.id)}
                          onChange={(e) => handleBoosterSelection(step.product.id + '_pm', booster.id, e.target.checked)}
                          disabled={!isBoosterSelected(step.product.id + '_pm', booster.id) && getBoosterCount(step.product.id + '_pm') >= 5}
                          className="mt-1 rounded border-slate-400 text-cyan-500 focus:ring-cyan-500"
                        />
                        <div className="flex-1">
                          <div className="text-white font-medium text-sm">{booster.name}</div>
                          <div className="text-slate-400 text-xs">{booster.category}</div>
                          <div className="text-slate-400 text-xs mt-1">
                            Targets: {Array.isArray(booster.target_concerns)
                              ? booster.target_concerns.slice(0, 2).join(', ')
                              : booster.target_concerns}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 mr-4">
            Save My Plan
          </button>
          <button className="bg-white/20 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300">
            Modify Plan
          </button>
        </div>
      </div>
    </div>
  )
}

export default PersonalizedPlanComponent