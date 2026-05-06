import { ArrowLeft, Shield, Lock, FileText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

type Tab = "terms" | "privacy" | "fees" | "limits";

const tabs = [
  { id: "terms" as const, label: "Terms" },
  { id: "privacy" as const, label: "Privacy" },
  { id: "fees" as const, label: "Fees" },
  { id: "limits" as const, label: "Limits" },
];

const TermsPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("terms");

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/20">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Link to="/settings" className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60 md:hidden">
            <ArrowLeft className="h-[17px] w-[17px] text-foreground" strokeWidth={2} />
          </Link>
          <h1 className="text-page-title">Legal & Policies</h1>
        </div>
        <div className="flex gap-1 px-5 pb-2.5">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                activeTab === tab.id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 py-5 md:px-8 max-w-2xl mx-auto space-y-4">
        {activeTab === "terms" && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="rounded-2xl bg-card shadow-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-primary" strokeWidth={2} />
                <h2 className="text-[14px] font-bold text-foreground">Terms of Service</h2>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">Last updated: March 1, 2026</p>
              <div className="space-y-3 text-[12px] text-muted-foreground leading-relaxed">
                <p>By creating an account with Zenith Pay, you agree to these terms governing the use of our digital banking services including transfers, card issuance, savings products, bill payments, and merchant services.</p>
                <h3 className="text-[12px] font-bold text-foreground">1. Account Eligibility</h3>
                <p>You must be at least 18 years old with a valid global phone number and government-issued identification to open a fully verified account. Basic accounts may be opened with limited functionality pending identity verification.</p>
                <h3 className="text-[12px] font-bold text-foreground">2. Account Security</h3>
                <p>You are responsible for maintaining the confidentiality of your login credentials, PIN, and biometric data. Zenith Pay will never ask for your PIN via phone, email, or SMS. Report unauthorized access immediately.</p>
                <h3 className="text-[12px] font-bold text-foreground">3. Transactions</h3>
                <p>All transfers are subject to applicable limits and verification requirements. Zenith Pay processes transactions in global US Dollar. Transfer fees are disclosed before confirmation and are non-refundable once a transaction is completed.</p>
                <h3 className="text-[12px] font-bold text-foreground">4. Dispute Resolution</h3>
                <p>Transaction disputes must be reported within 30 days. Zenith Pay will investigate and respond within 5 business days. Unauthorized transactions may be reversed at our discretion pending investigation.</p>
                <h3 className="text-[12px] font-bold text-foreground">5. Account Closure</h3>
                <p>You may close your account at any time. Outstanding balances will be transferred to a designated account. Zenith Pay may suspend or close accounts that violate these terms or applicable regulations.</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "privacy" && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="rounded-2xl bg-card shadow-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-success" strokeWidth={2} />
                <h2 className="text-[14px] font-bold text-foreground">Privacy & Data Protection</h2>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">Last updated: March 1, 2026</p>
              <div className="space-y-3 text-[12px] text-muted-foreground leading-relaxed">
                <h3 className="text-[12px] font-bold text-foreground">What We Collect</h3>
                <p>We collect personal information necessary to provide banking services: name, phone number, email, government ID, address, transaction data, device information, and biometric data (with your consent).</p>
                <h3 className="text-[12px] font-bold text-foreground">How We Use Your Data</h3>
                <p>Your data is used to process transactions, verify identity, prevent fraud, improve services, comply with regulations, and provide customer support. We do not sell your personal information to third parties.</p>
                <h3 className="text-[12px] font-bold text-foreground">Data Security</h3>
                <p>All data is encrypted in transit and at rest using AES-256 encryption. Biometric data is stored locally on your device and never transmitted to our servers. We maintain SOC 2 Type II compliance.</p>
                <h3 className="text-[12px] font-bold text-foreground">Your Rights</h3>
                <p>You can request access to, correction of, or deletion of your personal data at any time through the app or by contacting support. Data retention follows FINRA regulatory requirements.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-success/[0.04] border border-success/10 px-4 py-3">
              <Lock className="h-3.5 w-3.5 text-success shrink-0" strokeWidth={2} />
              <p className="text-[11px] text-muted-foreground">Your data is encrypted and protected under global data protection regulations (GDPR).</p>
            </div>
          </motion.div>
        )}

        {activeTab === "fees" && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="rounded-2xl bg-card shadow-card p-5">
              <h2 className="text-[14px] font-bold text-foreground mb-4">Fee Schedule</h2>
              <p className="text-[11px] text-muted-foreground mb-4">All fees are displayed before you confirm a transaction. No hidden charges.</p>
              <div className="space-y-0 rounded-xl border border-border/15 overflow-hidden">
                {[
                  { service: "Wallet-to-Wallet Transfer", fee: "Free" },
                  { service: "Bank Transfer (≤ $5,000)", fee: "$10" },
                  { service: "Bank Transfer (≤ $50,000)", fee: "$25" },
                  { service: "Bank Transfer (> $50,000)", fee: "$50" },
                  { service: "Virtual Card Issuance", fee: "Free" },
                  { service: "Physical Card Issuance", fee: "$1,500" },
                  { service: "Card Replacement", fee: "$1,500" },
                  { service: "Airtime & Data Purchase", fee: "Free" },
                  { service: "Bill Payments", fee: "Free" },
                  { service: "QR Payment (Customer)", fee: "Free" },
                  { service: "Merchant Settlement", fee: "0.5%" },
                ].map((row, i) => (
                  <div key={row.service} className={`flex items-center justify-between px-4 py-3 ${i % 2 === 0 ? "bg-muted/10" : ""}`}>
                    <span className="text-[12px] text-foreground">{row.service}</span>
                    <span className="text-[12px] font-semibold text-foreground tabular-nums">{row.fee}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "limits" && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="rounded-2xl bg-card shadow-card p-5">
              <h2 className="text-[14px] font-bold text-foreground mb-4">Account Limits</h2>
              <p className="text-[11px] text-muted-foreground mb-4">Limits vary by verification level. Complete KYC to unlock higher limits.</p>
              <div className="space-y-4">
                {[
                  { tier: "Basic (Unverified)", daily: "$50,000", single: "$20,000", balance: "$300,000", color: "text-muted-foreground", bg: "bg-secondary" },
                  { tier: "Standard (IDV Verified)", daily: "$500,000", single: "$200,000", balance: "$5,000,000", color: "text-info", bg: "bg-info/8" },
                  { tier: "Premium (Fully Verified)", daily: "$5,000,000", single: "$1,000,000", balance: "Unlimited", color: "text-success", bg: "bg-success/8" },
                ].map((tier) => (
                  <div key={tier.tier} className="rounded-xl border border-border/15 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`rounded-full ${tier.bg} px-2 py-0.5 text-[9px] font-bold ${tier.color}`}>{tier.tier}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-caption mb-0.5">Daily Limit</p>
                        <p className="text-[12px] font-semibold text-foreground tabular-nums">{tier.daily}</p>
                      </div>
                      <div>
                        <p className="text-caption mb-0.5">Per Transaction</p>
                        <p className="text-[12px] font-semibold text-foreground tabular-nums">{tier.single}</p>
                      </div>
                      <div>
                        <p className="text-caption mb-0.5">Max Balance</p>
                        <p className="text-[12px] font-semibold text-foreground tabular-nums">{tier.balance}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/kyc" className="block w-full rounded-2xl balance-gradient py-3.5 text-center text-[13px] font-bold text-white shadow-balance hover:opacity-95 transition-opacity">
              Upgrade Verification Level
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TermsPage;
