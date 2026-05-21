import { Navigate, Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { PublicRoute } from '@/components/common/PublicRoute'
import { Budgets_Page } from '@/features/budgets/Budgets_Page'
import { Categories_Page } from '@/features/categories/Categories_Page'
import { DailyBudget_Page } from '@/features/dailyBudget/DailyBudget_Page'
import { Dashboard_Page } from '@/features/dashboard/Dashboard_Page'
import { Goals_Page } from '@/features/goals/Goals_Page'
import { Login_Page } from '@/features/auth/Login_Page'
import { Notifications_Page } from '@/features/notifications/Notifications_Page'
import { PaymentMethods_Page } from '@/features/paymentMethods/PaymentMethods_Page'
import { Profile_Page } from '@/features/profile/Profile_Page'
import { RecurringTransactions_Page } from '@/features/recurringTransactions/RecurringTransactions_Page'
import { Register_Page } from '@/features/auth/Register_Page'
import { Transactions_Page } from '@/features/transactions/Transactions_Page'
import { ROUTES } from '@/routes'

export const App = () => (
  <Routes>
    <Route path={ROUTES.login} element={<PublicRoute><Login_Page /></PublicRoute>} />
    <Route path={ROUTES.register} element={<PublicRoute><Register_Page /></PublicRoute>} />
    <Route path={ROUTES.dashboard} element={<ProtectedRoute><Dashboard_Page /></ProtectedRoute>} />
    <Route path={ROUTES.transactions} element={<ProtectedRoute><Transactions_Page /></ProtectedRoute>} />
    <Route path={ROUTES.categories} element={<ProtectedRoute><Categories_Page /></ProtectedRoute>} />
    <Route path={ROUTES.paymentMethods} element={<ProtectedRoute><PaymentMethods_Page /></ProtectedRoute>} />
    <Route path={ROUTES.budgets} element={<ProtectedRoute><Budgets_Page /></ProtectedRoute>} />
    <Route path={ROUTES.goals} element={<ProtectedRoute><Goals_Page /></ProtectedRoute>} />
    <Route path={ROUTES.dailyBudget} element={<ProtectedRoute><DailyBudget_Page /></ProtectedRoute>} />
    <Route path={ROUTES.recurringTransactions} element={<ProtectedRoute><RecurringTransactions_Page /></ProtectedRoute>} />
    <Route path={ROUTES.notifications} element={<ProtectedRoute><Notifications_Page /></ProtectedRoute>} />
    <Route path={ROUTES.profile} element={<ProtectedRoute><Profile_Page /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
  </Routes>
)
