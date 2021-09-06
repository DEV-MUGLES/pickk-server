export function parseToImageKey(imageUrl: string) {
  return new URL(imageUrl).pathname.slice(1);
}
