import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute, PublicRoute, ProfileRoute } from './routes/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import ForgotPassword from './components/ForgotPassword';

const ProfileCompleteLazy = lazy(() => import('./components/ProfileComplete'));
const DashboardLazy = lazy(() => import('./components/Dashboard'));
const DiscussionsLazy = lazy(() => import('./components/Discussions'));
const CasesPageLazy = lazy(() => import('./components/CasesPage'));
const ProfileScreenLazy = lazy(() => import('./components/ProfileScreen'));

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
              <ErrorBoundary>
              <Suspense fallback={null}>
                <Routes>
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <LandingPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginScreen />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <SignupScreen />
                  </PublicRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PublicRoute>
                    <ForgotPassword />
                  </PublicRoute>
                }
              />
              <Route
                path="/complete-profile"
                element={
                  <ProfileRoute>
                    <ProfileCompleteLazy />
                  </ProfileRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLazy />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/case/:caseId"
                element={
                  <ProtectedRoute>
                    <DiscussionsLazy />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cases"
                element={
                  <ProtectedRoute>
                    <CasesPageLazy />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreenLazy />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
