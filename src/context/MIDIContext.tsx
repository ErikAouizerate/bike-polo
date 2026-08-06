"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useMIDI } from "@/hooks/useMIDI";

interface MIDIContextValue {
  isConnected: boolean;
  isConnecting: boolean;
  deviceName: string | null;
  error: string | null;
  devices: string[];
  connect: () => Promise<void>;
  disconnect: () => void;
  mapping: Record<number, string>;
  assignNote: (action: string, note: number) => void;
  learnMode: string | null;
  startLearn: (action: string) => void;
  stopLearn: () => void;
  isWaitingForNote: boolean;
  onAction: (action: string, cb: () => void) => () => void;
  resetMapping: () => void;
}

const MIDIContext = createContext<MIDIContextValue | null>(null);

const STORAGE_KEY = "bike-polo-midi-mapping";

function loadMapping(): Record<number, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Object.fromEntries(
        Object.entries(parsed).map(([k, v]) => [Number(k), v as string])
      );
    }
  } catch {}
  return {};
}

function saveMapping(mapping: Record<number, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mapping));
  } catch {}
}

export const ACTIONS_LABELS: Record<string, string> = {
  teamA_plus: "Équipe A +1",
  teamA_minus: "Équipe A -1",
  teamB_plus: "Équipe B +1",
  teamB_minus: "Équipe B -1",
};

export function MIDIProvider({ children }: { children: ReactNode }) {
  const {
    isConnected,
    isConnecting,
    deviceName,
    error,
    devices,
    connect,
    disconnect,
    onNoteOn,
  } = useMIDI();

  const [mapping, setMapping] = useState<Record<number, string>>(loadMapping);
  const [learnMode, setLearnMode] = useState<string | null>(null);

  const actionListenersRef = useRef<Map<string, Set<() => void>>>(new Map());
  const lastNoteTimeRef = useRef<number>(0);

  const onAction = useCallback(
    (action: string, cb: () => void): (() => void) => {
      if (!actionListenersRef.current.has(action)) {
        actionListenersRef.current.set(action, new Set());
      }
      actionListenersRef.current.get(action)!.add(cb);
      return () => {
        actionListenersRef.current.get(action)?.delete(cb);
      };
    },
    []
  );

  const assignNote = useCallback((action: string, note: number) => {
    setMapping((prev) => {
      const next = { ...prev };
      for (const [n, a] of Object.entries(next)) {
        if (a === action) delete next[Number(n)];
      }
      next[note] = action;
      saveMapping(next);
      return next;
    });
  }, []);

  const resetMapping = useCallback(() => {
    setMapping({});
    saveMapping({});
  }, []);

  const startLearn = useCallback((action: string) => {
    setLearnMode(action);
  }, []);

  const stopLearn = useCallback(() => {
    setLearnMode(null);
  }, []);

  useEffect(() => {
    return onNoteOn((note) => {
      const now = Date.now();
      if (note === null || now - lastNoteTimeRef.current < 80) return;
      lastNoteTimeRef.current = now;

      if (learnMode) {
        assignNote(learnMode, note);
        setLearnMode(null);
      } else {
        const action = mapping[note];
        if (action && actionListenersRef.current.has(action)) {
          actionListenersRef.current.get(action)!.forEach((cb) => cb());
        }
      }
    });
  }, [onNoteOn, learnMode, assignNote, mapping]);

  const value: MIDIContextValue = {
    isConnected,
    isConnecting,
    deviceName,
    error,
    devices,
    connect,
    disconnect,
    mapping,
    assignNote,
    learnMode,
    startLearn,
    stopLearn,
    isWaitingForNote: learnMode !== null,
    onAction,
    resetMapping,
  };

  return <MIDIContext.Provider value={value}>{children}</MIDIContext.Provider>;
}

export function useMIDIContext(): MIDIContextValue {
  const ctx = useContext(MIDIContext);
  if (!ctx) throw new Error("useMIDIContext must be used within MIDIProvider");
  return ctx;
}
