<template>
  <view class="dish-win-lose">
    <view class="dish-win-lose__scale">
      <view class="li"
        :key="index"
        v-for="(n, index) in 6">{{max - index * (max / 6)}}</view>
      <view class="win">{{continuousType ? '输' : '赢'}}</view>
    </view>
    <view
      :key="index"
      class="dish-win-lose__bar"
      :class="{
        'win': !continuousType && currentCount === item.continuousGames,
        'loss':continuousType && currentCount === item.continuousGames,
        'current-history': currentCount === item.continuousGames && historicHigh === item.continuousGames
      }" v-for="(item,index) in list">
      <view class="line" :style="{'height': item.times * 200 / max + 'rpx'}">
        <view class="b" v-if="historicHigh === item.continuousGames">历史最高</view>
        <view class="i" v-if="currentCount === item.continuousGames">当前最高</view>
      </view>
      <text class="span">连{{item.continuousGames}}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'dish-win-lose',
  props: ['info', 'type'],
  computed: {
    list () {
      let value = []
      if (this.type === 'home') {
        value = this.info.homeHistory
      }
      if (this.type === 'away') {
        value = this.info.awayHistory
      }
      return value
    },
    continuousType () {
      let value = ''
      if (this.type === 'home') {
        value = this.info.homeContinuousType
      }
      if (this.type === 'away') {
        value = this.info.awayContinuousType
      }
      return value
    },
    currentCount () {
      let value = ''
      if (this.type === 'home') {
        value = this.info.homeCurrentCount
      }
      if (this.type === 'away') {
        value = this.info.awayCurrentCount
      }
      return value
    },
    historicHigh () {
      let value = ''
      if (this.type === 'home') {
        value = this.info.homeHistoricHigh
      }
      if (this.type === 'away') {
        value = this.info.awayHistoricHigh
      }
      return value
    },
    max () {
      const { info, type } = this
      let i = 0
      let arr = []
      if (info && type === 'home' && info.homeHistory) {
        arr = info.homeHistory
      }
      if (info && type === 'away' && info.awayHistory) {
        arr = info.awayHistory
      }
      arr.map((item) => {
        if (item.times >= i) {
          i = item.times
        }
      })
      return this.getMaxValue(i)
    }
  },
  methods: {
    getMaxValue (value) {
      return Math.ceil(value / 6) * 6
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.dish-win-lose {
  position: relative;
  padding: 0 32rpx;
  height: 250rpx;
  display: flex;
  &__scale {
    width: 30rpx;
    height: 250rpx;
    padding-right: 8rpx;
    position: relative;
    border-right: 1rpx solid #ededed;
    .li {
      height: 30rpx;
      line-height: 30rpx;
      text-align: right;
      color: #999;
      list-style: none;
    }
    .win {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      color: #999;
      text-align: right;
      padding-right: 8rpx;
      height: 50rpx;
      line-height: 50rpx;
    }
  }
  &__bar {
    height: 250rpx;
    width: 56rpx;
    margin-left: 16rpx;
    position: relative;
    .line {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 50rpx;
      -webkit-border-radius: 4rpx 4rpx 0 0;
      border-radius: 4rpx 4rpx 0 0;
      background: #ff6e25;
      .b {
        position: absolute;
        width: 57rpx;
        font-style: normal;
        text-align: center;
        color: #ff2222;
        line-height: 28rpx;
        left: 0;
        top: -66rpx;
      }
      .i {
        position: absolute;
        width: 57rpx;
        font-style: normal;
        text-align: center;
        color: #333;
        line-height: 28rpx;
        left: 0;
        top: -66rpx;
      }
    }
    .span {
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      color: #333;
      background: #eee;
      text-align: center;
      height: 50rpx;
      line-height: 50rpx;
    }
    &.win {
      .line {
        background: #ff2222;
      }
    }
    &.loss {
      .line {
        background: #2ba86d;
      }
    }
    &.current-history {
      .line {
        .i {
          top: -130rpx;
        }
      }
    }
  }
}
</style>