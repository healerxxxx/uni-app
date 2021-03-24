<template>
  <view class="basketball-player-rank">
    <view class="basketball-player-rank__nav">
      <view :class="{'current': index === 0}" @click="switchTab(0)">得分</view>
      <view :class="{'current': index === 1}" @click="switchTab(1)">篮板</view>
      <view :class="{'current': index === 2}" @click="switchTab(2)">助攻</view>
      <view :class="{'current': index === 3}" @click="switchTab(3)">抢断</view>
      <view :class="{'current': index === 4}" @click="switchTab(4)">盖帽</view>
    </view>
    <view class="basketball-player-rank__viewst">
      <view
        class="basketball-player-rank__viewst--scroll"
        ref="scroll"
        v-if="!loading && !noData">
        <view class="basketball-player-rank__head">
          <view class="rank"></view>
          <view class="player"><view>球员</view></view>
          <view class="team"><view>球队</view></view>
          <view class="number"><view>场均{{typeKey[index].label}}</view></view>
        </view>
        <view class="basketball-player-rank__detail" v-for="(item, i) in viewst" :key="i">
          <view class="rank">{{i + 1}}</view>
          <view class="player" @click="toPlayerInfo(item.playerId)">
            <view class="pic">
              <image :src="/relottery|(126.net)/.test(item.logo) ? item.logo + '?imageView&thumbnail=54y54&quaviewty=85' : item.logo"  v-if="item.logo" />
              <image src="https://relottery.ws.126.net/thread/20191115/oWbNQe.png" v-else />
            </view>
            <view>{{item.playerName}}</view>
          </view>
          <view class="team">{{item.teamName}}</view>
          <view class="number"><view>{{item[typeKey[index].key]}}</view></view>
        </view>
        <view class="basketball-player-rank__no-more">
          <view>没有更多了~</view>
        </view>
      </view>
      <loading center v-if="loading" />
      <no-data v-if="noData" />
    </view>
  </view>
</template>

<script>
import NoData from './no-data'
export default {
  name: 'basketball-player-rank',
  props: ['info'],
  data () {
    return {
      typeKey: {
        0: {
          label: '得分',
          key: 'points'
        },
        1: {
          label: '篮板',
          key: 'rebounds'
        },
        2: {
          label: '助攻',
          key: 'assists'
        },
        3: {
          label: '抢断',
          key: 'steals'
        },
        4: {
          label: '盖帽',
          key: 'blocks'
        }
      }
    }
  },
  comments:{
    NoData
  },
  computed: {
    index () {
      return this.info.index
    },
    loading () {
      const { info, index } = this
      return info[index].loading
    },
    viewst () {
      const { info, index } = this
      const data = info[index].data
      if (Object.prototype.toString.call(data) === '[object Array]' && data.length === 0) {
        return []
      }
      if (Object.prototype.toString.call(data) === '[object Object]' && Object.keys(data).length === 0) {
        return []
      }
      if (data) {
        return data
      }
      return []
    },
    noData () {
      if (!this.loading && this.viewst.length < 1) {
        return true
      }
      return false
    }
  },
  methods: {
    switchTab (id) {
      if (this.$refs.scroll) {
        this.$refs.scroll.scrollTop = 0
      }
      this.$bus.$emit('basketball-player-rank', id)
    },
    toPlayerInfo (playerId) {
      uni.navigateTo({
        url:`/pages/player/index?playerId=${playerId}&categoryId=2`
      })
    },
    scroll (to) {
      to = to || 0
      if (this.$refs.scroll) {
        this.$refs.scroll.scrollTop = to
      }
    },
    getScrollTop () {
      if (this.$refs.scroll) {
        return this.$refs.scroll.scrollTop
      }
      return 0
    }
  },
  components: {
    NoData
  }
}
</script>

<style lang="scss">
@import "../../../assets/style/mixin.scss";
.basketball-player-rank {
  height: 100%;
  position: relative;
  display: flex;
  align-items: flex-start;
  .rank {
    flex-shrink: 0;
    width: 60rpx;
    padding-left: 10rpx;
    color: #999;
    text-align: center;
  }
  .player {
    flex-shrink: 0;
    overflow: hidden;
    padding: 0 8rpx 0 0;
    width: 200rpx;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .team {
    flex: auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .number {
    flex-shrink: 0;
    width: 120rpx;
    padding: 0 10rpx;
    text-align: right;
  }
  &__nav {
    flex-shrink: 0;
    width: 110rpx;
    height: 100%;
    background: #f3f5f7;
    border-top-left-radius: 6rpx;
    overflow: hidden;
    transform: translateZ(0);
    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: 6rpx 0 0 6rpx;
    border: 1px solid #eee;
    border-bottom: 0;
    border-right: 0;
    view {
      list-style: none;
      height: 150rpx;
      line-height: 150rpx;
      text-align: center;
      position: relative;
      cursor: pointer;
      border-bottom: 1rpx solid #eee;
      &.current {
        background: #fff;
        font-weight: bold;
        &:before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 10rpx;
          background: #ff6507;
          z-index: 1;
        }
      }
      &:first-child {
        border-top-left-radius: 6rpx;
        overflow: hidden;
        transform: translateZ(0);
      }
    }
  }
  &__viewst {
    flex: auto;
    height: 100%;
    position: relative;
    background: #fff;
    border-top-right-radius: 6rpx;
    border: 1px solid #eee;
    border-bottom: none;
    &--scroll {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolviewng: touch;
    }
  }
  &__head,
  &__detail {
    position: relative;
    display: flex;
  }
  &__head {
    height: 60rpx;
    line-height: 60rpx;
    color: #999;
    background: #fbfbfc;
    border-top-right-radius: 6rpx;
    view {
      display: inline-block;
      transform: scale(0.92) translateZ(0);
      transform-origin: 0 50%;
    }
    .player {
      view {
        padding-left: 18rpx;
      }
    }
    .team {
      view {
        padding-left: 8rpx;
      }
    }
    .number {
      view {
        transform-origin: 100% 50%;
      }
    }
  }
  &__detail {
    height: 90rpx;
    line-height: 90rpx;
    color: #333;
    border-bottom: 1rpx solid #eee;
    .player {
      color: #4a4a4a;
      .pic {
        flex-shrink: 0;
        width: 36rpx;
        height: 36rpx;
        border-radius: 100%;
        transform: translateZ(0);
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        image {
          max-width: 36rpx;
          max-height: 36rpx;
        }
      }
      view {
        flex: auto;
        padding-left: 10rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .number {
      view {
        padding-right: 20rpx;
      }
    }
  }
  &__no-more {
    height: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999;
  }
}
</style>
