'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

interface FunctionGroup {
  function: string
  boosters: Booster[]
  selectedBoosters: string[]
}

interface PersonalizedPlan {
  amRoutine: RoutineStep[]
  pmRoutine: RoutineStep[]
  userConcerns: string[]
  availableBoosters: Booster[]
  boosterFunctions: FunctionGroup[]
  userName?: string
}

// Helper function to organize boosters by function
const organizeBoosters = (boosters: Booster[], userConcerns: string[]): FunctionGroup[] => {
  const functionMap = new Map<string, Booster[]>()

  // Common skincare functions based on booster categories and concerns
  const functionPriority = [
    'Anti-Aging', 'Hydration', 'Acne Treatment', 'Brightening',
    'Soothing', 'Anti-Oxidant', 'Exfoliation', 'Eye Care', 'Protection'
  ]

  boosters.forEach(booster => {
    let functionName = booster.category

    // Map categories to more user-friendly function names
    if (booster.category.toLowerCase().includes('anti-aging') ||
        booster.category.toLowerCase().includes('wrinkle') ||
        booster.target_concerns.some(c => c.toLowerCase().includes('fine lines') || c.toLowerCase().includes('aging'))) {
      functionName = 'Anti-Aging'
    } else if (booster.category.toLowerCase().includes('hydrat') ||
               booster.category.toLowerCase().includes('moisture')) {
      functionName = 'Hydration'
    } else if (booster.category.toLowerCase().includes('acne') ||
               booster.target_concerns.some(c => c.toLowerCase().includes('acne'))) {
      functionName = 'Acne Treatment'
    } else if (booster.category.toLowerCase().includes('brighten') ||
               booster.target_concerns.some(c => c.toLowerCase().includes('pigment') || c.toLowerCase().includes('dark spot'))) {
      functionName = 'Brightening'
    } else if (booster.category.toLowerCase().includes('sooth') ||
               booster.target_concerns.some(c => c.toLowerCase().includes('redness') || c.toLowerCase().includes('sensitive'))) {
      functionName = 'Soothing'
    } else if (booster.category.toLowerCase().includes('antioxidant') ||
               booster.category.toLowerCase().includes('protection')) {
      functionName = 'Anti-Oxidant'
    } else if (booster.category.toLowerCase().includes('exfoliat') ||
               booster.target_concerns.some(c => c.toLowerCase().includes('texture'))) {
      functionName = 'Exfoliation'
    } else if (booster.target_concerns.some(c => c.toLowerCase().includes('eye'))) {
      functionName = 'Eye Care'
    }

    if (!functionMap.has(functionName)) {
      functionMap.set(functionName, [])
    }
    functionMap.get(functionName)!.push(booster)
  })

  // Convert to function groups and sort by priority
  const functionGroups: FunctionGroup[] = []

  functionPriority.forEach(func => {
    if (functionMap.has(func)) {
      functionGroups.push({
        function: func,
        boosters: functionMap.get(func)!,
        selectedBoosters: []
      })
      functionMap.delete(func)
    }
  })

  // Add remaining functions
  functionMap.forEach((boosters, functionName) => {
    functionGroups.push({
      function: functionName,
      boosters,
      selectedBoosters: []
    })
  })

  return functionGroups
}

// AI preselection based on user concerns
const getAIPreselections = (functionGroups: FunctionGroup[], userConcerns: string[]): {[functionName: string]: string[]} => {
  const selections: {[functionName: string]: string[]} = {}

  functionGroups.forEach(group => {
    const relevantBoosters = group.boosters.filter(booster =>
      booster.target_concerns.some(concern =>
        userConcerns.some(userConcern =>
          concern.toLowerCase().includes(userConcern.toLowerCase()) ||
          userConcern.toLowerCase().includes(concern.toLowerCase())
        )
      )
    )

    if (relevantBoosters.length > 0) {
      // Select top 1-2 most relevant boosters per function
      selections[group.function] = relevantBoosters
        .slice(0, Math.min(2, relevantBoosters.length))
        .map(b => b.id)
    }
  })

  return selections
}

const PersonalizedPlanComponent = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [plan, setPlan] = useState<PersonalizedPlan | null>(null)
  const [loading, setLoading] = useState(true)
    const [selectedBoostersByProduct, setSelectedBoostersByProduct] = useState<Record<string, Record<string, string[]>>>({})
  const [isModifying, setIsModifying] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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

      // Group boosters by function/category
      const functionGroups = organizeBoosters(relevantBoosters, userConcerns)

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
        boosterFunctions: functionGroups,
        userName
      })

      // Initialize AI preselections
      initializeAISelections(amRoutine, pmRoutine, functionGroups, userConcerns)

      setLoading(false)

    } catch (error) {
      console.error('Error generating plan:', error)
      setLoading(false)
    }
  }

  const initializeAISelections = (amRoutine: RoutineStep[], pmRoutine: RoutineStep[], functionGroups: FunctionGroup[], userConcerns: string[]) => {
    const aiSelections = getAIPreselections(functionGroups, userConcerns)
    const initialSelections: {[productId: string]: {[functionName: string]: string[]}} = {}

    // Initialize for AM routine products (excluding cleansers)
    amRoutine.forEach(step => {
      if (!step.product.name.toLowerCase().includes('cleanser')) {
        initialSelections[step.product.id] = aiSelections
      }
    })

    // Initialize for PM routine products (excluding cleansers)
    pmRoutine.forEach(step => {
      if (!step.product.name.toLowerCase().includes('cleanser')) {
        initialSelections[step.product.id + '_pm'] = aiSelections
      }
    })

    setSelectedBoostersByProduct(initialSelections)
  }

  const handleBoosterSelection = (productId: string, functionName: string, boosterId: string, selected: boolean) => {
    setSelectedBoostersByProduct(prev => {
      const productSelections = prev[productId] || {}
      const functionBoosters = productSelections[functionName] || []

      const newFunctionBoosters = selected
        ? [...functionBoosters, boosterId]
        : functionBoosters.filter(id => id !== boosterId)

      return {
        ...prev,
        [productId]: {
          ...productSelections,
          [functionName]: newFunctionBoosters
        }
      }
    })
  }

  const isBoosterSelected = (productId: string, functionName: string, boosterId: string) => {
    return selectedBoostersByProduct[productId]?.[functionName]?.includes(boosterId) || false
  }

  const getFunctionBoosterCount = (productId: string, functionName: string) => {
    return selectedBoostersByProduct[productId]?.[functionName]?.length || 0
  }

  const getTotalBoosterCount = (productId: string) => {
    const productSelections = selectedBoostersByProduct[productId] || {}
    return Object.values(productSelections).reduce((total, boosters) => total + boosters.length, 0)
  }

  const handleSavePlan = async () => {
    if (!plan) return

    setIsSaving(true)

    try {
      // Prepare plan data for saving
      const planData = {
        userName: plan.userName,
        userConcerns: plan.userConcerns,
        selectedBoosters: selectedBoostersByProduct,
        amRoutine: plan.amRoutine.map(step => ({
          product: step.product,
          selectedBoosters: selectedBoostersByProduct[step.product.id] || {}
        })),
        pmRoutine: plan.pmRoutine.map(step => ({
          product: step.product,
          selectedBoosters: selectedBoostersByProduct[step.product.id + '_pm'] || {}
        })),
        boosterFunctions: plan.boosterFunctions,
        savedAt: new Date().toISOString()
      }

      // Save to localStorage for immediate access
      localStorage.setItem('skincoach_saved_plan', JSON.stringify(planData))

      // If user is authenticated, also save to database
      if (user) {
        const { error } = await supabase
          .from('saved_plans')
          .upsert([
            {
              user_id: user.id,
              plan_data: planData,
              updated_at: new Date().toISOString()
            }
          ])

        if (error) {
          console.error('Error saving to database:', error)
        }
      }

      // Navigate to checkout
      router.push('/checkout')

    } catch (error) {
      console.error('Error saving plan:', error)
      alert('Error saving plan. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleModifyPlan = () => {
    setIsModifying(!isModifying)
  }

  const handleRetakeQuiz = () => {
    // Clear existing data and redirect to quiz
    localStorage.removeItem('skincoach_quiz_data')
    localStorage.removeItem('skincoach_user_session')
    router.push('/quiz')
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

            {plan.amRoutine.map((step, index) => {
              const isCleanser = step.product.name.toLowerCase().includes('cleanser')

              return (
                <div key={step.product.id} className="mb-6">
                  <div className="bg-white/20 rounded-xl p-4 mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {index + 1}. {step.product.name}
                    </h3>
                    <p className="text-slate-300 text-sm">{step.product.description}</p>
                  </div>

                  {/* Booster Selection - Only for non-cleansers */}
                  {!isCleanser && (
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-white font-medium">Add Boosters</h4>
                        <span className="text-cyan-300 text-sm">
                          {getTotalBoosterCount(step.product.id)} total selected
                        </span>
                      </div>

                      <div className="space-y-4 max-h-64 overflow-y-auto">
                        {plan.boosterFunctions.map(functionGroup => (
                          <div key={functionGroup.function} className="border-b border-white/10 pb-4 last:border-b-0">
                            {/* Function Header */}
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="text-cyan-200 font-medium text-sm">{functionGroup.function}</h5>
                              <span className="text-slate-400 text-xs">
                                {getFunctionBoosterCount(step.product.id, functionGroup.function)} selected
                              </span>
                            </div>

                            {/* Left-Right Layout: Function description and Boosters */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {functionGroup.boosters.map(booster => (
                                <label
                                  key={booster.id}
                                  className="flex items-start gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-xs"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isBoosterSelected(step.product.id, functionGroup.function, booster.id)}
                                    onChange={(e) => handleBoosterSelection(step.product.id, functionGroup.function, booster.id, e.target.checked)}
                                    className="mt-0.5 rounded border-slate-400 text-cyan-500 focus:ring-cyan-500 scale-75"
                                  />
                                  <div className="flex-1">
                                    <div className="text-white font-medium">{booster.name}</div>
                                    <div className="text-slate-400 text-xs mt-1">
                                      {booster.description?.slice(0, 80)}...
                                    </div>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* PM Routine */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">🌙 Evening Routine</h2>

            {plan.pmRoutine.map((step, index) => {
              const isCleanser = step.product.name.toLowerCase().includes('cleanser')
              const productKey = step.product.id + '_pm'

              return (
                <div key={productKey} className="mb-6">
                  <div className="bg-white/20 rounded-xl p-4 mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {index + 1}. {step.product.name}
                    </h3>
                    <p className="text-slate-300 text-sm">{step.product.description}</p>
                  </div>

                  {/* Booster Selection - Only for non-cleansers */}
                  {!isCleanser && (
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-white font-medium">Add Boosters</h4>
                        <span className="text-cyan-300 text-sm">
                          {getTotalBoosterCount(productKey)} total selected
                        </span>
                      </div>

                      <div className="space-y-4 max-h-64 overflow-y-auto">
                        {plan.boosterFunctions.map(functionGroup => (
                          <div key={functionGroup.function} className="border-b border-white/10 pb-4 last:border-b-0">
                            {/* Function Header */}
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="text-cyan-200 font-medium text-sm">{functionGroup.function}</h5>
                              <span className="text-slate-400 text-xs">
                                {getFunctionBoosterCount(productKey, functionGroup.function)} selected
                              </span>
                            </div>

                            {/* Left-Right Layout: Function description and Boosters */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {functionGroup.boosters.map(booster => (
                                <label
                                  key={booster.id}
                                  className="flex items-start gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-xs"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isBoosterSelected(productKey, functionGroup.function, booster.id)}
                                    onChange={(e) => handleBoosterSelection(productKey, functionGroup.function, booster.id, e.target.checked)}
                                    className="mt-0.5 rounded border-slate-400 text-cyan-500 focus:ring-cyan-500 scale-75"
                                  />
                                  <div className="flex-1">
                                    <div className="text-white font-medium">{booster.name}</div>
                                    <div className="text-slate-400 text-xs mt-1">
                                      {booster.description?.slice(0, 80)}...
                                    </div>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleSavePlan}
            disabled={isSaving}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving Plan...' : 'Save & Subscribe'}
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleModifyPlan}
              className="bg-white/20 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300"
            >
              {isModifying ? 'Finish Modifying' : 'Modify Plan'}
            </button>

            <button
              onClick={handleRetakeQuiz}
              className="bg-slate-600/40 text-slate-300 px-6 py-4 rounded-xl font-medium hover:bg-slate-600/60 hover:text-white transition-all duration-300"
            >
              Retake Quiz
            </button>
          </div>
        </div>

        {/* Modify Plan Notice */}
        {isModifying && (
          <div className="mt-6 text-center">
            <div className="inline-block bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
              <p className="text-yellow-200 text-sm">
                🔧 <strong>Modification Mode</strong>: You can now adjust your booster selections above.
                Click "Finish Modifying" when you're done with changes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PersonalizedPlanComponent