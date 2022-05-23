export const validateAttachmentLink = (link: string) => {
  // the link is a valid link (e.g. https://media.giphy.com/media/26xBtnTEjWcGtceiY/giphy.gif)
  if (link.length <= 0) {
    return true;
  }
  if (link.match(/^https?:\/\/.*\.(gif|jpg|jpeg|tiff|png)$/)) {
    return true;
  }
};
