<template>
  <div id="hold-canvas-container">
    <canvas id="hold-canvas" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator"
import { Tetrominos } from "../Tetrominos"

@Component
export default class Hold extends Vue {
  @Prop() holdTetrominoIndex!: number

  canvas!: HTMLCanvasElement
  context!: CanvasRenderingContext2D
  unitWidth!: number
  unitHeight!: number
  canvasBlockWidth: number = 5
  canvasBlockHeightPerTetromino: number = 4
  canvasTextBlockHeight: number = 1

  mounted(): void {
    const canvasContainer: HTMLElement = document.getElementById(
      "hold-canvas-container"
    ) as HTMLElement
    this.canvas = document.getElementById("hold-canvas") as HTMLCanvasElement
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D

    this.canvas.width = canvasContainer.clientWidth
    this.canvas.height = canvasContainer.clientHeight
    this.unitWidth = this.canvas.width / this.canvasBlockWidth
    this.unitHeight =
      this.canvas.height / (this.canvasTextBlockHeight + this.canvasBlockHeightPerTetromino)

    this.context.font = "25px sans-serif"
    this.context.textAlign = "center"
    this.context.fillText("HOLD", this.canvas.width / 2, this.unitHeight / 2)

    this.context.strokeStyle = "lightgray"
    this.context.strokeRect(
      0,
      this.canvasTextBlockHeight * this.unitHeight,
      this.canvas.width,
      this.canvas.height
    )
  }

  drawHoldTetromino(): void {
    // clear out current mino
    this.context.clearRect(
      0,
      this.canvasTextBlockHeight * this.unitHeight,
      this.canvas.width,
      this.canvas.height
    )
    this.context.strokeRect(
      0,
      this.canvasTextBlockHeight * this.unitHeight,
      this.canvas.width,
      this.canvas.height
    )

    const rotation = 0
    const adjustX: number =
      (this.canvasBlockWidth - Tetrominos[this.holdTetrominoIndex].blocks[rotation][0].length) / 2
    const adjustY: number = this.canvasTextBlockHeight + 1

    for (const [dy, row] of Tetrominos[this.holdTetrominoIndex].blocks[rotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          this.context.fillStyle = Tetrominos[this.holdTetrominoIndex].color
          this.context.fillRect(
            (adjustX + dx) * this.unitWidth,
            (adjustY + dy) * this.unitHeight,
            this.unitWidth,
            this.unitHeight
          )
        }
      }
    }
  }
}
</script>

<style>
#hold-canvas-container {
  position: relative;
  margin: 40px 20px 10px auto;
  height: 0;
  width: 10%;
  overflow: hidden;
  padding-top: 10%; /* (1 + 4) / 5 * 0.1 */
}
#hold-canvas {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
