export function url2key(imageUrl: string) {
  return new URL(imageUrl).pathname.slice(1);
}
