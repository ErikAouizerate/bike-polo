"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMIDIContext, ACTION_KEYS, getActionLabels } from "@/context/MIDIContext";
import { Cable, Unplug, Gamepad2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const NOTE_NAMES: Record<number, string> = {
  36: "C2", 38: "D2", 42: "F#2", 46: "A#2",
  48: "C3", 49: "C#3", 50: "D3", 51: "D#3",
  52: "E3", 53: "F3", 54: "F#3", 55: "G3",
  56: "G#3", 57: "A3", 58: "A#3", 59: "B3",
  60: "C4", 61: "C#4", 62: "D4", 63: "D#4",
  64: "E4", 65: "F4", 66: "F#4", 67: "G4",
  68: "G#4", 69: "A4", 70: "A#4", 71: "B4",
  72: "C5",
};

function formatNote(note: number): string {
  const name = NOTE_NAMES[note];
  return name ? `${note} (${name})` : `${note}`;
}

export default function MIDIPanel({
  teamA = "Équipe A",
  teamB = "Équipe B",
}: {
  teamA?: string;
  teamB?: string;
}) {
  const labels = getActionLabels(teamA, teamB);

  const {
    isConnected,
    isConnecting,
    deviceName,
    error,
    connect,
    disconnect,
    mapping,
    learnMode,
    startLearn,
    stopLearn,
    isWaitingForNote,
    resetMapping,
  } = useMIDIContext();

  const [isOpen, setIsOpen] = useState(true);
  const mappedActions = new Set(Object.values(mapping));

  const findNote = (action: string): number | null => {
    for (const [note, a] of Object.entries(mapping)) {
      if (a === action) return Number(note);
    }
    return null;
  };

  return (
    <Card>
      <CardHeader
        className="flex flex-row items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="text-lg flex items-center gap-2">
          <Gamepad2 size={20} />
          MIDI
        </CardTitle>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </CardHeader>
      {isOpen && (
        <CardContent className="flex flex-col gap-4">
          {/* Connection */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm">
              {isConnected ? (
                <Cable size={16} className="text-green-500" />
              ) : (
                <Unplug size={16} className="text-muted-foreground" />
              )}
              <span>
                {isConnected
                  ? `Connecté : ${deviceName}`
                  : "Déconnecté"}
              </span>
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <Button
              size="sm"
              variant={isConnected ? "outline" : "default"}
              onClick={isConnected ? disconnect : connect}
              disabled={isConnecting}
            >
              {isConnecting
                ? "Connexion..."
                : isConnected
                  ? "Déconnecter"
                  : "Connecter un pad MIDI"}
            </Button>
          </div>

          {/* Mapping */}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Mapping des pads</p>
            <div className="flex flex-col gap-1">
              {ACTION_KEYS.map((action) => {
                const label = labels[action];
                const note = findNote(action);
                const isLearning = learnMode === action;
                return (
                  <div
                    key={action}
                    className={`flex items-center gap-2 text-sm p-1.5 rounded-md transition-colors ${
                      isLearning
                        ? "bg-yellow-100 dark:bg-yellow-900/30 ring-2 ring-yellow-400"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span className="flex-1">{label}</span>
                    <span className="font-mono text-xs min-w-[80px] text-right">
                      {isLearning ? "..." : note !== null ? formatNote(note) : "—"}
                    </span>
                    <Button
                      size="sm"
                      variant={isLearning ? "default" : "outline"}
                      onClick={() =>
                        isLearning ? stopLearn() : startLearn(action)
                      }
                      className="h-7 px-2 text-xs"
                    >
                      {isLearning ? "Annuler" : "Apprendre"}
                    </Button>
                  </div>
                );
              })}
            </div>
            {isWaitingForNote && (
              <p className="text-xs text-yellow-600 dark:text-yellow-400 animate-pulse">
                Tapez sur le pad MIDI à assigner...
              </p>
            )}
            {mappedActions.size > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={resetMapping}
                className="self-end h-7 px-2 text-xs text-muted-foreground"
              >
                Réinitialiser
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
