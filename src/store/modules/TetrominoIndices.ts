import store from "../"
import { Module, VuexModule, Mutation, Action, getModule } from "vuex-module-decorators"
import { Tetrominos } from "../../Tetrominos"
import { shuffle } from "../../Algorhythms"

@Module({ dynamic: true, store, name: "tetrominoindices" })
class TetrominoIndices extends VuexModule {
  private nextTetrominoIndicesSet: number[] = shuffle(Array.from(Array(Tetrominos.length).keys()))

  private nextNextTetrominoIndicesSet: number[] = shuffle(
    Array.from(Array(Tetrominos.length).keys())
  )

  private previewIndicesSet: number[] = this.nextTetrominoIndicesSet
    .slice(1)
    .concat(this.nextNextTetrominoIndicesSet)

  private tetrominoIndicesIterator: IterableIterator<number> = this.nextTetrominoIndicesSet.values()
  private tetrominoIndicesResult: IteratorResult<number> = this.tetrominoIndicesIterator.next()

  private tetrominoIndex: number = this.tetrominoIndicesResult.value
  private holdTetrominoIndex: number = -1
  private isHoldTetrominoUsed: boolean = false

  @Mutation
  private ROTATE_FORWARD_NEXT_TETROMINO_INDICES_SETS(): void {
    // shallow copy
    this.nextTetrominoIndicesSet = this.nextNextTetrominoIndicesSet.slice()
    this.nextNextTetrominoIndicesSet = shuffle(this.nextNextTetrominoIndicesSet)
  }

  @Mutation
  private SHIFT_PREVIEW_INDICES_SET(): void {
    this.previewIndicesSet.shift()
  }

  @Mutation
  private PUSH_APPLY_PREVIEW_INDICES_SET(): void {
    this.previewIndicesSet.push.apply(this.previewIndicesSet, this.nextNextTetrominoIndicesSet)
  }

  @Mutation
  private SET_TETROMINO_INDICES_ITERATOR(): void {
    this.tetrominoIndicesIterator = this.nextTetrominoIndicesSet.values()
  }

  @Mutation
  private SET_NEXT_TETROMINO_INDICES_RESULT(): void {
    this.tetrominoIndicesResult = this.tetrominoIndicesIterator.next()
  }

  @Mutation
  private SET_CURRENT_TETROMINO_INDEX(): void {
    this.tetrominoIndex = this.tetrominoIndicesResult.value
  }

  @Mutation
  private SWAP_HOLD_AND_CURRENT_TETROMINO_INDEX(): void {
    const tmp: number = this.holdTetrominoIndex
    this.holdTetrominoIndex = this.tetrominoIndex
    this.tetrominoIndex = tmp
  }

  @Mutation
  public SET_IS_HOLD_TETROMINO_USED(payload: boolean): void {
    this.isHoldTetrominoUsed = payload
  }

  @Action
  public popNextTetromino(): void {
    this.SET_NEXT_TETROMINO_INDICES_RESULT()
    if (this.tetrominoIndicesResult.done) {
      this.ROTATE_FORWARD_NEXT_TETROMINO_INDICES_SETS()
      this.PUSH_APPLY_PREVIEW_INDICES_SET()

      this.SET_TETROMINO_INDICES_ITERATOR()
      this.SET_NEXT_TETROMINO_INDICES_RESULT()
    }
    this.SET_CURRENT_TETROMINO_INDEX()
    this.SHIFT_PREVIEW_INDICES_SET()
  }

  @Action
  public holdRequest(): void {
    if (this.isHoldTetrominoUsedNow) return

    this.SWAP_HOLD_AND_CURRENT_TETROMINO_INDEX()

    if (this.getCurrentTetrominoIndex === -1) {
      this.popNextTetromino()
    }

    this.SET_IS_HOLD_TETROMINO_USED(true)
  }

  public get getPreviewIndiceSet(): number[] {
    return this.previewIndicesSet
  }

  public get getCurrentTetrominoIndex(): number {
    return this.tetrominoIndex
  }

  public get getCurrentHoldTetrominoIndex(): number {
    return this.holdTetrominoIndex
  }

  public get isHoldTetrominoUsedNow(): boolean {
    return this.isHoldTetrominoUsed
  }
}

export const tetrominoIndicesModule = getModule(TetrominoIndices)
