import Link from "next/link";
import { LoginStatus } from "./LoginStatus";
import { NavLinks } from "./NavLinks";

/*
  Shared header — single row: wordmark, nav, login. Deliberately NO flag,
  NO emblem, NO "Government of India" strip, NO logos: ClearChallan is an
  independent prototype. (The skip-to-content link lives in the layout,
  before this header.)
*/
export function TopBar() {
  return (
    <header className="border-b border-rule bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link
          href="/"
          className="flex items-baseline gap-2"
          aria-label="ClearChallan home"
        >
          <span className="text-base font-semibold tracking-tight text-ink">
            ClearChallan
          </span>
          <span className="border border-rule px-1 py-px text-[11px] leading-4 text-muted-strong">
            Independent prototype
          </span>
        </Link>

        <div className="order-last flex w-full flex-wrap items-center gap-x-6 gap-y-2 md:order-none md:ml-auto md:w-auto">
          <NavLinks />
          <LoginStatus />
        </div>
      </div>
    </header>
  );
}
