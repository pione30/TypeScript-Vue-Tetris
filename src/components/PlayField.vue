<template>
  <div>
    <canvas id="canvas" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator"
import BoardConfigs from "../@types/BoardConfigs"
import Tetromino from "../@types/Tetromino"

@Component
export default class PlayField extends Vue {
  @Prop() configs!: BoardConfigs
  @Prop() tetromino!: Tetromino

  isBlockFilled!: boolean[][]
  colorBoard!: string[][]
  rotation: number = 0

  canvas!: HTMLCanvasElement
  context!: CanvasRenderingContext2D

  unitWidth!: number
  unitHeight!: number

  currentX: number = Math.floor(this.configs.width / 2) - 1
  currentY: number = 1

  mounted(): void {
    // initialize the board
    this.isBlockFilled = Array.from(new Array(this.configs.height), () =>
      new Array(this.configs.width).fill(false)
    )
    this.colorBoard = Array.from(new Array(this.configs.height), () =>
      new Array(this.configs.width).fill("white")
    )
    for (let x = 0; x < this.configs.width; x++) {
      this.isBlockFilled[0][x] = true
      this.isBlockFilled[this.configs.height - 1][x] = true

      this.colorBoard[0][x] = "black"
      this.colorBoard[this.configs.height - 1][x] = "black"
    }
    for (let y = 0; y < this.configs.height; y++) {
      this.isBlockFilled[y][0] = true
      this.isBlockFilled[y][this.configs.width - 1] = true

      this.colorBoard[y][0] = "black"
      this.colorBoard[y][this.configs.width - 1] = "black"
    }

    this.canvas = document.getElementById("canvas") as HTMLCanvasElement
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D
    this.unitWidth = this.canvas.width / this.configs.width
    this.unitHeight = this.canvas.height / this.configs.height

    // draw grid
    this.context.strokeStyle = "gray"
    for (let y = 0; y < this.configs.height; y++) {
      for (let x = 0; x < this.configs.width; x++) {
        this.context.fillStyle = this.colorBoard[y][x]
        this.context.fillRect(
          x * this.unitWidth,
          y * this.unitHeight,
          this.unitWidth,
          this.unitHeight
        )
        this.context.strokeRect(
          x * this.unitWidth,
          y * this.unitHeight,
          this.unitWidth,
          this.unitHeight
        )
      }
    }
  }

  drawTetromino(): void {
    this.context.fillStyle = this.tetromino.color
    for (const [dy, row] of this.tetromino.blocks[this.rotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          this.context.fillRect(
            (this.currentX + dx) * this.unitWidth,
            (this.currentY + dy) * this.unitHeight,
            this.unitWidth,
            this.unitHeight
          )
        }
      }
    }
  }

  clearTetromino(): void {
    for (const [dy, row] of this.tetromino.blocks[this.rotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          this.context.clearRect(
            (this.currentX + dx) * this.unitWidth,
            (this.currentY + dy) * this.unitHeight,
            this.unitWidth,
            this.unitHeight
          )
          this.context.strokeRect(
            (this.currentX + dx) * this.unitWidth,
            (this.currentY + dy) * this.unitHeight,
            this.unitWidth,
            this.unitHeight
          )
        }
      }
    }
  }

  @Watch("tetromino")
  onTetrominoChange(newTetromino: Tetromino, oldTetromino: Tetromino): void {
    const execCurrentTurn = (milliseconds: number): Promise<string> =>
      new Promise((resolve, reject) => {
        this.drawTetromino()

        setTimeout(() => {
          // return if the tetromino can not move down any more
          for (const [dy, row] of newTetromino.blocks[this.rotation].entries()) {
            for (const [dx, blockElement] of row.entries()) {
              if (blockElement != 0) {
                if (this.isBlockFilled[this.currentY + dy + 1][this.currentX + dx]) {
                  // fill isBlockFilled with current tetromino
                  for (const [tmpdy, tmprow] of newTetromino.blocks[this.rotation].entries()) {
                    for (const [tmpdx, tmpblockElement] of tmprow.entries()) {
                      if (tmpblockElement != 0) {
                        this.isBlockFilled[this.currentY + tmpdy][this.currentX + tmpdx] = true
                      }
                    }
                  }
                  resolve("grounded")
                  return
                }
              }
            }
          }

          this.clearTetromino()

          this.currentY++
          execCurrentTurn(milliseconds)
            .then(() => {
              resolve("grounded")
            })
            .catch(() => {
              console.error("Something went wrong")
            })
        }, milliseconds)
      })

    this.currentX = Math.floor(this.configs.width / 2) - 1
    this.currentY = 1
    execCurrentTurn(1000)
      .then(() => {
        this.$emit("tetromino-grounded")
      })
      .catch(() => {
        console.error("Something went wrong")
      })
  }
}
</script>

<style>
canvas {
  position: relative;
  width: 100;
  height: 50;
}
</style>
