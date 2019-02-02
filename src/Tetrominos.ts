import Tetrimino from "./Tetrimino"
export const Tetriminos: Tetrimino[] = [
  {
    name: "I",
    color: "red",
    blocks: [[[1, 1, 1, 1]], [[1], [1], [1], [1]]]
  },

  {
    name: "O",
    color: "yellow",
    blocks: [[[1, 1], [1, 1]]]
  },

  {
    name: "S",
    color: "hotpink",
    blocks: [[[0, 1, 1], [1, 1, 0]], [[1, 0], [1, 1], [0, 1]]]
  },

  {
    name: "Z",
    color: "greenyellow",
    blocks: [[[1, 1, 0], [0, 1, 1]], [[0, 1], [1, 1], [1, 0]]]
  },

  {
    name: "J",
    color: "blue",
    blocks: [
      [[1, 0, 0], [1, 1, 1]],
      [[0, 1], [0, 1], [1, 1]],
      [[1, 1, 1], [0, 0, 1]],
      [[1, 1], [1, 0], [1, 0]]
    ]
  },

  {
    name: "L",
    color: "orange",
    blocks: [
      [[0, 0, 1], [1, 1, 1]],
      [[1, 1], [0, 1], [0, 1]],
      [[1, 1, 1], [1, 0, 0]],
      [[1, 0], [1, 0], [1, 1]]
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
