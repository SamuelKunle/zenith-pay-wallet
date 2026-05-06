import { useQuery } from "@tanstack/react-query";
import { demoDelay } from "@/lib/demo/demoDelay";
import {
  disputesDemoCases,
  insightsDemoPayload,
  notificationsDemoFeed,
  rewardsDemoHubPayload,
  schedulesDemoSeed,
  type InsightsDemoPayload,
  type RewardsHubDemoPayload,
  type ScheduledDemoRow,
  type DisputeCaseModel,
  type NotifDemoRow,
} from "@/lib/demo/demoScreenData";

const stale = 60_000;

/** Demo queries never hit the network; keep retries low and gc sensible for mock data. */
const demoQueryOpts = {
  staleTime: stale,
  gcTime: 10 * 60_000,
  retry: 1,
  retryDelay: 400,
} as const;

export function useInsightsDemoQuery() {
  return useQuery({
    queryKey: ["demo", "insights", "v1"],
    queryFn: async ({ signal }): Promise<InsightsDemoPayload> => {
      await demoDelay(undefined, signal);
      return {
        ...insightsDemoPayload,
        insights: [...insightsDemoPayload.insights],
        spendingCategories: [...insightsDemoPayload.spendingCategories],
      };
    },
    ...demoQueryOpts,
  });
}

export function useDisputesDemoQuery() {
  return useQuery({
    queryKey: ["demo", "disputes", "v1"],
    queryFn: async ({ signal }): Promise<DisputeCaseModel[]> => {
      await demoDelay(undefined, signal);
      return disputesDemoCases.map((c) => ({ ...c, updates: [...c.updates] }));
    },
    ...demoQueryOpts,
  });
}

export function useNotificationsDemoQuery() {
  return useQuery({
    queryKey: ["demo", "notifications", "v1"],
    queryFn: async ({ signal }): Promise<NotifDemoRow[]> => {
      await demoDelay(undefined, signal);
      return notificationsDemoFeed.map((n) => ({ ...n }));
    },
    ...demoQueryOpts,
  });
}

export function useRewardsHubDemoQuery() {
  return useQuery({
    queryKey: ["demo", "rewards-hub", "v1"],
    queryFn: async ({ signal }): Promise<RewardsHubDemoPayload> => {
      await demoDelay(undefined, signal);
      return {
        ...rewardsDemoHubPayload,
        history: [...rewardsDemoHubPayload.history],
      };
    },
    ...demoQueryOpts,
  });
}

export function useSchedulesDemoQuery() {
  return useQuery({
    queryKey: ["demo", "schedules", "v1"],
    queryFn: async ({ signal }): Promise<ScheduledDemoRow[]> => {
      await demoDelay(undefined, signal);
      return schedulesDemoSeed.map((r) => ({ ...r }));
    },
    ...demoQueryOpts,
  });
}
