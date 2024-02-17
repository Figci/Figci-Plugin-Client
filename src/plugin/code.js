figma.showUI(__html__, { width: 400, height: 540 });

figma.ui.onmessage = async message => {
  if (message.type === "SAVE_ACCESS_TOKEN") {
    await figma.clientStorage.setAsync("accessToken", message.content);
  }
};
