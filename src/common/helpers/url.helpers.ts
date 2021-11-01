const urlRegex = /^https?:\/\/([^\s$.?#].[^\s]*)$/;
const urlWithoutProtocolRegex = /^([^\s$.?#].[^\s]*)$/;

const isUrlString = (str: string) => {
  if (!str) {
    return false;
  }

  return urlRegex.test(str);
};

export const parse2UrlString = (str: string) => {
  if (isUrlString(str)) {
    return str;
  }

  return urlWithoutProtocolRegex.test(str) ? `http://${str}` : null;
};

export const removeProtocolFrom = (url: string) => {
  if (!isUrlString(url)) {
    return null;
  }

  return urlRegex.exec(url)[1];
};
