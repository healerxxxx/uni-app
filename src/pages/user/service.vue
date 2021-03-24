<template>
  <view class="user-service">
    <view class="user-service__modules">
      <image class="logo" src="/static/logo-app.png"></image>
      <view class="name">下载“网易红彩”客户端</view>
      <view class="tips">获取赛事分析及结果预测<br />领取198元大礼包</view>
      <view class="button" @click="toDownload">立即前往</view>
    </view>
    <view class="user-service__modules">
      <image class="logo" src="/static/logo-app.png"></image>
      <view class="name">打开“网易数字彩”小程序</view>
      <view class="tips">双色球大乐透开奖结果及分析,<br />共赢百万大奖</view>
      <view class="button">立即前往</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello'
    }
  },
  onLoad() {
  },
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
.user-service {
  min-height: 100vh;
  &__modules {
    margin: 36rpx 32rpx;
    padding: 64rpx 0 60rpx;
    background: #f3f5f7;
    border-radius: 52rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    .logo {
      width: 120rpx;
      height: 120rpx;
      border-radius: 24rpx;
    }
    .name {
      color: #333;
      font-size: 40rpx;
      line-height: 48rpx;
      font-weight: bold;
      margin-top: 36rpx;
    }
    .tips {
      color: #666;
      font-size: 28rpx;
      line-height: 40rpx;
      margin-top: 18rpx;
    }
    .button {
      margin-top: 30rpx;
      width: 240rpx;
      line-height: 80rpx;
      border-radius: 40rpx;
      color: #fff;
      background: #f22;
      font-size: 32rpx;
      font-weight: bold;
    }
  }
}
</style>
