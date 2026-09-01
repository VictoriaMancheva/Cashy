export const ADMIN_ENDPOINTS = {
  users: '/api/admin/users',
  userRole: (id: number) => `/api/admin/users/${id}/role`,
  deleteUser: (id: number) => `/api/admin/users/${id}`,
} as const
