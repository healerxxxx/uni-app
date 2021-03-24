<template>
  <view class="no-more-wrap">
    <text>{{text ? text : '没有更多了~'}}</text>
  </view>
</template>

<script>
export default {
  name: 'no-more',
  props: ['text']
}
</script>

<style lang="scss">
.no-more-wrap {
  line-height: 100rpx;
  text-align: center;
  span {
    font-size: 28rpx;
    color: #666;
  }
}
</style>
