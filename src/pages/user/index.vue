<template>
  <view class="user-wrapper">
    <view class="user-wrapper__header">
      <nav-bar
        :is-back="false"
        transparent />
      <view
        class="user-wrapper__header--info"
        @click="toLogin"
        :class="{'login': isLogin}">
        <view class="user-wrapper__header--info--avatar">
          <image :src="userInfo.avatar || defaultAvatar" />
        </view>
        <view class="user-wrapper__header--info--nickname">{{isLogin ? userInfo.nickname : '请登录'}}</view>
        <view
          class="user-wrapper__header--info--tips"
          v-if="!isLogin">
          <text>马上登录，享更多精彩服务</text>
        </view>
      </view>
    </view>
    <view class="user-wrapper__content">
      <view
        class="user-wrapper__content--item"
        @click="toBetAssistantList">
        <text>竞彩投注助手</text>
        <view class="icon-arrow"></view>
      </view>
      <view
        class="user-wrapper__content--item"
        @click="toBetAssistantHistory">
        <text>模拟投注历史</text>
        <view class="icon-arrow"></view>
      </view>
      <view
        class="user-wrapper__content--item"
        @click="toService">
        <text>更多服务</text>
        <view class="icon-arrow"></view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data () {
    return {
      defaultAvatar: '/static/default-avatar.png'
    }
  },
  computed: {
    ...mapGetters(['isLogin']),
    ...mapState(['userInfo'])
  },
  onShareAppMessage (res) {
    return {
      title: '网易欧洲杯',
    }
  },
  methods: {
    toLogin () {
      if (this.isLogin) return
      uni.navigateTo({
        url: '/pages/user/login'
      })
    },
    toBetAssistantList () {
      uni.navigateTo({
        url: '/pages/bet-assistant/list/index'
      })
    },
    toBetAssistantHistory () {
      if (this.isLogin) {
        uni.navigateTo({
          url: '/pages/bet-assistant/history/index'
        })
      } else {
        this.toLogin()
      }
    },
    toService () {
      uni.navigateTo({
        url: '/pages/user/service'
      })
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.user-wrapper {
  min-height: 100vh;
  &__header {
    background-image: linear-gradient(218deg, #F73131 31%, #F24614 100%);
    &--info {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-wrap: nowrap;
      color: #fff;
      padding-bottom: 68rpx;
      &.login {
        padding-bottom: 96rpx;
      }
      &--avatar {
        width: 100rpx;
        height: 100rpx;
        border-radius: 100%;
        overflow: hidden;
        transform: translateZ(0);
        img, image {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }
      }
      &--nickname {
        margin-top: 20rpx;
        font-size: 40rpx;
        line-height: 56rpx;
        font-weight: bold;
      }
      &--tips {
        padding-top: 12rpx;
        font-size: 28rpx;
        line-height: 40rpx;
      }
    }
  }
  .user-info{
    padding: 20rpx 0 54rpx 0;
    .avatar{
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
    }
    .islogin{
      margin-top: 10rpx;
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      width: 400rpx;
    }
    .unlogin{
      text-align: center;
      font-size: 36rpx;
      color: #333;
      margin-top: 10rpx;
      .registered{
        margin-left: 35rpx;
        position: relative;
        &:before{
          content: '';
          position: absolute;
          left: -15rpx;
          top: 7rpx;
          bottom: 3rpx;
          width: 1rpx;
          background: #333;
        }
      }
    }
  }
  &__content{
    padding-left: 32rpx;
    &--item {
      height: 108rpx;
      line-height: 108rpx;
      padding-right: 32rpx;
      color: #333;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 28rpx;
      border-bottom: 1rpx solid #e5e5e5;
      .icon-arrow{
        display: inline-block;
        width: 16rpx;
        height: 26rpx;
        @include bg-image('../../static/icon-arrows-right-d2.png');
      }
    }
  }
}	
</style>
