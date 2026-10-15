import {
  ArrowLeftRight,
  BarChart2,
  Bell,
  CalendarDays,
  CreditCard,
  Crown,
  DollarSign,
  LayoutDashboard,
  LogOut,
  PieChart,
  RefreshCw,
  Shield,
  Tag,
  Target,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

import { CurrencySwitcher } from '@/components/common/CurrencySwitcher'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useNotifications_urgentUnreadCountQuery } from '@/features/notifications/hooks/useNotifications_urgentUnreadCountQuery'
import { useProfile_meQuery } from '@/features/profile/hooks/useProfile_meQuery'
import type { TranslationKey } from '@/i18n/translate'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes'

type NavItem = {
  to: string
  icon: LucideIcon
  labelKey: TranslationKey
}

const NAV_ITEMS = [
  { to: ROUTES.dashboard, icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { to: ROUTES.transactions, icon: ArrowLeftRight, labelKey: 'nav.transactions' },
  { to: ROUTES.categories, icon: Tag, labelKey: 'nav.categories' },
  { to: ROUTES.paymentMethods, icon: CreditCard, labelKey: 'nav.paymentMethods' },
  { to: ROUTES.budgets, icon: PieChart, labelKey: 'nav.budgets' },
  { to: ROUTES.goals, icon: Target, labelKey: 'nav.goals' },
  { to: ROUTES.dailyBudget, icon: CalendarDays, labelKey: 'nav.dailyBudget' },
  { to: ROUTES.recurringTransactions, icon: RefreshCw, labelKey: 'nav.recurring' },
  { to: ROUTES.analytics, icon: BarChart2, labelKey: 'nav.analytics' },
] as const satisfies readonly NavItem[]

const BOTTOM_NAV_ITEMS = [
  { to: ROUTES.notifications, icon: Bell, labelKey: 'nav.notifications' },
  { to: ROUTES.premium, icon: Crown, labelKey: 'nav.premium' },
  { to: ROUTES.profile, icon: User, labelKey: 'nav.profile' },
] as const satisfies readonly NavItem[]

type Props = {
  children: React.ReactNode
}

export const AppLayout = ({ children }: Props) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { data: currentUser } = useProfile_meQuery()
  const isAdmin = currentUser?.role === 'ADMIN'
  const { data: urgentCount = 0 } = useNotifications_urgentUnreadCountQuery()

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
          {NAV_ITEMS.map(({ to, icon: Icon, labelKey }) => (
            <NavLink key={to} to={to} className={navClass}>
              <Icon className="h-4 w-4 shrink-0" />
              {t(labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-4 space-y-1">
          <Separator className="mb-3" />
          {BOTTOM_NAV_ITEMS.map(({ to, icon: Icon, labelKey }) => (
            <NavLink key={to} to={to} className={navClass}>
              <Icon className="h-4 w-4 shrink-0" />
              {t(labelKey)}
              {to === ROUTES.notifications && urgentCount > 0 && (
                <span
                  className="ml-auto rounded-full bg-destructive px-2 py-0.5 text-xs font-semibold text-white"
                  aria-label={t('notifications.urgentCountAria', { count: urgentCount })}
                >
                  {urgentCount}
                </span>
              )}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to={ROUTES.admin} className={navClass}>
              <Shield className="h-4 w-4 shrink-0" />
              {t('nav.admin')}
            </NavLink>
          )}
          <LanguageSwitcher className="w-full" />
          <CurrencySwitcher className="w-full" />
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-accent-foreground px-3"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {t('nav.signOut')}
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
