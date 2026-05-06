/** Stable names — mirror these when wiring a real analytics backend. */
export const TelemetryEvents = {
  APP_SESSION_READY: "app_session_ready",
  SCREEN_VIEW: "screen_view",
  LOGIN_SUCCESS: "login_success",
  SIGNUP_OTP_COMPLETE: "signup_otp_complete",
  TRANSFER_COMPLETED: "transfer_completed",
  TRANSFER_FAILED: "transfer_failed",
  WALLET_FUND_SIMULATED: "wallet_fund_simulated",
  WALLET_FUND_FAILED: "wallet_fund_failed",
  PIN_SETUP_COMPLETE: "pin_setup_complete",
  SCAN_PAYMENT_SUCCESS: "scan_payment_success",
  LOGOUT: "logout",
  API_ERROR_RESPONSE: "api_error_response",
  NETWORK_ERROR: "network_error",
  EXCEPTION: "exception",
} as const;
