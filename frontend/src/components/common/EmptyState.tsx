type Props = {
  icon?: React.ElementType
  title: string
  description?: string
}

export const EmptyState = ({ icon: Icon, title, description }: Props) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {Icon && <Icon className="h-12 w-12 text-muted-foreground/40 mb-4" />}
    <h3 className="text-base font-semibold text-foreground">{title}</h3>
    {description && <p className="text-sm text-muted-foreground mt-1 max-w-xs">{description}</p>}
  </div>
)
