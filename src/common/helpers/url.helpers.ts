const urlRegex = /^https?:\/\/([^\s$.?#].[^\s]*)$/;
const urlWithoutProtocolRegex = /^([^\s$.?#].[^\s]*)$/;

const isUrlString = (str: string): boolean => {
  if (!str) {
    return false;
  }

  return urlRegex.test(str);
};

export const addHttpTo = (url: string): string | null => {
  if (isUrlString(url)) {
    return url;
  }

  return urlWithoutProtocolRegex.test(url) ? `http://${url}` : null;
};

export const removeProtocolFrom = (url: string): string | null => {
  if (!isUrlString(url)) {
    return null;
  }

  return urlRegex.exec(url)[1];
};
