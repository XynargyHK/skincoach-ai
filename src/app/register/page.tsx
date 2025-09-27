'use client'

import { useRouter } from 'next/navigation'
import UserRegistrationComponent from '@/components/ui/user-registration'

export default function RegisterPage() {
  const router = useRouter()

  const handleComplete = () => {
    // Redirect to personalized plan after successful registration
    router.push('/plan')
  }

  return <UserRegistrationComponent onComplete={handleComplete} />
}