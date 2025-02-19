// app/banner.js
"use client";
import { Alert, AlertDescription, AlertTitle } from "@/ui/alert";
import { Button } from "@/ui/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const KEY = "cookie_consent";

export const cookieConsentGiven = () => {
  const consent = localStorage.getItem(KEY);
  if (consent === null) {
    return "na";
  }
  return consent === "true";
};

export const CookieBanner = () => {
  const [consentGiven, setConsentGiven] = useState<"na" | boolean | undefined>(
    undefined,
  );

  const setCookieConsent = (consent: boolean) => {
    localStorage.setItem(KEY, consent ? "true" : "false");
    setConsentGiven(consent);
  };

  useEffect(() => {
    if (Intl.DateTimeFormat().resolvedOptions().timeZone.includes("Europe")) {
      // We want this to only run once the client loads
      // or else it causes a hydration error
      setConsentGiven(cookieConsentGiven());
    } else {
      setCookieConsent(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    setCookieConsent(true);
  };

  const handleDeclineCookies = () => {
    setCookieConsent(false);
  };

  if (typeof consentGiven === "boolean" || consentGiven === undefined) {
    return null;
  }

  return (
    <Alert className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg">
      <AlertTitle className="pb-1">Cookie Consent</AlertTitle>
      <AlertDescription className="pb-2.5 pr-10">
        We use cookies to enhance your browsing experience and analyze our
        traffic. By clicking &quot;Accept&quot;, you consent to our use of
        cookies.
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleAcceptCookies}
        className="absolute right-px top-px"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
      <div className="flex flex-row-reverse gap-3">
        <Button
          variant="default"
          size="sm"
          onClick={handleAcceptCookies}
          className="mt-2"
        >
          Accept
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDeclineCookies}
          className="mt-2"
        >
          Decline
        </Button>
      </div>
    </Alert>
  );
};
