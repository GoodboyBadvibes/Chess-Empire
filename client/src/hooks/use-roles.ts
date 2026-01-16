import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useRoles() {
  return useQuery({
    queryKey: [api.roles.list.path],
    queryFn: async () => {
      const res = await fetch(api.roles.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch roles");
      return api.roles.list.responses[200].parse(await res.json());
    },
  });
}

export function useRole(id: number) {
  return useQuery({
    queryKey: [api.roles.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.roles.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch role");
      return api.roles.get.responses[200].parse(await res.json());
    },
  });
}
