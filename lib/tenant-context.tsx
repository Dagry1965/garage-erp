// lib/tenant-context.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Tenant = {
  id: string;
  name: string;
  slug: string;
};

type TenantContextType = {
  currentTenant: Tenant | null;
  setCurrentTenant: (tenant: Tenant) => void;
  currentWorkspaceId: string | null;
  setCurrentWorkspaceId: (id: string) => void;
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);

  return (
    <TenantContext.Provider value={{
      currentTenant,
      setCurrentTenant,
      currentWorkspaceId,
      setCurrentWorkspaceId,
    }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) throw new Error('useTenant must be used within TenantProvider');
  return context;
}