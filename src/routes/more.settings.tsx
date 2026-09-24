import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AppShell } from "@/components/eattrack/AppShell";
import { Button, Card, Field, SectionTitle } from "@/components/eattrack/ui";
import { defaultData, exportJSON, replaceAll, todayKey, update, useAppData } from "@/lib/eattrack/store";

export const Route = createFileRoute("/more/settings")({
  head: () => ({
    meta: [
      { title: "Settings & Data — EatTrack" },
      { name: "description", content: "Export, import or reset your EatTrack data stored on this device." },
      { property: "og:title", content: "Settings & Data — EatTrack" },
      { property: "og:description", content: "Back up and restore your local EatTrack data." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const data = useAppData();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");
  const days = Object.keys(data.days).length;

  const doExport = () => {
    const blob = new Blob([exportJSON()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eattrack-backup-${todayKey()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMsg("Backup file downloaded.");
  };

  const copyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportJSON());
      setMsg("Data copied to clipboard.");
    } catch {
      setMsg("Could not copy — use Download instead.");
    }
  };

  const onFile = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed || typeof parsed !== "object" || !("days" in parsed)) throw new Error();
      if (!window.confirm("Replace all current data with this backup?")) return;
      replaceAll(parsed);
      setMsg("Data imported successfully.");
    } catch {
      setMsg("That file is not a valid EatTrack backup.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const reset = () => {
    if (!window.confirm("Delete ALL EatTrack data on this device? This cannot be undone.")) return;
    replaceAll(defaultData());
    setMsg("All data was reset.");
  };

  return (
    <AppShell title="Settings & Data" back="/more">
      <Card className="mb-4 space-y-3">
        <SectionTitle>Preferences</SectionTitle>
        <Field label="Water button step (ml)">
          <input
            className="et-field"
            type="number"
            inputMode="numeric"
            value={data.settings.waterStepMl}
            onChange={(e) =>
              update((d) => ({ ...d, settings: { ...d.settings, waterStepMl: Math.max(50, Number(e.target.value) || 250) } }))
            }
          />
        </Field>
        <Field label="First day of week">
          <select
            className="et-field"
            value={data.settings.firstDayOfWeek}
            onChange={(e) =>
              update((d) => ({ ...d, settings: { ...d.settings, firstDayOfWeek: Number(e.target.value) as 0 | 1 } }))
            }
          >
            <option value={1}>Monday</option>
            <option value={0}>Sunday</option>
          </select>
        </Field>
      </Card>

      <Card className="mb-4 space-y-3">
        <SectionTitle>Your data</SectionTitle>
        <p className="text-sm text-muted-foreground">
          {days} logged days · {data.customFoods.length} custom foods · {data.savedMeals.length} saved meals.
          Everything is stored only on this device.
        </p>
        <Button className="w-full" onClick={doExport}>Export data (JSON)</Button>
        <Button className="w-full" variant="outline" onClick={copyExport}>Copy data to clipboard</Button>
        <Button className="w-full" variant="soft" onClick={() => fileRef.current?.click()}>Import data</Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </Card>

      <Card className="space-y-3">
        <SectionTitle>Danger zone</SectionTitle>
        <Button className="w-full" variant="danger" onClick={reset}>Reset all data</Button>
      </Card>

      {msg ? <p role="status" className="mt-4 text-center text-sm font-semibold text-primary">{msg}</p> : null}
    </AppShell>
  );
}
