# GitHub Pages Form Handler Setup

This repository is configured to keep the website on GitHub Pages and send form submissions through a Google Apps Script web app.

## Existing Apps Script URLs

- Project editor: https://script.google.com/home/projects/1qHNojJ5rFOp0avlvqYrER06mX78zNrqIuQ4bKBFjz5dmnca5yc9L3Qnr/edit
- Production web app: https://script.google.com/macros/s/AKfycbztbd9BZ55jNSTu4TIGgwk4mvIHteoyPhiB_qbzvRl4MM7T5XYq1axQNxhbudFutvht/exec
- Version 5 library: https://script.google.com/macros/library/d/1qHNojJ5rFOp0avlvqYrER06mX78zNrqIuQ4bKBFjz5dmnca5yc9L3Qnr/5

## What this does

- The React site stays fully static on GitHub Pages.
- The appointment picker reads free times from the Google Calendar connected to the Apps Script project.
- Calendar event titles and details stay server-side; the website receives only available start times.
- Apps Script rechecks the selected time under a script lock, creates the 55-minute event, and sends the visitor a Google Calendar invitation.
- The contact form and appointment booking post to the same Google Apps Script web app.
- Apps Script sends a notification email to the configured recipient.
- The email `replyTo` is set to the visitor's email address.

## Files to use

- Apps Script server code: [`apps-script/Code.gs`](apps-script/Code.gs)
- Apps Script manifest: [`apps-script/appsscript.json`](apps-script/appsscript.json)

## Deploy the Apps Script web app

1. Create a new standalone Google Apps Script project while signed in as the calendar owner.
2. Replace the default script content with [`apps-script/Code.gs`](apps-script/Code.gs).
3. Replace the manifest with [`apps-script/appsscript.json`](apps-script/appsscript.json).
4. Save the project.
5. Open `Deploy -> New deployment`.
6. Choose deployment type `Web app`.
7. Set `Execute as` to `Me`.
8. Set `Who has access` to `Anyone`.
9. Authorize the script when prompted.
10. Copy the deployed `/exec` URL.

The added Calendar permission is required to read busy periods and create booked events. Existing deployments must be redeployed and authorized again after this change.

For the existing web app, replace both files in the Apps Script editor, then open `Deploy -> Manage deployments`, edit the active web-app deployment, choose `New version`, and deploy it. Editing the existing deployment keeps its `/exec` URL. Authorize the new Calendar permission when prompted.

Deploy the Apps Script update before merging the frontend PR; until the backend is updated, the new picker will show its safe calendar-unavailable state.

## Configure booking availability

The defaults at the top of `apps-script/Code.gs` are:

- Primary Google Calendar (`BOOKING_CALENDAR_ID` is empty).
- Monday to Friday, 09:00–12:00 and 13:00–18:00 in `Europe/Budapest`.
- 55-minute sessions starting every 30 minutes.
- At least 24 hours' notice.
- The next 14 dates with free times, within a 60-day horizon.

To use another calendar, set `BOOKING_CALENDAR_ID` to its calendar ID. Adjust `WORKING_WINDOWS` and the other booking constants before redeploying if the defaults do not match your schedule.

## Connect GitHub Pages to the web app

For local development, create `.env.local` in the repo root:

```bash
VITE_APPS_SCRIPT_WEB_APP_URL="https://script.google.com/macros/s/REPLACE_ME/exec"
```

This repository currently includes the deployed web app URL as the default production endpoint. If you redeploy the Apps Script and get a new `/exec` URL, you can override it with a repository variable:

1. Open the GitHub repository settings.
2. Go to `Secrets and variables -> Actions -> Variables`.
3. Add `VITE_APPS_SCRIPT_WEB_APP_URL`.
4. Paste the same `/exec` URL as the value.

The GitHub Pages workflow reads that variable during `npm run build`.

## Deploy after configuration

After the variable is set:

1. Push any commit to `main`, or
2. Run the `Deploy to GitHub Pages` workflow manually from GitHub Actions.

## Manual checks

1. Confirm an existing Google Calendar event marked as busy removes every overlapping 55-minute slot from the website.
2. Confirm an event marked as available does not remove overlapping slots.
3. Book a free time using a test email address.
4. Confirm the event appears in the configured Google Calendar and the test address receives an invitation.
5. Open the site in a second browser and confirm the booked time is no longer available.
6. Confirm a notification email arrives at the configured recipient.

## Important limitations

- The Apps Script endpoint URL is public. It is not a secret.
- The current implementation includes only light spam filtering (honeypot plus minimum submission time).
- If spam becomes a problem, add a stronger verification layer before the Apps Script endpoint.
