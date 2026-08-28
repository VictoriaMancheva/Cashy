import {
  ArrowLeftRight,
  BarChart2,
  Bell,
  CalendarDays,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  LogOut,
  PieChart,
  RefreshCw,
  Tag,
  Target,
  User,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes'

const NAV_ITEMS = [
  { to: ROUTES.dashboard, icon: LayoutDashboard, label: 'Dashboard' },
  { to: ROUTES.transactions, icon: ArrowLeftRight, label: 'Transactions' },
  { to: ROUTES.categories, icon: Tag, label: 'Categories' },
  { to: ROUTES.paymentMethods, icon: CreditCard, label: 'Payment Methods' },
  { to: ROUTES.budgets, icon: PieChart, label: 'Budgets' },
  { to: ROUTES.goals, icon: Target, label: 'Goals' },
  { to: ROUTES.dailyBudget, icon: CalendarDays, label: 'Daily Budget' },
  { to: ROUTES.recurringTransactions, icon: RefreshCw, label: 'Recurring' },
  { to: ROUTES.analytics, icon: BarChart2, label: 'Analytics' },
] as const

const BOTTOM_NAV_ITEMS = [
  { to: ROUTES.notifications, icon: Bell, label: 'Notifications' },
  { to: ROUTES.profile, icon: User, label: 'Profile' },
] as const

type Props = {
  children: React.ReactNode
}

export const AppLayout = ({ children }: Props) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate(ROUTES.login)
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
    )

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="w-60 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-border shrink-0">
          <DollarSign className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">Cashy</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={navClass}>
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-4 space-y-1">
          <Separator className="mb-3" />
          {BOTTOM_NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={navClass}>
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-accent-foreground px-3"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
