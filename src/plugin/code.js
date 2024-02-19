figma.showUI(__html__, { width: 400, height: 540 });

figma.ui.onmessage = async message => {
  if (message.type === "SAVE_ACCESS_TOKEN") {
    await figma.clientStorage.setAsync("accessToken", message.content);
  }

  if (message.type === "GET_ACCESS_TOKEN") {
    const accessToken = await figma.clientStorage.getAsync("accessToken");

    figma.ui.postMessage({
      type: "GET_ACCESS_TOKEN",
      content: accessToken,
    });
  }

  if (message.type === "GET_PROJECT_KEY") {
    const projectKey = figma.fileKey;

    figma.ui.postMessage({
      type: "GET_PROJECT_KEY",
      content: projectKey,
    });
  }

  if (message.type === "GET_CURRENT_PAGE_ID") {
    const currentPageId = figma.currentPage.id;

    figma.ui.postMessage({
      type: "GET_CURRENT_PAGE_ID",
      content: currentPageId,
    });
  }

  if (message.type === "GET_NEW_VERSION_ID") {
    const newVersionId = await figma.saveVersionHistoryAsync(
      new Date().toISOString().split("T").join(" "),
    );

    figma.ui.postMessage({
      type: "GET_NEW_VERSION_ID",
      content: newVersionId,
    });
  }
};
