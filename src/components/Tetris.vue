<template>
  <div>
    <div id="tetris-component">
      <hold class="inline-block" />
      <play-field class="inline-block" />
      <div class="inline-block">
        <next-preview />
        <level-score />
      </div>
    </div>
    <div>
      <mobile-controller />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import Hold from "components/Hold.vue"
import PlayField from "components/PlayField.vue"
import NextPreview from "components/NextPreview.vue"
import LevelScore from "components/LevelScore.vue"
import MobileController from "components/MobileController.vue"

@Component({
  components: {
    Hold,
    PlayField,
    NextPreview,
    LevelScore,
    MobileController
  }
})
export default class TetrisComponent extends Vue {}
</script>

<style scoped>
#tetris-component {
  text-align: center;
}
.inline-block {
  display: inline-block;
  vertical-align: top;
}
</style>
