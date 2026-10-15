import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'

type Props = {
  children: React.ReactNode
}

export const AuthLayout = ({ children }: Props) => (
  <div className="relative min-h-screen flex items-center justify-center bg-background px-4">
    <div className="absolute top-4 right-4">
      <LanguageSwitcher className="w-40" />
    </div>
    <div className="w-full max-w-md">{children}</div>
  </div>
)
