import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useStories() {
  return useQuery({
    queryKey: [api.stories.list.path],
    queryFn: async () => {
      const res = await fetch(api.stories.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stories");
      return api.stories.list.responses[200].parse(await res.json());
    },
  });
}

export function useStory(id: number) {
  return useQuery({
    queryKey: [api.stories.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.stories.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch story");
      return api.stories.get.responses[200].parse(await res.json());
    },
  });
}
