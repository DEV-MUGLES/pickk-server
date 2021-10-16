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
