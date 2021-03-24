<template>
  <view class="login-urs">
    <mobile-login
      v-if="!showUnite"
      :saveTempMobileNm="saveTempMobileNm"
      :saveTempMobile="saveTempMobile"
      @changepage="onChangePage"
      :options="options">
    </mobile-login>
    <mobile-unite-login
      v-if="showUnite"
      @changepage="onChangePage"
      :saveTempMobileNm="saveTempMobileNm"
      :saveTempMobile="saveTempMobile"
      :options="options">
    </mobile-unite-login>
  </view>
</template>

<script>
export default {
  data() {
    return {
      options: {
        detal: "1",
        pd: "hongcai_euro",
        pkht: "hongcai.163.com",
        pkid: "DktOcWu",
        ulogo: 'https://static.ws.126.net/f2e/products/relottery/relotteryMobile/trunk/reflowpages/images/hongcai_logo.png',
        buttonColor: '#ffffff',
        buttonBgColor: '#ff2222',
        buttonDisColor: '#666666',
        changeColor: '#ff2222',
        logoWidth: '140rpx',
        logoHeight: '140rpx'
      },
      showUnite: true,
      saveTempMobile: '',
      saveTempMobileNm: ''
    }
  },
  onLoad() {
  },
  methods: {
    onChangePage (obj) {
      const detail = obj.detail || {}
      this.showUnite = !this.showUnite
      this.saveTempMobile = detail.saveTempMobile || ''
      this.saveTempMobileNm = detail.saveTempMobileNm || ''
    }
  }
}
</script>

<style lang="scss">
.login-urs {
  height: 100vh;
}
.slide {
        border-bottom: 1px solid #DEDEDE;
    }
    .l {
        background-color: white;
        height: 110rpx;
        width: 750rpx;
        display: flex;
        flex-direction: row;
    }
    .r {
        height: 110rpx;
        display: flex;
        direction: row;
        text-align: center;
        vertical-align: middle;
        line-height: 110rpx;
    }
    .read {
        background-color: #ccc;
        color: #fff;
        width: 350rpx;
    }
    .delete {
        background-color: red;
        color: #fff;
        width: 150rpx;
    }
    .img {
        width: 90rpx;
        height: 90rpx;
        border-radius: 10rpx;
        margin: 10rpx 15rpx;
    }
    .text {
        display: flex;
        flex-direction: row;
    }

    .title {
        margin-top: 15rpx;
        font-size: 33rpx;
    }
    .time {
        margin-top: 15rpx;
        color: #ccc;
        font-size: 25rpx;
        margin-left: 330rpx;
    }
</style>
