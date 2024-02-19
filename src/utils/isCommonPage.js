const isCommonPage = (commonPageList, targetPageId) => {
  for (const { pageId } of commonPageList) {
    if (pageId === targetPageId) {
      return true;
    }
  }

  return false;
};

export default isCommonPage;
