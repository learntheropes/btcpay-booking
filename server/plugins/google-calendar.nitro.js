import { google } from 'googleapis';

export default defineNitroPlugin((nitroApp) => {
  const {
    googleServiceAccountEmail,
    googleServiceAccountPrivateKey,
  } = useRuntimeConfig();

  const auth = new google.auth.JWT({
    email: googleServiceAccountEmail,
    key: googleServiceAccountPrivateKey.replace(/\\n/g, '\n'),
    scopes: [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar',
    ],
  });

  const calendar = google.calendar({ version: 'v3', auth });

  nitroApp.calendar = calendar;
});