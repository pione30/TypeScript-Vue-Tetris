import store from "../"
import { Module, VuexModule, Mutation, Action, getModule } from "vuex-module-decorators"
import { Tetrominos } from "../../Tetrominos"
import { levelScoreModule } from "./LevelScore"
import { intervalModule } from "./Interval"
import { tetrominoIndicesModule } from "./TetrominoIndices"

@Module({ dynamic: true, store, name: "playfield" })
class PlayField extends VuexModule {
  private fieldWidth: number = 10 + 2
  private fieldHeight: number = 20 + 2

  private turnNum: number = 0

  private tetrominoIndex: number = 0
  private currentX: number = Math.floor(this.fieldWidth / 2) - 1
  private currentY: number = 1
  private rotation: number = 0

  private isHoldTetrominoUsed: boolean = false

  private isBlockFilled: boolean[][] = Array.from(new Array(this.fieldHeight), () =>
    new Array(this.fieldWidth).fill(false)
  )
  private colorBoard: string[][] = Array.from(new Array(this.fieldHeight), () =>
    new Array(this.fieldWidth).fill("white")
  )

  private canvasContainer: HTMLElement = document.getElementById(
    "play-field-canvas-container"
  ) as HTMLElement
  private canvas: HTMLCanvasElement = document.getElementById(
    "play-field-canvas"
  ) as HTMLCanvasElement

  private unitWidth: number = 0
  private unitHeight: number = 0

  public get getFieldSize(): { [key: string]: number } {
    return {
      fieldWidth: this.fieldWidth,
      fieldHeight: this.fieldHeight
    }
  }

  public get getTurnNum(): number {
    return this.turnNum
  }

  public get isHoldTetrominoUsedNow(): boolean {
    return this.isHoldTetrominoUsed
  }

  public get getColorBoard(): string[][] {
    return this.colorBoard
  }

  public get isGameOver(): boolean {
    for (const [dy, row] of Tetrominos[this.tetrominoIndex].blocks[this.rotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          if (this.isBlockFilled[this.currentY + dy][this.currentX + dx]) return true
        }
      }
    }
    return false
  }

  private get canMoveDown(): boolean {
    for (const [dy, row] of Tetrominos[this.tetrominoIndex].blocks[this.rotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          if (this.isBlockFilled[this.currentY + dy + 1][this.currentX + dx]) {
            return false
          }
        }
      }
    }

    return true
  }

  private get canMoveLeft(): boolean {
    for (const [dy, row] of Tetrominos[this.tetrominoIndex].blocks[this.rotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          if (this.isBlockFilled[this.currentY + dy][this.currentX + dx - 1]) return false
        }
      }
    }

    return true
  }

  private get canMoveRight(): boolean {
    for (const [dy, row] of Tetrominos[this.tetrominoIndex].blocks[this.rotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          if (this.isBlockFilled[this.currentY + dy][this.currentX + dx + 1]) return false
        }
      }
    }

    return true
  }

  private get canRotateLeft(): boolean {
    const leftRotation: number = (this.rotation + 1) % Tetrominos[this.tetrominoIndex].blocks.length

    for (const [dy, row] of Tetrominos[this.tetrominoIndex].blocks[leftRotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          if (this.isBlockFilled[this.currentY + dy][this.currentX + dx]) return false
        }
      }
    }

    return true
  }

  private get canRotateRight(): boolean {
    const rightRotation: number =
      (this.rotation + Tetrominos[this.tetrominoIndex].blocks.length - 1) %
      Tetrominos[this.tetrominoIndex].blocks.length

    for (const [dy, row] of Tetrominos[this.tetrominoIndex].blocks[rightRotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          if (this.isBlockFilled[this.currentY + dy][this.currentX + dx]) return false
        }
      }
    }

    return true
  }

  @Mutation
  private INCREMENT_TURN_NUM(): void {
    this.turnNum++
  }

  @Mutation
  private INIT_BOARD_STATE(): void {
    for (let x = 0; x < this.fieldWidth; x++) {
      this.isBlockFilled[0][x] = true
      this.isBlockFilled[this.fieldHeight - 1][x] = true

      this.colorBoard[0][x] = "black"
      this.colorBoard[this.fieldHeight - 1][x] = "black"
    }
    for (let y = 0; y < this.fieldHeight; y++) {
      this.isBlockFilled[y][0] = true
      this.isBlockFilled[y][this.fieldWidth - 1] = true

      this.colorBoard[y][0] = "black"
      this.colorBoard[y][this.fieldWidth - 1] = "black"
    }
  }

  @Mutation
  private SET_TETROMINO_INDEX(tetrominoIndex: number): void {
    this.tetrominoIndex = tetrominoIndex
  }

  @Mutation
  private SET_INITIAL_POSITIONS(): void {
    this.currentX = Math.floor(this.fieldWidth / 2) - 1
    this.currentY = 1
    this.rotation = 0
  }

  @Mutation
  private SET_CANVAS_CONTAINER(canvasContainer: HTMLElement): void {
    this.canvasContainer = canvasContainer
  }

  @Mutation
  private SET_CANVAS(canvas: HTMLCanvasElement): void {
    this.canvas = canvas
    this.canvas.width = this.canvasContainer.clientWidth
    this.canvas.height = this.canvasContainer.clientHeight
  }

  @Mutation
  private SET_UNIT_SIZE(): void {
    this.unitWidth = this.canvas.width / this.fieldWidth
    this.unitHeight = this.canvas.height / this.fieldHeight
  }

  @Mutation
  private PAINT_BOARD_ALL(): void {
    const context = this.canvas.getContext("2d") as CanvasRenderingContext2D
    context.strokeStyle = "lightgray"

    for (const [y, row] of this.colorBoard.entries()) {
      for (const [x, color] of row.entries()) {
        context.fillStyle = color
        context.fillRect(x * this.unitWidth, y * this.unitHeight, this.unitWidth, this.unitHeight)
        context.strokeRect(x * this.unitWidth, y * this.unitHeight, this.unitWidth, this.unitHeight)
      }
    }
  }

  @Mutation
  private DRAW_TETROMINO(): void {
    const context = this.canvas.getContext("2d") as CanvasRenderingContext2D
    context.strokeStyle = "lightgray"
    context.fillStyle = Tetrominos[this.tetrominoIndex].color

    for (const [dy, row] of Tetrominos[this.tetrominoIndex].blocks[this.rotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          context.fillRect(
            (this.currentX + dx) * this.unitWidth,
            (this.currentY + dy) * this.unitHeight,
            this.unitWidth,
            this.unitHeight
          )
          context.strokeRect(
            (this.currentX + dx) * this.unitWidth,
            (this.currentY + dy) * this.unitHeight,
            this.unitWidth,
            this.unitHeight
          )
        }
      }
    }
  }

  @Mutation
  private CLEAR_TETROMINO(): void {
    const context = this.canvas.getContext("2d") as CanvasRenderingContext2D
    context.strokeStyle = "lightgray"
    context.fillStyle = Tetrominos[this.tetrominoIndex].color

    for (const [dy, row] of Tetrominos[this.tetrominoIndex].blocks[this.rotation].entries()) {
      for (const [dx, blockElement] of row.entries()) {
        if (blockElement != 0) {
          context.clearRect(
            (this.currentX + dx) * this.unitWidth,
            (this.currentY + dy) * this.unitHeight,
            this.unitWidth,
            this.unitHeight
          )
          context.strokeRect(
            (this.currentX + dx) * this.unitWidth,
            (this.currentY + dy) * this.unitHeight,
            this.unitWidth,
            this.unitHeight
          )
        }
      }
    }
  }

  @Mutation
  private MOVE_LEFT(): void {
    this.currentX--
  }

  @Mutation
  private MOVE_RIGHT(): void {
    this.currentX++
  }

  @Mutation
  private MOVE_DOWN(): void {
    this.currentY++
  }

  @Mutation
  private ROTATE_LEFT(): void {
    this.rotation = (this.rotation + 1) % Tetrominos[this.tetrominoIndex].blocks.length
  }

  @Mutation
  private ROTATE_RIGHT(): void {
    this.rotation =
      (this.rotation + Tetrominos[this.tetrominoIndex].blocks.length - 1) %
      Tetrominos[this.tetrominoIndex].blocks.length
  }

  @Mutation
  public SET_IS_HOLD_TETROMINO_USED(payload: boolean): void {
    this.isHoldTetrominoUsed = payload
  }

  @Mutation
  private FILL_BLOCKS_AND_COLOR_BY_TETROMINO(): void {
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

  @Mutation
  private DELETE_COMPLETED_LINES(): void {
    let filledLineIndices: number[] = []
    for (const [y, row] of this.isBlockFilled.entries()) {
      if (y === 0 || y === this.fieldHeight - 1) continue

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
        const unitFilledLine: boolean[] = new Array(this.fieldWidth).fill(false)
        unitFilledLine[0] = true
        unitFilledLine[this.fieldWidth - 1] = true
        this.isBlockFilled.splice(1, 0, unitFilledLine)

        const unitColorLine: string[] = new Array(this.fieldWidth).fill("white")
        unitColorLine[0] = "black"
        unitColorLine[this.fieldWidth - 1] = "black"
        this.colorBoard.splice(1, 0, unitColorLine)
      }

      levelScoreModule.deleteLines(filledLineIndices.length)
    }
  }

  @Action
  public initialize(payload: { canvasContainer: HTMLElement; canvas: HTMLCanvasElement }): void {
    this.SET_CANVAS_CONTAINER(payload.canvasContainer)
    this.SET_CANVAS(payload.canvas)
    this.SET_UNIT_SIZE()
    this.INIT_BOARD_STATE()
    this.PAINT_BOARD_ALL()
  }

  @Action
  public initCurrentTurn(tetrominoIndex: number): void {
    this.SET_TETROMINO_INDEX(tetrominoIndex)
    this.SET_INITIAL_POSITIONS()
    this.DRAW_TETROMINO()
  }

  @Action
  public paintBoardAll(): void {
    this.PAINT_BOARD_ALL()
  }

  @Action
  public drawTetromino(): void {
    this.DRAW_TETROMINO()
  }

  @Action
  public clearTetromino(): void {
    this.CLEAR_TETROMINO()
  }

  @Action
  public moveLeft(): void {
    if (this.canMoveLeft) {
      this.CLEAR_TETROMINO()
      this.MOVE_LEFT()
      this.DRAW_TETROMINO()
    }
  }

  @Action
  public moveRight(): void {
    if (this.canMoveRight) {
      this.CLEAR_TETROMINO()
      this.MOVE_RIGHT()
      this.DRAW_TETROMINO()
    }
  }

  @Action
  public moveDown(): void {
    if (this.canMoveDown) {
      this.CLEAR_TETROMINO()
      this.MOVE_DOWN()
      this.DRAW_TETROMINO()
    } else {
      this.registerGroundedTetromino()
    }
  }

  @Action
  private registerGroundedTetromino(): void {
    intervalModule.clearIntervalID()

    this.FILL_BLOCKS_AND_COLOR_BY_TETROMINO()
    this.DELETE_COMPLETED_LINES()
    this.PAINT_BOARD_ALL()
    this.SET_IS_HOLD_TETROMINO_USED(false)
    this.INCREMENT_TURN_NUM()
  }

  @Action
  public hardDrop(): void {
    while (this.canMoveDown) {
      this.CLEAR_TETROMINO()
      this.MOVE_DOWN()
      this.DRAW_TETROMINO()
    }

    this.registerGroundedTetromino()
  }

  @Action
  public rotateLeft(): void {
    if (this.canRotateLeft) {
      this.CLEAR_TETROMINO()
      this.ROTATE_LEFT()
      this.DRAW_TETROMINO()
    }
  }

  @Action
  public rotateRight(): void {
    if (this.canRotateRight) {
      this.CLEAR_TETROMINO()
      this.ROTATE_RIGHT()
      this.DRAW_TETROMINO()
    }
  }

  @Action
  public hold(): void {
    if (this.isHoldTetrominoUsedNow) return

    intervalModule.clearIntervalID()
    tetrominoIndicesModule.holdTetromino()
    this.CLEAR_TETROMINO()
    this.SET_IS_HOLD_TETROMINO_USED(true)
  }
}

export const playFieldModule = getModule(PlayField)
