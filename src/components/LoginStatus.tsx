"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { hasAnyOwnership, subscribeOwnership } from "@/lib/ownership";
import { Ux4gIcon } from "./Ux4gIcon";

/*
  Header login entry. ClearChallan has no accounts — "login" is the
  ownership gate, and the signed-in state is session-scoped ownership
  proof. No emblem, no Aadhaar, no mobile-OTP account login here.
*/
export function LoginStatus() {
  const verified = useSyncExternalStore(
    subscribeOwnership,
    hasAnyOwnership,
    () => false,
  );

  if (verified) {
    return (
      <Link
        href="/gate"
        className="ux4g-tag ux4g-tag-tonal-success flex h-8 items-center"
      >
        <Ux4gIcon name="verified" /> Owner verified
      </Link>
    );
  }

  return (
    <Link
      href="/gate"
      className="ux4g-btn ux4g-btn-primary ux4g-btn-sm flex h-8 items-center"
    >
      <Ux4gIcon name="login" /> Login
    </Link>
  );
}
