<template>
  <div>
    <p class="label">NEXT</p>
    <div id="next-preview-canvas-container">
      <canvas id="next-preview-canvas" />
    </div>
    <level-score class="level-score" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator"
import LevelScore from "components/LevelScore.vue"
import Tetromino from "typings/Tetromino"
import { Tetrominos } from "Tetrominos"
import { tetrominoIndicesModule } from "store/modules/TetrominoIndices"

@Component({
  components: {
    LevelScore
  }
})
export default class NextPreview extends Vue {
  canvas!: HTMLCanvasElement
  context!: CanvasRenderingContext2D
  unitWidth!: number
  unitHeight!: number
  previewNum: number = 3
  canvasBlockWidth: number = 5
  canvasBlockHeightPerTetromino: number = 4

  mounted(): void {
    const canvasContainer: HTMLElement = document.getElementById(
      "next-preview-canvas-container"
    ) as HTMLElement
    this.canvas = document.getElementById("next-preview-canvas") as HTMLCanvasElement
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D

    this.canvas.width = canvasContainer.clientWidth
    this.canvas.height = canvasContainer.clientHeight
    this.unitWidth = this.canvas.width / this.canvasBlockWidth
    this.unitHeight = this.canvas.height / (this.canvasBlockHeightPerTetromino * this.previewNum)

    this.context.strokeStyle = "lightgray"
    this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawPreviewTetrominos()
  }

  drawPreviewTetrominos(): void {
    // clear out current preview
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height)

    for (let i = 0; i < this.previewNum; i++) {
      const tetromino: Tetromino = Tetrominos[this.previewIndicesSet[i]]
      const rotation = 0
      const adjustX: number = (this.canvasBlockWidth - tetromino.blocks[rotation][0].length) / 2
      const adjustY: number = i * this.canvasBlockHeightPerTetromino + 1

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

  get previewIndicesSet(): number[] {
    return tetrominoIndicesModule.getPreviewIndiceSet
  }

  @Watch("previewIndicesSet")
  onPreviewIndicesSetChange(): void {
    this.drawPreviewTetrominos()
  }
}
</script>

<style lang="scss">
@media screen and (min-width: 320px) {
  .label {
    margin: 10px 10px 10px;
  }
}
@media screen and (min-width: 1000px) {
  .label {
    margin: 40px 30px 10px;
  }
}

#next-preview-canvas-container {
  position: relative;
  height: 0;
  width: 100%;
  overflow: hidden;
  padding-top: 240%; /* 4 * 3 / 5 */
}
#next-preview-canvas {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.level-score {
  margin: 40px 0px;
}
</style>
