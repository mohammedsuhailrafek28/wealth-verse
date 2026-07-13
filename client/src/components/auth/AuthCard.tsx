import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type AuthCardProps = {
  eyebrow?: string;
  title: string;
  titleLevel?: 1 | 2 | 3;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function AuthCard({
  eyebrow,
  title,
  titleLevel = 2,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  const Heading = `h${titleLevel}` as const;

  return (
    <Card
      className={cn(
        "w-full rounded-[var(--wv-radius-card)] border-wv-border bg-wv-surface shadow-wv-card",
        className
      )}
    >
      <CardHeader className="gap-3 px-6 pt-6 sm:px-8 sm:pt-8">
        {eyebrow ? (
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-wv-primary">
            {eyebrow}
          </p>
        ) : null}
        <CardTitle>
          <Heading className="font-display text-[34px] font-extrabold leading-[1.08] tracking-[-0.03em] text-wv-text sm:text-[40px]">
            {title}
          </Heading>
        </CardTitle>
        <CardDescription className="text-[15px] font-normal leading-6 text-wv-text-secondary sm:text-[17px]">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 sm:px-8">{children}</CardContent>
      {footer ? (
        <CardFooter className="border-t border-wv-border px-6 pt-5 sm:px-8">
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  );
}
