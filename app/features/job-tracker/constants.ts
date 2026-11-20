import { Briefcase, CheckCircle2, FileText, TrendingUp, XCircle } from "lucide-react";

export const STATUS_ORDER = ["SAVED", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"] as const;

export const STATUS_META = {
  SAVED: {
    label: "Saved",
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
    dot: "bg-slate-400",
    icon: Briefcase,
  },
  APPLIED: {
    label: "Applied",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-400",
    icon: FileText,
  },
  INTERVIEW: {
    label: "Interview",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    dot: "bg-violet-400",
    icon: TrendingUp,
  },
  OFFER: {
    label: "Offer",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-400",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-400",
    icon: XCircle,
  },
} as const;

export function formatDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function getInitials(value?: string | null) {
  if (!value) return "??";
  return value
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getAccentHue(value?: string | null) {
  if (!value) return 220;
  const hues = [220, 260, 180, 140, 30, 300, 200, 0];
  return hues[value.charCodeAt(0) % hues.length];
}
