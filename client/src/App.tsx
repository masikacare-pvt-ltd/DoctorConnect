import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute, PublicRoute, ProfileRoute, AdminRoute } from './routes/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import ForgotPassword from './components/ForgotPassword';
import PendingApproval from './components/PendingApproval';
import AdminLogin from './components/AdminLogin';
import NotFoundPage from './components/NotFoundPage';

const ProfileCompleteLazy = lazy(() => import('./components/ProfileComplete'));
const DashboardLazy = lazy(() => import('./components/Dashboard'));
const AddReportPageLazy = lazy(() => import('./components/AddReportPage'));
const DiscussionsLazy = lazy(() => import('./components/Discussions'));
const CasesPageLazy = lazy(() => import('./components/CasesPage'));
const ProfileScreenLazy = lazy(() => import('./components/ProfileScreen'));
const AdminDashboardLazy = lazy(() => import('./components/AdminDashboard'));
const AdminCasesPageLazy = lazy(() => import('./components/AdminCasesPage'));
const AdminCaseDetailPageLazy = lazy(() => import('./components/AdminCaseDetailPage'));
const AdminDoctorsPageLazy = lazy(() => import('./components/AdminDoctorsPage'));
const AdminRecycleBinLazy = lazy(() => import('./components/AdminRecycleBin'));
const AdminReportsPageLazy = lazy(() => import('./components/AdminReportsPage'));

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
              <ErrorBoundary>
              <Suspense fallback={
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
              }>
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
                path="/pending-approval"
                element={<PendingApproval />}
              />
              <Route
                path="/admin/login"
                element={<AdminLogin />}
              />
              <Route
                path="/complete-profile"
                element={
                  <ProfileRoute>
                    <ProfileCompleteLazy />
                  </ProfileRoute>
                }
              />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLazy /></ProtectedRoute>} />
              <Route path="/add-report" element={<ProtectedRoute><AddReportPageLazy /></ProtectedRoute>} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboardLazy />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/doctors"
                element={
                  <AdminRoute>
                    <AdminDoctorsPageLazy />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/cases"
                element={
                  <AdminRoute>
                    <AdminCasesPageLazy />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/cases/:caseId"
                element={
                  <AdminRoute>
                    <AdminCaseDetailPageLazy />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/recycle-bin"
                element={
                  <AdminRoute>
                    <AdminRecycleBinLazy />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <AdminRoute>
                    <AdminReportsPageLazy />
                  </AdminRoute>
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
              <Route path="*" element={<NotFoundPage />} />
              </Routes>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}