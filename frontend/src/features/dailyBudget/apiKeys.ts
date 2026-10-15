export const dailyBudgetKeys = {
  all: (): readonly string[] => ['dailyBudgets'] as const,
  today: (): readonly string[] => ['dailyBudgets', 'today'] as const,
}
