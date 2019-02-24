<template>
  <div id="tetris-component">
    <hold :hold-tetromino-index="holdTetrominoIndex" />
    <play-field
      class="inline-block"
      :configs="configs"
      :tetromino-index="tetrominoIndex"
      :flip-flop-turn="flipFlopTurn"
      @tetromino-grounded="popNextTetromino"
    />
    <next-preview
      class="inline-block"
      :next-tetromino-indices-set="nextTetrominoIndicesSet"
      :next-next-tetromino-indices-set="nextNextTetrominoIndicesSet"
      :flip-flop-turn="flipFlopTurn"
      :flip-flop-next-tetromino-indices-set="flipFlopNextTetrominoIndicesSet"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import Hold from "./Hold.vue"
import PlayField from "./PlayField.vue"
import NextPreview from "./NextPreview.vue"
import BoardConfigs from "../@types/BoardConfigs"
import { Tetrominos } from "../Tetrominos"

@Component({
  components: {
    Hold,
    PlayField,
    NextPreview
  }
})
export default class TetrisComponent extends Vue {
  // data
  configs: BoardConfigs = {
    width: 10 + 2,
    height: 20 + 2
  }

  flipFlopTurn: boolean = true
  flipFlopNextTetrominoIndicesSet: boolean = true

  nextTetrominoIndicesSet: number[] = this.shuffle(Array.from(Array(Tetrominos.length).keys()))
  nextNextTetrominoIndicesSet: number[] = this.shuffle(Array.from(Array(Tetrominos.length).keys()))
  tetrominoIndicesIterator: IterableIterator<number> = this.nextTetrominoIndicesSet.values()

  tetrominoIndex: number = this.nextTetrominoIndicesSet[0]
  holdTetrominoIndex: number | undefined = undefined

  mounted(): void {
    this.popNextTetromino()
  }

  popNextTetromino(): void {
    let result: IteratorResult<number> = this.tetrominoIndicesIterator.next()
    if (result.done) {
      // shallow copy
      this.nextTetrominoIndicesSet = this.nextNextTetrominoIndicesSet.slice()
      this.tetrominoIndicesIterator = this.nextTetrominoIndicesSet.values()
      result = this.tetrominoIndicesIterator.next()

      this.nextNextTetrominoIndicesSet = this.shuffle(this.nextNextTetrominoIndicesSet)
      this.flipFlopNextTetrominoIndicesSet = !this.flipFlopNextTetrominoIndicesSet
    }
    this.tetrominoIndex = result.value

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

<style>
#tetris-component {
  text-align: center;
}
.inline-block {
  display: inline-block;
  vertical-align: top;
}
</style>
