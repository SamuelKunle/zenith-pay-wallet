import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { logger } from "@/lib/logger";
import { getTelemetry } from "@/lib/telemetry";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render errors in subtree so the whole SPA does not go blank.
 * Place inside `BrowserRouter` so recovery UI can use `<Link />`.
 */
export class AppErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error("Unhandled React render error", {
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    });
    getTelemetry().captureException(error, {
      componentStack: info.componentStack,
      source: "AppErrorBoundary",
    });
  }

  override render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-12 text-center">
          <div className="max-w-md rounded-2xl border border-border bg-card p-8 shadow-card">
            <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-destructive" strokeWidth={1.8} />
            <h1 className="mb-2 text-lg font-bold text-foreground">Something went wrong</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              The app hit an unexpected error. Try again or return home.
            </p>
            <div className="flex flex-col gap-2">
              <button type="button" className="btn-primary" onClick={() => this.setState({ error: null })}>
                Try again
              </button>
              <Link to="/" className="text-sm font-semibold text-primary">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
