import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut, Menu, UserRound } from "lucide-react";
import type { ReactNode } from "react";

export type DashboardNavLink = {
  label: string;
  href: string;
  isActive?: boolean;
};

export type DashboardNavbarProps = {
  logoSrc?: string;
  brandName?: string;
  links: DashboardNavLink[];
  userName?: string;
  profileLabel?: string;
  onProfileSwitch?: () => void;
  onLogout?: () => void;
  onMobileMenuClick?: () => void;
  className?: string;
  children?: ReactNode;
};

export function DashboardNavbar({
  logoSrc,
  brandName = "WealthVerse",
  links,
  userName,
  profileLabel,
  onProfileSwitch,
  onLogout,
  onMobileMenuClick,
  className,
  children,
}: DashboardNavbarProps) {
  return (
    <header
      className={cn(
        "border-b border-white/15 bg-wv-primary-dark text-white shadow-wv-low",
        className
      )}
    >
      <div className="mx-auto flex min-h-16 max-w-[var(--wv-content-width)] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="/dashboard"
          className="inline-flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-wv-primary-dark"
          aria-label={`${brandName} dashboard`}
        >
          {logoSrc ? (
            <img src={logoSrc} alt="" className="h-10 w-auto rounded-md" />
          ) : (
            <span className="flex size-10 items-center justify-center rounded-md bg-white/12">
              <UserRound className="size-5" aria-hidden="true" />
            </span>
          )}
          <span className="font-display text-base font-bold">{brandName}</span>
        </a>

        <nav
          className="hidden flex-1 items-center justify-center gap-1 lg:flex"
          aria-label="Dashboard navigation"
        >
          {links.map((link) => (
            <a
              key={`${link.href}-${link.label}`}
              href={link.href}
              aria-current={link.isActive ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-semibold text-white/78 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-wv-primary-dark",
                link.isActive && "bg-white/12 text-white"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {children}
          {profileLabel || userName ? (
            <button
              type="button"
              onClick={onProfileSwitch}
              className="hidden rounded-md border border-white/25 px-3 py-2 text-left transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-wv-primary-dark sm:block"
              aria-label={onProfileSwitch ? "Switch profile" : "Current profile"}
            >
              <span className="block text-xs text-white/65">
                {profileLabel ?? "Profile"}
              </span>
              <span className="block max-w-40 truncate text-sm font-semibold">
                {userName ?? "Demo User"}
              </span>
            </button>
          ) : null}
          {onLogout ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="hidden border-white/30 bg-transparent text-white hover:bg-white/10 sm:inline-flex"
              onClick={onLogout}
              aria-label="Log out"
            >
              <LogOut className="size-4" aria-hidden="true" />
            </Button>
          ) : null}
          {onMobileMenuClick ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 lg:hidden"
              onClick={onMobileMenuClick}
              aria-label="Open dashboard navigation"
            >
              <Menu className="size-4" aria-hidden="true" />
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
