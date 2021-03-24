<template>
  <view class="loading-more">
    <view class="loading-more__icon" :class="[icon]"></view>
  </view>
</template>

<script>
export default {
  name: 'loading-more',
  props: ['icon']
}
</script>

<style lang="scss">
@import '@/assets/style/mixin.scss';
.loading-more {
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  &__icon {
    width: 50rpx;
    height: 50rpx;
    margin: 0 auto;
    animation: circle-rotate 1s infinite linear;
    @include bg-image('@/static/icon-loading.png');
  }
}
@keyframes circle-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
