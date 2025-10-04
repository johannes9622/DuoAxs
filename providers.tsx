"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@duoaxs/api/src/client";
import { httpBatchLink } from "@trpc/client";
import { apiBase } from "@duoaxs/api/src/http";
import superjson from "superjson";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({ transformer: superjson, links: [httpBatchLink({ url: `${apiBase}/api/trpc` })] })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={qc}>
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
