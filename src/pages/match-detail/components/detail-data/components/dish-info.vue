<template>
  <view class="dish-info">
    <view class="p" v-if="len > 0">
      <text class="span">{{count.winNum}}胜<i v-if="category === 1">{{count.dogfallNum}}平</i>{{count.loserNum}}负</text>
      <text class="span" v-if="category===1">进{{count.goalNum}}球失{{count.ballverlustNum}}球</text>
      <text class="span" v-if="category===2">场均{{(count.goalNum / len).toFixed(1)}}分</text>
      <text class="span" v-if="count && count.showWinPlate">赢盘率<text class="red">{{[count.winPlateRate, 0] | toPercent}}</text></text>
      <text class="span" v-if="category===1">胜率<text class="red">{{[count.winGameRate,0] | toPercent}}</text></text>
    </view>
    <view class="p"  v-if="len > 0">
      <text class="span" v-if="category===1">大球率{{[count.bigGameRate, 0] | toPercent}}</text>
      <text class="span" v-if="info.continuousSpieltag || info.historicHigh">近期连{{info.continuousType ? '输' : '赢'}}: {{info.continuousSpieltag}}</text>
      <text class="span" v-if="info.continuousSpieltag || info.historicHigh">近3年最高: {{info.historicHigh}}</text>
    </view>
  </view>
</template>

<script>
import { toPercent } from '@/utils/tools'
export default {
  name: 'dish-info',
  props: ['info', 'category', 'type'],
  computed: {
    typeDis () {
      return this.type === 0 ? 'allDishCountVo' : 'teamDishCountVo'
    },
    count () {
      return this.info[this.typeDis]
    },
    len () {
      return this.info[this.typeDis].matchNum || 0
    }
  },
  filters: {
    toPercent: toPercent
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.dish-info {
  padding-left:32rpx;
  line-height: 48rpx;
  color: #666;
  .p {
    display: flex;
    align-items: center;
  }
  .span {
    margin-right: 8rpx;
    position: relative;
    .red {
      color: #ff2222;
      font-style: normal;
    }
  }
  .span + .span {
    padding-left: 10rpx;
    border-left: 1rpx solid #ddd;
    // &:before {
    //   @include one-rpx-y(#ddd, left);
    //   top: 25%;
    //   height: 50%;
    // }
  }
}
</style>