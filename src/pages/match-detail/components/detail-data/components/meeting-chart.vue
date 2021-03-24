<template>
  <view class="meeting-chart" v-if="len > 0">
    <view
      class="meeting-chart__win"
      v-if="win > 0"
      :style="winStyle">
      <text class="span">{{win}}胜</text>
    </view>
    <view
      class="meeting-chart__draw"
      v-if="draw > 0"
      :style="drawStyle">
      <text class="span">{{draw}}平</text>
    </view>
    <view
      class="meeting-chart__lose"
      v-if="lose > 0"
      :style="loseStyle">
      <text class="span">{{lose}}负</text>
    </view>
  </view>
</template>

<script>
import { toPercent } from '@/utils/tools'
export default {
  name: 'meeting-chart',
  props: ['count', 'category'],
  computed: {
    len () {
      return this.count.matchNum || 0
    },
    win () {
      return this.count.winNum || 0
    },
    draw () {
      return this.count.dogfallNum || 0
    },
    lose () {
      return this.count.loserNum || 0
    },
    winStyle () {
      return this.getStyle(this.win)
    },
    drawStyle () {
      return this.getStyle(this.draw)
    },
    loseStyle () {
      return this.getStyle(this.lose)
    }
  },
  filters: {
    toPercent: toPercent
  },
  methods: {
    getStyle (num) {
      return `width: ${num * 100 / this.len}%`
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.meeting-chart {
  height: 40rpx;
  line-height: 40rpx;
  margin: 0 32rpx;
  color: #fff;
  text-align: center;
  border-radius: 4rpx;
  overflow: hidden;
  transform: translateZ(0);
  display: flex;
  &__win {
    position: relative;
    background: linear-gradient(90deg, #ff2222, #ff4747);
  }
  &__draw {
    position: relative;
    background: #65afff;
  }
  &__lose {
    position: relative;
    background: #2ba86d;
  }
  .meeting-chart__win + .meeting-chart__draw, .meeting-chart__win + .meeting-chart__lose, .meeting-chart__draw + .meeting-chart__lose {
    &:before {
      content: '';
      width: 1rpx;
      position: absolute;
      top: 0;
      left: -4rpx;
      bottom: 0;
      background: #fff;
      z-index: 1;
      transform: skewX(-15deg);
    }
    &:after {
      content: '';
      width: 8rpx;
      position: absolute;
      top: 0;
      left: -4rpx;
      bottom: 0;
      transform: skewX(-15deg);
    }
  }
  .meeting-chart__win + .meeting-chart__draw {
    &:after {
      background: #65afff;
    }
  }
  .meeting-chart__win + .meeting-chart__lose, .meeting-chart__draw + .meeting-chart__lose {
    &:after {
      background: #2ba86d;
    }
  }
  .chart-draw,
  .chart-lose {
    &.isSkew {
      transform: skewX(-15deg);
      margin-left: -5rpx;
      .span {
        display: inline-block;
        transform: skew(15deg);
      }
    }
    &.alone {
      &:before {
        display: none;
      }
    }
  }
  .chart-draw {
    background: #65afff;
    position: relative;
    &.before-line:before {
      content: "";
      width: 2rpx;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      background: #fff;
    }
    &.after-line:after {
      content: "";
      width: 2rpx;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      background: #fff;
    }
  }
  .chart-lose {
    background: #2ba86d;
    position: relative;
    &:before {
      content: "";
      width: 2rpx;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      background: #fff;
    }
  }
}
</style>