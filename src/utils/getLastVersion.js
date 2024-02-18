const getLastVersion = (allDates, byDates) => {
  const lastDate = allDates[0];
  let lastVersionId = null;

  if (byDates[lastDate]) {
    for (const versionId in byDates[lastDate]) {
      const version = byDates[lastDate][versionId];

      if (
        !lastVersionId ||
        new Date(version.createdAt) > new Date(lastVersionId.createdAt)
      ) {
        lastVersionId = versionId;
      }
    }
  }

  return { afterDate: lastDate, afterVersion: lastVersionId };
};

export default getLastVersion;
