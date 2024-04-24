figma.showUI(__html__, { width: 400, height: 540 });

const differenceRectangleList = [];

const CONSTANTS = {
  MODIFIED_FILLS: {
    type: "SOLID",
    color: { r: 1, g: 0.419, b: 0 },
    opacity: 0.000001,
  },
  MODIFIED_STROKES: {
    type: "SOLID",
    color: { r: 1, g: 0.419, b: 0 },
    opacity: 0.6,
  },
  NEW_FILLS: {
    type: "SOLID",
    color: { r: 0.129, g: 0.8, b: 0.239 },
    opacity: 0.000001,
  },
  NEW_STROKES: {
    type: "SOLID",
    color: { r: 0.129, g: 0.8, b: 0.239 },
    opacity: 1,
  },
  MIN_SIZE_VALUE: 1,
  TIME_GAP_MS: 9 * 60 * 60 * 1000,
  PAGINATION: {
    INDEX_INCREASE: 1,
    INDEX_DECREASE: -1,
  },
};

const isOwnProperty = (targetObject, targetProperty) => {
  return Object.prototype.hasOwnProperty.call(targetObject, targetProperty);
};

const isIncludeId = selectedNode => {
  for (const rectangleNode of differenceRectangleList) {
    if (rectangleNode.id === selectedNode.id) {
      return true;
    }
  }

  return false;
};

const getNodeIndex = selectedNode => {
  return differenceRectangleList.findIndex(
    rectangleNode => rectangleNode.id === selectedNode.id,
  );
};

const focusScreen = async (nodeIndex = 0) => {
  const targetNode = differenceRectangleList[nodeIndex];

  figma.viewport.scrollAndZoomIntoView([targetNode]);
  figma.currentPage.selection = [targetNode];
};

const renderDifferenceRectangle = (differences, modifiedFrames) => {
  for (const nodeId in differences) {
    if (isOwnProperty(differences, nodeId)) {
      const modifiedNode = differences[nodeId];
      const { type, differenceInformation, frameId } = modifiedNode;
      const { x, y, width, height } = modifiedNode.position;

      const differenceRectangle = figma.createRectangle();

      differenceRectangle.name = "Difference Rectangle Node";
      differenceRectangle.resize(
        width + 6 || CONSTANTS.MIN_SIZE_VALUE,
        height + 6 || CONSTANTS.MIN_SIZE_VALUE,
      );
      differenceRectangle.x = x - 3;
      differenceRectangle.y = y - 3;

      switch (type) {
        case "NEW":
          differenceRectangle.fills = [CONSTANTS.NEW_FILLS];
          differenceRectangle.strokes = [CONSTANTS.NEW_STROKES];
          differenceRectangle.strokeWeight = 3;
          differenceRectangle.strokeAlign = "OUTSIDE";
          differenceRectangle.setPluginData(
            "differenceInformation",
            "New element, not in the previous version!",
          );

          break;
        case "MODIFIED":
          differenceRectangle.fills = [CONSTANTS.MODIFIED_FILLS];
          differenceRectangle.strokes = [CONSTANTS.MODIFIED_STROKES];
          differenceRectangle.strokeWeight = 3;
          differenceRectangle.strokeAlign = "OUTSIDE";
          differenceRectangle.setPluginData(
            "differenceInformation",
            JSON.stringify(differenceInformation),
          );

          break;
        default:
          break;
      }

      differenceRectangleList.push(differenceRectangle);

      modifiedFrames[frameId].isNew = false;
    }
  }

  for (const frameId in modifiedFrames) {
    if (isOwnProperty(modifiedFrames, frameId)) {
      if (modifiedFrames[frameId].isNew) {
        const differenceRectangle = figma.createRectangle();
        const { x, y, width, height } = modifiedFrames[frameId];

        differenceRectangle.name = "Difference Rectangle Node";
        differenceRectangle.resize(width + 6, height + 6);
        differenceRectangle.x = x - 3;
        differenceRectangle.y = y - 3;
        differenceRectangle.fills = [CONSTANTS.NEW_FILLS];
        differenceRectangle.strokes = [CONSTANTS.NEW_STROKES];
        differenceRectangle.strokeWeight = 3;
        differenceRectangle.strokeAlign = "OUTSIDE";
        differenceRectangle.setPluginData(
          "differenceInformation",
          "New frame, absent in the previous version!",
        );

        differenceRectangleList.push(differenceRectangle);
      }
    }
  }

  differenceRectangleList.reverse();
};

const clearRectangleNode = () => {
  for (const rectangleNode of differenceRectangleList) {
    rectangleNode.remove();
  }

  differenceRectangleList.length = 0;
};

const formatTime = dateString => {
  const currentDate = new Date(dateString);
  const utcMS =
    currentDate.getTime() + currentDate.getTimezoneOffset() * 60 * 1000;

  const koreaTime = new Date(utcMS + CONSTANTS.TIME_GAP_MS);

  const year = koreaTime.getFullYear();
  const month = koreaTime.getMonth() + 1;
  const date = koreaTime.getDate();

  const hour = koreaTime.getHours();
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  const minutes =
    koreaTime.getMinutes() < 10
      ? `0${koreaTime.getMinutes()}`
      : koreaTime.getMinutes();

  const formattedDate = `${year}-${month}-${date}`;
  const formattedTime = `${formattedHour}:${minutes} ${ampm}`;

  return { formattedDate, formattedTime };
};

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

  if (message.type === "GET_CURRENT_PAGE_ID") {
    const currentPageId = figma.currentPage.id;

    figma.ui.postMessage({
      type: "GET_CURRENT_PAGE_ID",
      content: currentPageId,
    });
  }

  if (message.type === "GET_NEW_VERSION_ID") {
    const currentDateString = new Date().toISOString();
    const { formattedTime: createdTime } = formatTime(currentDateString);

    const newVersionId = await figma.saveVersionHistoryAsync(createdTime);

    figma.ui.postMessage({
      type: "GET_NEW_VERSION_ID",
      content: newVersionId,
    });
  }

  if (message.type === "POST_DIFFING_RESULT") {
    const { differences, modifiedFrames } = message.content;

    clearRectangleNode();

    renderDifferenceRectangle(differences, modifiedFrames);

    await focusScreen();
  }

  if (message.type === "PAGINATION_BUTTON") {
    const currentSelection = figma.currentPage.selection[0];
    const differencesLength = differenceRectangleList.length;

    if (currentSelection && isIncludeId(currentSelection)) {
      const currentIndex = getNodeIndex(currentSelection);

      let nextIndex;

      if (message.content === "prev") {
        nextIndex =
          (currentIndex +
            CONSTANTS.PAGINATION.INDEX_DECREASE +
            differencesLength) %
          differencesLength;
      } else {
        nextIndex =
          (currentIndex + CONSTANTS.PAGINATION.INDEX_INCREASE) %
          differencesLength;
      }

      await focusScreen(nextIndex);

      return;
    }

    await focusScreen();
  }
};

figma.on("selectionchange", () => {
  const currentSelection = figma.currentPage.selection[0];

  if (!currentSelection) {
    return;
  }

  const differencesLength = differenceRectangleList.length;

  if (isIncludeId(currentSelection)) {
    const differenceInformation = currentSelection.getPluginData(
      "differenceInformation",
    );

    const currentFrameIndex = getNodeIndex(currentSelection) + 1;

    figma.ui.postMessage({
      type: "FRAME_PAGINATION",
      content: {
        result: true,
        currentCount: currentFrameIndex,
        frameCounts: differencesLength,
      },
    });

    figma.ui.postMessage({
      type: "RENDER_DIFFERENCE_INFORMATION",
      content: { differenceInformation },
    });

    return;
  }

  figma.ui.postMessage({
    type: "RENDER_DIFFERENCE_INFORMATION",
    content: "UNCHANGED_NODE",
  });

  if (differencesLength) {
    figma.ui.postMessage({
      type: "FRAME_PAGINATION",
      content: {
        result: true,
        currentCount: 0,
        frameCounts: differencesLength,
      },
    });

    return;
  }

  figma.ui.postMessage({
    type: "FRAME_PAGINATION",
    content: {
      result: false,
      frameCounts: "- / -",
    },
  });
});

figma.on("currentpagechange", () => {
  const currentPageId = figma.currentPage.id;

  clearRectangleNode();

  figma.ui.postMessage({
    type: "CHANGED_CURRENT_PAGE_ID",
    content: currentPageId,
  });
});

figma.on("close", () => {
  clearRectangleNode();
});
