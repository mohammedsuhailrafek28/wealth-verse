import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

export type PublicNavLink = {
  label: string;
  href: string;
  isActive?: boolean;
};

export type PublicNavbarAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  ariaLabel?: string;
};

export type PublicNavbarProps = {
  logoSrc?: string;
  brandName?: string;
  links: PublicNavLink[];
  actions?: PublicNavbarAction[];
  onMobileMenuClick?: () => void;
  className?: string;
  children?: ReactNode;
};

export function PublicNavbar({
  logoSrc,
  brandName = "WealthVerse",
  links,
  actions = [],
  onMobileMenuClick,
  className,
  children,
}: PublicNavbarProps) {
  return (
    <header
      className={cn(
        "border-b border-wv-border bg-wv-surface text-wv-text shadow-wv-low",
        className
      )}
    >
      <div className="mx-auto flex min-h-16 max-w-[var(--wv-content-width)] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="/"
          className="inline-flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wv-primary focus-visible:ring-offset-2"
          aria-label={`${brandName} home`}
        >
          {logoSrc ? (
            <img src={logoSrc} alt="" className="h-10 w-auto rounded-md" />
          ) : (
            <span className="flex size-10 items-center justify-center rounded-md bg-wv-primary text-white">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
          )}
          <span className="font-display text-base font-bold text-wv-text">
            {brandName}
          </span>
        </a>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Primary navigation"
        >
          {links.map((link) => (
            <a
              key={`${link.href}-${link.label}`}
              href={link.href}
              aria-current={link.isActive ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-wv-text-secondary transition-colors hover:bg-wv-background hover:text-wv-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wv-primary focus-visible:ring-offset-2",
                link.isActive && "bg-wv-background text-wv-primary"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {children}
          <div className="hidden items-center gap-2 sm:flex">
            {actions.map((action) => (
              <NavbarAction key={action.label} action={action} />
            ))}
          </div>
          {onMobileMenuClick ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="border-wv-border text-wv-text md:hidden"
              onClick={onMobileMenuClick}
              aria-label="Open navigation menu"
            >
              <Menu className="size-4" aria-hidden="true" />
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function NavbarAction({ action }: { action: PublicNavbarAction }) {
  const className =
    action.variant === "primary"
      ? "bg-wv-accent text-white hover:bg-wv-accent-hover"
      : "border-wv-border text-wv-text hover:bg-wv-background";

  if (action.href) {
    return (
      <Button asChild variant={action.variant === "primary" ? "default" : "outline"} className={className}>
        <a href={action.href} aria-label={action.ariaLabel}>
          {action.label}
        </a>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={action.variant === "primary" ? "default" : "outline"}
      className={className}
      onClick={action.onClick}
      aria-label={action.ariaLabel}
    >
      {action.label}
    </Button>
  );
}
