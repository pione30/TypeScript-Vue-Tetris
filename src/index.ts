import Vue from "vue"
import TetrisComponent from "components/Tetris.vue"
import "core-js/stable/array"

new Vue({
  el: "#app",
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  render: h => h(TetrisComponent)
})
