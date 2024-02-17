import generateApiUri from "../utils/generateURI";

const clientId = import.meta.env.VITE_FIGMA_CLIENT_ID;
const figmaURI = import.meta.env.VITE_FIGMA_BASE_API_URI;
const serverURI = import.meta.env.VITE_BACKEND_BASE_API_URI;
const redirectURI = import.meta.env.VITE_FIGMA_REDIRECT_URI;
const oAuthState = import.meta.env.VITE_FIGMA_OAUTH_STATE;

const openAuth = () => {
  const queryParams = {
    client_id: clientId,
    redirect_uri: redirectURI,
    scope: "files:read",
    state: oAuthState,
    response_type: "code",
  };

  const API_URI = generateApiUri(figmaURI, "oauth", queryParams);

  window.open(API_URI);
};

const getToken = async () => {
  const API_URI = generateApiUri(serverURI, "oauth/accesstoken");

  const response = await fetch(API_URI, { method: "GET" });
  const { accessToken } = await response.json();

  return accessToken;
};

export { openAuth, getToken };
