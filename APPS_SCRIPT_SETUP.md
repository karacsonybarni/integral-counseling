# GitHub Pages Form Handler Setup

This repository is configured to keep the website on GitHub Pages and send form submissions through a Google Apps Script web app.

## What this does

- The React site stays fully static on GitHub Pages.
- The appointment and contact forms post to a Google Apps Script web app.
- Apps Script sends an email from `karacsony.barni@gmail.com` to `karacsony.barni@gmail.com`.
- The email `replyTo` is set to the visitor's email address.

## Files to use

- Apps Script server code: [`apps-script/Code.gs`](/home/kbarna/VSCodeProjects/integral-counseling/apps-script/Code.gs)
- Apps Script manifest: [`apps-script/appsscript.json`](/home/kbarna/VSCodeProjects/integral-counseling/apps-script/appsscript.json)

## Deploy the Apps Script web app

1. Create a new standalone Google Apps Script project while signed in as `karacsony.barni@gmail.com`.
2. Replace the default script content with [`apps-script/Code.gs`](/home/kbarna/VSCodeProjects/integral-counseling/apps-script/Code.gs).
3. Replace the manifest with [`apps-script/appsscript.json`](/home/kbarna/VSCodeProjects/integral-counseling/apps-script/appsscript.json).
4. Save the project.
5. Open `Deploy -> New deployment`.
6. Choose deployment type `Web app`.
7. Set `Execute as` to `Me`.
8. Set `Who has access` to `Anyone`.
9. Authorize the script when prompted.
10. Copy the deployed `/exec` URL.

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

1. Submit an appointment request on the live site.
2. Confirm an email arrives in `karacsony.barni@gmail.com`.
3. Reply to that email and confirm the reply goes to the visitor's email address.
4. Submit the contact form and verify the same behavior.

## Important limitations

- The Apps Script endpoint URL is public. It is not a secret.
- The current implementation includes only light spam filtering (honeypot plus minimum submission time).
- If spam becomes a problem, add a stronger verification layer before the Apps Script endpoint.
