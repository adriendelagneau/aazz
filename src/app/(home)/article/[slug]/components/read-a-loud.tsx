"use client";

import { PauseIcon, HeadphonesIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function ReadAloudButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.onend = () => setSpeaking(false);

    speechSynthesis.cancel(); // Stop previous utterances
    speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <Button onClick={speaking ? stop : speak} variant="ghost">
      {speaking ? (
        <>
          <PauseIcon />
        </>
      ) : (
        <>
          <HeadphonesIcon />
        </>
      )}
    </Button>
  );
}
