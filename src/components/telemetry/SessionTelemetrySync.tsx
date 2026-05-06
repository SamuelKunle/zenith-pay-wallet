import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getTelemetry } from "@/lib/telemetry";
import { TelemetryEvents } from "@/lib/telemetry/events";

/**
 * Keeps mock analytics “identity” aligned with auth session (swap backend later).
 */
export function SessionTelemetrySync() {
  const { session } = useAuth();

  useEffect(() => {
    const telemetry = getTelemetry();
    telemetry.identify({
      userId: session.subject,
      traits: {
        auth_status: session.status,
        email: session.email,
      },
    });
    telemetry.track(TelemetryEvents.APP_SESSION_READY, {
      subject: session.subject,
      status: session.status,
    });
  }, [session.subject, session.status, session.email]);

  return null;
}
