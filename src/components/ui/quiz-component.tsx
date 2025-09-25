'use client'

import { useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

const sliderStyles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(45deg, #06b6d4, #10b981);
    border: 2px solid #fff;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
  }
  .slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(45deg, #06b6d4, #10b981);
    border: 2px solid #fff;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
  }
`

interface QuizQuestion {
  id: string
  category: string
  question: string
  type: 'single' | 'multiple' | 'scale'
  options: string[]
  required: boolean
}

interface QuizResponse {
  [key: string]: string | string[]
}

const skinCareQuestions: QuizQuestion[] = [
  {
    id: 'gender',
    category: 'Demographics',
    question: 'How would you describe your gender?',
    type: 'single',
    options: ['Female', 'Male', 'Non-binary', 'Prefer not to say'],
    required: true
  },
  {
    id: 'age_group',
    category: 'Demographics',
    question: 'What is your age group?',
    type: 'single',
    options: ['<20', '20-35', '36-50', '50+'],
    required: true
  },
  {
    id: 'ethnicity',
    category: 'Demographics',
    question: 'What is your ethnicity?',
    type: 'single',
    options: ['Caucasian', 'Asian', 'Hispanic/Latino', 'African American', 'Mixed', 'Other'],
    required: true
  },
  {
    id: 'skin_tone',
    category: 'Skin Classification',
    question: 'Which option best represents your skin tone? (Based on Fitzpatrick Scale)',
    type: 'single',
    options: [
      'Pale - Always burns, never tans',
      'Fair - Often burns, tans a little',
      'Light - Sometimes burns, tans evenly',
      'Medium - Burns minimally, tans easily',
      'Olive - Rarely burns, tans darkly',
      'Dark - Never burns, always tans darkly'
    ],
    required: true
  },
  {
    id: 'skin_type',
    category: 'Skin Classification',
    question: 'What is your skin type?',
    type: 'single',
    options: [
      'Combination - Dry in some areas, oily in others (T-zone)',
      'Oily - Produces lots of natural oils, shiny complexion',
      'Dry - Prone to cracking, peeling, or feeling tight',
      'Normal - Well-balanced, not too dry or oily'
    ],
    required: true
  },
  {
    id: 'sensitivity_level',
    category: 'Skin Sensitivity',
    question: 'How sensitive is your skin to skincare products?',
    type: 'single',
    options: [
      'Not sensitive - Never have problems with products',
      'Mildly sensitive - Sometimes react to acids or actives',
      'Quite sensitive - Regularly react to many products',
      'Very sensitive - Most products sting or burn'
    ],
    required: true
  },
  {
    id: 'skin_conditions',
    category: 'Skin Health',
    question: 'Have you been diagnosed with any chronic skin conditions?',
    type: 'multiple',
    options: ['Atopic Dermatitis', 'Rosacea', 'Eczema', 'Psoriasis', 'None of the above'],
    required: true
  },
  {
    id: 'acne_level',
    category: 'Skin Concerns',
    question: 'Do you have acne or comedones (white/blackheads) on your face?',
    type: 'single',
    options: [
      'No acne or comedones',
      'Some comedones',
      'Some acne',
      'Large patches of acne',
      'Severe acne with scarring'
    ],
    required: true
  },
  {
    id: 'pigmentation_issues',
    category: 'Skin Concerns',
    question: 'Do you have hyperpigmentation issues?',
    type: 'multiple',
    options: [
      'No pigmentation issues',
      'Sun spots appearing',
      'Post-acne pigmentation',
      'Uneven skin tone',
      'Melasma'
    ],
    required: true
  },
  {
    id: 'aging_signs',
    category: 'Skin Concerns',
    question: 'What aging signs do you notice?',
    type: 'multiple',
    options: [
      'No visible aging signs',
      'Fine lines starting to appear',
      'Crows feet around eyes',
      'Deep wrinkles when face is at rest',
      'Loss of skin elasticity'
    ],
    required: true
  },
  {
    id: 'skin_firmness',
    category: 'Skin Concerns',
    question: 'How would you describe your skin firmness?',
    type: 'single',
    options: [
      'Tight and smooth',
      'Slightly sagging',
      'Noticeable sagging',
      'Lost elasticity'
    ],
    required: true
  },
  {
    id: 'dark_circles',
    category: 'Eye Area',
    question: 'Do you have dark circles under your eyes?',
    type: 'single',
    options: ['No dark circles', 'Mild dark circles', 'Very dark circles'],
    required: true
  },
  {
    id: 'eye_bags',
    category: 'Eye Area',
    question: 'Do you have eye bags or puffiness?',
    type: 'single',
    options: ['No eye bags', 'Mild puffiness', 'Very puffy'],
    required: true
  },
  {
    id: 'current_routine',
    category: 'Current Skincare',
    question: 'What is in your current skincare routine?',
    type: 'multiple',
    options: [
      'None of these',
      'Sunscreen',
      'Cleanser',
      'Moisturizer',
      'Acids/Exfoliants',
      'Eye Cream',
      'Serums',
      'Face Masks',
      'Night Cream',
      'Makeup Remover'
    ],
    required: true
  },
  {
    id: 'skincare_knowledge',
    category: 'Experience',
    question: 'How would you describe your skincare knowledge level?',
    type: 'single',
    options: [
      'Beginner - I haven\'t got a clue',
      'Intermediate - I\'m fairly clued up',
      'Advanced - I\'m a dedicated enthusiast'
    ],
    required: true
  },
  {
    id: 'skin_goals',
    category: 'Goals',
    question: 'What are your main skin goals? (Choose all that apply)',
    type: 'multiple',
    options: [
      'Tackle fine lines and wrinkles',
      'Improve skin texture (firmer, brighter, smoother)',
      'Reduce dark spots or pigmentation',
      'Make pores less visible',
      'Treat rosacea',
      'Clear acne and blackheads',
      'Improve hydration',
      'Even out skin tone'
    ],
    required: true
  },
  {
    id: 'lifestyle_factors',
    category: 'Lifestyle',
    question: 'Which lifestyle factors apply to you?',
    type: 'multiple',
    options: [
      'None of these apply',
      'Spend a lot of time outdoors',
      'Get less than 7 hours of sleep',
      'Live a stressful lifestyle',
      'Live in a high pollution area',
      'Use tanning beds',
      'Exercise frequently'
    ],
    required: true
  },
  {
    id: 'diet_habits',
    category: 'Diet & Habits',
    question: 'Which of these do you consume regularly?',
    type: 'multiple',
    options: [
      'None of these',
      'Alcohol',
      'Processed foods or refined sugar',
      'Caffeine',
      'Nicotine or tobacco',
      'Dairy products',
      'Lots of water'
    ],
    required: true
  }
]

export default function QuizComponent() {
  const [responses, setResponses] = useState<QuizResponse>({})
  const [isComplete, setIsComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [spendingAmount, setSpendingAmount] = useState(50)
  const { user } = useAuth()

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleSpendingChange = (value: number[]) => {
    setSpendingAmount(value[0])
    setResponses(prev => ({
      ...prev,
      spending_budget: value[0].toString()
    }))
  }

  const canComplete = () => {
    const concerns = Array.isArray(responses.primary_concern) ? responses.primary_concern : []
    return responses.gender &&
           responses.age_group &&
           responses.skin_type &&
           concerns.length > 0 &&
           responses.spending_budget
  }

  const handleComplete = () => {
    if (canComplete()) {
      setIsComplete(true)
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      alert('Please sign in to save your quiz results')
      return
    }

    setIsSubmitting(true)

    try {
      // Save quiz response to Supabase
      const { data, error } = await supabase
        .from('quiz_responses')
        .insert([
          {
            user_id: user.id,
            gender: responses.gender,
            age_group: responses.age_group,
            skin_type: responses.skin_type,
            primary_concern: responses.primary_concern,
            spending_budget: responses.spending_budget
          }
        ])
        .select()

      if (error) throw error

      // Generate recommendations based on responses
      await generateRecommendations(data[0].id)

      alert('Quiz completed! Your personalized skincare recommendations are being generated.')

    } catch (error) {
      console.error('Error saving quiz:', error)
      alert('Error saving quiz results. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateRecommendations = async (quizResponseId: string) => {
    // Simple recommendation logic based on responses
    let recommendedPlan = 'Essential'
    let boosters: string[] = []
    const priorityConcerns: string[] = []

    const ageGroup = responses.age_group as string
    const spendingBudget = parseInt(responses.spending_budget as string || '50')
    const primaryConcerns = Array.isArray(responses.primary_concern) ? responses.primary_concern as string[] : []

    // Determine plan based on age, budget, and number of concerns
    if (ageGroup === '40+' || spendingBudget >= 150 || primaryConcerns.length >= 4) {
      recommendedPlan = 'Concierge'
      boosters = ['Anti-aging', 'Hydration', 'Brightening', 'Firming']
    } else if (ageGroup === '21-40' || spendingBudget >= 80 || primaryConcerns.length >= 2) {
      recommendedPlan = 'Pro'
      boosters = ['Hydration', 'Protection', 'Brightening']
    } else {
      recommendedPlan = 'Essential'
      boosters = ['Hydration', 'Protection']
    }

    // Add specific boosters based on selected concerns
    primaryConcerns.forEach(concern => {
      switch (concern) {
        case 'Acne':
          if (!boosters.includes('Anti-acne')) boosters.push('Anti-acne')
          if (!priorityConcerns.includes('Acne treatment')) priorityConcerns.push('Acne treatment')
          break
        case 'Pigments':
          if (!boosters.includes('Brightening')) boosters.push('Brightening')
          if (!priorityConcerns.includes('Pigmentation reduction')) priorityConcerns.push('Pigmentation reduction')
          break
        case 'Fine Lines':
        case 'Sagging':
        case 'Crow\'s Feet':
          if (!boosters.includes('Anti-wrinkle')) boosters.push('Anti-wrinkle')
          if (!priorityConcerns.includes('Anti-aging')) priorityConcerns.push('Anti-aging')
          break
        case 'Redness':
          if (!boosters.includes('Soothing')) boosters.push('Soothing')
          if (!priorityConcerns.includes('Sensitivity reduction')) priorityConcerns.push('Sensitivity reduction')
          break
        case 'Eye Bag':
        case 'Dark Circle':
          if (!boosters.includes('Eye Care')) boosters.push('Eye Care')
          if (!priorityConcerns.includes('Eye area treatment')) priorityConcerns.push('Eye area treatment')
          break
        case 'Uneven Texture':
          if (!boosters.includes('Exfoliation')) boosters.push('Exfoliation')
          if (!priorityConcerns.includes('Texture improvement')) priorityConcerns.push('Texture improvement')
          break
      }
    })

    // Save recommendations
    const { error } = await supabase
      .from('recommendations')
      .insert([
        {
          quiz_response_id: quizResponseId,
          recommended_plan: recommendedPlan,
          confidence_score: 0.85,
          boosters: boosters,
          priority_concerns: priorityConcerns,
          skin_analysis: {
            skin_type: responses.skin_type,
            main_concerns: priorityConcerns,
            primary_concerns: primaryConcerns
          },
          timeline_expectations: '4-8 weeks for visible results'
        }
      ])

    if (error) {
      console.error('Error saving recommendations:', error)
    }
  }


  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="max-w-2xl w-full">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center">
              <div className="mb-6">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                  Quiz Complete! 🎉
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto rounded-full"></div>
              </div>

              <div className="space-y-6 text-slate-300">
                <p className="text-lg">
                  Thank you for completing the SkinCoach.ai skin assessment.
                </p>
                <p className="text-slate-400">
                  Our AI dermatology team is analyzing your responses to create your personalized skincare routine.
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="mt-8 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Generating Recommendations...' : 'Get My Personalized Plan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: sliderStyles }} />
      {/* Background gradient orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                Basic Assessment
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-8">
              {/* Gender */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4 text-center">Gender</h3>
                <div className="flex gap-4">
                  {['Male', 'Female'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer('gender', option)}
                      className={`flex-1 p-4 rounded-xl border transition-all duration-300 ${
                        responses.gender === option
                          ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-100 shadow-lg shadow-cyan-500/25'
                          : 'border-white/20 bg-white/5 text-slate-300 hover:border-white/30 hover:bg-white/10'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4 text-center">Age Group</h3>
                <div className="flex gap-4">
                  {['<20', '21-40', '40+'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer('age_group', option)}
                      className={`flex-1 p-4 rounded-xl border transition-all duration-300 ${
                        responses.age_group === option
                          ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-100 shadow-lg shadow-cyan-500/25'
                          : 'border-white/20 bg-white/5 text-slate-300 hover:border-white/30 hover:bg-white/10'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skin Type */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4 text-center">Skin Type</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['Dry', 'Normal', 'Combination', 'Oily'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer('skin_type', option)}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        responses.skin_type === option
                          ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-100 shadow-lg shadow-cyan-500/25'
                          : 'border-white/20 bg-white/5 text-slate-300 hover:border-white/30 hover:bg-white/10'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Top Concern */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4 text-center">Top Concerns</h3>
                <div className="grid grid-cols-3 gap-3">
                  {['Acne', 'Redness', 'Pigments', 'Sagging', 'Fine Lines', 'Uneven Texture', 'Eye Bag', 'Dark Circle', 'Crow\'s Feet'].map((option) => {
                    const currentConcerns = Array.isArray(responses.primary_concern) ? responses.primary_concern as string[] : []
                    const isSelected = currentConcerns.includes(option)

                    return (
                      <button
                        key={option}
                        onClick={() => {
                          if (isSelected) {
                            handleAnswer('primary_concern', currentConcerns.filter(c => c !== option))
                          } else {
                            handleAnswer('primary_concern', [...currentConcerns, option])
                          }
                        }}
                        className={`p-3 text-sm rounded-xl border transition-all duration-300 ${
                          isSelected
                            ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-100 shadow-lg shadow-cyan-500/25'
                            : 'border-white/20 bg-white/5 text-slate-300 hover:border-white/30 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <div className={`w-4 h-4 rounded border-2 transition-all ${
                            isSelected ? 'bg-cyan-500 border-cyan-400' : 'border-white/30'
                          }`}>
                            {isSelected && (
                              <svg className="w-2.5 h-2.5 text-white ml-0.5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Spending/Month */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4 text-center">
                  Monthly Spending: ${spendingAmount}{spendingAmount >= 200 ? '+' : ''}
                </h3>
                <div className="px-2">
                  <input
                    type="range"
                    min="20"
                    max="200"
                    value={spendingAmount}
                    onChange={(e) => handleSpendingChange([parseInt(e.target.value)])}
                    className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #06b6d4 0%, #10b981 ${((spendingAmount - 20) / 180) * 100}%, rgba(255,255,255,0.2) ${((spendingAmount - 20) / 180) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-slate-400 mt-2">
                    <span>$20</span>
                    <span>$200+</span>
                  </div>
                </div>
              </div>

              {/* Complete Button */}
              <div className="pt-4">
                <button
                  onClick={handleComplete}
                  disabled={!canComplete()}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}