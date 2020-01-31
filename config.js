const PLACEHOLDER = "REPLACE_YOURS_HERE";
const oAuthClientID = process.env.OAUTH_CLIENT_ID;
const oAuthclientSecret = process.env.OAUTH_CLIENT_SECRET;

function isSet(env) {
  return env !== undefined && env !== "undefined" && env !== "";
}

const config = {
  oAuthClientID: isSet(oAuthClientID) ? oAuthClientID : PLACEHOLDER,
  oAuthclientSecret: isSet(oAuthclientSecret) ? oAuthclientSecret : PLACEHOLDER,
  oAuthCallbackUrl: "http://localhost:8080/auth/google/callback",
  port: 8080,
  scopes: ["profile"],
  apiEndpoint: "https://photoslibrary.googleapis.com"
};

function validate(config) {
  if (config.oAuthClientID === PLACEHOLDER) {
    console.info("throwing error");
    throw new Error(
      "Either set environment variable OAUTH_CLIENT_ID or set it in config.js"
    );
  }

  if (config.oAuthclientSecret === PLACEHOLDER) {
    throw new Error(
      "Either set environment variable OAUTH_CLIENT_SECRET or set it in config.js"
    );
  }

  return config;
}

module.exports = validate(config);
