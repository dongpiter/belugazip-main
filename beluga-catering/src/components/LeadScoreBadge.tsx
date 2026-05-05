interface LeadScoreBadgeProps {
  score?: string | null;
  showLabel?: boolean;
}

export default function LeadScoreBadge({ score, showLabel = true }: LeadScoreBadgeProps) {
  if (!score) return null;

  const config = {
    hot: { label: "Hot", className: "bg-red-100 text-red-700 border border-red-200" },
    warm: { label: "Warm", className: "bg-amber-100 text-amber-700 border border-amber-200" },
    cold: { label: "Cold", className: "bg-blue-100 text-blue-700 border border-blue-200" },
  };

  const cfg = config[score as keyof typeof config] ?? config.cold;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${cfg.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${score === "hot" ? "bg-red-500" : score === "warm" ? "bg-amber-500" : "bg-blue-500"}`} />
      {showLabel && cfg.label}
    </span>
  );
}
