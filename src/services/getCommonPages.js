import generateApiUri from "../utils/generateURI";

const getCommonPages = async (
  projectKey,
  beforeVersion,
  afterVersion,
  token,
) => {
  const baseURI = import.meta.env.VITE_BACKEND_BASE_API_URI;

  const queryParams = {
    "before-version": beforeVersion,
    "after-version": afterVersion,
  };

  const API_URI = generateApiUri(
    baseURI,
    `projects/${projectKey}/pages`,
    queryParams,
  );

  const response = await fetch(API_URI, {
    method: "GET",
    headers: {
      authorization: token,
    },
  });

  const responseResult = await response.json();

  return responseResult;
};

export default getCommonPages;
