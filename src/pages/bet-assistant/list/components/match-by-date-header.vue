<template>
  <view class="match-by-date-header">
    {{info}}
    <!-- <span>2020.1.14</span> 星期六 2场比赛 -->
  </view>
</template>

<script>
export default {
  name: 'match-by-date-header',
  props: ['info']
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.match-by-date-header {
  position: relative;
  padding: 0 32rpx;
  height: 96rpx;
  background: #fff;
  line-height: 96rpx;
  color: #333;
  font-size: 32rpx;
  font-weight: bold;
  transform: translateZ(0);
}
</style>
