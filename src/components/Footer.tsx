import Link from "next/link";
import { navItems } from "./nav";

export function Footer() {
  return (
    <footer className="border-t border-rule bg-surface-sunken">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-body hover:text-ink hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/accessibility"
                className="text-sm text-body hover:text-ink hover:underline"
              >
                Accessibility
              </Link>
            </li>
            <li>
              <Link
                href="/gate"
                className="text-sm text-body hover:text-ink hover:underline"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
        <p className="text-sm text-muted-strong">
          All records are invented. ClearChallan is not a government service.
          Built to the UX4G design standard; not affiliated with UX4G or the
          Government of India.
        </p>
      </div>
    </footer>
  );
}
