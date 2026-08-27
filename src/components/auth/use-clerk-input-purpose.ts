"use client";

import { useEffect } from "react";

type AuthMode = "sign-in" | "sign-up";

function setInputPurpose(mode: AuthMode) {
  const inputs = Array.from(document.querySelectorAll<HTMLInputElement>(".cl-rootBox input"));
  for (const input of inputs) {
    const name = input.name.toLowerCase();
    const type = input.type.toLowerCase();

    if (type === "email" || name.includes("email") || name.includes("identifier")) {
      input.autocomplete = mode === "sign-in" ? "username" : "email";
      input.inputMode = "email";
    }

    if (type === "password" || name.includes("password")) {
      input.autocomplete = mode === "sign-in" ? "current-password" : "new-password";
    }
  }
}

export function useClerkInputPurpose(mode: AuthMode) {
  useEffect(() => {
    setInputPurpose(mode);
    const observer = new MutationObserver(() => setInputPurpose(mode));
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [mode]);
}
