import { useQuery } from "@tanstack/react-query";
import type { WalletBalanceResponse } from "@/lib/api/types";
import { fetchJson } from "@/lib/api/fetchJson";

export function useWalletBalance() {
  return useQuery({
    queryKey: ["wallet", "balance"],
    queryFn: () => fetchJson<WalletBalanceResponse>("/api/v1/wallet/balance"),
    staleTime: 15_000,
  });
}
