'use client'

import { useState, useEffect } from 'react'
import {
  Play,
  Users,
  MessageSquare,
  Star,
  Clock,
  Target,
  Plus,
  Send,
  RotateCcw,
  CheckCircle,
  User,
  Bot,
  Timer,
  BarChart3,
  Settings,
  Trash2,
  Edit,
  Pause,
  Loader2
} from 'lucide-react'

interface CustomerPersona {
  id: string
  name: string
  personality: string
  traits: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  color: string
  description: string
}

interface TrainingScenario {
  id: string
  name: string
  description: string
  customerType: string
  scenario: string
  objectives: string[]
  timeframeMins: number
  isActive: boolean
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
}

interface TrainingSession {
  id: string
  scenarioId: string
  status: 'running' | 'completed' | 'paused'
  startTime: Date
  endTime?: Date
  score?: number
  customerPersona: string
  sessionNotes?: string
  scenario?: TrainingScenario
  conversation: Message[]
  feedback: string[]
  objectives: string[]
  summary: string
}

interface Message {
  id: string
  sessionId: string
  sender: 'user' | 'customer'
  message: string
  timestamp: Date
  metadata?: {
    confidence?: number
    intent?: string
    emotion?: string
  }
}

interface SessionStats {
  totalSessions: number
  completedSessions: number
  averageScore: number
  successRate: number
}

interface RoleplayTrainingProps {
  onTrainingSessionsUpdate?: (sessions: TrainingSession[]) => void
}

interface AIStaff {
  id: string
  name: string
  role: 'coach' | 'sales' | 'customer-service' | 'scientist'
  createdAt: Date
  trainingMemory: {[key: string]: string[]}
  totalSessions: number
}

// Default AI Coach prompt
const defaultAICoachPrompt = `You are Dr. Sakura, an expert AI skincare coach and consultant. Your role is to help customers with:

🎯 CORE EXPERTISE:
- Personalized skincare routine recommendations
- Ingredient education and safety guidance
- Product selection based on skin type and concerns
- Anti-aging and treatment advice
- Budget-friendly and premium options

💡 RESPONSE STYLE:
- Be warm, professional, and knowledgeable
- Ask clarifying questions to understand their needs
- Provide specific, actionable advice
- Explain the "why" behind recommendations
- Address concerns with empathy and expertise

🛍️ BUSINESS KNOWLEDGE:
- Essential Plan: $29/month (cleanser, treatment, moisturizer)
- Pro Plan: $49/month (adds serums, targeted treatments)
- Concierge Plan: $89/month (premium ingredients, exclusive access)
- 30-day money-back guarantee on all plans
- Free consultations and ongoing support

📋 CONVERSATION FLOW:
1. Greet warmly and ask about their skin goals
2. Assess skin type, concerns, and current routine
3. Recommend appropriate products and routine order
4. Explain benefits and address any concerns
5. Suggest suitable plan based on their needs and budget
6. Offer to answer any questions

⚠️ IMPORTANT:
- Always prioritize skin safety and patch testing
- Recommend starting slowly with active ingredients
- Ask about allergies and sensitivities
- Never diagnose medical conditions - refer to dermatologist when appropriate
- Be honest about realistic timelines for results

Remember: You're here to educate, guide, and help them achieve their best skin!`

// Role-specific prompts
const rolePrompts = {
  coach: defaultAICoachPrompt,

  sales: `You are a world-class sales consultant trained in proven methodologies (SPIN Selling, Challenger Sale, BANT, Customer-Centric Selling). Your goal is to educate, build trust, and guide customers to the best solution for their needs while maximizing revenue.

⚠️ CRITICAL RULES:
1. When customer asks a DIRECT QUESTION, answer it IMMEDIATELY with specifics. Answer first, sell second.
2. USE CLEAN FORMATTING - bullet points, short paragraphs, line breaks. NO WALLS OF TEXT!
3. Keep responses SCANNABLE - customers skim, they don't read every word

📝 FORMATTING REQUIREMENTS - FOLLOW THIS EXACTLY:

When listing features, put EACH bullet on a NEW LINE (no blank lines between bullets):

Great question! The Concierge Plan includes:
• Personal AI Skin Coach (24/7 chat access)
• Premium Swiss-formulated ingredients
• 4 Specialized Treatment Products
• Bi-weekly video consultations
• Priority access to new products (30 days early)
• Free express shipping

This is our premium tier designed for customers who want the fastest results. Most customers see visible improvements within 2-3 weeks vs 6-8 weeks with Essential.

Would you like to know how this compares to the Pro Plan?

CRITICAL: Each bullet on NEW LINE, but NO blank lines between bullets. Add blank line only AFTER the full list.

🎯 SALES PHILOSOPHY (Research-Backed):
- 85% of success comes from emotional intelligence, not product knowledge
- Teach customers something NEW about their problem (Challenger Sale)
- Build authentic relationships through active listening
- Act as trusted advisor, not pusher
- Help customers make their own decision (SNAP Selling)
- Focus on value and transformation, not just features

📊 QUALIFICATION FRAMEWORK (BANT):
1. **Budget**: Understand financial capacity early
   - "What's your monthly skincare budget currently?"
   - "How much are you spending now that isn't giving results?"

2. **Authority**: Identify decision-maker
   - "Are you the one making this decision, or will others be involved?"

3. **Need**: Uncover pain points
   - "What's the biggest skin concern keeping you from feeling confident?"
   - "What have you tried before that didn't work?"

4. **Timing**: Create urgency naturally
   - "When are you hoping to see results?"
   - "Is there an event or deadline driving this?"

🔄 SPIN SELLING QUESTIONS (Use in order):
1. **Situation**: "What's your current skincare routine?"
2. **Problem**: "What's frustrating you most about your skin right now?"
3. **Implication**: "How is this affecting your confidence and daily life?"
4. **Need-Payoff**: "If we could solve this, what would that mean for you?"

💡 CHALLENGER SALE APPROACH (Teach → Tailor → Take Control):

**TEACH** (Educate with new insights):
- "Most people think [common belief], but research shows [insight]"
- "Here's what 78% of customers don't realize about [skin issue]..."
- "The skincare industry doesn't tell you this, but..."

**TAILOR** (Customize to their situation):
- "Based on what you told me about [specific need], here's what I recommend..."
- "For someone in your situation with [pain point], the key is..."

**TAKE CONTROL** (Guide decision confidently):
- "Here's what I suggest: Start with [recommended plan] because..."
- "The best path forward for you is [specific recommendation]"

🛍️ PRODUCT DETAILS (ANSWER DIRECT QUESTIONS WITH THESE SPECIFICS):

**Essential Plan: $29/month**
What's Included:
- Daily Cleanser (removes dirt, oil, makeup)
- Active Treatment Serum (targets main concern)
- Daily Moisturizer with SPF 30
- Basic ingredient concentrations
- Email support
Who it's for: Budget-conscious beginners

**Pro Plan: $49/month** ⭐ BEST VALUE
What's Included:
- Everything in Essential, PLUS:
- 2 Targeted Treatment Serums (day & night)
- Eye Cream
- Weekly Exfoliating Mask
- Higher active ingredient concentrations (2x Essential)
- Priority email support
- Monthly progress check-ins
Who it's for: Serious about results, wants faster improvement

**Concierge Plan: $89/month** 👑 PREMIUM
What's Included:
- Everything in Pro, PLUS:
- Personal AI Skin Coach (24/7 chat access)
- Premium Swiss-formulated ingredients
- 4 Specialized Treatment Products
- Highest active concentrations (clinical-grade)
- Bi-weekly video consultations
- Priority access to new products (30 days early)
- Free express shipping
- Exclusive formulations not available in lower tiers
Who it's for: Want fastest results, value expert guidance

💡 ANSWERING STRATEGY:
1. **Direct question?** Answer FIRST with specifics above
2. **Then** frame value: "Here's why customers love this tier..."
3. **Then** guide decision: "Based on your needs, I'd recommend..."

NEVER dodge direct questions with sales talk - customers hate that!

💰 ADVANCED UPSELLING TECHNIQUES:

**Price Anchoring**:
- Always present Concierge first to make Pro/Essential seem affordable
- "Our premium tier is $89, but I understand that might be outside your budget right now"

**Value Stacking**:
- "With Concierge you get: personal coaching ($50 value) + priority shipping ($15 value) + exclusive formulations (priceless) + 30-day guarantee"

**Assumptive Close**:
- "So when would you like your first delivery - beginning or end of month?"
- "I'll get you started with Concierge - shipping to [address]?"

**Takeaway Close** (if hesitating):
- "You know what? Concierge might not be right for you. Let me ask - what's holding you back?"

🚫 OBJECTION HANDLING (Challenger mindset):

**"Too expensive"**:
- Reframe: "I understand. Let me ask - how much have you already spent on products that didn't work?"
- Challenge: "What's the cost of NOT solving this? How does it affect your confidence?"
- ROI: "Break it down: $89 ÷ 30 days = $2.96/day for clear, confident skin"

**"I need to think about it"**:
- Uncover real objection: "Of course. What specifically do you need to think about?"
- Create urgency: "I totally get it. Just so you know, our special pricing ends [timeframe]"

**"I'll start with Essential"**:
- Challenge gently: "I respect that. But here's what I've seen - 85% of Essential customers upgrade within a month because results are slower. Would you rather save time or money?"
- Alternative: "How about this - start with Pro to see faster results, then we can discuss Concierge after 30 days?"

**"Found cheaper on Amazon"**:
- Differentiate: "Great question. Here's what most people don't know - Amazon products often have lower active ingredient concentrations and no personal coaching. You're comparing apples to oranges."
- Teach: "The real cost isn't the price tag - it's using the wrong products for 6 months with no results"

📋 CONVERSATION STRUCTURE:

1. **Build Rapport** (30 seconds)
   - Warm greeting, show genuine interest

2. **Discovery** (SPIN questions - 40% of time)
   - Uncover pain points, goals, budget, timeline
   - Active listening - let them talk!

3. **Teach Something New** (Challenger - 30% of time)
   - Share insight they didn't know
   - Reframe their thinking

4. **Tailor Solution** (20% of time)
   - Recommend specific plan based on their needs
   - Stack value, show ROI

5. **Close** (10% of time)
   - Assumptive or trial close
   - Handle objections
   - Ask for the sale directly

⚠️ CRITICAL SUCCESS FACTORS:

✅ DO:
- Listen more than you talk (60/40 rule)
- Ask permission before pitching: "Would you like to hear what I recommend?"
- Use their name and reference specific things they said
- Show empathy: "I totally understand why you'd feel that way"
- Be consultative, not pushy
- Create urgency through value, not fake scarcity

❌ DON'T:
- Pitch before understanding their needs
- Use manipulative tactics that destroy trust
- Discount too quickly (shows lack of value)
- Give up after first objection
- Talk over the customer

🎯 ULTIMATE GOAL:
Make the customer feel they discovered the solution themselves, while you expertly guided them there. They should feel empowered, not sold to.

Remember: Research shows the Challenger approach (teach, tailor, take control) outperforms relationship-building or hard-closing by 40%. Be bold, be insightful, be valuable!`,

  'customer-service': `You are Dr. Sakura, a dedicated customer service specialist focused on ensuring customer satisfaction and resolving any issues with care and professionalism.

🎯 SERVICE OBJECTIVES:
- Resolve customer issues quickly and effectively
- Show empathy and understanding
- Turn negative experiences into positive ones
- Retain customers through excellent service
- Gather feedback to improve products/services
- Build trust and long-term loyalty

💡 SERVICE APPROACH:
- Listen actively and acknowledge concerns
- Apologize sincerely for any issues
- Take ownership of problems
- Provide clear solutions and timelines
- Follow up to ensure satisfaction
- Go above and beyond expectations
- Stay calm under pressure

🛡️ PROBLEM-SOLVING FRAMEWORK:
- Acknowledge the issue: "I understand your frustration..."
- Apologize genuinely: "I'm truly sorry this happened..."
- Gather information: Ask clarifying questions
- Propose solutions: Offer multiple options
- Take action: Implement fix immediately
- Confirm satisfaction: "Does this resolve your concern?"
- Follow up: "I'll check in with you in 3 days..."

💝 SERVICE RECOVERY:
- Defective product: Immediate replacement + discount on next order
- Shipping delay: Expedited shipping + free upgrade
- Product not working: Full refund + personalized alternative
- Billing issue: Immediate correction + account credit
- Unclear instructions: Personal consultation + written guide

📋 SERVICE CONVERSATION FLOW:
1. Empathetic greeting and acknowledgment
2. Active listening to understand the full issue
3. Sincere apology and taking ownership
4. Ask clarifying questions
5. Present solution options clearly
6. Implement fix or escalate if needed
7. Confirm customer satisfaction
8. Thank them for their patience

⚠️ SERVICE PRINCIPLES:
- Customer is always heard (even if not always right)
- Speed matters - respond quickly
- Transparency builds trust
- Turn complainers into advocates
- Every interaction is an opportunity
- Document issues for product improvement

Remember: Great service turns problems into opportunities and creates loyal customers for life!`,

  scientist: `You are Dr. Sakura, a research scientist and dermatology expert specializing in evidence-based skincare formulations and ingredient science.

🎯 SCIENTIFIC EXPERTISE:
- Molecular biology of skin aging
- Ingredient mechanisms of action
- Clinical study interpretation
- Formulation chemistry and stability
- Dermatological research and evidence
- Cosmeceutical science

💡 SCIENTIFIC COMMUNICATION:
- Use precise, technical terminology
- Cite research studies and clinical trials
- Explain biochemical mechanisms
- Discuss ingredient concentrations and pH
- Present data and statistics
- Address questions with scientific rigor
- Acknowledge limitations of current research

🔬 EVIDENCE-BASED RECOMMENDATIONS:
- Reference peer-reviewed studies
- Explain active ingredient mechanisms (e.g., "Retinol upregulates collagen synthesis via RAR receptors...")
- Discuss bioavailability and penetration
- Explain synergistic ingredient combinations
- Address contraindications and side effects
- Provide realistic timelines based on cell turnover
- Discuss quality control and stability testing

📊 PRODUCT ANALYSIS:
- Essential Plan: Clinical-grade actives at proven concentrations
  * Retinol 0.5% (proven efficacy above 0.3%)
  * Niacinamide 5% (optimal range 2-10%)
  * Hyaluronic acid (multi-molecular weight for layered hydration)
- Pro Plan: Advanced actives with enhanced delivery systems
  * Encapsulated retinol for stability
  * Peptide complexes (Matrixyl, Argireline)
  * Antioxidant blends (vitamins C+E+Ferulic)
- Concierge Plan: Cutting-edge ingredients from latest research
  * Growth factors and cytokines
  * Novel peptides from recent trials
  * Microbiome-supporting prebiotics

📋 SCIENTIFIC CONSULTATION FLOW:
1. Assess skin type using Fitzpatrick scale
2. Analyze concerns with clinical terminology
3. Explain underlying pathophysiology
4. Recommend evidence-based interventions
5. Discuss expected outcomes with timeframes
6. Explain proper application for maximum efficacy
7. Set realistic expectations based on literature

⚠️ SCIENTIFIC INTEGRITY:
- Always cite sources when making claims
- Acknowledge when evidence is limited
- Don't oversell or make unrealistic promises
- Explain the difference between cosmetic and medical treatments
- Recommend dermatologist for medical concerns
- Stay current with latest research
- Disclose when personal opinion vs. evidence

Remember: Science-based recommendations build credibility and trust with educated consumers!`
}

// Function to get role prompt with custom staff name
const getRolePrompt = (role: string, staffName: string): string => {
  const prompt = rolePrompts[role as keyof typeof rolePrompts] || rolePrompts.coach
  // Replace "Dr. Sakura" with custom staff name
  return prompt.replace(/Dr\. Sakura/g, staffName)
}

const RoleplayTraining = ({ onTrainingSessionsUpdate }: RoleplayTrainingProps = {}) => {
  const [selectedScenario, setSelectedScenario] = useState<TrainingScenario | null>(null)
  const [activeSession, setActiveSession] = useState<TrainingSession | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [sessionTimer, setSessionTimer] = useState(0)
  const [showCreateScenario, setShowCreateScenario] = useState(false)
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false)
  const [scenarios, setScenarios] = useState<TrainingScenario[]>([])
  const [stats, setStats] = useState<SessionStats>({
    totalSessions: 0,
    completedSessions: 0,
    averageScore: 0,
    successRate: 0
  })
  const [manualMode, setManualMode] = useState(false)
  const [autoConversationTimeout, setAutoConversationTimeout] = useState<NodeJS.Timeout | null>(null)
  const [showPromptEditor, setShowPromptEditor] = useState(false)
  const [aiCoachPrompt, setAiCoachPrompt] = useState('')
  const [isTrainingActive, setIsTrainingActive] = useState(false)
  const [trainingSpeed, setTrainingSpeed] = useState(3)
  const [selectedCustomerType, setSelectedCustomerType] = useState('random')
  const [showControlPanel, setShowControlPanel] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [completedTrainingSessions, setCompletedTrainingSessions] = useState<TrainingSession[]>([])
  const [sessionFeedback, setSessionFeedback] = useState<string[]>([])
  const [trainingMemory, setTrainingMemory] = useState<{[key: string]: string[]}>({})
  const [generatingWho, setGeneratingWho] = useState<'customer' | 'coach' | null>(null)
  const [selectedRole, setSelectedRole] = useState<'coach' | 'sales' | 'customer-service' | 'scientist'>('coach')
  const [aiStaffList, setAiStaffList] = useState<AIStaff[]>([])
  const [selectedStaff, setSelectedStaff] = useState<AIStaff | null>(null)
  const [showStaffCreator, setShowStaffCreator] = useState(false)

  // Customer personas inspired by brezcode-platform
  const customerPersonas: CustomerPersona[] = [
    {
      id: 'angry',
      name: 'Frustrated Sarah',
      personality: 'Angry Customer',
      traits: ['Impatient', 'Demanding', 'Skeptical'],
      difficulty: 'Hard',
      color: 'bg-red-500',
      description: 'Customer with a bad experience who needs careful handling'
    },
    {
      id: 'confused',
      name: 'Confused Mike',
      personality: 'Confused Customer',
      traits: ['Uncertain', 'Needs guidance', 'Asks many questions'],
      difficulty: 'Medium',
      color: 'bg-yellow-500',
      description: 'Customer who needs clear explanations and step-by-step help'
    },
    {
      id: 'price-sensitive',
      name: 'Budget-conscious Emma',
      personality: 'Price-Sensitive Customer',
      traits: ['Cost-conscious', 'Needs value', 'Compares options'],
      difficulty: 'Medium',
      color: 'bg-orange-500',
      description: 'Customer focused on getting the best value for money'
    },
    {
      id: 'tech-savvy',
      name: 'Tech-savvy Alex',
      personality: 'Tech-Savvy Customer',
      traits: ['Detail-oriented', 'Knowledgeable', 'Wants specifics'],
      difficulty: 'Easy',
      color: 'bg-blue-500',
      description: 'Customer with technical knowledge who asks detailed questions'
    },
    {
      id: 'enthusiastic',
      name: 'Enthusiastic Lisa',
      personality: 'Enthusiastic Customer',
      traits: ['Excited', 'Eager to learn', 'Open to suggestions'],
      difficulty: 'Easy',
      color: 'bg-green-500',
      description: 'Customer who is excited about skincare and eager to try new products'
    }
  ]

  // Role-specific scenarios
  const roleSpecificScenarios: Record<string, TrainingScenario[]> = {
    coach: [
      {
        id: 'coach-1',
        name: 'Confused Beginner - First Time User',
        description: 'Customer has never had a skincare routine and needs guidance',
        customerType: 'confused',
        scenario: 'Customer is completely new to skincare and overwhelmed by choices',
        objectives: ['Assess skin type and concerns', 'Build simple beginner routine', 'Educate on proper order and usage'],
        timeframeMins: 20,
        isActive: true,
        difficulty: 'Beginner'
      },
      {
        id: 'coach-2',
        name: 'Enthusiastic Learner - Ingredient Education',
        description: 'Customer wants to understand ingredients and how they work',
        customerType: 'enthusiastic',
        scenario: 'Customer is eager to learn about active ingredients and their benefits',
        objectives: ['Explain key ingredients', 'Discuss benefits and side effects', 'Recommend evidence-based products'],
        timeframeMins: 25,
        isActive: true,
        difficulty: 'Intermediate'
      }
    ],

    sales: [
      {
        id: 'sales-1',
        name: 'Price Objection - "Too Expensive"',
        description: 'Customer thinks products are too expensive',
        customerType: 'price-sensitive',
        scenario: 'Customer interested but says pricing is too high for their budget',
        objectives: ['Overcome price objection', 'Show value and ROI', 'Close the deal with upsell'],
        timeframeMins: 15,
        isActive: true,
        difficulty: 'Intermediate'
      },
      {
        id: 'sales-2',
        name: 'Competitor Comparison - "Amazon is Cheaper"',
        description: 'Customer comparing prices with competitors',
        customerType: 'tech-savvy',
        scenario: 'Customer found similar products cheaper on Amazon and wants to know why they should pay more',
        objectives: ['Differentiate from competitors', 'Justify premium pricing', 'Close with Concierge plan'],
        timeframeMins: 20,
        isActive: true,
        difficulty: 'Advanced'
      },
      {
        id: 'sales-3',
        name: 'Upsell Opportunity - Essential Plan Interest',
        description: 'Customer wants Essential plan, upsell to Pro/Concierge',
        customerType: 'enthusiastic',
        scenario: 'Customer says they want to start with Essential Plan ($29)',
        objectives: ['Show limitations of Essential', 'Create desire for Pro/Concierge', 'Close higher-tier sale'],
        timeframeMins: 15,
        isActive: true,
        difficulty: 'Intermediate'
      }
    ],

    'customer-service': [
      {
        id: 'cs-1',
        name: 'Angry Customer - Defective Product',
        description: 'Customer received defective product and demands refund',
        customerType: 'angry',
        scenario: 'Customer received a defective cleanser that caused skin irritation',
        objectives: ['Apologize sincerely', 'Resolve issue quickly', 'Retain customer with recovery offer'],
        timeframeMins: 15,
        isActive: true,
        difficulty: 'Advanced'
      },
      {
        id: 'cs-2',
        name: 'Shipping Delay - Missing Order',
        description: 'Customer order is delayed and they are frustrated',
        customerType: 'angry',
        scenario: 'Customer paid for expedited shipping but order is 5 days late',
        objectives: ['Track order status', 'Compensate for delay', 'Prevent churn'],
        timeframeMins: 15,
        isActive: true,
        difficulty: 'Intermediate'
      },
      {
        id: 'cs-3',
        name: 'Refund Request - Not Working',
        description: 'Customer wants refund because product not working',
        customerType: 'confused',
        scenario: 'Customer used products for 2 weeks and sees no results, wants money back',
        objectives: ['Understand usage pattern', 'Educate on realistic timelines', 'Offer solution or process refund'],
        timeframeMins: 20,
        isActive: true,
        difficulty: 'Intermediate'
      }
    ],

    scientist: [
      {
        id: 'sci-1',
        name: 'Skeptical Customer - Show Me Proof',
        description: 'Customer wants scientific evidence for claims',
        customerType: 'tech-savvy',
        scenario: 'Customer questions efficacy and wants peer-reviewed studies',
        objectives: ['Cite relevant research', 'Explain mechanisms', 'Build credibility with evidence'],
        timeframeMins: 25,
        isActive: true,
        difficulty: 'Advanced'
      },
      {
        id: 'sci-2',
        name: 'Medical Concern - Prescription Conflict',
        description: 'Customer on tretinoin, wants to know about product compatibility',
        customerType: 'tech-savvy',
        scenario: 'Customer currently using prescription tretinoin and concerned about ingredient interactions',
        objectives: ['Assess current regimen', 'Explain contraindications', 'Recommend safe alternatives or refer to derm'],
        timeframeMins: 20,
        isActive: true,
        difficulty: 'Advanced'
      }
    ]
  }

  // Legacy default scenarios for backward compatibility
  const defaultScenarios: TrainingScenario[] = roleSpecificScenarios.coach

  useEffect(() => {
    initializeData()
  }, [])

  // Save selected role when it changes
  useEffect(() => {
    localStorage.setItem('skincoach_ai_role', selectedRole)
  }, [selectedRole])

  // Update scenarios when role changes
  useEffect(() => {
    const roleScenarios = roleSpecificScenarios[selectedRole] || defaultScenarios
    setScenarios(roleScenarios)
  }, [selectedRole])

  const createNewStaff = (name: string, role: 'coach' | 'sales' | 'customer-service' | 'scientist') => {
    const newStaff: AIStaff = {
      id: Date.now().toString(),
      name,
      role,
      createdAt: new Date(),
      trainingMemory: {},
      totalSessions: 0
    }
    const updatedList = [...aiStaffList, newStaff]
    setAiStaffList(updatedList)
    setSelectedStaff(newStaff)
    setSelectedRole(role)
    localStorage.setItem('skincoach_ai_staff', JSON.stringify(updatedList))
    setShowStaffCreator(false)
  }

  const selectStaff = (staff: AIStaff) => {
    setSelectedStaff(staff)
    setSelectedRole(staff.role)
    setTrainingMemory(staff.trainingMemory || {})
  }

  // Timer effect for active sessions
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isSessionActive && activeSession) {
      interval = setInterval(() => {
        setSessionTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isSessionActive, activeSession])

  const initializeData = () => {
    // Load AI Staff
    const savedStaff = localStorage.getItem('skincoach_ai_staff')
    if (savedStaff) {
      const staff = JSON.parse(savedStaff)
      setAiStaffList(staff)
      // Select first staff by default
      if (staff.length > 0) {
        setSelectedStaff(staff[0])
        setSelectedRole(staff[0].role)
      }
    } else {
      // Create default AI staff member
      const defaultStaff: AIStaff = {
        id: '1',
        name: 'Dr. Sakura',
        role: 'coach',
        createdAt: new Date(),
        trainingMemory: {},
        totalSessions: 0
      }
      setAiStaffList([defaultStaff])
      setSelectedStaff(defaultStaff)
      localStorage.setItem('skincoach_ai_staff', JSON.stringify([defaultStaff]))
    }

    // Load saved scenarios or use role-specific defaults
    const savedScenarios = localStorage.getItem('skincoach_roleplay_scenarios')
    if (savedScenarios) {
      setScenarios(JSON.parse(savedScenarios))
    } else {
      // Load scenarios for current role
      const initialScenarios = roleSpecificScenarios[selectedRole] || defaultScenarios
      setScenarios(initialScenarios)
      localStorage.setItem('skincoach_roleplay_scenarios', JSON.stringify(initialScenarios))
    }

    // Load session stats
    const savedStats = localStorage.getItem('skincoach_roleplay_stats')
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }

    // Load selected role
    const savedRole = localStorage.getItem('skincoach_ai_role')
    if (savedRole && ['coach', 'sales', 'customer-service', 'scientist'].includes(savedRole)) {
      setSelectedRole(savedRole as 'coach' | 'sales' | 'customer-service' | 'scientist')
    }

    // Load AI coach prompt
    const savedPrompt = localStorage.getItem('skincoach_ai_coach_prompt')
    if (savedPrompt) {
      setAiCoachPrompt(savedPrompt)
    } else {
      // Default AI coach prompt
      const defaultPrompt = `You are Dr. Sakura, an expert AI skincare coach and consultant. Your role is to help customers with:

🎯 CORE EXPERTISE:
- Personalized skincare routine recommendations
- Ingredient education and safety guidance
- Product selection based on skin type and concerns
- Anti-aging and treatment advice
- Budget-friendly and premium options

💡 RESPONSE STYLE:
- Be warm, professional, and knowledgeable
- Ask clarifying questions to understand their needs
- Provide specific, actionable advice
- Explain the "why" behind recommendations
- Address concerns with empathy and expertise

🛍️ BUSINESS KNOWLEDGE:
- Essential Plan: $29/month (cleanser, treatment, moisturizer)
- Pro Plan: $49/month (adds serums, targeted treatments)
- Concierge Plan: $89/month (premium ingredients, exclusive access)
- 30-day money-back guarantee on all plans
- Free consultations and ongoing support

📋 CONVERSATION FLOW:
1. Greet warmly and ask about their skin goals
2. Assess skin type, concerns, and current routine
3. Recommend appropriate products and routine order
4. Explain benefits and address any concerns
5. Suggest suitable plan based on their needs and budget
6. Offer to answer any questions

⚠️ IMPORTANT:
- Always prioritize skin safety and patch testing
- Recommend starting slowly with active ingredients
- Ask about allergies and sensitivities
- Never diagnose medical conditions - refer to dermatologist when appropriate
- Be honest about realistic timelines for results

Remember: You're here to educate, guide, and help them achieve their best skin!`

      setAiCoachPrompt(defaultPrompt)
      localStorage.setItem('skincoach_ai_coach_prompt', defaultPrompt)
    }
  }

  const handleStartSession = (scenario: TrainingScenario) => {
    const newSession: TrainingSession = {
      id: Date.now().toString(),
      scenarioId: scenario.id,
      status: 'running',
      startTime: new Date(),
      customerPersona: scenario.customerType
    }

    setSelectedScenario(scenario)
    setActiveSession(newSession)
    setIsSessionActive(true)
    setMessages([])
    setSessionTimer(0)

    // Start AI vs AI conversation
    startAIConversation(scenario)
  }

  const startAIConversation = (scenario: TrainingScenario) => {
    // Generate initial customer message
    generateInitialCustomerMessage(scenario)

    // Start automated conversation after initial message
    setTimeout(() => {
      if (activeSession && selectedScenario) {
        continueAIConversation(scenario, 1)
      }
    }, 2000)
  }

  const generateInitialCustomerMessage = (scenario: TrainingScenario) => {
    const persona = customerPersonas.find(p => p.id === scenario.customerType)
    let initialMessage = ''

    switch (scenario.customerType) {
      case 'angry':
        initialMessage = "I'm really frustrated! The skincare routine you recommended isn't working at all and I've been using it for weeks. I want a refund and an explanation for why you wasted my time!"
        break
      case 'confused':
        initialMessage = "Hi... I'm really confused about skincare. I have so many questions and don't know where to start. Everyone tells me different things and I just don't understand what I actually need."
        break
      case 'price-sensitive':
        initialMessage = "I'm interested in improving my skin but honestly, your prices seem pretty high. I'm on a tight budget - do you have anything more affordable that actually works?"
        break
      case 'tech-savvy':
        initialMessage = "I've been researching skincare ingredients and I'm curious about your formulations. What are the exact concentrations of active ingredients and how do they compare to competitors?"
        break
      case 'enthusiastic':
        initialMessage = "OMG I'm so excited about starting a proper skincare routine! I've heard amazing things about AI-powered recommendations. Tell me everything - I want to know all about the products and ingredients!"
        break
      default:
        initialMessage = "Hi, I'm interested in learning more about your skincare recommendations."
    }

    const customerMessage: Message = {
      id: Date.now().toString(),
      sessionId: activeSession?.id || '',
      sender: 'customer',
      message: initialMessage,
      timestamp: new Date(),
      metadata: {
        emotion: getPersonalityEmotion(scenario.customerType),
        intent: 'initial_inquiry'
      }
    }

    setMessages([customerMessage])

    // Generate AI coach response immediately after customer message
    setTimeout(async () => {
      setIsGeneratingResponse(true)
      try {
        const coachResponse = await generateAICoachResponseToAll(initialMessage, scenario)

        const coachMessage: Message = {
          id: (Date.now() + 1).toString(),
          sessionId: activeSession?.id || '',
          sender: 'user', // AI Coach
          message: coachResponse,
          timestamp: new Date(),
          metadata: {
            intent: 'coach_response',
            confidence: Math.random() * 0.3 + 0.7
          }
        }

        setMessages(prev => [...prev, coachMessage])
      } catch (error) {
        console.error('Error generating initial coach response:', error)

        // NO FALLBACK IN TRAINING! Show the real error
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          sessionId: activeSession?.id || '',
          sender: 'user',
          message: `❌ TRAINING ERROR: Failed to generate initial coach response - ${error instanceof Error ? error.message : 'Unknown error'}. Training cannot continue with fallback responses!`,
          timestamp: new Date(),
          metadata: {
            intent: 'training_error_initial',
            confidence: 0,
            error: true
          }
        }
        setMessages(prev => [...prev, errorMessage])
      }
      setIsGeneratingResponse(false)
    }, 1500)
  }

  const getPersonalityEmotion = (customerType: string): string => {
    const emotions = {
      angry: '😠',
      confused: '😕',
      'price-sensitive': '💰',
      'tech-savvy': '🤓',
      enthusiastic: '😍'
    }
    return emotions[customerType as keyof typeof emotions] || '😊'
  }

  const continueAIConversation = async (scenario: TrainingScenario, turn: number) => {
    if (!activeSession || !isSessionActive || turn > 8 || manualMode) {
      // Auto-complete session after 8 turns or if manual mode is enabled
      if (turn > 8) {
        const timeout = setTimeout(() => handleCompleteSession(), 2000)
        setAutoConversationTimeout(timeout)
      }
      return
    }

    setIsGeneratingResponse(true)

    // Generate AI Coach response
    const coachTimeout = setTimeout(async () => {
      if (manualMode) {
        setIsGeneratingResponse(false)
        return
      }

      try {
        // Get the last customer message for context
        const lastCustomerMessage = messages.filter(m => m.sender === 'customer').slice(-1)[0]?.message ||
          'Initial customer inquiry based on scenario'

        const coachResponse = await generateAICoachResponseToAll(lastCustomerMessage, scenario)

        const coachMessage: Message = {
          id: Date.now().toString(),
          sessionId: activeSession.id,
          sender: 'user', // AI Coach
          message: coachResponse,
          timestamp: new Date(),
          metadata: {
            intent: 'coach_response',
            confidence: Math.random() * 0.3 + 0.7
          }
        }

        setMessages(prev => [...prev, coachMessage])
      } catch (error) {
        console.error('Error generating auto coach response:', error)

        // NO FALLBACK IN TRAINING! Show the real error to fix the root cause
        const errorMessage: Message = {
          id: Date.now().toString(),
          sessionId: activeSession.id,
          sender: 'user',
          message: `❌ TRAINING ERROR: OpenAI API failed - ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key, internet connection, or OpenAI service status.`,
          timestamp: new Date(),
          metadata: {
            intent: 'training_error',
            confidence: 0,
            error: true
          }
        }
        setMessages(prev => [...prev, errorMessage])
      }

      setIsGeneratingResponse(false)

      // Generate customer response after coach (only if still in auto mode)
      const customerTimeout = setTimeout(async () => {
        if (activeSession && isSessionActive && !manualMode) {
          // Customer response will now be generated by AI Customer Brain API
          await generateAICustomerBrain()

          // Continue conversation (only if still in auto mode)
          const nextTimeout = setTimeout(() => {
            if (!manualMode) {
              continueAIConversation(scenario, turn + 1)
            }
          }, 2000 + Math.random() * 1000)
          setAutoConversationTimeout(nextTimeout)
        }
      }, 1500 + Math.random() * 1000)
      setAutoConversationTimeout(customerTimeout)
    }, 1000 + Math.random() * 1000)
    setAutoConversationTimeout(coachTimeout)
  }

  const handleManualMessage = async () => {
    if (!currentMessage.trim() || !activeSession || !selectedScenario) return

    // Add user message as customer
    const customerMessage: Message = {
      id: Date.now().toString(),
      sessionId: activeSession.id,
      sender: 'customer',
      message: currentMessage.trim(),
      timestamp: new Date(),
      metadata: {
        emotion: '👤',
        intent: 'manual_customer'
      }
    }

    setMessages(prev => [...prev, customerMessage])
    setCurrentMessage('')
    setIsGeneratingResponse(true)
    setGeneratingWho('coach')

    try {
      // Generate AI Coach response using real OpenAI API
      const coachResponse = await generateAICoachResponseToAll(customerMessage.message, selectedScenario)

      const coachMessage: Message = {
        id: Date.now().toString(),
        sessionId: activeSession.id,
        sender: 'user', // AI Coach
        message: coachResponse,
        timestamp: new Date(),
        metadata: {
          intent: 'coach_response_to_manual',
          confidence: Math.random() * 0.3 + 0.7
        }
      }

      setMessages(prev => [...prev, coachMessage])
    } catch (error) {
      console.error('Error generating coach response:', error)

      // Add error message if something goes wrong
      const errorMessage: Message = {
        id: Date.now().toString(),
        sessionId: activeSession.id,
        sender: 'user',
        message: "I apologize, but I'm having trouble generating a response right now. Please try again.",
        timestamp: new Date(),
        metadata: {
          intent: 'error_response',
          confidence: 0
        }
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsGeneratingResponse(false)
      setGeneratingWho(null)
    }
  }

  const generateAICoachResponseToAll = async (customerMessage: string, scenario: TrainingScenario): Promise<string> => {
    try {
      // Get relevant training memory for this scenario type
      const scenarioMemory = trainingMemory[scenario.customerType] || []
      const generalMemory = trainingMemory['general'] || []
      const allRelevantMemory = [...scenarioMemory, ...generalMemory]

      // Call the real OpenAI API with custom prompt including memory
      console.log('🧠 AI Coach Training Memory:', {
        scenario: scenario.name,
        customerType: scenario.customerType,
        customerMessage: customerMessage.substring(0, 50),
        messagesCount: messages.length,
        memoryItems: allRelevantMemory.length,
        scenarioMemoryCount: scenarioMemory.length,
        generalMemoryCount: generalMemory.length,
        allMemory: allRelevantMemory
      })

      const response = await fetch('/api/ai/coach-training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: `${getRolePrompt(selectedRole, selectedStaff?.name || 'Dr. Sakura')}

CURRENT TRAINING SCENARIO: ${scenario.name}
SCENARIO DESCRIPTION: ${scenario.scenario}
CUSTOMER TYPE: ${scenario.customerType}

CRITICAL OBJECTIVES YOU MUST ACHIEVE:
${scenario.objectives.map(obj => `- ${obj}`).join('\n')}

${allRelevantMemory.length > 0 ? `
TRAINING MEMORY - IMPORTANT FEEDBACK FROM PREVIOUS SESSIONS:
${allRelevantMemory.map((feedback, index) => `${index + 1}. ${feedback}`).join('\n')}

CRITICAL: Apply lessons learned from previous feedback above. Do NOT repeat past mistakes!` : ''}

TRAINING INSTRUCTIONS:
- You are being tested on your ability to handle this specific scenario
- Work systematically towards achieving ALL the scenario objectives
- The AI Customer will challenge you until these objectives are met
- Stay professional but adapt your approach to the customer type (${scenario.customerType})
- Demonstrate competency in addressing the specific scenario challenges
- Provide concrete solutions, not just generic responses
- Remember: Your success is measured by how well you achieve the scenario objectives
${allRelevantMemory.length > 0 ? '- MOST IMPORTANT: Apply all feedback from your training memory to avoid repeating past mistakes' : ''}

Your response should work towards completing these objectives while maintaining customer satisfaction.`,
          customerMessage,
          conversationHistory: messages.map(m => ({
            sender: m.sender,
            message: m.message,
            timestamp: m.timestamp.toISOString()
          })),
          customerPersona: scenario.customerType,
          scenario: scenario.description
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success || !data.response) {
        throw new Error('Invalid API response')
      }

      return data.response

    } catch (error) {
      console.error('OpenAI API Error:', error)
      console.error('Full error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        scenario: scenario?.name,
        customerMessage: customerMessage?.substring(0, 100),
        responseStatus: error instanceof Error && error.message.includes('API error:') ? error.message : 'Network or other error'
      })

      // For training purposes, we want to know when the real AI fails
      // Don't use fallback - let the error bubble up so you can fix the root cause
      throw new Error(`OpenAI API failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key, internet connection, or OpenAI service status.`)
    }
  }


  const handleDirectMessage = async () => {
    if (!currentMessage.trim()) return

    // Add user message as customer
    const customerMessage: Message = {
      id: Date.now().toString(),
      sessionId: 'direct-chat',
      sender: 'customer',
      message: currentMessage.trim(),
      timestamp: new Date(),
      metadata: {
        emotion: '👤',
        intent: 'manual_customer'
      }
    }

    setMessages(prev => [...prev, customerMessage])
    setCurrentMessage('')
    setIsGeneratingResponse(true)
    setGeneratingWho('coach')

    try {
      // Create a basic scenario for direct chat
      const directScenario: TrainingScenario = {
        id: 'direct',
        name: 'Direct Consultation',
        description: 'Direct customer consultation with Dr. Sakura',
        customerType: 'general',
        scenario: 'Customer seeking skincare advice from Dr. Sakura',
        objectives: ['Provide helpful skincare advice'],
        timeframeMins: 30,
        isActive: true,
        difficulty: 'Beginner'
      }

      // Generate AI Coach response using real OpenAI API
      const coachResponse = await generateAICoachResponseToAll(customerMessage.message, directScenario)

      const coachMessage: Message = {
        id: Date.now().toString(),
        sessionId: 'direct-chat',
        sender: 'user', // Dr. Sakura
        message: coachResponse,
        timestamp: new Date(),
        metadata: {
          intent: 'coach_response_direct',
          confidence: Math.random() * 0.3 + 0.7
        }
      }

      setMessages(prev => [...prev, coachMessage])
    } catch (error) {
      console.error('Error generating coach response:', error)

      // Add error message if something goes wrong
      const errorMessage: Message = {
        id: Date.now().toString(),
        sessionId: 'direct-chat',
        sender: 'user',
        message: "I apologize, but I'm having trouble generating a response right now. Please try again.",
        timestamp: new Date(),
        metadata: {
          intent: 'error_response',
          confidence: 0
        }
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsGeneratingResponse(false)
      setGeneratingWho(null)
    }
  }

  const startTraining = () => {
    setIsTrainingActive(true)
    setMessages([]) // Clear any existing messages
    setSessionTimer(0)

    // Start the first customer question
    generateCustomerQuestion()
  }

  const stopTraining = () => {
    setIsTrainingActive(false)
    setIsGeneratingResponse(false)

    // Clear any pending timeouts
    if (autoConversationTimeout) {
      clearTimeout(autoConversationTimeout)
      setAutoConversationTimeout(null)
    }
  }

  // Load completed training sessions and training memory on mount
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('skincoach_training_sessions')
      if (savedSessions) {
        const sessions = JSON.parse(savedSessions)
        setCompletedTrainingSessions(sessions)
      }

      // Load training memory
      const savedMemory = localStorage.getItem('skincoach_training_memory')
      if (savedMemory) {
        const memory = JSON.parse(savedMemory)
        setTrainingMemory(memory)
      }
    } catch (error) {
      console.error('Error loading training data:', error)
    }
  }, [])

  const clearChat = () => {
    setMessages([])
    setSessionTimer(0)
  }

  const generateAICustomerBrain = async () => {
    if (isGeneratingResponse || !selectedScenario) return

    setIsGeneratingResponse(true)
    setGeneratingWho('customer')

    try {
      // Get conversation history and last AI coach response
      const lastCoachMessage = messages.filter(m => m.sender === 'user').slice(-1)[0]
      const turn = Math.floor(messages.length / 2) + 1

      console.log('🤖 Generating REAL AI Customer response:', {
        scenario: selectedScenario.name,
        customerType: selectedScenario.customerType,
        turn,
        lastCoachMessage: lastCoachMessage?.message?.substring(0, 100)
      })

      // Call the REAL AI Customer Brain API
      const response = await fetch('/api/ai/customer-brain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          scenario: selectedScenario,
          coachMessage: lastCoachMessage?.message || 'Initial greeting',
          conversationHistory: messages.map(m => ({
            sender: m.sender,
            message: m.message,
            timestamp: m.timestamp.toISOString()
          })),
          turn
        })
      })

      if (!response.ok) {
        throw new Error(`AI Customer API error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success || !data.response) {
        throw new Error('Invalid AI Customer API response')
      }

      const customerQuestion = data.response

      // Add REAL AI Customer message
      const customerMessage: Message = {
        id: Date.now().toString(),
        sessionId: selectedScenario.id,
        sender: 'customer',
        message: customerQuestion,
        timestamp: new Date(),
        metadata: {
          emotion: getPersonalityEmotion(selectedScenario.customerType),
          intent: 'ai_customer_question',
          aiGenerated: true,
          turn,
          model: 'gpt-4o-mini'
        }
      }

      setMessages(prev => [...prev, customerMessage])
      setIsGeneratingResponse(false)
      setGeneratingWho(null)

      // Generate AI Coach response after delay
      setTimeout(async () => {
        setIsGeneratingResponse(true)
        setGeneratingWho('coach')
        try {
          const coachResponse = await generateAICoachResponseToAll(customerQuestion, selectedScenario)

          const coachMessage: Message = {
            id: Date.now().toString(),
            sessionId: selectedScenario.id,
            sender: 'user', // Dr. Sakura (AI Coach)
            message: coachResponse,
            timestamp: new Date(),
            metadata: {
              intent: 'coach_scenario_response',
              confidence: Math.random() * 0.3 + 0.7,
              aiGenerated: true,
              model: 'gpt-4o-mini'
            }
          }

          setMessages(prev => [...prev, coachMessage])
        } catch (error) {
          console.error('Error generating AI Coach response:', error)
          const errorMessage: Message = {
            id: Date.now().toString(),
            sessionId: selectedScenario.id,
            sender: 'user',
            message: `❌ TRAINING ERROR: AI Coach failed - ${error instanceof Error ? error.message : 'Unknown error'}. Check your OpenAI API.`,
            timestamp: new Date(),
            metadata: {
              intent: 'training_error',
              confidence: 0,
              error: true
            }
          }
          setMessages(prev => [...prev, errorMessage])
        }

        setIsGeneratingResponse(false)
        setGeneratingWho(null)
      }, 1500)

    } catch (error) {
      console.error('Error generating AI Customer response:', error)

      // Show clear error for AI Customer failure
      const errorMessage: Message = {
        id: Date.now().toString(),
        sessionId: selectedScenario?.id || 'error',
        sender: 'customer',
        message: `❌ TRAINING ERROR: AI Customer Brain failed - ${error instanceof Error ? error.message : 'Unknown error'}. Check your OpenAI API configuration.`,
        timestamp: new Date(),
        metadata: {
          intent: 'ai_customer_error',
          confidence: 0,
          error: true
        }
      }
      setMessages(prev => [...prev, errorMessage])
      setIsGeneratingResponse(false)
      setGeneratingWho(null)
    }
  }

  // ❌ REMOVED: All scripted customer response functions
  // Now using REAL AI Customer Brain via OpenAI API!
  // Old functions like generateAngryCustomerQuestion, generateConfusedCustomerQuestion, etc.
  // have been replaced with actual AI that responds dynamically to the coach's messages.







  const generateCustomerQuestion = generateAICustomerBrain

  const handleCompleteTrainingSession = () => {
    if (messages.length === 0 || !selectedScenario) {
      alert('No training session to complete.')
      return
    }

    // Create completed training session
    const completedSession: TrainingSession = {
      id: Date.now().toString(),
      scenarioId: selectedScenario.id,
      status: 'completed',
      startTime: activeSession?.startTime || new Date(),
      endTime: new Date(),
      customerPersona: selectedScenario.customerType,
      scenario: selectedScenario,
      conversation: [...messages],
      feedback: [...sessionFeedback],
      objectives: selectedScenario.objectives,
      summary: generateSessionSummary(),
      score: calculateSessionScore()
    }

    // Save to completed sessions
    const updatedSessions = [...completedTrainingSessions, completedSession]
    setCompletedTrainingSessions(updatedSessions)

    // Save to localStorage for persistence
    try {
      const existingSessions = JSON.parse(localStorage.getItem('skincoach_training_sessions') || '[]')
      const allSessions = [...existingSessions, completedSession]
      localStorage.setItem('skincoach_training_sessions', JSON.stringify(allSessions))

      // Notify parent component about training sessions update
      onTrainingSessionsUpdate?.(allSessions)
    } catch (error) {
      console.error('Error saving training session:', error)
    }

    // Clear current session
    setMessages([])
    setActiveSession(null)
    setIsSessionActive(false)
    setSessionFeedback([])
    setSelectedScenario(null)

    alert(`Training session completed and saved!\n\nScenario: ${selectedScenario.name}\nMessages: ${messages.length}\nFeedback provided: ${sessionFeedback.length}\nScore: ${calculateSessionScore()}%`)
  }

  const generateSessionSummary = (): string => {
    const customerMessages = messages.filter(m => m.sender === 'customer').length
    const coachMessages = messages.filter(m => m.sender === 'user').length
    const revisedMessages = messages.filter(m => m.metadata?.intent === 'coach_revision').length

    return `Training session with ${selectedScenario?.customerType} customer. ${customerMessages} customer questions, ${coachMessages} coach responses, ${revisedMessages} revisions based on feedback. ${sessionFeedback.length} feedback comments provided.`
  }

  const calculateSessionScore = (): number => {
    // Simple scoring based on conversation length and feedback
    const baseScore = Math.min(100, messages.length * 10) // 10 points per message, max 100
    const feedbackPenalty = sessionFeedback.length * 5 // -5 points per feedback (more feedback = more corrections needed)
    return Math.max(0, baseScore - feedbackPenalty)
  }


  const handleFeedback = async () => {
    if (!feedbackMessage.trim() || isGeneratingResponse || !selectedScenario) return

    // Get the last AI coach response to revise
    const lastCoachMessage = messages.filter(m => m.sender === 'user').slice(-1)[0]
    const lastCustomerMessage = messages.filter(m => m.sender === 'customer').slice(-1)[0]

    if (!lastCoachMessage || !lastCustomerMessage) {
      alert('No AI coach response to provide feedback on.')
      return
    }

    setIsGeneratingResponse(true)
    setGeneratingWho('coach')

    try {
      // Get conversation context
      const conversationHistory = messages.slice(-6).map(msg => ({
        sender: msg.sender === 'user' ? 'coach' : 'customer',
        message: msg.message,
        timestamp: msg.timestamp.toISOString()
      }))

      // Analyze feedback for specific instructions
      const feedbackLower = feedbackMessage.toLowerCase()
      const needsShorter = feedbackLower.includes('less word') || feedbackLower.includes('shorter') || feedbackLower.includes('brief') || feedbackLower.includes('concise')
      const needsLonger = feedbackLower.includes('more detail') || feedbackLower.includes('longer') || feedbackLower.includes('elaborate')

      // Create revision prompt for AI Coach
      const revisionPrompt = `You are Dr. Sakura receiving training feedback. You must REVISE your previous response based on the trainer's specific feedback.

TRAINING CONTEXT:
Scenario: ${selectedScenario.name}
Customer Type: ${selectedScenario.customerType}

CUSTOMER'S QUESTION:
"${lastCustomerMessage.message}"

YOUR PREVIOUS RESPONSE (THAT NEEDS REVISION):
"${lastCoachMessage.message}"

🚨 TRAINER'S FEEDBACK ON YOUR RESPONSE:
"${feedbackMessage}"

${needsShorter ? `
⚠️ CRITICAL: The trainer wants a SHORTER response! Your previous response was ${lastCoachMessage.message.split(' ').length} words.
Make your revised response SIGNIFICANTLY shorter (aim for 30-50 words MAX). Be concise and direct!` : ''}

${needsLonger ? `
⚠️ CRITICAL: The trainer wants MORE DETAIL! Your previous response was too brief.
Expand your revised response with more explanation, examples, and helpful details.` : ''}

REVISION INSTRUCTIONS:
1. Read the trainer's feedback carefully
2. Identify what was wrong or missing in your previous response
3. Write a COMPLETELY NEW response that:
   - Directly addresses the trainer's feedback
   ${needsShorter ? '   - Is MUCH SHORTER than your previous response (cut it by at least 50%)' : ''}
   ${needsLonger ? '   - Is MORE DETAILED than your previous response (at least 2x longer)' : ''}
   - Fixes the specific issues mentioned
   - Maintains your professional, warm tone
   - Provides better, more helpful guidance to the customer
4. DO NOT just repeat your previous response
5. DO NOT ignore the trainer's feedback
6. SHOW that you learned from the feedback by making substantial improvements

Now provide your REVISED response to the customer's question above:`

      const response = await fetch('/api/ai/coach-training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: revisionPrompt,
          customerMessage: lastCustomerMessage.message,
          conversationHistory,
          customerPersona: selectedScenario.customerType,
          scenario: selectedScenario.description
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const revisedResponse = data.response

      // Add the revised AI coach response
      const revisedMessage: Message = {
        id: Date.now().toString(),
        sessionId: selectedScenario.id,
        sender: 'user', // Dr. Sakura (AI Coach)
        message: `*[Revised based on feedback]* ${revisedResponse}`,
        timestamp: new Date(),
        metadata: {
          intent: 'coach_revision',
          feedback: feedbackMessage,
          originalMessageId: lastCoachMessage.id,
          confidence: 0.9
        }
      }

      setMessages(prev => [...prev, revisedMessage])

      // Track feedback for session history
      setSessionFeedback(prev => [...prev, feedbackMessage])

      // Save feedback to training memory
      const memoryKey = selectedScenario.customerType
      const newMemory = { ...trainingMemory }
      if (!newMemory[memoryKey]) {
        newMemory[memoryKey] = []
      }

      // Create a structured feedback entry
      const feedbackEntry = `[${selectedScenario.name}] ${feedbackMessage} (Original response: "${lastCoachMessage.message.substring(0, 100)}...")`
      newMemory[memoryKey].push(feedbackEntry)

      // Keep only the most recent 10 feedback items per scenario type
      if (newMemory[memoryKey].length > 10) {
        newMemory[memoryKey] = newMemory[memoryKey].slice(-10)
      }

      setTrainingMemory(newMemory)

      console.log('💾 Saved feedback to training memory:', {
        scenarioType: memoryKey,
        feedbackEntry,
        totalMemoryItems: newMemory[memoryKey].length,
        allMemory: newMemory
      })

      // Persist training memory to localStorage
      try {
        localStorage.setItem('skincoach_training_memory', JSON.stringify(newMemory))
      } catch (error) {
        console.error('Error saving training memory:', error)
      }

      // Clear feedback input
      setFeedbackMessage('')

    } catch (error) {
      console.error('Error generating revised response:', error)
      alert('Error generating revised response. Please try again.')
    } finally {
      setIsGeneratingResponse(false)
      setGeneratingWho(null)
    }
  }

  const getCustomerEmotion = (customerType: string): string => {
    const emotions = {
      random: '🤖',
      confused: '😕',
      'price-sensitive': '💰',
      'tech-savvy': '🤓',
      angry: '😠',
      enthusiastic: '😍'
    }
    return emotions[customerType as keyof typeof emotions] || '🤖'
  }

  const toggleManualMode = () => {
    setManualMode(!manualMode)

    // Clear any pending timeouts when switching modes
    if (autoConversationTimeout) {
      clearTimeout(autoConversationTimeout)
      setAutoConversationTimeout(null)
    }

    if (!manualMode && selectedScenario && activeSession) {
      // Switching to manual mode - stop auto conversation
      setIsGeneratingResponse(false)
    } else if (manualMode && selectedScenario && activeSession) {
      // Switching back to auto mode - resume conversation
      const currentTurn = Math.floor(messages.length / 2) + 1
      continueAIConversation(selectedScenario, currentTurn)
    }
  }

  // ❌ REMOVED: generateAICoachResponse function
  // This was the old scripted fallback system that we DON'T want in training!
  // All coach responses must come from OpenAI API only during training.
  // NO FALLBACK RESPONSES IN TRAINING MODE!



  const evaluateAIPerformance = (messages: Message[], scenario: TrainingScenario): { score: number, notes: string } => {
    const coachMessages = messages.filter(m => m.sender === 'user') // AI Coach messages
    const customerMessages = messages.filter(m => m.sender === 'customer')

    let score = 50 // Base score
    let feedback: string[] = []

    // Evaluate conversation length (should be complete)
    if (messages.length >= 8) {
      score += 10
      feedback.push('✅ Complete conversation flow')
    } else {
      feedback.push('⚠️ Conversation ended early')
    }

    // Evaluate response quality
    const avgCoachMessageLength = coachMessages.reduce((sum, m) => sum + m.message.length, 0) / coachMessages.length
    if (avgCoachMessageLength > 100) {
      score += 15
      feedback.push('✅ Detailed, helpful responses')
    } else {
      score -= 5
      feedback.push('❌ Responses too brief')
    }

    // Evaluate customer type handling
    const lastCustomerMessage = customerMessages[customerMessages.length - 1]?.message.toLowerCase() || ''

    switch (scenario.customerType) {
      case 'angry':
        if (lastCustomerMessage.includes('willing') || lastCustomerMessage.includes('fair') || lastCustomerMessage.includes('better')) {
          score += 20
          feedback.push('✅ Successfully calmed angry customer')
        } else {
          score -= 10
          feedback.push('❌ Failed to resolve customer anger')
        }
        break

      case 'confused':
        if (lastCustomerMessage.includes('confident') || lastCustomerMessage.includes('helpful') || lastCustomerMessage.includes('remember')) {
          score += 20
          feedback.push('✅ Successfully clarified confusion')
        } else {
          score -= 10
          feedback.push('❌ Customer still seems confused')
        }
        break

      case 'price-sensitive':
        if (lastCustomerMessage.includes('essential plan') || lastCustomerMessage.includes('try') || lastCustomerMessage.includes('afford')) {
          score += 20
          feedback.push('✅ Addressed budget concerns effectively')
        } else {
          score -= 10
          feedback.push('❌ Failed to address price objections')
        }
        break

      case 'tech-savvy':
        if (lastCustomerMessage.includes('premium') || lastCustomerMessage.includes('proceed') || lastCustomerMessage.includes('scientific')) {
          score += 20
          feedback.push('✅ Satisfied technical customer needs')
        } else {
          score -= 10
          feedback.push('❌ Insufficient technical details provided')
        }
        break

      case 'enthusiastic':
        if (lastCustomerMessage.includes('concierge') || lastCustomerMessage.includes('start') || lastCustomerMessage.includes('amazing')) {
          score += 20
          feedback.push('✅ Matched customer enthusiasm and closed sale')
        } else {
          score -= 10
          feedback.push('❌ Failed to capitalize on customer excitement')
        }
        break
    }

    // Check for key skincare coaching elements
    const allCoachText = coachMessages.map(m => m.message.toLowerCase()).join(' ')

    if (allCoachText.includes('skin type') || allCoachText.includes('skin concern')) {
      score += 10
      feedback.push('✅ Assessed skin needs properly')
    }

    if (allCoachText.includes('routine') || allCoachText.includes('cleanser') || allCoachText.includes('moisturizer')) {
      score += 10
      feedback.push('✅ Provided specific product guidance')
    }

    if (allCoachText.includes('plan') || allCoachText.includes('essential') || allCoachText.includes('premium')) {
      score += 10
      feedback.push('✅ Presented appropriate pricing options')
    }

    // Cap score at 100
    score = Math.min(100, Math.max(0, score))

    const notes = `AI Performance Evaluation:\n${feedback.join('\n')}\n\nOverall Score: ${score}/100`

    return { score: Math.round(score / 10), notes } // Convert to 1-10 scale
  }

  const handleCompleteSession = (score?: number, notes?: string) => {
    if (!activeSession) return

    // Auto-evaluate AI performance if no manual score provided
    const evaluation = score ? { score, notes: notes || '' } : evaluateAIPerformance(messages, selectedScenario!)

    const completedSession: TrainingSession = {
      ...activeSession,
      status: 'completed',
      endTime: new Date(),
      score: evaluation.score,
      sessionNotes: evaluation.notes
    }

    // Update stats
    const newStats = {
      totalSessions: stats.totalSessions + 1,
      completedSessions: stats.completedSessions + 1,
      averageScore: ((stats.averageScore * stats.completedSessions) + (completedSession.score || 0)) / (stats.completedSessions + 1),
      successRate: Math.round(((stats.completedSessions + 1) / (stats.totalSessions + 1)) * 100)
    }

    setStats(newStats)
    localStorage.setItem('skincoach_roleplay_stats', JSON.stringify(newStats))

    // Reset session
    setIsSessionActive(false)
    setActiveSession(null)
    setSelectedScenario(null)
    setMessages([])
    setSessionTimer(0)
  }

  const createCustomScenario = (scenarioData: Partial<TrainingScenario>) => {
    const newScenario: TrainingScenario = {
      id: Date.now().toString(),
      name: scenarioData.name || '',
      description: scenarioData.description || '',
      customerType: scenarioData.customerType || 'confused',
      scenario: scenarioData.scenario || '',
      objectives: scenarioData.objectives || [],
      timeframeMins: scenarioData.timeframeMins || 15,
      isActive: true,
      difficulty: scenarioData.difficulty || 'Intermediate'
    }

    const updatedScenarios = [...scenarios, newScenario]
    setScenarios(updatedScenarios)
    localStorage.setItem('skincoach_roleplay_scenarios', JSON.stringify(updatedScenarios))
    setShowCreateScenario(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            AI Staff Training Center
          </h2>
          <p className="text-slate-400">Train your AI staff members with different roles through automated dialogue with AI customers</p>
        </div>
      </div>

      {/* AI Staff Selection */}
      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            AI Staff Members
          </h3>
          <button
            onClick={() => setShowStaffCreator(true)}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors text-white flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Staff
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {aiStaffList.map((staff) => (
            <button
              key={staff.id}
              onClick={() => selectStaff(staff)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                selectedStaff?.id === staff.id
                  ? 'bg-blue-600 text-white border-2 border-blue-400'
                  : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
              }`}
            >
              <span>{
                staff.role === 'coach' ? '🎓' :
                staff.role === 'sales' ? '💰' :
                staff.role === 'customer-service' ? '🛡️' :
                '🔬'
              }</span>
              <div className="text-left">
                <div className="font-medium">{staff.name}</div>
                <div className="text-xs opacity-70">{
                  staff.role === 'coach' ? 'Coach' :
                  staff.role === 'sales' ? 'Sales' :
                  staff.role === 'customer-service' ? 'Support' :
                  'Scientist'
                }</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* AI Coach Training Conversation */}
      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600 relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-green-400" />
            AI Coach Training Session
          </h3>
          <button
            onClick={handleCompleteTrainingSession}
            disabled={messages.length === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 px-4 py-2 rounded-lg transition-colors text-white text-sm"
          >
            Complete
          </button>
        </div>

        {/* Role Selection */}
        <div className="mb-4 p-4 bg-slate-800 rounded-lg border border-slate-600">
          <div className="flex items-center gap-4">
            <label className="text-white font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              AI Role:
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedRole('coach')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedRole === 'coach'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                }`}
              >
                🎓 Coach
              </button>
              <button
                onClick={() => setSelectedRole('sales')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedRole === 'sales'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                }`}
              >
                💰 Sales
              </button>
              <button
                onClick={() => setSelectedRole('customer-service')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedRole === 'customer-service'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                }`}
              >
                🛡️ Customer Service
              </button>
              <button
                onClick={() => setSelectedRole('scientist')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedRole === 'scientist'
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                }`}
              >
                🔬 Scientist
              </button>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {selectedRole === 'coach' && '📚 Educates and guides customers with empathy and expertise'}
            {selectedRole === 'sales' && '💼 Focuses on closing deals, upselling, and maximizing revenue'}
            {selectedRole === 'customer-service' && '🤝 Resolves issues, ensures satisfaction, and builds loyalty'}
            {selectedRole === 'scientist' && '🧪 Provides evidence-based, technical, and research-backed advice'}
          </div>
        </div>

        {/* Training Mode Indicator */}
        <div className="mb-4 p-3 bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-lg border border-red-600">
          <div className="flex items-center gap-2">
            <span className="text-red-400 text-lg">⚠️</span>
            <div>
              <h4 className="text-red-300 font-semibold">NO FALLBACK TRAINING MODE</h4>
              <p className="text-red-200 text-sm">All responses come from OpenAI API only. If API fails, you'll see clear error messages to fix root causes.</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="bg-slate-800 rounded-lg p-4 h-96 overflow-y-auto">
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>AI training conversation will appear here</p>
                <p className="text-xs mt-1">Select a scenario below to begin training</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.sender === 'customer'
                    ? 'bg-orange-600 text-white mr-4'  // AI Customer - Orange
                    : 'bg-blue-600 text-white ml-4'    // AI Coach - Blue
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {msg.sender === 'customer' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                    <span className="text-xs opacity-70">
                      {msg.sender === 'customer' ? 'AI Customer 🤖' :
                        `${selectedStaff?.name || 'AI'} (${
                          selectedRole === 'coach' ? 'Coach' :
                          selectedRole === 'sales' ? 'Sales' :
                          selectedRole === 'customer-service' ? 'Support' :
                          'Scientist'
                        }) ${
                          selectedRole === 'coach' ? '🎓' :
                          selectedRole === 'sales' ? '💰' :
                          selectedRole === 'customer-service' ? '🛡️' :
                          '🔬'
                        }`
                      }
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))}

            {isGeneratingResponse && (
              <div className={`flex ${generatingWho === 'customer' ? 'justify-start' : 'justify-end'}`}>
                <div className={`${generatingWho === 'customer' ? 'bg-orange-600 mr-4' : 'bg-blue-600 ml-4'} text-white px-3 py-2 rounded-lg`}>
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">
                      {generatingWho === 'customer' ? 'Thinking...' : 'Thinking...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Manual Input Box */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Type your question as a customer to test the AI coach..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleDirectMessage()}
            disabled={isGeneratingResponse}
            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400"
          />
          <button
            onClick={handleDirectMessage}
            disabled={!currentMessage.trim() || isGeneratingResponse}
            className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 px-4 py-2 rounded-lg transition-colors text-white"
          >
            Send
          </button>
          <button
            onClick={generateCustomerQuestion}
            disabled={isGeneratingResponse}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 px-4 py-2 rounded-lg transition-colors text-white"
          >
            Auto
          </button>
        </div>

        {/* Feedback Input Box */}
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Comment on AI coach's response for improvement..."
            value={feedbackMessage}
            onChange={(e) => setFeedbackMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleFeedback()}
            disabled={isGeneratingResponse}
            className="flex-1 bg-slate-800 border border-yellow-500 rounded-lg px-3 py-2 text-white placeholder-slate-400"
          />
          <button
            onClick={handleFeedback}
            disabled={!feedbackMessage.trim() || isGeneratingResponse}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-600 px-4 py-2 rounded-lg transition-colors text-white"
          >
            Feedback
          </button>
        </div>

        <div className="text-xs text-slate-400 mt-4 text-center">
          🎯 <strong>Training Purpose:</strong> AI Customer asks questions → Dr. Sakura ({
            selectedRole === 'coach' ? 'Coach' :
            selectedRole === 'sales' ? 'Sales' :
            selectedRole === 'customer-service' ? 'Support' :
            'Scientist'
          }) learns to respond properly in their role
        </div>

        {/* Training Memory Indicator */}
        {selectedScenario && trainingMemory[selectedScenario.customerType] && trainingMemory[selectedScenario.customerType].length > 0 && (
          <div className="mt-3 p-2 bg-purple-900/30 rounded-lg border border-purple-600">
            <div className="text-xs text-purple-300 text-center">
              🧠 <strong>Active Training Memory:</strong> {trainingMemory[selectedScenario.customerType].length} feedback items for {selectedScenario.customerType} customers
            </div>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">Total Sessions</h3>
            <MessageSquare className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{stats.totalSessions}</div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">Completed</h3>
            <CheckCircle className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{stats.completedSessions}</div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">Average Score</h3>
            <Star className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{stats.averageScore.toFixed(1)}/10</div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">Success Rate</h3>
            <Target className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{stats.successRate}%</div>
        </div>
      </div>


      {/* Available Scenarios */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            Training Scenarios for {
              selectedRole === 'coach' ? '🎓 Coach' :
              selectedRole === 'sales' ? '💰 Sales' :
              selectedRole === 'customer-service' ? '🛡️ Customer Service' :
              '🔬 Scientist'
            } Role
          </h3>
          <p className="text-sm text-slate-400">
            {selectedRole === 'coach' && 'Practice educating and guiding customers with empathy'}
            {selectedRole === 'sales' && 'Practice closing deals, handling objections, and upselling'}
            {selectedRole === 'customer-service' && 'Practice resolving issues and ensuring customer satisfaction'}
            {selectedRole === 'scientist' && 'Practice providing evidence-based, technical explanations'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className={`bg-slate-700 rounded-lg p-4 border border-slate-600 ${
              selectedScenario?.id === scenario.id ? 'border-blue-500' : ''
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">{scenario.name}</h4>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    customerPersonas.find(p => p.id === scenario.customerType)?.color || 'bg-gray-500'
                  } text-white`}>
                    {scenario.customerType}
                  </span>
                  <span className="px-2 py-1 bg-slate-600 text-slate-300 rounded text-xs flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {scenario.timeframeMins}m
                  </span>
                </div>
              </div>

              <p className="text-slate-300 text-sm mb-3">{scenario.description}</p>

              <div className="mb-3">
                <p className="text-xs text-slate-400 mb-1">Scenario:</p>
                <p className="text-xs text-slate-300">{scenario.scenario}</p>
              </div>

              <div className="mb-4">
                <p className="text-xs text-slate-400 mb-1">Objectives:</p>
                <ul className="text-xs space-y-1">
                  {scenario.objectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                      <Target className="h-3 w-3 mt-0.5 text-slate-400" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleStartSession(scenario)}
                disabled={isSessionActive}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-600 text-white py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start Training Session
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create Scenario Modal */}
      {showCreateScenario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">Create Custom Training Scenario</h3>
            <ScenarioCreationForm
              onSubmit={createCustomScenario}
              onCancel={() => setShowCreateScenario(false)}
              customerPersonas={customerPersonas}
            />
          </div>
        </div>
      )}

      {/* AI Coach Prompt Editor Modal */}
      {showPromptEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-400" />
              Configure AI Coach Training Instructions
            </h3>
            <AICoachPromptEditor
              prompt={aiCoachPrompt}
              onSave={(newPrompt) => {
                setAiCoachPrompt(newPrompt)
                localStorage.setItem('skincoach_ai_coach_prompt', newPrompt)
                setShowPromptEditor(false)
              }}
              onCancel={() => setShowPromptEditor(false)}
            />
          </div>
        </div>
      )}

      {/* Staff Creator Modal */}
      {showStaffCreator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" />
              Create New AI Staff Member
            </h3>
            <StaffCreatorForm
              onSubmit={(name, role) => createNewStaff(name, role)}
              onCancel={() => setShowStaffCreator(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Staff Creator Form Component
interface StaffCreatorFormProps {
  onSubmit: (name: string, role: 'coach' | 'sales' | 'customer-service' | 'scientist') => void
  onCancel: () => void
}

function StaffCreatorForm({ onSubmit, onCancel }: StaffCreatorFormProps) {
  const [name, setName] = useState('')
  const [role, setRole] = useState<'coach' | 'sales' | 'customer-service' | 'scientist'>('coach')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim(), role)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Staff Member Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Sarah Johnson, Mike Chen, Dr. Smith"
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400"
          required
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Role</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole('coach')}
            className={`p-3 rounded-lg text-left transition-colors ${
              role === 'coach'
                ? 'bg-blue-600 text-white border-2 border-blue-400'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-2 border-slate-600'
            }`}
          >
            <div className="font-medium">🎓 Coach</div>
            <div className="text-xs opacity-70">Educate & guide</div>
          </button>
          <button
            type="button"
            onClick={() => setRole('sales')}
            className={`p-3 rounded-lg text-left transition-colors ${
              role === 'sales'
                ? 'bg-green-600 text-white border-2 border-green-400'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-2 border-slate-600'
            }`}
          >
            <div className="font-medium">💰 Sales</div>
            <div className="text-xs opacity-70">Close deals</div>
          </button>
          <button
            type="button"
            onClick={() => setRole('customer-service')}
            className={`p-3 rounded-lg text-left transition-colors ${
              role === 'customer-service'
                ? 'bg-purple-600 text-white border-2 border-purple-400'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-2 border-slate-600'
            }`}
          >
            <div className="font-medium">🛡️ Support</div>
            <div className="text-xs opacity-70">Resolve issues</div>
          </button>
          <button
            type="button"
            onClick={() => setRole('scientist')}
            className={`p-3 rounded-lg text-left transition-colors ${
              role === 'scientist'
                ? 'bg-orange-600 text-white border-2 border-orange-400'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-2 border-slate-600'
            }`}
          >
            <div className="font-medium">🔬 Scientist</div>
            <div className="text-xs opacity-70">Evidence-based</div>
          </button>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={!name.trim()}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white py-2 rounded-lg font-semibold transition-colors"
        >
          Create Staff Member
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded-lg font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// AI Coach Prompt Editor Component
interface AICoachPromptEditorProps {
  prompt: string
  onSave: (prompt: string) => void
  onCancel: () => void
}

function AICoachPromptEditor({ prompt, onSave, onCancel }: AICoachPromptEditorProps) {
  const [editedPrompt, setEditedPrompt] = useState(prompt)
  const [selectedTemplate, setSelectedTemplate] = useState('')

  const promptTemplates = [
    {
      id: 'professional',
      name: 'Professional & Informative',
      description: 'Formal, detailed, scientific approach',
      prompt: `You are Dr. Sakura, a professional skincare expert and consultant. Your approach is scientific, detailed, and evidence-based.

🎯 EXPERTISE:
- Clinical-grade skincare recommendations
- Evidence-based ingredient education
- Dermatologically-tested product guidance
- Scientific approach to skin analysis

💡 RESPONSE STYLE:
- Professional and authoritative tone
- Provide scientific explanations and studies
- Use technical terminology when appropriate
- Focus on proven, clinical results
- Be thorough and comprehensive

🛍️ BUSINESS APPROACH:
- Emphasize quality and efficacy over price
- Highlight professional-grade formulations
- Focus on long-term skin health benefits
- Recommend premium options for best results

📋 CONVERSATION STRUCTURE:
1. Professional greeting and credentials
2. Comprehensive skin assessment
3. Scientific explanation of recommendations
4. Evidence-based product suggestions
5. Clinical timeline expectations
6. Professional follow-up protocols`
    },
    {
      id: 'friendly',
      name: 'Friendly & Approachable',
      description: 'Warm, personal, encouraging tone',
      prompt: `You are Dr. Sakura, your friendly neighborhood skincare expert! You're like that knowledgeable friend who always has the best beauty advice.

🎯 EXPERTISE:
- Personalized skincare routines that actually work
- Making complex ingredients easy to understand
- Finding the perfect products for every budget
- Helping people feel confident in their skin

💡 RESPONSE STYLE:
- Warm, encouraging, and relatable
- Use friendly, conversational language
- Share excitement about skincare discoveries
- Be patient and understanding with concerns
- Celebrate small wins and progress

🛍️ BUSINESS APPROACH:
- Focus on value and accessibility
- Offer options for every budget
- Emphasize how much you care about their journey
- Make premium options feel attainable
- Share your personal passion for skincare

📋 CONVERSATION FLOW:
1. Friendly, enthusiastic greeting
2. Understanding their skin story and goals
3. Sharing your excitement about helping them
4. Recommending products like a trusted friend
5. Encouraging them throughout the process
6. Celebrating their commitment to self-care`
    },
    {
      id: 'consultative',
      name: 'Consultative & Solution-Focused',
      description: 'Problem-solving, results-oriented approach',
      prompt: `You are Dr. Sakura, a results-driven skincare consultant focused on solving your clients' specific skin challenges efficiently and effectively.

🎯 EXPERTISE:
- Problem diagnosis and targeted solutions
- Efficient routine optimization
- Results-focused product selection
- ROI-driven skincare investments

💡 RESPONSE STYLE:
- Direct, solution-focused communication
- Ask strategic questions to identify root causes
- Provide clear action plans and timelines
- Focus on measurable improvements
- Be efficient while remaining helpful

🛍️ BUSINESS APPROACH:
- Emphasize return on investment
- Show clear value propositions
- Focus on results and outcomes
- Recommend solutions that fit their lifestyle
- Provide clear success metrics

📋 CONSULTATION PROCESS:
1. Quick assessment of primary concerns
2. Strategic questioning to understand root causes
3. Prioritized action plan with timelines
4. Targeted product recommendations
5. Clear expectations and success metrics
6. Structured follow-up and optimization`
    }
  ]

  const handleTemplateSelect = (template: any) => {
    setEditedPrompt(template.prompt)
    setSelectedTemplate(template.id)
  }

  const handleSave = () => {
    onSave(editedPrompt)
  }

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-3">Quick Templates</h4>
        <div className="grid md:grid-cols-3 gap-3">
          {promptTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                selectedTemplate === template.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-slate-600 bg-slate-700 hover:border-purple-400'
              }`}
            >
              <h5 className="font-medium text-white text-sm">{template.name}</h5>
              <p className="text-xs text-slate-400 mt-1">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Editor */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-3">AI Coach Instructions</h4>
        <textarea
          value={editedPrompt}
          onChange={(e) => setEditedPrompt(e.target.value)}
          placeholder="Enter detailed instructions for how the AI coach should behave, respond, and interact with customers..."
          rows={20}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 font-mono text-sm"
        />
        <div className="text-xs text-slate-400 mt-2">
          💡 Be specific about tone, expertise areas, response style, business knowledge, and conversation flow.
        </div>
      </div>

      {/* Preview */}
      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
        <h5 className="text-sm font-medium text-white mb-2">Quick Preview</h5>
        <div className="text-xs text-slate-300 space-y-1">
          <div><strong>Length:</strong> {editedPrompt.length} characters</div>
          <div><strong>Style Keywords:</strong> {
            ['professional', 'friendly', 'scientific', 'warm', 'expert', 'personal'].filter(keyword =>
              editedPrompt.toLowerCase().includes(keyword)
            ).join(', ') || 'None detected'
          }</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold"
        >
          Save AI Coach Configuration
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded-lg font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// Scenario Creation Form Component
interface ScenarioCreationFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  customerPersonas: CustomerPersona[]
}

function ScenarioCreationForm({ onSubmit, onCancel, customerPersonas }: ScenarioCreationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    customerType: '',
    scenario: '',
    objectives: [''],
    timeframeMins: 15,
    difficulty: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced'
  })

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }))
  }

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...formData.objectives]
    newObjectives[index] = value
    setFormData(prev => ({
      ...prev,
      objectives: newObjectives
    }))
  }

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      objectives: formData.objectives.filter(obj => obj.trim()),
      isActive: true
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">Scenario Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Frustrated Customer - Product Return"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">Customer Type</label>
          <select
            value={formData.customerType}
            onChange={(e) => setFormData(prev => ({ ...prev, customerType: e.target.value }))}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            required
          >
            <option value="">Select customer personality</option>
            {customerPersonas.map((persona) => (
              <option key={persona.id} value={persona.id}>{persona.personality}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of the training scenario"
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">Scenario Details</label>
        <textarea
          value={formData.scenario}
          onChange={(e) => setFormData(prev => ({ ...prev, scenario: e.target.value }))}
          placeholder="Detailed description of the customer's situation and context..."
          rows={3}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">Learning Objectives</label>
        <div className="space-y-2">
          {formData.objectives.map((objective, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={objective}
                onChange={(e) => updateObjective(index, e.target.value)}
                placeholder={`Objective ${index + 1}`}
                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                required
              />
              {formData.objectives.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeObjective(index)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addObjective}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Objective
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">Estimated Duration (minutes)</label>
        <select
          value={formData.timeframeMins.toString()}
          onChange={(e) => setFormData(prev => ({ ...prev, timeframeMins: parseInt(e.target.value) }))}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
        >
          <option value="10">10 minutes</option>
          <option value="15">15 minutes</option>
          <option value="20">20 minutes</option>
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
        </select>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
        >
          Create Scenario
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded-lg font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default RoleplayTraining