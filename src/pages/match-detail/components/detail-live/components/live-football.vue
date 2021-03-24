<template>
  <view class="live-football">
    <view
      class="tab fixed"
      :style="{'opacity': isFixed ? 1 : 0, 'z-index': isFixed ? 100 : -10}">
      <view class="tab-item" :class="{'current': navIndex === 0 }" @click="navChange(0)"><span>重要事件直播</span></view>
      <view class="tab-item" :class="{'current': navIndex === 1 }" @click="navChange(1)"><span>文字直播</span></view>
    </view>
    <scroll-view
      scroll-y="true"
      :scroll-top="liveScrollTop"
      @scroll="scroll"
      style="height: 100%;">
      <view
        class="live-football-wrapper"
        @touchstart="touchStart"
        @touchmove="touchMove">
        <view class="live-football-fixed">
          <view class="live-football__surprise" v-if="surpriseDescribeList.length > 0">
            <view class="p" v-for="(item, index) in surpriseDescribeList" :key="index">
              <text class="span">·{{item.describe}}</text>
            </view>
          </view>
          <football-stats
            :statsLiveList="statsLiveList"
            :chat-num="chatNum"
            :chat-stuats="chatStatus" />
        </view>
        <view class="live-football-content">
          <view class="tab" :style="{'opacity': isFixed ? 0 : 1}">
            <view class="tab-item" :class="{'current': navIndex === 0 }" @click="navChange(0)"><span>重要事件直播</span></view>
            <view class="tab-item" :class="{'current': navIndex === 1 }" @click="navChange(1)"><span>文字直播</span></view>
          </view>
          <view
            class="live-football__penalty-timeLine"
            v-show="navIndex === 0">
            <football-timeline
              :iconType="iconType"
              :eventType="eventType"
              v-if="liveData.incidentsList.length > 0"
              :incidentsList="liveData.incidentsList" />
            <view class="live-football__no-data" v-else>
              <text>暂无数据</text>
            </view>
          </view>
          <view
            class="live-football__penalty-shootout"
            v-show="navIndex === 1">
            <view class="shootout"
              v-if="liveData.textLiveList && liveData.textLiveList.length > 0">
              <view class="title" v-if="liveData.matchExplain">{{liveData.matchExplain}}</view>
              <view class="item" v-for="item in liveData.textLiveList.slice()" :key="item.nanoFootballTextLiveId"
                :class="{'home': item.position === 1, 'guest': item.position === 2}">
                <view class="span icon" :class="iconType[item.typeValue] || 'icon-commentary'"></view>
                <view class="span time">{{item.textTime || ''}}</view>
                <view class="text" >
                  <text class="span">{{item.position === 1 ? '[主]' : item.position == 2 ? '[客]' : ''}}</text>
                  {{item.textData}}
                </view>
              </view>
              <view class="item" v-if="environmentLive">
                <text class="span icon icon-commentary"></text>
                <text class="span time"></text>
                <view class="text">比赛天气情况：{{weatherDescription[environmentLive.weather]}}</view>
              </view>
              <view
                class="live-football__weather"
                :class="[`bgType-${environmentLive.weather}`]"
                v-if="liveData.environmentLive">
                <view class="temperature">{{liveData.environmentLive.temperature}}</view>
                <view class="timeLine">
                  <text class="span">气压: {{environmentLive.pressure}}</text>
                  <text class="span">风速: {{environmentLive.wind}}</text>
                  <text class="span">温度: {{environmentLive.temperature}}</text>
                  <text class="span">湿度: {{environmentLive.humidity}}</text>
                </view>
                <view class="weather-text">
                  <text class="span icon" :class="[`iconType-${environmentLive.weather}`]"></text>
                  <text class="span text">{{weatherDescription[environmentLive.weather]}}</text>
                </view>
              </view>
            </view>
            <view class="live-football__no-data" v-else>
              <text>暂无数据</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script>
import FootballStats from './football-stats'
import FootballTimeline from './football-timeline'
import { mapGetters } from 'vuex'
let domQuery = null
let tabTop = 0
let lastY = 0
export default {
  data () {
    return {
      weatherDescription: {
        1: '局部有云',
        2: '多云',
        3: '局部有云,雨',
        4: '雪',
        5: '晴',
        6: '阴有雨,局部有雷暴',
        7: '阴',
        8: '薄雾',
        9: '阴有雨',
        10: '多云有雨',
        11: '多云有雨,局部有雷暴',
        12: '局部有云,雨和雷暴',
        13: '雾'
      },
      iconType: {
        1: 'icon-goal',
        2: 'icon-corner',
        3: 'icon-yellow',
        4: 'icon-red',
        8: 'icon-penalty-kick',
        9: 'icon-trans',
        10: 'icon-whistle',
        11: 'icon-commentary',
        12: 'icon-whistle',
        13: 'icon-commentary',
        15: 'icon-yellow2red',
        16: 'icon-penalty-kick-loss',
        17: 'icon-own-goal',
        26: 'icon-whistle',
        27: 'icon-whistle'
      },
      eventType: {
        1: '进球',
        2: '角球',
        3: '黄牌',
        4: '红牌',
        5: '界外球',
        6: '任意球',
        7: '球门球',
        8: '点球',
        9: '换人',
        10: '比赛开始',
        11: '中场',
        12: '结束',
        13: '半场比分',
        15: '两黄变红',
        16: '点球未进',
        17: '乌龙球',
        19: '伤停补时',
        21: '射正',
        22: '射偏',
        23: '进攻',
        24: '危险进攻',
        25: '控球率',
        26: '加时比赛结束',
        27: '点球大战结束'
      },
      navIndex: 0,
      isFixed: false,
      scrollTop: 0,
      liveScrollTop: 0
    }
  },
  props: ['liveData', 'header-hidden', 'chat-num'],
  components: {
    FootballStats,
    FootballTimeline,
  },
  computed: {
    ...mapGetters(['statusBarHeight', 'customBar']),
    environmentLive () {
      return this.liveData.environmentLive || null
    },
    statsLiveList () {
      if (!this.liveData.statsLiveList || !this.liveData.statsLiveList.length) return {}
      const statsLiveList = {}
      this.liveData.statsLiveList.forEach(list => {
        statsLiveList[list.typeValue] = list
      })
      statsLiveList.shot = {} // 前端自定义事件  射门 = 射正 + 射偏
      statsLiveList.shot.homeValue = statsLiveList[21].homeValue + statsLiveList[22].homeValue
      statsLiveList.shot.awayValue = statsLiveList[21].awayValue + statsLiveList[22].awayValue
      return statsLiveList
    },
    surpriseDescribeList () {
      return this.liveData.surpriseDescribeList || []
    }
  },
  created () {
    domQuery = uni.createSelectorQuery().in(this)
    this.$bus.$on('detail-live-top', () => {
      this.liveScrollTop = this.scrollTop
      this.$nextTick(function() {
        this.liveScrollTop = 0
      })
    })
  },
  mounted() {
    this.setTabTop()
  },
  watch: {
    surpriseDescribeList: {
      deep: true,
      handler () {
        this.$nextTick(() => {
          setTimeout(() => {
            this.setTabTop()
          }, 16)
        })
      }
    },
    chatNum () {
      this.$nextTick(() => {
        setTimeout(() => {
          this.setTabTop()
        }, 16)
      })
    }
  },
  methods: {
    touchStart (e) {
      const pageY = e && e.touches && e.touches[0].pageY
      pageY && (lastY = pageY)
    },
    touchMove (e) {
      const pageY = e && e.touches && e.touches[0].pageY
      if (pageY) {
        if (pageY - lastY > 0) {
          if (this.scrollTop <= 10 && this.headerHidden) {
            this.$emit('move', 'down')
          }
        } else {
          if (!this.headerHidden) {
            this.$emit('move', 'up')
          }
        }
      }
    },
    navChange (i) {
      this.navIndex = i
      if (this.isFixed) {
        this.liveScrollTop = this.scrollTop
        this.$nextTick(() => {
          this.liveScrollTop = tabTop
        })
      }
    },
    scroll (e) {
      this.scrollTop = e.detail.scrollTop
      this.isFixed = this.scrollTop >= tabTop
      this.$emit('scroll', e)
    },
    setTabTop () {
      domQuery && domQuery.select('.live-football-fixed').boundingClientRect(data => {
        tabTop = data.height
      }).exec()
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/style/mixin.scss";
.live-football {
  height: 100%;
  position: relative;
  .icon-commentary {
    @include bg-image("/static/match-detail/icon-commentary.png");
  }
  .icon-whistle {
    @include bg-image("/static/match-detail/icon-whistle.png");
  }
  &-fixed {
    padding-bottom: 16rpx;
  }
  &__surprise {
    background: #f4f9ff;
    padding: 8rpx 0;
    .p {
      padding-left: 30rpx;
      line-height: 28rpx;
      color: #65afff;
      // width: 840rpx;
      .span {
        display: inline-block;
        vertical-align: middle;
        font-size: 24rpx;
        transform: scale(0.82) translateZ(0);
        transform-origin: 0 50%;
      }
    }
  }
  .tab {
    height: 119rpx;
    padding-bottom: 1rpx;
    line-height: 120rpx;
    background: #fff;
    color: #999;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
    transform: translateZ(0);
    border-bottom: 1rpx solid #ddd;
    &.fixed{
      position: absolute;
      transform: translateZ(0);
      top: 0;
      right: 0;
      z-index: 20;
    }
    &-item {
      display: inline-block;
      height: 62rpx;
      line-height: 62rpx;
      width: 216rpx;
      text-align: center;
      position: relative;
      border-radius: 31rpx;
      &:last-child {
        margin-left: 32rpx;
      }
      border: 1px solid #ddd;
      &.current {
        color: #f22;
        background: rgba(255, 34, 34, 0.1);
        border: 1px solid #f22;
      }
    }
    .span {
      font-size: 24rpx;
      display: inline-block;
      transform: scale(1.17);
      vertical-align: middle;
      line-height: 50rpx;
      height: 48rpx;
    }
  }
  &-content {
    flex: auto;
    background: #fff;
  }
  &__penalty-timeLine {
    width: 100%;
    box-sizing: border-box;
    font-size: 24rpx;
    padding: 36rpx 32rpx;
  }
  &__penalty-shootout {
    .title {
      padding: 0 32rpx;
      font-size: 28rpx;
      color: #333;
      text-align: left;
      height: 90rpx;
      line-height: 90rpx;
      font-weight: bold;
    }
    .item {
      padding: 28rpx 90rpx 24rpx 176rpx;
      color: #666;
      font-size: 24rpx;
      position: relative;
      background: #fbfcfd;
      .icon {
        display: inline-block;
        width: 44rpx;
        height: 44rpx;
        position: absolute;
        left: 32rpx;
        transform: translate3d(0, -50%, 0);
        top: 50%;
      }
      .time {
        color: #333;
        position: absolute;
        left: 80rpx;
        top: 50%;
        transform: translate3d(0, -50%, 0);
      }
      .text {
        display: inline-block;
        line-height: 1.5;
        color: #666;
        .span{
          padding-right: 4rpx;
        }
        .player-name {
          color: #151515;
        }
      }
      &.home {
        background: #fff;
        .text {
          color: #151515;
          .span{
            color: #ffb447;
          }
        }
      }
      &.guest{
        background: #f9fafb;
      }
    }
  }
  &__weather {
    width: 410rpx;
    height: 170rpx;
    margin: 46rpx auto 66rpx;
    background: #fff;
    color: #fff;
    padding: 0 42rpx;
    padding-left: 234rpx;
    overflow: hidden;
    position: relative;
    &.bgType-5, &.bgType-1 {
      background: url('https://relottery.ws.126.net/thread/20201118/IYmZ8H.png') no-repeat;
      background-size: contain;
    }
    &.bgType-2 {
      background: url('https://relottery.ws.126.net/thread/20201118/3xpFw6.png') no-repeat;
      background-size: contain;
    }
    &.bgType-3, &.bgType-10 {
      background: url('https://relottery.ws.126.net/thread/20201118/tLNjW1.png') no-repeat;
      background-size: contain;
    }
    &.bgType-4 {
      background: url('https://relottery.ws.126.net/thread/20201118/5CpE5t.png') no-repeat;
      background-size: contain;
    }
    &.bgType-8, &.bgType-13 {
      background: url('https://relottery.ws.126.net/thread/20201118/AH0zOM.png') no-repeat;
      background-size: contain;
    }
    &.bgType-7{
      background: url('https://relottery.ws.126.net/thread/20201118/zvvHQo.png') no-repeat;
      background-size: contain;
    }
    &.bgType-9 {
      background: url('https://relottery.ws.126.net/thread/20201118/hoykWA.png') no-repeat;
      background-size: contain;
    }
    &.bgType-6, &.bgType-11, &.bgType-12 {
      background: url('https://relottery.ws.126.net/thread/20201118/FSnPBo.png') no-repeat;
      background-size: contain;
    }
    .weather-text {
      font-size: 24rpx;
      position: absolute;
      bottom: 18rpx;
      left: 42rpx;
      line-height: 50rpx;
      .icon {
        display: inline-block;
        width: 52rpx;
        height: 52rpx;
        vertical-align: middle;
        margin-right: 7rpx;
        &.iconType-5 {
          background: url("/static/match-detail/icon-weather-sunny.png") no-repeat;
          background-size: contain;
        }
        &.iconType-1,
        &.iconType-2,
        &.iconType-7 {
          background: url("/static/match-detail/icon-weather-cloudy-sunny.png") no-repeat;
          background-size: contain;
        }
        &.iconType-3,
        &.iconType-10 {
          background: url("/static/match-detail/icon-weather-cloud.png") no-repeat;
          background-size: contain;
        }
        &.iconType-4 {
          background: url("/static/match-detail/icon-weather-snow.png") no-repeat;
          background-size: contain;
        }
        &.iconType-8,
        &.iconType-13 {
          background: url("/static/match-detail/icon-weather-fog.png") no-repeat;
          background-size: contain;
        }
        &.iconType-9 {
          background: url("/static/match-detail/icon-weather-rain.png") no-repeat;
          background-size: contain;
        }
        &.iconType-6,
        &.iconType-12,
        &.iconType-11 {
          background: url("/static/match-detail/icon-weather-rainstorm.png") no-repeat;
          background-size: contain;
        }
      }
      .text {
        position: relative;
        top: 3rpx;
      }
    }
    .temperature {
      position: absolute;
      font-size: 64rpx;
      left: 42rpx;
      top: 34rpx;
      line-height: 1;
    }
    .timeLine {
      width: 410rpx;
      left: 234rpx;
      font-size: 24rpx;
      margin-top: 34rpx;
      .span {
        width: 60%;
        float: left;
        margin-bottom: 18rpx;
        line-height: 1;
        &:nth-child(2n) {
          width: 40%;
        }
      }
    }
  }
  &__no-data {
    line-height: 290rpx;
    background: #fff;
    text-align: center;
    color: #bbb;
    font-size: 28rpx;
  }
}
</style>
