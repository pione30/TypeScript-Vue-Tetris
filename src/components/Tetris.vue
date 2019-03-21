<template>
  <div>
    <div id="tetris-component">
      <hold class="inline-block" />
      <play-field class="inline-block" />
      <next-preview class="inline-block" />
    </div>
    <div>
      <mobile-controller />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import Hold from "./Hold.vue"
import PlayField from "./PlayField.vue"
import NextPreview from "./NextPreview.vue"
import MobileController from "./MobileController.vue"

@Component({
  components: {
    Hold,
    PlayField,
    NextPreview,
    MobileController
  }
})
export default class TetrisComponent extends Vue {}
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
