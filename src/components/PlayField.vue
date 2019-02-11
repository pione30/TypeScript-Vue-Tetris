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

  @Watch("tetromino")
  onTetrominoChange(newTetromino: Tetromino, oldTetromino: Tetromino): void {
    const execCurrentTurn = (currentY: number, milliseconds: number): void => {
      const currentX: number = Math.floor(this.configs.width / 2)

      // draw tetromino
      this.context.fillStyle = newTetromino.color
      for (const [dy, row] of newTetromino.blocks[this.rotation].entries()) {
        for (const [dx, blockElement] of row.entries()) {
          if (blockElement != 0) {
            this.context.fillRect(
              (currentX + dx) * this.unitWidth,
              (currentY + dy) * this.unitHeight,
              this.unitWidth,
              this.unitHeight
            )
          }
        }
      }

      setTimeout(() => {
        // return if the tetromino can not move down any more
        for (const [dy, row] of newTetromino.blocks[this.rotation].entries()) {
          for (const [dx, blockElement] of row.entries()) {
            if (blockElement != 0) {
              if (this.isBlockFilled[currentY + dy + 1][currentX + dx]) {
                this.$emit("tetromino-grounded")
                return
              }
            }
          }
        }

        // clear current tetromino
        for (const [dy, row] of newTetromino.blocks[this.rotation].entries()) {
          for (const [dx, blockElement] of row.entries()) {
            if (blockElement != 0) {
              this.context.clearRect(
                (currentX + dx) * this.unitWidth,
                (currentY + dy) * this.unitHeight,
                this.unitWidth,
                this.unitHeight
              )
              this.context.strokeRect(
                (currentX + dx) * this.unitWidth,
                (currentY + dy) * this.unitHeight,
                this.unitWidth,
                this.unitHeight
              )
            }
          }
        }

        execCurrentTurn(currentY + 1, milliseconds)
      }, milliseconds)
    }
    execCurrentTurn(1, 1000)
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
