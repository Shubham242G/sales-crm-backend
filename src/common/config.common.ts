// import * as dotenv from "dotenv";
// dotenv.config({ override: true });

/**
 * Create a .env.local file for secrets
 */
// dotenv.config({ path: ".env.local", override: true });
export const CONFIG = {
  PORT: process.env.PORT ? process.env.PORT : 3000,
  MONGOURI: process.env.MONGOURI ? process.env.MONGOURI : "",
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET ? process.env.JWT_ACCESS_TOKEN_SECRET : "qwertyuiop",
  ACCESS_TOKEN: process.env.ACCESS_TOKEN,
};


export const ZOOM_CONFIG = {
  ZOOM_OAUTH_ACCOUNT_ID: process.env.ZOOM_OAUTH_ACCOUNT_ID,
  ZOOM_OAUTH_CLIENT_ID: process.env.ZOOM_OAUTH_CLIENT_ID,
  ZOOM_OAUTH_CLIENT_SECRET: process.env.ZOOM_OAUTH_CLIENT_SECRET,
  ZOOM_MEETING_SDK_CLIENT_ID: process.env.ZOOM_MEETING_SDK_CLIENT_ID,
  ZOOM_MEETING_SDK_CLIENT_SECRET: process.env.ZOOM_MEETING_SDK_CLIENT_SECRET,
  ZOOM_BASE_URL: process.env.ZOOM_BASE_URL,
  ZOOM_OAUTH_ACCOUNT_ID_ZAK:process.env.ZOOM_OAUTH_ACCOUNT_ID_ZAK,
  ZOOM_OAUTH_CLIENT_ID_ZAK:process.env.ZOOM_OAUTH_CLIENT_ID_ZAK,
  ZOOM_OAUTH_CLIENT_SECRET_ZAK:process.env.ZOOM_OAUTH_CLIENT_SECRET_ZAK,
  ZOOM_EVENT_VERIFICATION_TOKEN: process.env.ZOOM_EVENT_VERIFICATION_TOKEN
}


export const BREVO = {
  KEY: process.env.BREVO_API_KEY
}
