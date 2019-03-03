<template>
  <div>
    <p class="label">HOLD</p>
    <div id="hold-canvas-container">
      <canvas id="hold-canvas" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator"
import { Tetrominos } from "../Tetrominos"
import { tetrominoIndicesModule } from "../store/modules/TetrominoIndices"

@Component
export default class Hold extends Vue {
  canvas!: HTMLCanvasElement
  context!: CanvasRenderingContext2D
  unitWidth!: number
  unitHeight!: number
  canvasBlockWidth: number = 5
  canvasBlockHeightPerTetromino: number = 4

  mounted(): void {
    const canvasContainer: HTMLElement = document.getElementById(
      "hold-canvas-container"
    ) as HTMLElement
    this.canvas = document.getElementById("hold-canvas") as HTMLCanvasElement
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D

    this.canvas.width = canvasContainer.clientWidth
    this.canvas.height = canvasContainer.clientHeight
    this.unitWidth = this.canvas.width / this.canvasBlockWidth
    this.unitHeight = this.canvas.height / this.canvasBlockHeightPerTetromino

    this.context.strokeStyle = "lightgray"
    this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height)
  }

  get holdTetrominoIndex(): number {
    return tetrominoIndicesModule.getCurrentHoldTetrominoIndex
  }

  @Watch("holdTetrominoIndex")
  onHoldTetrominoIndexChange(): void {
    this.drawHoldTetromino()
  }

  drawHoldTetromino(): void {
    // clear out current mino
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height)

    const rotation = 0
    const adjustX: number =
      (this.canvasBlockWidth - Tetrominos[this.holdTetrominoIndex].blocks[rotation][0].length) / 2
    const adjustY = 1

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
.label {
  margin: 40px 30px 10px;
}
#hold-canvas-container {
  position: relative;
  height: 0;
  width: 100%;
  overflow: hidden;
  padding-top: 80%; /* 4 / 5 */
}
#hold-canvas {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
