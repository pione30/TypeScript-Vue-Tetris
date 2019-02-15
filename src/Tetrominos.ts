import Tetromino from "./@types/Tetromino"
export const Tetrominos: Tetromino[] = [
  {
    name: "I",
    color: "red",
    blocks: [[[1, 1, 1, 1]], [[1], [1], [1], [1]]]
  },

  {
    name: "O",
    color: "gold",
    blocks: [[[1, 1], [1, 1]]]
  },

  {
    name: "S",
    color: "magenta",
    blocks: [[[0, 1, 1], [1, 1, 0]], [[1, 0], [1, 1], [0, 1]]]
  },

  {
    name: "Z",
    color: "lawngreen",
    blocks: [[[1, 1, 0], [0, 1, 1]], [[0, 1], [1, 1], [1, 0]]]
  },

  {
    name: "J",
    color: "blue",
    blocks: [
      [[1, 1, 1], [0, 0, 1]],
      [[1, 1], [1, 0], [1, 0]],
      [[1, 0, 0], [1, 1, 1]],
      [[0, 1], [0, 1], [1, 1]]
    ]
  },

  {
    name: "L",
    color: "darkorange",
    blocks: [
      [[1, 1, 1], [1, 0, 0]],
      [[1, 0], [1, 0], [1, 1]],
      [[0, 0, 1], [1, 1, 1]],
      [[1, 1], [0, 1], [0, 1]]
    ]
  },

  {
    name: "T",
    color: "deepskyblue",
    blocks: [
      [[1, 1, 1], [0, 1, 0]],
      [[1, 0], [1, 1], [1, 0]],
      [[0, 1, 0], [1, 1, 1]],
      [[0, 1], [1, 1], [0, 1]]
    ]
  }
]
