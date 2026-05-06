import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { WalletCardDto, WalletCardsListResponse } from "@/lib/api/types";
import { fetchJson, patchJson, postJson } from "@/lib/api/fetchJson";

export function useWalletCards() {
  return useQuery({
    queryKey: ["wallet", "cards"],
    queryFn: () => fetchJson<WalletCardsListResponse>("/api/v1/wallet/cards"),
    staleTime: 15_000,
  });
}

export function useIssueCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (type: "virtual" | "physical") =>
      postJson<{ card: WalletCardDto }>("/api/v1/wallet/cards", { type }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet", "cards"] });
    },
  });
}

export function useUpdateCardFreeze() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, frozen }: { id: string; frozen: boolean }) =>
      patchJson<{ card: WalletCardDto }>(`/api/v1/wallet/cards/${encodeURIComponent(id)}`, {
        frozen,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet", "cards"] });
    },
  });
}
