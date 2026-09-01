import { Crown } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { useProfile_meQuery } from '@/features/profile/hooks/useProfile_meQuery'

type Props = {
  children: React.ReactNode
  compact?: boolean
}

export const PremiumGate = ({ children, compact = false }: Props) => {
  const { data: user, isLoading } = useProfile_meQuery()

  if (isLoading) return null

  if (user?.role === 'PREMIUM' || user?.role === 'ADMIN') return <>{children}</>

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <Crown className="h-4 w-4 shrink-0 text-amber-500" />
        <div>
          <p className="text-sm font-medium text-foreground">Premium Feature</p>
          <p className="text-xs text-muted-foreground">Upgrade to Premium to use receipt scanning.</p>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <Crown className="h-8 w-8 text-amber-500" />
        <div>
          <p className="font-semibold text-foreground">Premium Feature</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Upgrade to Premium to access financial forecasting.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
