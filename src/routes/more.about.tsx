import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/eattrack/AppShell";
import { Card, SectionTitle } from "@/components/eattrack/ui";

export const Route = createFileRoute("/more/about")({
  head: () => ({
    meta: [
      { title: "About — EatTrack" },
      { name: "description", content: "About EatTrack, the offline personal food and healthy lifestyle tracker." },
      { property: "og:title", content: "About — EatTrack" },
      { property: "og:description", content: "Offline-first, private food and habit tracking." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <AppShell title="About" back="/more">
      <Card className="mb-4 text-center">
        <p className="text-2xl font-extrabold text-primary">EatTrack</p>
        <p className="text-sm text-muted-foreground">Version 1.0.0</p>
      </Card>
      <Card className="mb-4 space-y-2 text-sm">
        <SectionTitle>Privacy</SectionTitle>
        <p>EatTrack works fully offline. There are no accounts and no cloud sync.</p>
        <p>All your data is saved only in this device's local storage. Use Export in Settings & Data to keep a backup.</p>
      </Card>
      <Card className="space-y-2 text-sm">
        <SectionTitle>Disclaimer</SectionTitle>
        <p>Nutrition values are approximate. EatTrack is a personal tracking tool and does not provide medical advice.</p>
      </Card>
    </AppShell>
  );
}
