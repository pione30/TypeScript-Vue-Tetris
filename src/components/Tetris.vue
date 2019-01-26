<template>
  <div>
    <play-field :configs="configs" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator"
import PlayField from "./PlayField.vue"

@Component({
  components: {
    PlayField
  }
})
export default class TetrisComponent extends Vue {
  // data
  configs: any = {
    width: 10 + 2,
    height: 20 + 2
  }
}
</script>

<style></style>
