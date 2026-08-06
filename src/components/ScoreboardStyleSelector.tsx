"use client";

import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

const STYLES = [
  { value: "neon", label: "Néon" },
  { value: "sobre", label: "Classique sobre" },
  { value: "tv", label: "Classique TV" },
] as const;

export default function ScoreboardStyleSelector({
  currentStyle,
  tournamentId,
  updateStyle,
}: {
  currentStyle: string;
  tournamentId: string;
  updateStyle: (tournamentId: string, style: string) => Promise<void>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (value: string) => {
    startTransition(async () => {
      await updateStyle(tournamentId, value);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>Style du scoreboard</Label>
      <div className="flex gap-2">
        {STYLES.map((style) => (
          <Button
            key={style.value}
            variant={currentStyle === style.value ? "default" : "outline"}
            size="sm"
            disabled={isPending}
            onClick={() => handleChange(style.value)}
          >
            {style.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
