import { isURL } from 'class-validator';
import path from 'path';

export const getDirname = (input: string): string => {
  if (!input) {
    return '';
  }

  const url = new URL(input);

  const hostname = url.hostname;
  const pathname = path.extname(url.pathname)
    ? url.pathname.slice(0, url.pathname.lastIndexOf('/'))
    : url.pathname;

  return hostname + pathname;
};

export const merge = (a: string, b: string): string => {
  if (!isURL(a) || !b) {
    return '';
  }

  const url = new URL(a);

  const { protocol, hostname } = url;

  if (!b.match(/^\./)) {
    return protocol + '//' + hostname + b;
  }

  const pathname = path.extname(url.pathname)
    ? url.pathname.slice(0, url.pathname.lastIndexOf('/'))
    : url.pathname;

  return protocol + '//' + path.normalize(hostname + pathname + '/' + b);
};
