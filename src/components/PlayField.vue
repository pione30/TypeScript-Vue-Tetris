<template>
  <div id="play-field-canvas-container">
    <canvas id="play-field-canvas" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Emit } from "vue-property-decorator"
import { levelScoreModule } from "../store/modules/LevelScore"
import { tetrominoIndicesModule } from "../store/modules/TetrominoIndices"
import { playFieldModule } from "../store/modules/PlayField"
import { intervalModule } from "../store/modules/Interval"

@Component
export default class PlayField extends Vue {
  mounted(): void {
    const canvasContainer: HTMLElement = document.getElementById(
      "play-field-canvas-container"
    ) as HTMLElement
    const canvas: HTMLCanvasElement = document.getElementById(
      "play-field-canvas"
    ) as HTMLCanvasElement

    playFieldModule.initialize({ canvasContainer: canvasContainer, canvas: canvas })

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
        playFieldModule.moveLeft()
        break

      case 38:
      case 69:
        // Up or E
        event.preventDefault()
        playFieldModule.hardDrop()
        break

      case 39:
      case 70:
        // Right or F
        event.preventDefault()
        playFieldModule.moveRight()
        break

      case 40:
      case 68:
        // Down or D
        event.preventDefault()
        playFieldModule.moveDown()
        break

      case 74:
        // J
        event.preventDefault()
        playFieldModule.rotateLeft()
        break

      case 75:
        // K
        event.preventDefault()
        playFieldModule.rotateRight()
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
    playFieldModule.initCurrentTurn(this.tetrominoIndex)
    playFieldModule.drawTetromino()

    if (playFieldModule.isGameOver) {
      window.removeEventListener("keydown", this.tetriminoController)
      window.removeEventListener("keydown", this.holdController)
      this.gameOver()
      return
    }

    intervalModule.setIntervalID(
      setInterval(() => playFieldModule.moveDown(), levelScoreModule.dropIntervalMs)
    )
  }

  get turnNum(): number {
    return playFieldModule.getTurnNum
  }

  get tetrominoIndex(): number {
    return tetrominoIndicesModule.getCurrentTetrominoIndex
  }

  get isHoldTetrominoUsedNow(): boolean {
    return tetrominoIndicesModule.isHoldTetrominoUsedNow
  }

  @Watch("turnNum")
  onTurnNumChange(): void {
    tetrominoIndicesModule.SET_IS_HOLD_TETROMINO_USED(false)
    tetrominoIndicesModule.popNextTetromino()

    this.execCurrentTurn()
  }

  @Watch("isHoldTetrominoUsedNow")
  onIsHoldTetrominoUsedNowChange(isUsedNow: boolean): void {
    if (isUsedNow) {
      this.execCurrentTurn()
    }
  }

  holdRequest(): void {
    if (!this.isHoldTetrominoUsedNow) {
      intervalModule.clearIntervalID()
      playFieldModule.clearTetromino()
    }
    tetrominoIndicesModule.holdRequest()
  }

  @Emit("game-over")
  gameOver(): void {}
}
</script>

<style lang="scss">
$field_width: 22;
$field_height: 12;

@mixin play_field_canvas_container_mixin($pc_container_width: 27%, $sp_container_width: 58%) {
  #play-field-canvas-container {
    width: $pc_container_width;
    padding-top: $pc_container_width * $field_width / $field_height;
    @content;
  }

  @media screen and (max-width: 999px) {
    #play-field-canvas-container {
      width: $sp_container_width;
      padding-top: $sp_container_width * $field_width / $field_height;
      @content;
    }
  }
}

@include play_field_canvas_container_mixin() {
  position: relative;
  margin: 10px 20px;
  height: 0;
  overflow: hidden;
}

#play-field-canvas {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
