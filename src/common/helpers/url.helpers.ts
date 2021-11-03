import { isURL } from 'class-validator';

const httpRegex = /^https?:\/\/([^\s$.?#].[^\s]*)$/;

export const addHttpTo = (url: string) => {
  if (!isURL(url)) {
    return null;
  }
  if (isURL(url, { require_protocol: true })) {
    return url;
  }

  return `http://${url}`;
};

export const removeProtocolFrom = (url: string) => {
  if (!isURL(url)) {
    return null;
  }
  if (!isURL(url, { require_protocol: true })) {
    return url;
  }

  return httpRegex.exec(url)[1];
};
