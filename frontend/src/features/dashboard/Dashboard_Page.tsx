import { ArrowLeftRight, Goal, LayoutDashboard, Wallet } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/layouts/AppLayout'

const FEATURE_CARDS = [
  {
    icon: ArrowLeftRight,
    title: 'Transactions',
    description: 'Track your income and expenses',
  },
  {
    icon: Wallet,
    title: 'Budgets',
    description: 'Set monthly limits by category',
  },
  {
    icon: Goal,
    title: 'Goals',
    description: 'Save towards what matters most',
  },
  {
    icon: LayoutDashboard,
    title: 'Daily Budget',
    description: 'Set a daily spending limit',
  },
]

export const Dashboard_Page = () => (
  <AppLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to Cashy — your personal finance tracker.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURE_CARDS.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">{title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </AppLayout>
)
