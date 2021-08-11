/** Add comma to numbers every three digits */
export function addCommas(n: number): string {
  if (n === null || n === undefined) {
    return '';
  }

  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
