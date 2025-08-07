// C:\nexus-call-hub\src\login\routes\signup.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import SignupComponent from "@/widgets/SignupForm/SignupComponent"

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

function SignupPage() {
  const navigate = useNavigate()

  // 회원가입 성공 후 로그인 페이지로 이동
  const handleSignupSuccess = () => {
    navigate({ to: '/' })
  }

  // 로그인 페이지로 이동
  const handleSwitchToLogin = () => {
    navigate({ to: '/' })
  }

  return (
    <SignupComponent 
      onSignupSuccess={handleSignupSuccess}
      onSwitchToLogin={handleSwitchToLogin}
    />
  )
}
