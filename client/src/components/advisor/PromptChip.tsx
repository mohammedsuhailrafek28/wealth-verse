export type PromptChipProps = {
  question: string;
  onSelect: (question: string) => void;
  disabled?: boolean;
};

export function PromptChip({ question, onSelect, disabled = false }: PromptChipProps) {
  return (
    <button
      type="button"
      className="min-h-10 rounded-full border border-wv-border bg-wv-surface px-3 py-2 text-left text-xs font-semibold text-wv-text-secondary transition-colors hover:border-wv-primary hover:text-wv-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wv-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      onClick={() => onSelect(question)}
      disabled={disabled}
    >
      {question}
    </button>
  );
}
