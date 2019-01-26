import Vue from "vue"
import TetrisComponent from "./components/Tetris.vue"
import "core-js"

new Vue({
  el: "#app",
  components: { TetrisComponent },
  template: `<tetris-component/>`
})
