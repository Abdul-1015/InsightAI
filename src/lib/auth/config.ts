import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET, SITE_URL } from "astro:env/server";
import { Google } from "arctic";

export const BASE_URL = SITE_URL;

export const google = new Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  `${BASE_URL}/api/auth/google/callback`
);

export { SESSION_SECRET };

export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
