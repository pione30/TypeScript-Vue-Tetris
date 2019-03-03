<template>
  <div id="play-field-canvas-container">
    <canvas id="play-field-canvas" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from "vue-property-decorator"
import BoardConfigs from "../@types/BoardConfigs"
import { Tetrominos } from "../Tetrominos"
import { levelScoreModule } from "../store/modules/LevelScore"
import { tetrominoIndicesModule } from "../store/modules/TetrominoIndices"

@Component
export default class PlayField extends Vue {
  @Prop() configs!: BoardConfigs

  isBlockFilled!: boolean[][]
  colorBoard!: string[][]

  context!: CanvasRenderingContext2D

  unitWidth!: number
  unitHeight!: number

  currentX: number = Math.floor(this.configs.width / 2) - 1
  currentY: number = 1
  rotation: number = 0

  intervalID: number = 0

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

    const canvasContainer: HTMLElement = document.getElementById(
      "play-field-canvas-container"
    ) as HTMLElement
    const canvas: HTMLCanvasElement = document.getElementById(
      "play-field-canvas"
    ) as HTMLCanvasElement
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D

    // set parent container size as canvas size
    canvas.width = canvasContainer.clientWidth
    canvas.height = canvasContainer.clientHeight
    this.unitWidth = canvas.width / this.configs.width
    this.unitHeight = canvas.height / this.configs.height

    // draw grid
    this.context.strokeStyle = "lightgray"
    this.paintBoardAll()

    window.addEventListener("keydown", this.tetriminoController)
    window.addEventListener("keydown", this.holdController)

    this.execCurrentTurn()
  }

  tetriminoController: (event: KeyboardEvent) => void = event => {
    switch (event.keyCode) {
      case 37:
      case 83:
        // Left or S
        event.preventDefault()
        this.moveLeft()
        break

      case 38:
      case 69:
        // Up or E
        event.preventDefault()
        this.hardDrop()
        break

      case 39:
      case 70:
        // Right or F
        event.preventDefault()
        this.moveRight()
        break

      case 40:
      case 68:
        // Down or D
        event.preventDefault()
        this.moveDown()
        break

      case 74:
        // J
        event.preventDefault()
        this.rotateLeft()
        break

      case 75:
        // K
        event.preventDefault()
        this.rotateRight()
        break
    }
  }

  holdController: (event: KeyboardEvent) => void = event => {
    switch (event.keyCode) {
      case 82:
      case 85:
        // R or U
        event.preventDefault()
        this.holdRequest()
        break
    }
  }

  execCurrentTurn(): void {
    clearInterval(this.intervalID)

    // start current turn
    this.currentX = Math.floor(this.configs.width / 2) - 1
    this.currentY = 1
    this.rotation = 0

    this.drawTetromino()

    if (this.isGameOver()) {
      window.removeEventListener("keydown", this.tetriminoController)
      window.removeEventListener("keydown", this.holdController)
      this.gameOver()
      return
    }

    this.intervalID = setInterval(() => this.moveDown(), levelScoreModule.dropIntervalMs)
  }

  get tetrominoIndex(): number {
    return tetrominoIndicesModule.getCurrentTetrominoIndex
  }

  @Watch("tetrominoIndicesModule.isHoldTetrominoUsedNow")
  onIsHoldTetrominoUsedNowChange(isUsedNow: boolean): void {
    if (isUsedNow) {
      this.execCurrentTurn()
    }
  }

  holdRequest(): void {
    if (!tetrominoIndicesModule.isHoldTetrominoUsedNow) {
      clearInterval(this.intervalID)
      this.clearTetromino()
    }
    tetrominoIndicesModule.holdRequest()
  }

  @Emit("game-over")
  gameOver(): void {}

  paintBoardAll(): void {
    for (const [y, row] of this.colorBoard.entries()) {
      for (const [x, color] of row.entries()) {
        this.context.fillStyle = color
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
    this.context.fillStyle = Tetrominos[this.tetrominoIndex].color
    for (const [dy, row] of Tetrominos[this.tetrominoIndex].blocks[this.rotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          this.context.fillRect(
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

  clearTetromino(): void {
    for (const [dy, row] of Tetrominos[this.tetrominoIndex].blocks[this.rotation].entries()) {
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

  fillBlocksAndColorByTetromino(): void {
    for (const [dy, row] of Tetrominos[this.tetrominoIndex].blocks[this.rotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          this.isBlockFilled[this.currentY + dy][this.currentX + dx] = true
          this.colorBoard[this.currentY + dy][this.currentX + dx] =
            Tetrominos[this.tetrominoIndex].color
        }
      }
    }
  }

  moveLeft(): void {
    for (const [dy, row] of Tetrominos[this.tetrominoIndex].blocks[this.rotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          if (this.isBlockFilled[this.currentY + dy][this.currentX + dx - 1]) return
        }
      }
    }

    this.clearTetromino()
    this.currentX--
    this.drawTetromino()
  }
  moveRight(): void {
    for (const [dy, row] of Tetrominos[this.tetrominoIndex].blocks[this.rotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          if (this.isBlockFilled[this.currentY + dy][this.currentX + dx + 1]) return
        }
      }
    }

    this.clearTetromino()
    this.currentX++
    this.drawTetromino()
  }
  moveDown(): boolean {
    for (const [dy, row] of Tetrominos[this.tetrominoIndex].blocks[this.rotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          if (this.isBlockFilled[this.currentY + dy + 1][this.currentX + dx]) {
            clearInterval(this.intervalID)
            this.fillBlocksAndColorByTetromino()
            this.deleteCompletedLines()
            tetrominoIndicesModule.popNextTetromino()
            this.execCurrentTurn()
            return false
          }
        }
      }
    }

    this.clearTetromino()
    this.currentY++
    this.drawTetromino()
    return true
  }
  hardDrop(): void {
    while (this.moveDown());
  }
  rotateLeft(): void {
    const leftRotation: number = (this.rotation + 1) % Tetrominos[this.tetrominoIndex].blocks.length

    for (const [dy, row] of Tetrominos[this.tetrominoIndex].blocks[leftRotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          if (this.isBlockFilled[this.currentY + dy][this.currentX + dx]) return
        }
      }
    }

    this.clearTetromino()
    this.rotation = leftRotation
    this.drawTetromino()
  }
  rotateRight(): void {
    const rightRotation: number =
      (this.rotation + Tetrominos[this.tetrominoIndex].blocks.length - 1) %
      Tetrominos[this.tetrominoIndex].blocks.length

    for (const [dy, row] of Tetrominos[this.tetrominoIndex].blocks[rightRotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          if (this.isBlockFilled[this.currentY + dy][this.currentX + dx]) return
        }
      }
    }

    this.clearTetromino()
    this.rotation = rightRotation
    this.drawTetromino()
  }

  deleteCompletedLines(): void {
    let filledLineIndices: number[] = []
    for (const [y, row] of this.isBlockFilled.entries()) {
      if (y === 0 || y === this.configs.height - 1) continue

      if (row.every(blockIsFilled => blockIsFilled)) {
        filledLineIndices.push(y)
      }
    }

    if (filledLineIndices.length > 0) {
      for (const index of filledLineIndices) {
        // remove the filled line
        this.isBlockFilled.splice(index, 1)
        this.colorBoard.splice(index, 1)

        // insert new line
        const unitFilledLine: boolean[] = new Array(this.configs.width).fill(false)
        unitFilledLine[0] = true
        unitFilledLine[this.configs.width - 1] = true
        this.isBlockFilled.splice(1, 0, unitFilledLine)

        const unitColorLine: string[] = new Array(this.configs.width).fill("white")
        unitColorLine[0] = "black"
        unitColorLine[this.configs.width - 1] = "black"
        this.colorBoard.splice(1, 0, unitColorLine)
      }

      levelScoreModule.deleteLines(filledLineIndices.length)
      this.paintBoardAll()
    }
  }

  isGameOver(): boolean {
    for (const [dy, row] of Tetrominos[this.tetrominoIndex].blocks[this.rotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          if (this.isBlockFilled[this.currentY + dy][this.currentX + dx]) return true
        }
      }
    }
    return false
  }
}
</script>

<style>
#play-field-canvas-container {
  position: relative;
  margin: 10px 20px;
  height: 0;
  width: 27%;
  overflow: hidden;
  padding-top: 49.5%; /* 22 / 12 * 0.27 */
}
#play-field-canvas {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
