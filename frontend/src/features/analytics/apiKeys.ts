export const analyticsKeys = {
  monthly: () => ['analytics', 'monthly'] as const,
  byCategory: (month: number, year: number) => ['analytics', 'by-category', month, year] as const,
  forecast: () => ['analytics', 'forecast'] as const,
}
