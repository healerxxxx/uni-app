<template>
  <view class="live-basketball">
    <view class="subnav fixed"
      :style="{'opacity': isFixed ? 1 : 0, 'z-index': isFixed ? 100 : -10}"
      v-if="lastQuarter > 0">
      <scroll-view
        class="ul"
        scroll-x="true"
        :scroll-left="liveScrollLeft"
        style="width: 100%;">
        <view
          v-for="i in lastQuarter"
          class="li"
          :class="{'current': navIndex === i}"
          :key="i"
          @click="subnavChange(i)">
          {{quarterObj[i + 1]}}
          <view class="span icon" v-if="liveData.matchStatus === 2 &&  i + 1 === textLiveList[0].quarterValue"></view>
        </view>
      </scroll-view>
    </view>
    <scroll-view
      scroll-y="true"
      :scroll-top="liveScrollTop"
      @scroll="scroll"
      style="height: 100%;">
      <view
        class="live-basketball-wrapper"
        @touchstart="touchStart"
        @touchmove="touchMove">
        <view class="live-basketball-fixed">
          <basketball-stats
            :statsLiveList="statsLiveList"
            :hitPercent="hitPercent"
            :chat-num="chatNum"
            :chat-stuats="chatStatus" />
          <view class="live-basketball__player">
            <view
              class="h3"
              :class="{'hide-line': !expand}"
              @click="changeStatShow">
              <text class="span">球员数据</text>
              <text
                class="span icon"
                :class="{'down' : !expand }"
                v-if="!playerNoData">
              </text>
            </view>
            <basketball-player-stats
              type="away"
              :list="awayPlayerStat"
              :liveData ="liveData"
              v-if="awayPlayerStat.length > 0 && expand" />
            <basketball-player-stats
              type="home"
              :liveData ="liveData"
              :list="homePlayerStat"
              v-if="homePlayerStat.length > 0 && expand " />
            <view class="live-basketball__no-data" v-if="playerNoData">
              <text>暂无数据</text>
            </view>
          </view>
        </view>
        <view class="live-basketball__shootout">
          <view class="h3">
            <text class="span">文字直播</text>
          </view>
          <view
            class="subnav"
            :style="{'opacity': isFixed ? 0 : 1}"
            v-if="lastQuarter > 0">
            <scroll-view
              class="ul"
              scroll-x="true"
              :scroll-left="liveScrollLeft"
              style="width: 100%;">
              <view
                v-for="i in lastQuarter"
                class="li"
                :class="{'current': navIndex === i}"
                :key="i"
                @click="subnavChange(i)">
                {{quarterObj[i + 1]}}
                <view class="span icon" v-if="liveData.matchStatus === 2 &&  i + 1 === textLiveList[0].quarterValue"></view>
              </view>
            </scroll-view>
          </view>
          <view class="item-swiper">
            <template v-for="(item,index) in textLiveList">
              <view
                class="item"
                :class="{
                  'home' :item.position === 1, 
                  'away':item.position === 2,
                  'basketball-live-quarter': index === 0 || (index > 1 && textLiveList[index-1].quarterValue !== textLiveList[index].quarterValue)
                }"
                :key="item.nanoBasketballTextLiveId">
                <span class="time">{{item.textTime}}</span>
                <view class="text"><span class="sign">{{item.position === 1 ? '[主]' : item.position == 2 ? '[客]' : ''}}</span><span>{{item.textData}}</span></view>
                <span class="score">{{item.score}}</span>
              </view>
            </template>
            <view class="live-basketball__no-data" v-if="textLiveList.length === 0">
              <text>暂无数据</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script>
import BasketballStats from './basketball-stats'
import BasketballPlayerStats from './basketball-player-stats'
import { mapGetters } from 'vuex'
let domQuery = null
let quarterTop = []
let lastY = 0
export default {
  props: ['liveData', 'header-hidden', 'chat-num'],
  data () {
    return {
      expand: true,
      navIndex: 0,
      isFixed: false,
      scrollTop: 0,
      liveScrollTop: 0,
      quarterObj: {
        1: '第一节',
        2: '第二节',
        3: '第三节',
        4: '第四节',
        5: '加时1',
        6: '加时2',
        7: '加时3',
        8: '加时4'
      },
      liveScrollLeft: 0,
      fixedHeight: 0
    }
  },
  computed: {
    ...mapGetters(['statusBarHeight', 'customBar', 'windowScale']),
    subNavHeight () {
      return Math.floor(90 * this.windowScale)
    },
    lastQuarter () {
      return (this.textLiveList[0] && this.textLiveList[0].quarterValue) || 0
    },
    textLiveList () {
      if (this.liveData && this.liveData.basketballTextLiveList && this.liveData.basketballTextLiveList.length > 0) {
        return [...this.liveData.basketballTextLiveList].reverse()
      }
      return []
    },
    statsLiveList () {
      if (!this.liveData.statsLiveList || !this.liveData.statsLiveList.length) return {}
      const statsLiveList = {}
      this.liveData.statsLiveList.forEach(list => {
        statsLiveList[list.typeValue] = list
      })
      return statsLiveList
    },
    hitPercent () {
      const hit = {
        shooting: {
          away: 0,
          home: 0
        },
        rate_2: {
          away: 0,
          home: 0
        },
        rate_3: {
          away: 0,
          home: 0
        },
        penalty: {
          away: 0,
          home: 0
        }
      }
      const statsLiveList = this.statsLiveList
      if (!statsLiveList) return hit
      hit.shooting.home = this.returnHitRate(102, 103, 'homeValue')
      hit.shooting.away = this.returnHitRate(102, 103, 'awayValue')
      hit.rate_2.home = this.returnHitRate(118, 119, 'homeValue')
      hit.rate_2.away = this.returnHitRate(118, 119, 'awayValue')
      hit.rate_3.home = this.returnHitRate(104, 105, 'homeValue')
      hit.rate_3.away = this.returnHitRate(104, 105, 'awayValue')
      hit.penalty.home = this.returnHitRate(106, 107, 'homeValue')
      hit.penalty.away = this.returnHitRate(106, 107, 'awayValue')
      return hit
    },
    homePlayerStat () {
      return (this.liveData.basketballPlayerStats && this.liveData.basketballPlayerStats.homePlayerStats) || []
    },
    awayPlayerStat () {
      return (this.liveData.basketballPlayerStats && this.liveData.basketballPlayerStats.awayPlayerStats) || []
    },
    playerNoData () {
      return this.awayPlayerStat.length === 0 && this.homePlayerStat.length === 0
    }
  },
  components: {
    BasketballStats,
    BasketballPlayerStats
  },
  created () {
    domQuery = uni.createSelectorQuery().in(this)
    try {
      const statShow = uni.getStorageSync('statShow').val
      if (typeof statShow !== 'undefined') {
        this.expand = statShow
      }
    } catch (error) {
    }
    this.$bus.$on('detail-live-top', () => {
      this.liveScrollTop = this.scrollTop
      this.$nextTick(() => {
        this.liveScrollTop = 0
      })
    })
  },
  mounted () {
    this.setFixedHeight()
    if (this.lastQuarter !== 0) {
      this.navIndex = this.lastQuarter - 1
    }
  },
  watch: {
    navIndex (val) {
      let num = 0
      if (val <= 3) {
        num = 0
      }
      if (val === 4) {
        num = 50
      }
      if (val > 4) {
        num = 50 + 160 * (val - 4)
      }
      this.$nextTick(() => {
        this.liveScrollLeft = num * this.windowScale
      })
    },
    scrollTop (val) {
      if (quarterTop[0]) {
        this.isFixed = val >= (quarterTop[0] - this.subNavHeight)
        let index = 0
        quarterTop.map((item, i) => {
          const min = i === 0 ? 0 : item - this.subNavHeight
          const max = i === quarterTop.length - 1 ? null : quarterTop[i + 1] - this.subNavHeight
          if (val >= min && (val < max || max === null)) {
            index = i
          }
        })
        this.navIndex = this.lastQuarter - 1 - index
      }
    },
    expand () {
      this.$nextTick(() => {
        this.setFixedHeight()
      })
    },
    chatNum () {
      this.$nextTick(() => {
        this.setFixedHeight()
      })
    },
    fixedHeight () {
      this.setQuarterTop()
    },
    lastQuarter () {
      this.$nextTick(() => {
        this.setQuarterTop()
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
    scroll (e) {
      this.scrollTop = e.detail.scrollTop
      this.$emit('scroll', e)
    },
    setFixedHeight () {
      domQuery && domQuery.select('.live-basketball-fixed').boundingClientRect(data => {
        this.fixedHeight = data.height + 190 * this.windowScale
      }).exec()
    },
    setQuarterTop () {
      domQuery && domQuery.selectAll('.basketball-live-quarter').boundingClientRect(data => {
        quarterTop = []
        data.map((item, index) => {
          if (index > 0) {
            quarterTop.push(Math.floor(this.fixedHeight + item.top - data[0].top))
          } else {
            quarterTop.push(Math.floor(this.fixedHeight))
          }
        })
      }).exec()
    },
    returnHitRate (typeValue1, typeValue2, type) {
      const statsLiveList = this.statsLiveList
      return ((statsLiveList[typeValue1] && statsLiveList[typeValue1][type]) || 0) / ((statsLiveList[typeValue2] && statsLiveList[typeValue2][type]) || 1)
    },
    changeStatShow () {
      this.expand = !this.expand
      uni.setStorageSync('statShow', this.expand)
    },
    subnavChange (i) {
      this.navIndex = i
      this.liveScrollTop = this.scrollTop
      this.$nextTick(function() {
        this.liveScrollTop = quarterTop[quarterTop.length - 1 - i] - this.subNavHeight
      })
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.live-basketball{
  height: 100%;
  position: relative;
  .subnav{
    height: 90rpx;
    line-height: 90rpx;
    overflow: hidden;
    background: #ffffff;
    transform: translateZ(0);
    &.fixed {
      position: absolute;
      left: 0;
      top: 0;
      transform: translateZ(0);
      z-index: 100;
      width: 100%;
      border-bottom: 1rpx solid #e4e4ee;
    }
    .ul {
      display: block;
      white-space: nowrap;
      .li {
        display: inline-block;
        width: 160rpx;
        text-align: center;
        font-size: 28rpx;
        color: #999;
        &.current{
          color: #ff2900;
        }
        .icon{
          width: 20rpx;
          height: 24rpx;
          padding-left: 4rpx;
          display: inline-block;
          @include bg-image('https://relottery.ws.126.net/thread/20210315/3kUjd6.gif');
        }
      }
    }
  }
  &-fixed {
    padding-bottom: 16rpx;
  }
  &__player,&__shootout{
    background: #fff;
    .h3 {
      line-height: 100rpx;
      padding-left: 30rpx;
      position: relative;
      font-size: 32rpx;
      color: #333;
      font-weight: bold;
      border-bottom: 1rpx solid #e4e4e4;
      &.hide-line {
        border: none;
      }
      .icon{
        width: 25rpx;
        height: 25rpx;
        display: inline-block;
        position: absolute;
        top: 43rpx;
        right: 35rpx;
        @include bg-image('/static/match-detail/icon-arrows-up.png');
        &.down{
          transform: translateZ(0) rotate(180deg);
        }
      }
    }
  }
  &__shootout{
    position: relative;
    .item{
      position: relative;
      padding: 28rpx 32rpx 24rpx 170rpx;
      color: #666;
      font-size: 24rpx;
      background: #fbfcfd;
      &.home{
        background: #fff;
        .text{
          color: #151515;
          .sign{
            color: #EE9E2B ;
          }
        }
      }
      &.away{
      background: #f9fafb;
      }
      .text{
        display: inline-block;
        line-height: 1.5;
        width: 410rpx;
        .sign{
          padding-right: 4rpx;
        }
      }
     .time{
       position: absolute;
       top: 50%;
       left: 36rpx;
       transform: translate3d(0, -50%, 0);
       color: #333;
     }
     .score{
       position: absolute;
       right: 28rpx;
       top: 50%;
       transform: translate3d(0, -50%, 0);
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
