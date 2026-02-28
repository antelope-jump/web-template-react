import type { ReactNode } from 'react';

import { usePermission } from '@/hooks/usePermission';

interface PermissionProps {
  permission?: string;
  anyOf?: string[];
  allOf?: string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function Permission({ permission, anyOf, allOf, fallback = null, children }: PermissionProps) {
  const { has, hasAny, hasAll } = usePermission();

  const matched =
    (permission ? has(permission) : true) &&
    (anyOf ? hasAny(anyOf) : true) &&
    (allOf ? hasAll(allOf) : true);

  return matched ? <>{children}</> : <>{fallback}</>;
}
