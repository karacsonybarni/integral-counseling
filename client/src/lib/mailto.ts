export const THERAPIST_EMAIL = "karacsony.barni@gmail.com";

interface EmailDraftOptions {
  recipient?: string;
  subject: string;
  bodyLines: Array<string | undefined>;
}

export function openEmailDraft({
  recipient = THERAPIST_EMAIL,
  subject,
  bodyLines,
}: EmailDraftOptions) {
  if (typeof window === "undefined") {
    throw new Error("Email drafts can only be opened in the browser.");
  }

  const body = bodyLines
    .filter((line): line is string => line !== undefined)
    .join("\n");

  const mailtoUrl =
    `mailto:${recipient}?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  window.location.href = mailtoUrl;
}
