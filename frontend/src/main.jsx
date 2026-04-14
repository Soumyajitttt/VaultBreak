import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import "./index.css";
import App from "./App.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) throw new Error("Missing Clerk Publishable Key");

const clerkAppearance = {
  layout: {
    logoImageUrl: null,
    logoPlacement: "none",
    socialButtonsVariant: "blockButton",
    socialButtonsPlacement: "top",
  },
  variables: {
    colorBackground: "#16161f",
    colorInputBackground: "#0a0a0f",
    colorInputText: "#e8e8f0",
    colorText: "#e8e8f0",
    colorTextSecondary: "#666680",
    colorPrimary: "#f5a623",
    colorDanger: "#ff3b3b",
    colorSuccess: "#00e887",
    colorWarning: "#f5a623",
    colorNeutral: "#2a2a3a",
    colorShimmer: "rgba(245,166,35,0.08)",
    colorBorder: "#2a2a3a",
    fontFamily: "'Syne', sans-serif",
    fontFamilyButtons: "'Syne', sans-serif",
    fontSize: "14px",
    fontWeight: { normal: 400, medium: 600, bold: 700 },
    borderRadius: "6px",
    spacingUnit: "16px",
  },
  elements: {
    // Card
    "card": {
      background: "#16161f",
      border: "1px solid #2a2a3a",
      borderRadius: "12px",
      boxShadow: "0 0 40px rgba(245,166,35,0.08), 0 20px 60px rgba(0,0,0,0.6)",
    },

    // Header title — Bebas Neue + amber
    "headerTitle": {
      color: "#f5a623 !important",
      fontFamily: "'Bebas Neue', sans-serif !important",
      fontSize: "30px !important",
      letterSpacing: "0.08em !important",
    },
    "cl-headerTitle": {
      color: "#f5a623 !important",
      fontFamily: "'Bebas Neue', sans-serif !important",
    },
    "headerSubtitle": { color: "#666680", fontSize: "13px" },

    // Hide Clerk logo
    "logoBox": { display: "none" },
    "logoImage": { display: "none" },

    // Social button
    "socialButtonsBlockButton": {
      background: "#111118 !important",
      border: "1px solid #2a2a3a !important",
      color: "#e8e8f0 !important",
      borderRadius: "6px !important",
      fontFamily: "'Syne', sans-serif !important",
      fontSize: "13px !important",
      fontWeight: "600 !important",
    },
    "socialButtonsBlockButtonText": {
      color: "#e8e8f0 !important",
      fontWeight: "600 !important",
    },

    // Divider
    "dividerLine": { background: "#2a2a3a" },
    "dividerText": { color: "#666680", fontSize: "12px" },

    // Labels
    "formFieldLabel": {
      color: "#e8e8f0 !important",
      fontSize: "11px !important",
      fontWeight: "700 !important",
      letterSpacing: "0.08em !important",
      textTransform: "uppercase !important",
    },

    // Inputs
    "formFieldInput": {
      background: "#0a0a0f !important",
      border: "1px solid #2a2a3a !important",
      borderRadius: "6px !important",
      color: "#e8e8f0 !important",
      fontSize: "14px !important",
      fontFamily: "'JetBrains Mono', monospace !important",
    },

    // Error / hint
    "formFieldHintText": { color: "#666680", fontSize: "12px" },
    "formFieldErrorText": { color: "#ff3b3b !important", fontSize: "12px" },

    // "Last used" badge
    "badge": {
      background: "rgba(245,166,35,0.12) !important",
      border: "1px solid rgba(245,166,35,0.3) !important",
      color: "#f5a623 !important",
      borderRadius: "4px !important",
      fontSize: "11px !important",
      fontWeight: "600 !important",
    },

    // PRIMARY BUTTON — amber, not purple
    "formButtonPrimary": {
      background: "#f5a623 !important",
      backgroundColor: "#f5a623 !important",
      color: "#0a0a0f !important",
      borderRadius: "6px !important",
      fontFamily: "'Syne', sans-serif !important",
      fontSize: "13px !important",
      fontWeight: "700 !important",
      letterSpacing: "0.1em !important",
      textTransform: "uppercase !important",
      border: "none !important",
      boxShadow: "none !important",
    },

    // Footer
    "footer": {
      background: "#111118 !important",
      borderTop: "1px solid #2a2a3a !important",
    },
    "footerActionText": { color: "#666680", fontSize: "13px" },
    "footerActionLink": {
      color: "#f5a623 !important",
      fontWeight: "600 !important",
    },

    // OTP inputs
    "otpCodeFieldInput": {
      background: "#0a0a0f !important",
      border: "1px solid #2a2a3a !important",
      color: "#f5a623 !important",
      fontFamily: "'JetBrains Mono', monospace !important",
      fontSize: "20px !important",
      fontWeight: "700 !important",
      borderRadius: "6px !important",
    },

    // Alert box
    "alert": {
      background: "rgba(245,166,35,0.08) !important",
      border: "1px solid rgba(245,166,35,0.2) !important",
      borderRadius: "6px !important",
    },
    "alertText": { color: "#e8e8f0", fontSize: "13px" },

    // UserButton popup
    "userButtonAvatarBox": {
      border: "2px solid #2a2a3a",
      borderRadius: "50%",
    },
    "userButtonPopoverCard": {
      background: "#16161f !important",
      border: "1px solid #2a2a3a !important",
      borderRadius: "10px !important",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5) !important",
    },
    "userButtonPopoverActionButton": { color: "#e8e8f0" },
    "userButtonPopoverActionButtonText": { color: "#e8e8f0", fontSize: "13px" },
    "userPreviewMainIdentifier": { color: "#e8e8f0", fontWeight: "600" },
    "userPreviewSecondaryIdentifier": { color: "#666680", fontSize: "12px" },
  },
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      appearance={clerkAppearance}
    >
      <App />
    </ClerkProvider>
  </StrictMode>
);