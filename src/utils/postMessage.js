const postMessage = (type, content, origin = "*") => {
  window.parent.postMessage(
    {
      pluginMessage: {
        type,
        content,
      },
    },
    origin,
  );
};

export default postMessage;
