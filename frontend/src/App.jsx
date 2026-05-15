import { useEffect } from "react"
import { Route, Routes, Navigate  } from "react-router-dom"

import FloatingShape from "./components/FloatingShape"
import LoadingSpinner from "./components/LoadingSpinner"

import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import EmailVerificationPage from "./pages/EmailVerificationPage"
import DashboardPage from "./pages/DashBoardPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"

import { Toaster } from "react-hot-toast"
import { useAuthStore } from "./store/authStore"

// protect routes that require authenticated
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore()
  if(!isAuthenticated){
    return <Navigate to="/login" replace />
  }
  if(!user?.isVerified){
    return <Navigate to="verify-email" replace />
  }
  return children
}

// redirect authenticated user to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const {isAuthenticated, user} = useAuthStore()
  if(isAuthenticated && user.isVerified){
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if(isCheckingAuth) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-green-500" size="w-64 h-64" delay={0}
      />
      <FloatingShape
        color="bg-green-500" size="w-48 h-48" delay={0}
      />
      <FloatingShape
        color="bg-green-500" size="w-32 h-32" delay={0}
      />

      <Routes>
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/signup" element={<RedirectAuthenticatedUser><SignUpPage /></RedirectAuthenticatedUser>} />
        <Route path="/login" element={<RedirectAuthenticatedUser><LoginPage /></RedirectAuthenticatedUser>} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={<RedirectAuthenticatedUser><ForgotPasswordPage /></RedirectAuthenticatedUser>} />
        <Route path="/reset-password/:token" element={<RedirectAuthenticatedUser><ResetPasswordPage /></RedirectAuthenticatedUser>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
