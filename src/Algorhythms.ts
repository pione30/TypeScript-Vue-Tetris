// Fisher–Yates shuffle algorithm
export const shuffle = function(array: number[]): number[] {
  for (let i: number = array.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
