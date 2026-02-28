import { useMemo } from 'react';

import { useAuthStore } from '@/store/authStore';

export function usePermission() {
  const permissions = useAuthStore((state) => state.user?.permissions ?? []);

  return useMemo(
    () => ({
      has: (permission: string) => permissions.includes(permission),
      hasAny: (items: string[]) => items.some((permission) => permissions.includes(permission)),
      hasAll: (items: string[]) => items.every((permission) => permissions.includes(permission)),
    }),
    [permissions],
  );
}
