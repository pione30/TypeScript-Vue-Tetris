<template>
  <div>
    <play-field
      :configs="configs"
      :tetromino="tetromino"
      :flip-flop-turn="flipFlopTurn"
      @tetromino-grounded="popNextTetromino"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import PlayField from "./PlayField.vue"
import BoardConfigs from "../@types/BoardConfigs"
import Tetromino from "../@types/Tetromino"
import { Tetrominos } from "../Tetrominos"

@Component({
  components: {
    PlayField
  }
})
export default class TetrisComponent extends Vue {
  // data
  configs: BoardConfigs = {
    width: 10 + 2,
    height: 20 + 2
  }

  tetromino: Tetromino = {
    name: "",
    color: "",
    blocks: [[[]]]
  }

  flipFlopTurn: boolean = true

  nextTetrominoIndicesSet: number[] = Array.from(Array(Tetrominos.length).keys())
  tetrominoIndicesIterator: IterableIterator<number> = this.nextTetrominoIndicesSet.values()

  mounted(): void {
    this.nextTetrominoIndicesSet = this.shuffle(this.nextTetrominoIndicesSet)
    this.popNextTetromino()
  }

  popNextTetromino(): void {
    let result: IteratorResult<number> = this.tetrominoIndicesIterator.next()
    if (result.done) {
      this.nextTetrominoIndicesSet = this.shuffle(this.nextTetrominoIndicesSet)
      this.tetrominoIndicesIterator = this.nextTetrominoIndicesSet.values()
      result = this.tetrominoIndicesIterator.next()
    }
    this.tetromino = Tetrominos[result.value]

    // If current tetromino and next tetromino are the same ones,
    // Vue.js cannot detect the "change" of the tetromino.
    // So tetromino cannot be used to watch the turn changes and
    // we need another variable which just only tells "turn-changing" information.
    this.flipFlopTurn = !this.flipFlopTurn
  }

  // Fisher–Yates shuffle algorithm
  shuffle(array: number[]): number[] {
    for (let i: number = array.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }
}
</script>

<style></style>
