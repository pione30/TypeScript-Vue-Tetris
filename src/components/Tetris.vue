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

  mounted(): void {
    this.popNextTetromino()
  }

  popNextTetromino(): void {
    // If current tetromino and next tetromino are the same ones,
    // Vue.js cannot detect the "change" of the tetromino.
    // So tetromino cannot be used to watch the turn changes and
    // we need another variable which just only tells "turn-changing" information.
    this.tetromino = Tetrominos[Math.floor(Math.random() * Tetrominos.length)]
    this.flipFlopTurn = !this.flipFlopTurn
  }
}
</script>

<style></style>
