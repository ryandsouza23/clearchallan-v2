"use client";

import { useEffect, useState } from "react";
import { Ux4gIcon } from "./Ux4gIcon";

/* Read-aloud affordance (Web Speech API). Reads the element with the given
   id; toggles off on second press; degrades politely when unsupported. */
export function ReadAloud({ targetId }: { targetId: string }) {
  const [speaking, setSpeaking] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  function toggle() {
    const synth = window.speechSynthesis;
    if (!synth) {
      setNote("Read-aloud isn't available in this browser.");
      return;
    }
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const text = document.getElementById(targetId)?.innerText ?? "";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    synth.speak(utterance);
    setSpeaking(true);
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={speaking}
        className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-sm"
      >
        <Ux4gIcon name={speaking ? "stop_circle" : "volume_up"} />{" "}
        {speaking ? "Stop reading" : "Read this page aloud"}
      </button>
      {note && (
        <span aria-live="polite" className="ux4g-label-m-default text-muted">
          {note}
        </span>
      )}
    </span>
  );
}
