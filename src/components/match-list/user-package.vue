<template>
  <view class="user-package">
    <view class="user-package--text">您有198的红包未领取</view>
    <view class="user-package--button" @click="toDownload">立即领取</view>
    <view class="user-package--icon">
      <image @click="$emit('close')" src="/static/icon-home-tips-close.png" />
    </view>
  </view>
</template>

<script>
export default {
  name: 'user-package',
  methods: {
    toDownload () {
      uni.navigateTo({
        url: '/pages/download/index'
      })
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/style/mixin.scss';
.user-package{
  z-index: 1000;
  position: absolute;
  bottom: 16rpx;
  height: 120rpx;
  width: 686rpx;
  left: 30rpx;
  background: #f2f2f2;
  border-radius: 8rpx;
  &--text{
    line-height: 120rpx;
    padding-left: 34rpx;
    font-size: 32rpx;
    color: #4a4a4a;
    font-weight: bold;
    display: inline-block;
  }
  &--button{
    display: inline-block;
    margin-left: 104rpx;
    width: 160rpx;
    height: 56rpx;
    line-height: 56rpx;
    text-align:center;
    background: #ff2900;
    border-radius: 27rpx;
    font-size: 28rpx;
    font-weight: bold;
    color: #fff;
  }
  &--icon{
    position: absolute;
    top: 0;
    right: 0;
    width: 50rpx;
    height: 50rpx;
    image{
      position: absolute;
      top: 10rpx;
      right: 20rpx;
      width: 18rpx;
      top: 16rpx;
      right: 18rpx;
      height: 18rpx;
      background-repeat: no-repeat;
      background-size: contain;
      z-index: 10;
    }
  }
}

</style>