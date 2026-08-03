import { AlertCircle } from "lucide-react";

interface SubmissionErrorMessageProps {
  title: string;
  description: string;
  email: string;
  emailAction: string;
}

export default function SubmissionErrorMessage({
  title,
  description,
  email,
  emailAction,
}: SubmissionErrorMessageProps) {
  return (
    <div
      role="alert"
      aria-atomic="true"
      className="flex gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-foreground"
      data-testid="submission-error-message"
    >
      <AlertCircle
        className="mt-0.5 h-5 w-5 shrink-0 text-destructive"
        aria-hidden="true"
      />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm">{description}</p>
        <a
          href={`mailto:${email}`}
          className="mt-2 inline-flex min-h-11 items-center rounded-sm font-medium text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {emailAction}
        </a>
      </div>
    </div>
  );
}
