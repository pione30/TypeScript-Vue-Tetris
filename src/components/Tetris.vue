<template>
  <div>
    <play-field
      :configs="configs"
      :tetromino="tetromino"
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

  mounted(): void {
    this.popNextTetromino()
  }

  popNextTetromino(): void {
    this.tetromino = Tetrominos[Math.floor(Math.random() * Tetrominos.length)]
  }
}
</script>

<style></style>
