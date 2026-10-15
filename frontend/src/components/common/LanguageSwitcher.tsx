import { Languages } from 'lucide-react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { isLanguage, LANGUAGES } from '@/i18n/languages'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
}

export const LanguageSwitcher = ({ className }: Props) => {
  const { language, setLanguage, t } = useTranslation()

  return (
    <Select
      value={language}
      onValueChange={(value) => {
        if (isLanguage(value)) setLanguage(value)
      }}
    >
      <SelectTrigger className={cn('h-9', className)} aria-label={t('common.language')}>
        <div className="flex items-center gap-2 min-w-0">
          <Languages className="h-4 w-4 shrink-0 text-muted-foreground" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((option) => (
          <SelectItem key={option.code} value={option.code}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
