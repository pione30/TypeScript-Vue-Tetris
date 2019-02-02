<template>
  <div>
    <canvas id="canvas" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator"
import BoardConfigs from "../@types/BoardConfigs"

@Component
export default class PlayField extends Vue {
  @Prop() configs!: BoardConfigs

  isBlockFilled!: boolean[][]
  colorBoard!: string[][]

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
      context.fillStyle = "green"
      context.fillRect(
        currentX * unitWidth,
        currentY * unitHeight,
        unitWidth,
        unitHeight
      )

      setTimeout(() => {
        if (!this.isBlockFilled[currentY + 1][currentX]) {
          context.clearRect(
            currentX * unitWidth,
            currentY * unitHeight,
            unitWidth,
            unitHeight
          )
          context.strokeRect(
            currentX * unitWidth,
            currentY * unitHeight,
            unitWidth,
            unitHeight
          )
          execCurrentTurn(currentY + 1, milliseconds)
        }
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
