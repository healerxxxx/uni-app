<template>
  <view class="net-error" :class="{'transparent': transparent}">
    <view class="net-error__content">
      <view class="net-error__content--icon"></view>
      <view class="net-error__content--text">{{text}}</view>
      <view
        class="net-error__content--btn"
        v-if="btnText"
        @click="$emit('btn-click')">
        {{btnText}}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'net-error',
  props: {
    transparent: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '网络加载异常'
    },
    btnText: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/style/mixin.scss';
.net-error {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  text-align: center;
  background: #f3f5f7;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  &__content {
    &--icon {
      width: 200rpx;
      height: 183rpx;
      margin: 0 auto;
      @include bg-image('/static/icon-net-error.png');
    }
    &--text {
      font-size: 30rpx;
      color: #999;
      margin-top: 20rpx;
      line-height: 1.5;
    }
    &--btn {
      margin-top: 30rpx;
      display: inline-block;
      font-size: 28rpx;
      color: #999;
      padding: 12rpx 40rpx;
      position: relative;
      min-width: 100rpx;
      cursor: pointer;
      border-radius: 6rpx;
      border: 1px solid #c8c8c8;
    }
  }
  &.transparent {
    background: transparent;
    .net-error__content {
      span {
        color: #fff;
      }
      &--btn {
        color: #fff;
        &:after {
          border-color: #fff;
        }
      }
    }
  }
}
</style>
