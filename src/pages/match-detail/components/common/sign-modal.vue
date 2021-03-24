<template>
  <view class="sign-modal">
    <view class="sign-modal__cover"
      v-if="modalShow"
      @touchend="modalShow = false"
      @click="modalShow = false">
    </view>
    <view class="sign-modal__modal" :style="!hidden && height !== null ? `bottom: ${height}px` : ''">
      <view
        class="sign-modal__modal--top"
        :class="{'no-sign': categoryId !== 1}"
        @click="$bus.$emit('detail-live-top')"
        v-if="!topHidden && topShow">
      </view>
      <view
        class="sign-modal__modal--sign"
        @click="modalShow = !modalShow"
        v-if="categoryId === 1"></view>
      <view class="main" v-show="modalShow">
        <view class="li">
          <view class="icon icon-goal"></view>
          <view class="des"><view class="span">进球</view></view>
        </view>
        <view class="li">
          <view class="icon icon-penalty-kick"></view>
          <view class="des"><view class="span">点球</view></view>
        </view>
        <view class="li">
          <view class="icon icon-penalty-kick-loss"></view>
          <view class="des"><view class="span">点球未进</view></view>
        </view>
        <view class="li">
          <view class="icon icon-assist"></view>
          <view class="des"><view class="span">助攻</view></view>
        </view>
        <view class="li">
          <view class="icon icon-own-goal"></view>
          <view class="des"><view class="span">乌龙球</view></view>
        </view>
        <view class="li">
          <view class="icon icon-red"></view>
          <view class="des"><view class="span">红牌</view></view>
        </view>
        <view class="li">
          <view class="icon icon-yellow"></view>
          <view class="des"><view class="span">黄牌</view></view>
        </view>
        <view class="li">
          <view class="icon icon-yellow2red"></view>
          <view class="des"><view class="span">两黄变红</view></view>
        </view>
        <view class="li">
          <view class="icon icon-trans"></view>
          <view class="des"><view class="span">换人</view></view>
        </view>
        <view class="li">
          <view class="icon icon-corner"></view>
          <view class="des"><view class="span">角球</view></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'sign-modal',
  props: ['top-hidden', 'categoryId', 'scroll-top'],
  data () {
    return {
      modalShow: false,
      topShow: false
    }
  },
  computed: {
    hidden () {
      return this.headerHidden()
    },
    height () {
      return this.headerHeight()
    },
    top () {
      return this.contentHeight()
    }
  },
  inject: ['headerHidden', 'headerHeight', 'contentHeight'],
  watch: {
    scrollTop (val) {
      if (val && this.top) {
        this.topShow = val > this.top / 2
      }
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.sign-modal {
  &__cover {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
  }
  &__modal {
    position: fixed;
    width: 80rpx;
    height: 80rpx;
    right: 32rpx;
    bottom: 0;
    margin-bottom: 40rpx;
    z-index: 102;
    &--sign {
      position: absolute;
      width: 60rpx;
      height: 60rpx;
      left: 10rpx;
      bottom: 10rpx;
      @include bg-image("/static/match-detail/icon-sign.png");
    }
    &--top {
      width: 60rpx;
      height: 60rpx;
      position: absolute;
      left: 10rpx;
      bottom: 90rpx;
      @include bg-image("/static/match-detail/icon-to-top.png");
      &.no-sign {
        bottom: 10rpx;
      }
    }
    .main {
      width: 620rpx;
      height: 208rpx;
      padding: 18rpx 34rpx;
      position: absolute;
      right: -1rpx;
      bottom: 88rpx;
      background: #fff;
      border-radius: 16rpx;
      box-shadow: 0 2rpx 10rpx 0 rgba(8, 8, 8, 0.2);
      &:after {
        position: absolute;
        content: "";
        width: 0;
        height: 0;
        top: 230rpx;
        right: 26rpx;
        border-top: 28rpx solid #fff;
        border-left: 14rpx solid transparent;
        border-right: 14rpx solid transparent;
      }
      .li {
        width: 124rpx;
        height: 28rpx;
        padding: 58rpx 0 18rpx;
        display: inline-block;
        vertical-align: top;
        position: relative;
        .icon {
          position: absolute;
          bottom: 50rpx;
          width: 44rpx;
          height: 40rpx;
          left: 50%;
          margin-left: -22rpx;
        }
        .des {
          line-height: 28rpx;
          text-align: center;
          .span {
            display: inline-block;
            font-size: 24rpx;
            color: #666666;
            transform: scale(0.82) translateZ(0);
          }
        }
      }
    }
  }
}
</style>
