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
  @Prop() flipFlopTurn!: boolean

  isBlockFilled!: boolean[][]
  colorBoard!: string[][]

  canvas!: HTMLCanvasElement
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

    this.canvas = document.getElementById("canvas") as HTMLCanvasElement
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D
    this.unitWidth = this.canvas.width / this.configs.width
    this.unitHeight = this.canvas.height / this.configs.height

    // draw grid
    this.context.strokeStyle = "gray"
    this.paintBoardAll()

    window.addEventListener("keydown", event => {
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
    })
  }

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

  @Watch("flipFlopTurn")
  onFlipFlopTurnChange(): void {
    // start current turn
    this.currentX = Math.floor(this.configs.width / 2) - 1
    this.currentY = 1
    this.rotation = 0

    this.drawTetromino()

    this.intervalID = setInterval(() => this.moveDown(), 1000)
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

  fillBlocksAndColorByTetromino(): void {
    for (const [dy, row] of this.tetromino.blocks[this.rotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          this.isBlockFilled[this.currentY + dy][this.currentX + dx] = true
          this.colorBoard[this.currentY + dy][this.currentX + dx] = this.tetromino.color
        }
      }
    }
  }

  moveLeft(): void {
    for (const [dy, row] of this.tetromino.blocks[this.rotation].entries()) {
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
    for (const [dy, row] of this.tetromino.blocks[this.rotation].entries()) {
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
    for (const [dy, row] of this.tetromino.blocks[this.rotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          if (this.isBlockFilled[this.currentY + dy + 1][this.currentX + dx]) {
            clearInterval(this.intervalID)
            this.fillBlocksAndColorByTetromino()
            this.$emit("tetromino-grounded")
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
    const leftRotation: number = (this.rotation + 1) % this.tetromino.blocks.length

    for (const [dy, row] of this.tetromino.blocks[leftRotation].entries()) {
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
      (this.rotation + this.tetromino.blocks.length - 1) % this.tetromino.blocks.length

    for (const [dy, row] of this.tetromino.blocks[rightRotation].entries()) {
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
}
</script>

<style>
canvas {
  position: relative;
  width: 100;
  height: 50;
}
</style>
