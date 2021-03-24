<template>
  <view class="login-wrapper">
    <image class="logo" src="/static/logo-app.png"></image>
    <view class="tips">请绑定手机</view>
    <view class="tips">我们能更好的为您服务</view>
    <button v-if="!agreement" class="disable" @click="buttonTips">手机快捷登录</button>
    <button v-else open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">手机快捷登录</button>
    <view class="agreement">
      <view
        class="choose"
        :class="{'choosed': agreement}"
        @click="chooseAgreement">
      </view>
      <view>登录即表示同意<view class="navigator" @click="toAgreement('login')">《红彩服务条款》</view>和<view class="navigator" @click="toAgreement('privacy')">《红彩隐私协议》</view></view>
    </view>
  </view>
</template>

<script>
import { getPhoneCookie } from '@/utils/api/common'
import { mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      code: null,
      agreement: false
    }
  },
  onShow () {
    this.getCode()
  },
  methods: {
    ...mapMutations(['setCookie']),
    ...mapActions(['userInit']),
    getCode (callback) {
      const that = this
      wx.login({
        success (res) {
          if (res.code) {
            that.code = res.code
            if (callback) {
              callback()
            }
          }
        }
      })
    },
    buttonTips () {
      uni.showToast({title: '请先阅读并同意服务和隐私条款', icon: 'none'})
    },
    getPhoneNumber (e) {
      const { encryptedData, iv } = e.detail
      const that = this
      if (encryptedData) {
        if (that.code) {
          that.getCookie(that.code, encryptedData, iv)
        } else {
          that.getCode(() => {
            that.getCookie(that.code, encryptedData, iv)
          })
        }
      } else {
        uni.showToast({
          title: '获取用户权限失败',
          icon: 'none'
        })
      }
    },
    getCookie(code, encryptedData, iv, info) {
      this.$service(getPhoneCookie, {
        method: 'post',
        data: {
          code: encodeURIComponent(code),
          product: 'hongcai_euro',
          encryptedData: encodeURIComponent(encryptedData),
          iv: encodeURIComponent(iv)
        }
      }).then(res => {
        if (res.code === 200) {
          const cookie = `P_OINFO=${res.data["pInfoCookie"]};S_OINFO=${res.data["sInfoCookie"]};NTES_SESS=${res.data["NTES_YD_SESS"]}`
          // 本地存储Cookie
          uni.setStorageSync('COOKIE', cookie)
          // Vuex全局设置Cookie
          this.setCookie(cookie)
          // 初始化用户
          this.userInit({
            from: 'miniProPhone',
            // avatar: info.avatarUrl,
            nickname: res.data.username,
            platform: 'wechat'
            // gender: info.gender === 0 ? 2 : info.gender === 1 ? 0 : info.gender === 2 ? 1 : '',
          }).then(res => {
            uni.showToast({
              title: '登录成功',
              icon: 'none'
            })
            uni.navigateBack()
          }).catch(err => {
            err && uni.showToast({
              title: '登录失败，请稍后再试',
              icon: 'none'
            })
          })
        } else {
          uni.showToast({
            title: '登录异常，即将跳往手机号登录',
            icon: 'none'
          })
          setTimeout(() => {
            uni.redirectTo({
              url: '/pages/user/login-urs'
            })
          }, 1500)
        }
      }).catch(err => {
        err && uni.showToast({
          title: '网络错误，请稍后再试',
          icon: 'none'
        })
      })
    },
    chooseAgreement () {
      this.agreement = !this.agreement
    },
    toAgreement (type) {
      uni.navigateTo({
        url: `/pages/agreement/${type}`
      })
    }
  }
}
</script>

<style lang="scss">
.login-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  .logo {
    height: 120rpx;
    width: 120rpx;
    margin: 150rpx auto 36rpx;
  }
  .tips {
    color: #333;
    line-height: 48rpx;
    font-size: 40rpx;
    font-weight: bold;
  }
  .tips + .tips {
    margin-top: 12rpx;
  }
  button {
    margin-top: 120rpx;
    width: 630rpx;
    height: 88rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28rpx;
    color: #fff;
    background: #f22;
    border-radius: 44rpx;
    font-weight: bold;
    &.disable {
      color: #4a4a4a;
      background: #eee;
    }
    &::after {
      display: none!important;
    }
  }
  .agreement {
    margin-top: 36rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24rpx;
    color: #999;
    .choose {
      width: 24rpx;
      height: 24rpx;
      border-radius: 100%;
      border: 1px solid #ddd;
      margin-right: 12rpx;
      box-sizing: border-box;
      &.choosed {
        border: none;
        background: url('../../static/icon-agreement-choose.png') no-repeat;
        background-size: contain;
      }
    }
    .navigator {
      display: inline-block;
      color: #333;
    }
  }
}
</style>
