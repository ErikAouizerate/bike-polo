"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseMIDIReturn {
  isConnected: boolean;
  isConnecting: boolean;
  deviceName: string | null;
  error: string | null;
  devices: string[];
  connect: () => Promise<void>;
  disconnect: () => void;
  onNoteOn: (cb: (note: number) => void) => () => void;
}

export function useMIDI(): UseMIDIReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<string[]>([]);

  const midiAccessRef = useRef<MIDIAccess | null>(null);
  const inputRef = useRef<MIDIInput | null>(null);
  const listenersRef = useRef<Set<(note: number) => void>>(new Set());

  const onNoteOn = useCallback((cb: (note: number) => void) => {
    listenersRef.current.add(cb);
    return () => {
      listenersRef.current.delete(cb);
    };
  }, []);

  const disconnect = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.onmidimessage = null;
    }
    inputRef.current = null;
    midiAccessRef.current = null;
    setIsConnected(false);
    setDeviceName(null);
    setDevices([]);
    setError(null);
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const access = await navigator.requestMIDIAccess();
      midiAccessRef.current = access;

      const inputs = Array.from(access.inputs.values());
      if (inputs.length === 0) {
        throw new Error("Aucun périphérique MIDI trouvé");
      }

      const input = inputs[0];
      inputRef.current = input;
      setDeviceName(input.name || "Périphérique MIDI");
      setDevices(inputs.map((i) => i.name || "Inconnu"));

      input.onmidimessage = (event: MIDIMessageEvent) => {
        const data = event.data;
        if (!data) return;
        const [status, note, velocity] = data;
        if ((status & 0xf0) === 144 && velocity > 0) {
          listenersRef.current.forEach((cb) => cb(note));
        }
      };

      setIsConnected(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur de connexion MIDI"
      );
    } finally {
      setIsConnecting(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (inputRef.current) {
        inputRef.current.onmidimessage = null;
      }
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    deviceName,
    error,
    devices,
    connect,
    disconnect,
    onNoteOn,
  };
}
