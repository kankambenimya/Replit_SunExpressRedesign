import { QueryClient } from "@tanstack/react-query";
import type { QueryFunctionContext, QueryKey } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn = <T>(options: { on401: UnauthorizedBehavior }) =>
  async (ctx: QueryFunctionContext<QueryKey>): Promise<T | null> => {
    const unauthorizedBehavior = options.on401;
    // Build URL from queryKey: [baseUrl, params?]
    const queryKey = ctx.queryKey as readonly [string, Record<string, unknown>?];
    let url = String(queryKey[0] ?? "");
    const maybeParams = queryKey[1];

    if (maybeParams && typeof maybeParams === "object") {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(maybeParams as Record<string, unknown>)) {
        if (value === undefined || value === null) continue;
        if (Array.isArray(value)) {
          for (const v of value) {
            if (v === undefined || v === null) continue;
            searchParams.append(key, String(v));
          }
        } else {
          searchParams.set(key, String(value));
        }
      }
      const qs = searchParams.toString();
      if (qs) url += (url.includes("?") ? "&" : "?") + qs;
    }

    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
