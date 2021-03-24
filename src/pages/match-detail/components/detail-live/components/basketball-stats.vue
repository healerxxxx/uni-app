<template>
  <view class="detail-live__stats basketball">
    <view class="detail-live__stats--module">
      <view class="detail-live__stats--item">
        <view class="left" v-if="statsLiveList[108] || statsLiveList[109]">
          <text :class="{'red': statsLiveList[108].homeValue < statsLiveList[108].awayValue }">{{statsLiveList[108] | statsLiveListAway}}/</text>
          <text :class="{'red': statsLiveList[109].homeValue < statsLiveList[109].awayValue }">{{statsLiveList[109] | statsLiveListAway}}</text>
        </view>
         <view class="left" v-else>-</view>
        <view class="main">
          <text class="span icon icon-backboard"></text>
          <text class="span">篮板(前/后)</text>
        </view>
        <view class="right" v-if="statsLiveList[108] || statsLiveList[109]">
          <text :class="{'red': statsLiveList[108].homeValue > statsLiveList[108].awayValue }">{{statsLiveList[108] | statsLiveListHome}}/</text>
          <text :class="{'red': statsLiveList[109].homeValue > statsLiveList[109].awayValue }">{{statsLiveList[109] | statsLiveListHome}}</text>
         </view>
        <view class="right" v-else>-</view>
      </view>
      <view class="detail-live__stats--item">
        <view class="left"  v-if="statsLiveList[111]" :class="{'red': statsLiveList[111].homeValue < statsLiveList[111].awayValue }">{{statsLiveList[111] | statsLiveListAway}}</view>
         <view class="left" v-else>-</view>
        <view class="main">
          <text class="span icon icon-basket-assists"></text>
          <text class="span">助攻</text>
        </view>
        <view class="right"  v-if="statsLiveList[111]" :class="{'red': statsLiveList[111].homeValue > statsLiveList[111].awayValue }">{{statsLiveList[111] | statsLiveListHome}}</view>
        <view class="right" v-else>-</view>
      </view>
      <view class="detail-live__stats--item">
        <view class="left" v-if="statsLiveList[112]" :class="{'red': statsLiveList[112].homeValue < statsLiveList[112].awayValue }">{{statsLiveList[112] | statsLiveListAway}}</view>
         <view class="left" v-else>-</view>
        <view class="main">
          <text class="span icon icon-snatch"></text>
          <text class="span">抢断</text>
        </view>
        <view class="right"  v-if="statsLiveList[112]" :class="{'red': statsLiveList[112].homeValue > statsLiveList[112].awayValue }">{{statsLiveList[112] | statsLiveListHome}}</view>
        <view class="right" v-else>-</view>
      </view>
      <view class="detail-live__stats--item">
        <view class="left"  v-if="statsLiveList[113]" :class="{'red': statsLiveList[113].homeValue < statsLiveList[113].awayValue }">
          {{statsLiveList[113] | statsLiveListAway}}</view>
        <view class="left" v-else>-</view>
        <view class="main">
          <text class="span icon icon-shot-block"></text>
          <text class="span">盖帽</text>
        </view>
        <view class="right"  v-if="statsLiveList[113]" :class="{'red': statsLiveList[113].homeValue > statsLiveList[113].awayValue }">{{statsLiveList[113] |statsLiveListHome}}</view>
        <view class="right" v-else>-</view>
      </view>
      <view class="detail-live__stats--item" >
        <view class="left"  v-if="statsLiveList[115]" :class="{'red': statsLiveList[115].homeValue < statsLiveList[115].awayValue }">
          {{statsLiveList[115] | statsLiveListAway}}</view>
          <view class="left" v-else>-</view>
        <view class="main">
          <text class="span icon icon-foul"></text>
          <text class="span">犯规</text>
        </view>
        <view class="right"  v-if="statsLiveList[115]" :class="{'red': statsLiveList[115].homeValue > statsLiveList[115].awayValue }">
          {{statsLiveList[115] | statsLiveListHome}}</view>
        <view class="right" v-else>-</view>
      </view>
      <view class="detail-live__stats--item">
        <view class="left"  v-if="statsLiveList[114]" :class="{'red': statsLiveList[114].homeValue < statsLiveList[114].awayValue }">
          {{statsLiveList[114]| statsLiveListAway}}</view>
          <view class="left" v-else>-</view>
        <view class="main">
          <text class="span icon icon-turnover"></text>
          <text class="span">失误</text>
        </view>
        <view class="right"  v-if="statsLiveList[114]" :class="{'red': statsLiveList[114].homeValue > statsLiveList[114].awayValue }">
          {{statsLiveList[114] | statsLiveListHome}}</view>
        <view class="right" v-else>-</view>
      </view>
    </view>
    <view class="detail-live__stats--module" >
      <view class="detail-live__stats--item" >
        <view class="left" v-if="hitPercent.shooting.away" :class="{'red': returnPercent(hitPercent.shooting.home) < returnPercent(hitPercent.shooting.away) }">
          {{hitPercent.shooting.away |  returnPercent}}</view>
          <view class="left" v-else>-</view>
        <view class="main">
          <text class="span icon icon-basket-shoot"></text>
          <text class="span">投篮命中率</text>
        </view>
        <view class="right"  v-if="hitPercent.shooting.home" :class="{'red':  returnPercent(hitPercent.shooting.home) >  returnPercent(hitPercent.shooting.away) }">
          {{hitPercent.shooting.home |  returnPercent}}</view>
        <view class="right" v-else>-</view>
      </view>
      <view class="detail-live__stats--item" >
       <view class="left" v-if="hitPercent.rate_2.away" :class="{'red':  returnPercent(hitPercent.rate_2.home) < returnPercent( hitPercent.rate_2.away) }">
          {{hitPercent.rate_2.away |  returnPercent}}</view>
        <view class="left" v-else>-</view>
        <view class="main">
          <text class="span icon icon-shoot-2"></text>
          <text class="span">2分命中率</text>
        </view>
       <view class="right"  v-if="hitPercent.rate_2.home" :class="{'red':  returnPercent(hitPercent.rate_2.home) >  returnPercent(hitPercent.rate_2.away) }">
          {{hitPercent.rate_2.home | returnPercent}}</view>
        <view class="right" v-else>-</view>
      </view>
      <view class="detail-live__stats--item" >
       <view class="left" v-if="hitPercent.rate_3.away" :class="{'red':  returnPercent(hitPercent.rate_3.home) <  returnPercent(hitPercent.rate_3.away) }">
          {{hitPercent.rate_3.away | returnPercent}}</view>
        <view class="left" v-else>-</view>
        <view class="main">
          <text class="span icon icon-shoot-3"></text>
          <text class="span">3分命中率</text>
        </view>
       <view class="right"  v-if="hitPercent.rate_3.home" :class="{'red':  returnPercent(hitPercent.rate_3.home) >  returnPercent(hitPercent.rate_3.away) }">
          {{hitPercent.rate_3.home | returnPercent}}</view>
        <view class="right" v-else>-</view>
      </view>
       <view class="detail-live__stats--item" >
       <view class="left" v-if="hitPercent.penalty.away" :class="{'red':  returnPercent(hitPercent.penalty.home) <  returnPercent(hitPercent.penalty.away) }">
          {{hitPercent.penalty.away | returnPercent}}</view>
        <view class="left" v-else>-</view>
        <view class="main">
          <text class="span icon icon-free-throw"></text>
          <text class="span">罚球命中率</text>
        </view>
       <view class="right"  v-if="hitPercent.penalty.home" :class="{'red':  returnPercent(hitPercent.penalty.home) > returnPercent(hitPercent.penalty.away) }">
          {{hitPercent.penalty.home |  returnPercent}}</view>
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
  name: 'basketball-stats',
  props: ['statsLiveList', 'hitPercent', 'chat-num', 'chat-status'],
  data () {
    return {
    }
  },
  filters: {
    statsLiveListHome (value) {
      return value ? value.homeValue : '-'
    },
    statsLiveListAway (value) {
      return value ? value.awayValue : '-'
    },
    returnPercent (num) {
      return Math.round(num * 100) + '%'
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
    returnPercent (num) {
      return Math.round(num * 100) + '%'
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
.detail-live {
  &__stats {
    flex-shrink: 0;
    background: #fff;
    margin-bottom: 16rpx;
    &.basketball{
      padding: 30rpx  32rpx  34rpx 32rpx;
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
      width: 523rpx;
      height: 62rpx;
      background: #F2F8FF;
      border: 1px solid #65AFFF;
      border-radius: 44rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #65AFFF;
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
