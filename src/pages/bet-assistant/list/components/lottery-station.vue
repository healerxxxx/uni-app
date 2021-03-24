<template>
  <view class="lottery-station" v-if="visible">
    <view class="lottery-station__text">投注助手不能购买彩票，如需购买，请到线下彩票站</view>
    <view class="lottery-station__jump anta-lottery-station" @click="toStation">
      <image src='/static/bet-assistant/icon-station.svg' class="lottery-station__jump--icon"></image>
      <view>彩票站</view>
    </view>
    <view
      class="lottery-station__close"
      @click="remove">
      <image src="/static/bet-assistant/icon-close-999.svg" class="icon-close-999"></image>
    </view>
  </view>
</template>

<script>
export default {
  name: 'lottery-station',
  data () {
    return {
      visible: true
    }
  },
  created () {
    try {
      const flag = uni.getStorageSync('lotteryStationVisible')
      if (flag) {
        this.visible = false
      }
    } catch (error) {
    }
  },
  methods: {
    remove () {
      try {
        uni.setStorageSync('lotteryStationVisible', true)
      } catch (error) {
      }
      this.visible = false
    },
    toStation () {
      uni.navigateTo({
        url: '/pages/map/index'
      })
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.lottery-station {
  flex-shrink: 0;
  position: relative;
  height: 92rpx;
  display: flex;
  align-items: center;
  padding: 0 32rpx;
  background: #F3F5F7;
  &__text {
    width: 440rpx;
    view {
      display: inline-block;
      transform: scale(.916) translateZ(0);
      transform-origin: 0 50%;
      line-height: 32rpx;
      width: 110%;
    }
  }
  &__jump {
    position: absolute;
    height: 56rpx;
    right: 92rpx;
    top: 16rpx;
    display: flex;
    align-items: center;
    padding: 0 15rpx;
    border-radius: 28rpx;
    border: 1px solid #f22;
    view {
      flex-shrink: 0;
      color: #f22;
      font-weight: bold;
    }
    &--icon {
      flex-shrink: 0;
      width: 20rpx;
      height: 24rpx;
      margin-right: 7rpx;
    }
  }
  &__close {
    position: absolute;
    width: 60rpx;
    height: 60rpx;
    right: 12rpx;
    top: 14rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon-close-999 {
      height: 20rpx;
      width: 20rpx;
    }
  }
}
</style>
