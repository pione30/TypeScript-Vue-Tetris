<template>
  <div class="flex-container mobile-controller-flex-container">
    <div class="left-hand">
      <div class="flex-container ">
        <div data-button-name="hold" class="button hold L"></div>
      </div>
      <div class="cross-keys">
        <div class="flex-container flex-justify-content-center">
          <div data-button-name="up" class="button circle"></div>
        </div>
        <div class="flex-container flex-justify-content-center">
          <div data-button-name="left" class="button circle"></div>
          <div class="button circle invisible"></div>
          <div data-button-name="right" class="button circle"></div>
        </div>
        <div class="flex-container flex-justify-content-center">
          <div data-button-name="down" class="button circle"></div>
        </div>
      </div>
    </div>
    <div class="right-hand">
      <div data-button-name="hold" class="button hold R"></div>
      <div class="button circle invisible"></div>
      <div class="flex-container flex-justify-content-center">
        <div data-button-name="rotateLeft" class="button circle"></div>
        <div class="button circle invisible"></div>
      </div>
      <div class="flex-container flex-justify-content-center">
        <div class="button circle invisible"></div>
        <div data-button-name="rotateRight" class="button circle"></div>
      </div>
    </div>
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
    switch (target.getAttribute("data-button-name")) {
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
@media screen and (min-width: 320px) {
  .flex-container {
    display: flex;
  }

  .flex-justify-content-center {
    justify-content: center;
  }

  .mobile-controller-flex-container {
    justify-content: space-between;
    align-items: center;
  }

  .button {
    background: lightslategray;
  }

  .invisible {
    visibility: hidden;
  }

  .hold {
    width: 250px;
    height: 90px;
    margin: 100px 2px 30px;
  }

  .L {
    border-radius: 40px 0 0 0;
  }

  .R {
    border-radius: 0 40px 0 0;
  }

  .circle {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    margin: 8px;
  }
}
@media screen and (min-width: 512px) {
  .button {
    display: none;
  }
}
</style>
