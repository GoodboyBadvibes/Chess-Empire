"use client";

import { useMutation } from "@tanstack/react-query";

export function useCreateApplication() {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      return res.json();
    },
  });
}
