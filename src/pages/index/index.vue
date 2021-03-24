<template>
  <view class="euro-home-wrapper">
    <nav-bar :is-back="false">欧洲杯</nav-bar>
    <view class="euro-home-content">
      <view class="euro-home-content__tips" v-if="!tipsIsClose">
        <view class="euro-home-content__tips--bg">
          <view class="arrow" v-if="customInfo" :style="{'left': `${customInfo.left + customInfo.width / 4}px`}"></view>
        </view>
        <text class="euro-home-content__tips--text">点击添加到我的小程序，下次快速找到</text>
        <view
          class="euro-home-content__tips--icon"
          @click="tipsClose"></view>
      </view>
      <text class="p">2021年6月</text>
      <text class="p">欧洲杯盛大开幕，敬请期待</text>
    </view>
    <view class="euro-home-download">
      <view class="text">加入欧洲杯训练营<br />享系列课程及专属答疑</view>
      <button class="button" @click="toDownload">立即加入</button>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      tipsIsClose: false
    }
  },
  computed: {
    ...mapState(['customInfo'])
  },
  onShareAppMessage (res) {
    return {
      title: '网易欧洲杯',
    }
  },
  onLoad () {
    const tips = uni.getStorageSync('homeFocusClose')
    if (tips) {
      this.tipsIsClose = true
    }
  },
  methods: {
    tipsClose () {
      this.tipsIsClose = true
      uni.setStorageSync('homeFocusClose', true)
    },
    toDownload () {
      uni.navigateTo({
        url: '/pages/download/index'
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/style/mixin.scss';
.euro-home {
  &-wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #E6E9ED;
    position: relative;
  }
  &-content {
    flex: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;
    color: #747678;
    font-weight: bold;
    position: relative;
    .p + .p {
      margin-top: 15rpx;
    }
    &__tips {
      position: absolute;
      z-index: 2;
      top: 0;
      left: 0;
      right: 0;
      height: 70rpx;
      line-height: 70rpx;
      padding: 0 32rpx;
      
      color: #fff;
      display: flex;
      justify-content: space-between;
      font-size: 24rpx;
      align-items: center;
      &--text {
        z-index: 10;
      }
      &--icon {
        width: 18rpx;
        height: 18rpx;
        @include bg-image('/static/icon-home-tips-close.png');
        z-index: 10;
      }
      &--bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: .8;
        background: #000;
        .arrow {
          position: absolute;
          left: 303px;
          top: -8rpx;
          content: "";
          width: 18rpx;
          height: 18rpx;
          border-radius: 4rpx;
          margin-left: -8rpx;
          transform: rotate(-45deg) translateZ(0);
          background: #000;
          z-index: 5;
        }
      }
    }
  }
  &-download {
    padding: 40rpx 56rpx 50rpx;
    flex-shrink: 0;
    background: #fff;
    display: flex;
    align-items: center;
    .text {
      font-size: 28rpx;
      color: #4A4A4A;
      line-height: 40rpx;
      flex: auto;
      font-weight: bold;
    }
    .button {
      flex-direction: 0;
      width: 240rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      background: #f22;
      color: #fff;
      border-radius: 40rpx;
    }
  }
}
</style>
