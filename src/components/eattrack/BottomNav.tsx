import { Link } from "@tanstack/react-router";
import { CalendarCheck, CircleEllipsis, Home, LineChart, Utensils } from "lucide-react";

const items = [
  { to: "/", label: "Today", icon: Home },
  { to: "/food", label: "Food", icon: Utensils },
  { to: "/progress", label: "Progress", icon: LineChart },
  { to: "/habits", label: "Habits", icon: CalendarCheck },
  { to: "/more", label: "More", icon: CircleEllipsis },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur et-safe-bottom">
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex min-h-16 flex-col items-center justify-center gap-1 text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <Icon className="h-5 w-5" />
              <span className="text-[11px] font-semibold">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
