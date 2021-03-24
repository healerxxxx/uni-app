<template>
  <view class="detail-live__stats football">
    <view class="detail-live__stats--module">
      <view class="detail-live__stats--item">
        <view class="left" v-if="statsLiveList[2]"  :class="{'red': statsLiveList[2].homeValue > statsLiveList[2].awayValue }">{{statsLiveList[2] | statsLiveListHome}}</view>
         <view class="left" v-else>-</view>
        <view class="main">
          <text class="span icon icon-corner"></text>
          <text class="span">角球</text>
        </view>
        <view class="right"  v-if="statsLiveList[2]"  :class="{'red': statsLiveList[2].homeValue < statsLiveList[2].awayValue }">{{statsLiveList[2] | statsLiveListAway}}</view>
        <view class="right" v-else>-</view>
      </view>
      <view class="detail-live__stats--item">
        <view class="left"  v-if="statsLiveList[4]"  :class="{'red': statsLiveList[4].homeValue > statsLiveList[4].awayValue }">{{statsLiveList[4] | statsLiveListHome}}</view>
         <view class="left" v-else>-</view>
        <view class="main">
          <text class="span icon icon-red"></text>
          <text class="span">红牌</text>
        </view>
        <view class="right"  v-if="statsLiveList[4]"  :class="{'red': statsLiveList[4].homeValue < statsLiveList[4].awayValue }">{{statsLiveList[4] | statsLiveListAway}}</view>
        <view class="right" v-else>-</view>
      </view>
      <view class="detail-live__stats--item">
        <view class="left"  v-if="statsLiveList[3]"  :class="{'red': statsLiveList[3].homeValue > statsLiveList[3].awayValue }">{{statsLiveList[3] | statsLiveListHome}}</view>
         <view class="left" v-else>-</view>
        <view class="main">
          <text class="span icon icon-yellow"></text>
          <text class="span">黄牌</text>
        </view>
        <view class="right" v-if="statsLiveList[3]"  :class="{'red': statsLiveList[3].homeValue < statsLiveList[3].awayValue }">{{statsLiveList[3] | statsLiveListAway}}</view>
        <view class="right" v-else>-</view>
      </view>
    </view>
    <view class="detail-live__stats--module">
      <view class="detail-live__stats--item">
        <view class="left"  v-if="statsLiveList[23]" :class="{'red': statsLiveList[23].homeValue > statsLiveList[23].awayValue }">
          {{statsLiveList[23] |statsLiveListHome}}
        </view>
        <view class="left" v-else>-</view>
        <view class="main">
          <text class="span icon icon-attack"></text>
          <text class="span">进攻</text>
        </view>
        <view class="right"  v-if="statsLiveList[23]"  :class="{'red': statsLiveList[23].homeValue < statsLiveList[23].awayValue }">
          {{statsLiveList[23] | statsLiveListAway}}</view>
        <view class="right" v-else>-</view>
      </view>
      <view class="detail-live__stats--item" >
        <view class="left"  v-if="statsLiveList[24]" :class="{'red': statsLiveList[24].homeValue > statsLiveList[24].awayValue }">
          {{statsLiveList[24] | statsLiveListHome}}</view>
          <view class="left" v-else>-</view>
        <view class="main">
          <text class="span icon icon-dangerous-attack"></text>
          <text class="span">危险进攻</text>
        </view>
        <view class="right"  v-if="statsLiveList[24]" :class="{'red': statsLiveList[24].homeValue < statsLiveList[24].awayValue }">
          {{statsLiveList[24] | statsLiveListAway}}</view>
        <view class="right" v-else>-</view>
      </view>
    </view>
    <view class="detail-live__stats--module" >
      <view class="detail-live__stats--item">
        <view class="left"  v-if="statsLiveList[25]" :class="{'red': statsLiveList[25].homeValue > statsLiveList[25].awayValue }">
          {{statsLiveList[25] | statsLiveListHome}}%</view>
          <view class="left" v-else>-</view>
        <view class="main">
          <text class="span icon icon-control"></text>
          <text class="span">控球率</text>
        </view>
        <view class="right"  v-if="statsLiveList[25]" :class="{'red': statsLiveList[25].homeValue < statsLiveList[25].awayValue }">
          {{statsLiveList[25]| statsLiveListAway}}%</view>
        <view class="right" v-else>-</view>
      </view>
      <view class="detail-live__stats--item" >
        <view class="left"  v-if="statsLiveList[21]" :class="{'red': statsLiveList[21].homeValue > statsLiveList[21].awayValue }">
          {{statsLiveList[21] | statsLiveListHome}}</view>
          <view class="left" v-else>-</view>
        <view class="main">
          <text class="span icon icon-orthonormal"></text>
          <text class="span">射正次数</text>
        </view>
        <view class="right"   v-if="statsLiveList[21]" :class="{'red': statsLiveList[21].homeValue < statsLiveList[21].awayValue }">
          {{statsLiveList[21] | statsLiveListAway}}</view>
        <view class="right" v-else>-</view>
      </view>
      <view class="detail-live__stats--item" >
        <view class="left"
         v-if="statsLiveList[21] && statsLiveList[22]"
          :class="{'red': (statsLiveList[21].homeValue +statsLiveList[22].homeValue) > (statsLiveList[21].awayValue +statsLiveList[22].awayValue) }">
          {{(statsLiveList[21] && statsLiveList[22])  ? (statsLiveList[21].homeValue +statsLiveList[22].homeValue) : '-'}}
        </view>
        <view class="left" v-else>-</view>
        <view class="main">
          <text class="span icon icon-football-shoot"></text>
          <text class="span">射门次数</text>
        </view>
        <view class="right"
         v-if="statsLiveList[21] && statsLiveList[22]"
          :class="{'red': (statsLiveList[21].homeValue +statsLiveList[22].homeValue) < (statsLiveList[21].awayValue +statsLiveList[22].awayValue)}">
          {{(statsLiveList[21] && statsLiveList[22])  ? (statsLiveList[21].awayValue +statsLiveList[22].awayValue) : '-'}}
        </view>
        <view class="right" v-else>-</view>
      </view>
    </view>
    <view class="chat-tips" v-if="chatNum > 1000 && chatStatus === 1" @click="toDownload">
      <text class="span">{{chatNum | chatNum2EN}}人正在一起热聊,去红彩APP参与聊天</text>
      <view class="arrows"></view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'football-stats',
  props: ['statsLiveList', 'chat-num', 'chat-stuats'],
  filters: {
    statsLiveListHome (value) {
      return value ? value.homeValue : '-'
    },
    statsLiveListAway (value) {
      return value ? value.awayValue : '-'
    },
    chatNum2EN (val) {
      if (val < 10000) {
        return (val / 1000).toFixed(1) + 'K'
      } else if (val < 100000) {
        return (val / 10000).toFixed(1) + 'W'
      } else {
        return (val / 10000).toFixed(0) + 'W'
      }
    }
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
@import '@/assets/style/mixin.scss';
.detail-live {
  &__stats {
    flex-shrink: 0;
    background: #fff;
    &.football{
      padding: 32rpx  32rpx  36rpx 32rpx;
    }
    &--module {
      background: #f9fafb;
      border-radius: 6rpx;
      &:not(:first-child) {
        margin-top: 16rpx;
      }
    }
    &--item {
      height: 62rpx;
      line-height: 62rpx;
      margin: 0 24rpx;
      font-size: 24rpx;
      color: #333;
      display: flex;
      flex-direction: row;
      position: relative;
      &:not(:last-child) {
        border-bottom: 1rpx solid #fff;
      }
      .red {
        color: #ff2222;
      }
      .left ,.right{
        width: 100rpx;
        text-align: left;
        display: inline-block;
        white-space: nowrap;
        span + span{
          margin-left: -8rpx;
        }
      }
      .main {
        flex: 1;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 11;
        .icon {
          margin-right: 8rpx;
          width: 32rpx;
          height: 32rpx;
          display: inline-block;
          vertical-align: middle;
        }
      }
      .left{
        padding-left: 32rpx;
      }
      .right {
        padding-right: 32rpx;
        text-align: right;
      }
    }
    .chat-tips {
      margin: 20rpx auto 0;
      width: 525rpx;
      height: 64rpx;
      background: #F2F8FF;
      border: 1px solid #65AFFF;
      border-radius: 44rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #65AFFF;
      box-sizing: border-box;
      .arrows {
        width: 12rpx;
        height: 22rpx;
        margin-left: 10rpx;
        @include bg-image("/static/match-detail/icon-arrows-chart-thread.png");
      }
    }
  }
}
</style>
