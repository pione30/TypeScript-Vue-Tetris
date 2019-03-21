<template>
  <div>
    <div id="hold" class="button square-rotate"></div>
    <div id="up" class="button circle"></div>
    <div id="left" class="button circle"></div>
    <div id="right" class="button circle"></div>
    <div id="down" class="button circle"></div>
    <div id="rotateLeft" class="button circle"></div>
    <div id="rotateRight" class="button circle"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator"
import { playFieldModule } from "../store/modules/PlayField"

@Component
export default class MobileController extends Vue {
  mounted(): void {
    const buttons: NodeListOf<Element> = document.querySelectorAll("div.button")
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("touchstart", this.mobileButtonsController)
    }
  }

  get isGameOver(): boolean {
    return playFieldModule.isGameOver
  }

  @Watch("isGameOver")
  onIsGameOverChange(isGameOver: boolean): void {
    if (isGameOver) {
      const buttons: NodeListOf<Element> = document.querySelectorAll("div.button")
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].removeEventListener("touchstart", this.mobileButtonsController)
      }
    }
  }

  mobileButtonsController: (event: Event) => void = event => {
    const target = event.target as HTMLElement
    switch (target.id) {
      case "hold":
        event.preventDefault()
        playFieldModule.hold()
        break

      case "up":
        event.preventDefault()
        playFieldModule.hardDrop()
        break

      case "left":
        event.preventDefault()
        playFieldModule.moveLeft()
        break

      case "right":
        event.preventDefault()
        playFieldModule.moveRight()
        break

      case "down":
        event.preventDefault()
        playFieldModule.moveDown()
        break

      case "rotateLeft":
        event.preventDefault()
        playFieldModule.rotateLeft()
        break

      case "rotateRight":
        event.preventDefault()
        playFieldModule.rotateRight()
        break
    }
  }
}
</script>

<style lang="scss" scoped>
.circle {
  width: 100px;
  height: 100px;
  background: lightslategray;
  border-radius: 50px;
}

.square-rotate {
  width: 100px;
  height: 100px;
  background: lightslategray;
  transform: rotate(45deg);
}
</style>
