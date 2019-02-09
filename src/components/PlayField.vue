<template>
  <div>
    <canvas id="canvas" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator"
import BoardConfigs from "../@types/BoardConfigs"
import Tetromino from "../@types/Tetromino"

@Component
export default class PlayField extends Vue {
  @Prop() configs!: BoardConfigs
  @Prop() tetromino!: Tetromino

  isBlockFilled!: boolean[][]
  colorBoard!: string[][]
  rotation: number = 0

  mounted(): void {
    const canvas: HTMLCanvasElement = document.getElementById(
      "canvas"
    ) as HTMLCanvasElement
    const context: CanvasRenderingContext2D = canvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D

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

    const unitWidth: number = canvas.width / this.configs.width
    const unitHeight: number = canvas.height / this.configs.height

    // draw grid
    context.strokeStyle = "gray"
    for (let y = 0; y < this.configs.height; y++) {
      for (let x = 0; x < this.configs.width; x++) {
        context.fillStyle = this.colorBoard[y][x]
        context.fillRect(x * unitWidth, y * unitHeight, unitWidth, unitHeight)
        context.strokeRect(x * unitWidth, y * unitHeight, unitWidth, unitHeight)
      }
    }

    const execCurrentTurn = (currentY: number, milliseconds: number): void => {
      const currentX: number = Math.floor(this.configs.width / 2)

      // draw tetromino
      context.fillStyle = this.tetromino.color
      for (const [dy, row] of this.tetromino.blocks[this.rotation].entries()) {
        for (const [dx, blockElement] of row.entries()) {
          if (blockElement != 0) {
            context.fillRect(
              (currentX + dx) * unitWidth,
              (currentY + dy) * unitHeight,
              unitWidth,
              unitHeight
            )
          }
        }
      }

      setTimeout(() => {
        // return if the tetromino can not move down any more
        for (const [dy, row] of this.tetromino.blocks[
          this.rotation
        ].entries()) {
          for (const [dx, blockElement] of row.entries()) {
            if (blockElement != 0) {
              if (this.isBlockFilled[currentY + dy + 1][currentX + dx]) return
            }
          }
        }

        // clear current tetromino
        for (const [dy, row] of this.tetromino.blocks[
          this.rotation
        ].entries()) {
          for (const [dx, blockElement] of row.entries()) {
            if (blockElement != 0) {
              context.clearRect(
                (currentX + dx) * unitWidth,
                (currentY + dy) * unitHeight,
                unitWidth,
                unitHeight
              )
              context.strokeRect(
                (currentX + dx) * unitWidth,
                (currentY + dy) * unitHeight,
                unitWidth,
                unitHeight
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
