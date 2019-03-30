<template>
  <div>
    <p>
      LEVEL <br />
      {{ level }}
    </p>
    <p>
      SCORE <br />
      {{ score }}
    </p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import { levelScoreModule } from "store/modules/LevelScore"

@Component
export default class LevelScore extends Vue {
  get level(): number {
    return levelScoreModule.currentLevel
  }
  get score(): number {
    return levelScoreModule.currentScore
  }
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 999px) {
  p {
    margin: 10px 0 10px;
  }
}
</style>
