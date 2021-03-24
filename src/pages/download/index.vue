<template>
  <view class="download-wrapper">
    <view class="logo">
      <image class="img" src="/static/logo-app.png" />
    </view>
    <view class="h2">网易红彩，竞彩一触即发！</view>
    <view class="info">&middot; 专业竞彩预测分析<br />&middot; 独家内幕资讯数据一网打尽<br />&middot; 张路于嘉等国内外顶尖高手独家入驻</view>
    <view class="button">
      <view class="download" @click="download">立即下载</view>
    </view>
  </view>
</template>

<script>
export default {
  onShareAppMessage (res) {
    return {
      title: '网易欧洲杯',
    }
  },
  methods: {
    download () {
      uni.setClipboardData({
        data: 'https://hongcai.163.com/html/download.html?from=miniPro_euro',
        success () {
          uni.showToast({
            title: '下载链接已复制，请在浏览器打开',
            icon: 'none',
            duration: 2500
          })
        },
        fail () {
        }
      })
    }
  }
}
</script>

<style lang="scss">
.download-wrapper {
  .logo {
    margin: 160rpx auto 0;
    display: flex;
    justify-content: center;
    .img {
      width: 200rpx;
      height: 200rpx;
    }
  }
  .h2 {
    text-align: center;
    font-size: 50rpx;
    padding-top: 25rpx;
    font-weight: 400;
    color: #323232;
  }
  .info {
    width: 510rpx;
    margin: 80rpx auto 0;
    font-size: 28rpx;
    line-height: 50rpx;
  }
  .button {
    display: flex;
    justify-content: center;
    margin: 90rpx auto 0;
    .download {
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      width: 300rpx;
      color: #fff;
      background: #e1201f;
      border-radius: 6rpx;
      font-size: 42rpx;
    }
  }
}
</style>
