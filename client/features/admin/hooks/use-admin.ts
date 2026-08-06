"use client";

import { useQuery } from "@tanstack/react-query";

import { adminService } from "@/features/admin/services/admin.service";

export const adminQueryKeys = {
  all: ["admin"] as const,
  dashboard: () => [...adminQueryKeys.all, "dashboard"] as const,
  analytics: () => [...adminQueryKeys.all, "analytics"] as const,
  users: () => [...adminQueryKeys.all, "users"] as const,
  interviews: () => [...adminQueryKeys.all, "interviews"] as const,
  system: () => [...adminQueryKeys.all, "system"] as const,
};

export function useAdminDashboard() {
  return useQuery({
    queryKey: adminQueryKeys.dashboard(),
    queryFn: () => adminService.getDashboard(),
    retry: 1,
    staleTime: 20_000,
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: adminQueryKeys.analytics(),
    queryFn: () => adminService.getAnalytics(),
    retry: 1,
    staleTime: 20_000,
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: adminQueryKeys.users(),
    queryFn: () => adminService.getUsers(),
    retry: 1,
    staleTime: 20_000,
  });
}

export function useAdminInterviews() {
  return useQuery({
    queryKey: adminQueryKeys.interviews(),
    queryFn: () => adminService.getInterviews(),
    retry: 1,
    staleTime: 20_000,
  });
}

export function useAdminSystem() {
  return useQuery({
    queryKey: adminQueryKeys.system(),
    queryFn: () => adminService.getSystem(),
    retry: 1,
    staleTime: 15_000,
  });
}

export function useAdmin() {
  return useAdminDashboard();
}
