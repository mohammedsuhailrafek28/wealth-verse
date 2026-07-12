import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Square } from "lucide-react";

export type VoiceControlsProps = {
  supported: boolean;
  muted: boolean;
  speaking: boolean;
  canReplay?: boolean;
  onToggleMute: () => void;
  onStop: () => void;
  onReplay?: () => void;
};

export function VoiceControls({
  supported,
  muted,
  speaking,
  canReplay = false,
  onToggleMute,
  onStop,
  onReplay,
}: VoiceControlsProps) {
  return (
    <section className="rounded-[var(--wv-radius-card)] border border-wv-border bg-wv-surface p-5 shadow-wv-card">
      <h2 className="text-base font-bold text-wv-text">Voice playback</h2>
      <p className="mt-2 text-sm leading-6 text-wv-text-secondary">
        Text-to-speech uses your browser. Voice input is not available in this prototype.
      </p>
      {!supported ? (
        <p className="mt-4 rounded-[var(--wv-radius-form)] bg-wv-background p-3 text-sm text-wv-text-secondary">
          Speech synthesis is not supported by this browser.
        </p>
      ) : (
        <div className="mt-4 grid gap-2">
          <Button
            type="button"
            variant="outline"
            className="justify-start border-wv-border text-wv-text"
            onClick={onToggleMute}
          >
            {muted ? <VolumeX className="size-4" aria-hidden="true" /> : <Volume2 className="size-4" aria-hidden="true" />}
            {muted ? "Muted" : "Sound on"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="justify-start border-wv-border text-wv-text"
            onClick={onStop}
            disabled={!speaking}
          >
            <Square className="size-4" aria-hidden="true" />
            Stop speaking
          </Button>
          {onReplay ? (
            <Button
              type="button"
              className="justify-start bg-wv-primary text-white hover:bg-wv-primary-dark"
              onClick={onReplay}
              disabled={!canReplay || muted || speaking}
            >
              <Volume2 className="size-4" aria-hidden="true" />
              Play latest answer
            </Button>
          ) : null}
        </div>
      )}
    </section>
  );
}
