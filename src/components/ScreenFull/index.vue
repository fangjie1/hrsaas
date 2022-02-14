<template>
  <div>
    <svg-icon icon-class="fullscreen"
              style="color:#fff; width: 20px; height: 20px"
              @click="changeScreen" />
  </div>
</template>

<script>
import screenFull from 'screenfull';
export default {
  methods: {
    //   改变全屏
    changeScreen () {
      if (!screenFull.isEnabled) {
        console.log(screenFull.isEnabled);
        this.$message.warning('此时全屏组件不可用')
        return
      }
      // document.documentElement.requestFullscreen()  
      screenFull.toggle()
    }
  }
}
</script>

<style>
</style>