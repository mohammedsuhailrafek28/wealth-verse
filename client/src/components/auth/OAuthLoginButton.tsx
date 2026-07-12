import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Loader2 } from "lucide-react";

export type OAuthLoginButtonProps = {
  href: string;
  label?: string;
  loading?: boolean;
  className?: string;
};

export function OAuthLoginButton({
  href,
  label = "Continue with secure sign-in",
  loading = false,
  className,
}: OAuthLoginButtonProps) {
  return (
    <Button
      asChild={!loading}
      disabled={loading}
      className={cn(
        "min-h-11 w-full bg-wv-primary px-5 text-white hover:bg-wv-primary-dark focus-visible:ring-wv-primary",
        className
      )}
    >
      {loading ? (
        <span aria-live="polite">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Checking session
        </span>
      ) : (
        <a href={href} aria-label={label}>
          {label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      )}
    </Button>
  );
}
