<template>
  <div id="next-preview-canvas-container">
    <p>NEXT</p>
    <canvas id="next-preview-canvas" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator"
import Tetromino from "../@types/Tetromino"
import { Tetrominos } from "../Tetrominos"

@Component
export default class NextPreview extends Vue {
  @Prop() nextTetrominoIndicesSet!: number[]
  @Prop() nextNextTetrominoIndicesSet!: number[]
  @Prop() flipFlopTurn!: boolean
  @Prop() flipFlopNextTetrominoIndicesSet!: boolean

  previewIndiceSet: number[] = this.nextTetrominoIndicesSet.concat(this.nextNextTetrominoIndicesSet)
  previewNum: number = 3

  canvas!: HTMLCanvasElement
  context!: CanvasRenderingContext2D
  unitWidth!: number
  unitHeight!: number
  canvasBlockWidth: number = 5

  mounted(): void {
    const canvasContainer: HTMLElement = document.getElementById(
      "next-preview-canvas-container"
    ) as HTMLElement
    this.canvas = document.getElementById("next-preview-canvas") as HTMLCanvasElement
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D

    this.canvas.width = canvasContainer.clientWidth
    this.canvas.height = canvasContainer.clientHeight
    this.unitWidth = this.canvas.width / this.canvasBlockWidth
    this.unitHeight = this.canvas.height / (4 * this.previewNum)

    this.context.strokeStyle = "lightgray"
    this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawPreviewTetrominos(): void {
    // clear out current preview
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height)

    for (let i = 0; i < this.previewNum; i++) {
      const tetromino: Tetromino = Tetrominos[this.previewIndiceSet[i]]
      const rotation = 0
      const adjustX: number = (this.canvasBlockWidth - tetromino.blocks[rotation][0].length) / 2
      const adjustY: number = i * 4 + 1

      for (const [dy, row] of tetromino.blocks[rotation].entries()) {
        for (const [dx, blockElement] of row.entries()) {
          if (blockElement != 0) {
            this.context.fillStyle = tetromino.color
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

  @Watch("flipFlopTurn")
  onFlipFlopTurnChange(): void {
    this.previewIndiceSet.shift()
    this.drawPreviewTetrominos()
  }
  @Watch("flipFlopNextTetrominoIndicesSet")
  onFlipFlopNextTetrominoIndicesSetChange(): void {
    this.previewIndiceSet.push.apply(this.previewIndiceSet, this.nextNextTetrominoIndicesSet)
  }
}
</script>

<style>
#next-preview-canvas-container {
  position: relative;
  margin: 10px auto;
  height: 0;
  width: 27%;
  overflow: hidden;
  padding-top: 64.8%; /* 12 / 5 * 0.27 */
}
#next-preview-canvas {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
