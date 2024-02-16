const getProjectKeyFromURI = projectURI => {
  const urlObject = new URL(projectURI);
  const urlPathList = urlObject.pathname.split("/").filter(part => part !== "");
  const projectKey = urlPathList[1];

  return projectKey;
};

export default getProjectKeyFromURI;
