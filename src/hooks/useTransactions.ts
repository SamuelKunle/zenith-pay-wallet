import { useQuery } from "@tanstack/react-query";
import type { TransactionsListResponse } from "@/lib/api/types";
import { fetchJson } from "@/lib/api/fetchJson";

const FETCH_LIMIT = 150;

/** One cached feed for home (`slice` client-side), `/history`, and cards teaser. */
export function useTransactions() {
  return useQuery({
    queryKey: ["wallet", "transactions"],
    queryFn: () =>
      fetchJson<TransactionsListResponse>(
        `/api/v1/transactions?limit=${encodeURIComponent(String(FETCH_LIMIT))}`,
      ),
    staleTime: 15_000,
  });
}
