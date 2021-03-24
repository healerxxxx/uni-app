<template>
  <view class="loading-data" :class="{'transparent': transparent}">
    <view
      class="loading-data__content"
      :class="{'match': type === 'match'}">
      <view class="loading-data__content--icon" :class="[icon]"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'loading-data',
  props: ['transparent', 'type', 'icon']
}
</script>

<style lang="scss">
@import '@/assets/style/mixin.scss';
.loading-data {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 11;
  background: #f3f5f7;
  &__content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    &.match {
      top: 225rpx;
    }
    &--icon {
      width: 54rpx;
      height: 54rpx;
      margin: 0 auto;
      animation: circle-rotate 1s infinite linear;
      @include bg-image('@/static/icon-loading.png');
    }
  }
  &.transparent {
    background: transparent;
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
