import { CheckCircle2 } from "lucide-react";

interface SubmissionSuccessMessageProps {
  title: string;
  description: string;
}

export default function SubmissionSuccessMessage({
  title,
  description,
}: SubmissionSuccessMessageProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="flex gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100"
      data-testid="submission-success-message"
    >
      <CheckCircle2
        className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-300"
        aria-hidden="true"
      />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
          {description}
        </p>
      </div>
    </div>
  );
}
