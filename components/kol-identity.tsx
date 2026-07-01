import { BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Kol } from "@/lib/types";

/** Avatar + handle + name, with a verified check. Reused in table, cards, drawer. */
export function KolIdentity({
  kol,
  size = "default",
  className,
}: {
  kol: Pick<Kol, "handle" | "name" | "avatar" | "verified">;
  size?: "default" | "lg";
  className?: string;
}) {
  const initials = kol.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <div className={cn("flex items-center gap-3 min-w-0", className)}>
      <Avatar size={size} className="border border-border/60 bg-muted">
        <AvatarImage src={kol.avatar} alt="" />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "truncate font-medium text-foreground",
              size === "lg" ? "text-base" : "text-sm",
            )}
          >
            {kol.handle}
          </span>
          {kol.verified && (
            <BadgeCheck
              className="size-3.5 shrink-0 text-primary"
              aria-label="Verified"
            />
          )}
        </div>
        <span className="block truncate text-xs text-muted-foreground">
          {kol.name}
        </span>
      </div>
    </div>
  );
}
