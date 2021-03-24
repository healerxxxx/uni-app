<template>
  <view class="meeting-info" :class="{'football' :category === 1}" v-if="len > 0">
    <view class="p">
      <text class="span" v-if="category===1">{{count.winNum}}胜{{count.dogfallNum}}平{{count.loserNum }}负</text>
      <text class="span" v-if="category===1">进{{info.goalNum}}球失{{info.ballverlustNum}}球</text>
      <text class="span" v-if="category===2"><text class="b">{{team}}</text>均场<text class="i red">{{(info.goalNum / len).toFixed(1)}}分</text></text>
      <text class="span" v-if="info.showWinPlate">赢盘率<text class="i red">{{[info.winPlateRate, 0] | toPercent}}</text></text>
      <text class="span" v-if="category===1 ">胜率<text  class="i red">{{[info.winGameRate,0] | toPercent}}</text></text>
      <text class="span" v-if="category===1 ">大球率{{[info.bigGameRate, 0] | toPercent}}</text>
      <text class="span" v-if="category===2">客队均场<text class="i green">{{(info.ballverlustNum / len).toFixed(1)}}分</text></text>
    </view>
  </view>
</template>

<script>
import { toPercent } from '@/utils/tools'
export default {
  name: 'meeting-info',
  props: ['team', 'info', 'category', 'count'],
  computed: {
    len () {
      return this.info.matchNum || 0
    }
  },
  filters: {
    toPercent: toPercent
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.meeting-info {
  padding: 0 32rpx;
  line-height: 48rpx;
  color: #666;
  &.football {
    padding: 0;
  }
  .p {
    display: flex;
    align-items: center;
  }
  .span {
    margin-right: 10rpx;
    position: relative;
    display: inline-block;
    &:last-child{
      margin-right: 0;
    }
    .b {
      font-size: 28rpx;
      color: #333;
      margin-right: 10rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 200rpx;
    }
    .red {
      color: #ff2222;
    }
    .green {
      color: #2ba86d;
    }
    .i {
      font-style: normal;
    }
  }
  span + span {
    padding-left: 12rpx;
    border-left: 1rpx solid #ddd;
    // &:before {
    //   @include one-rpx-y(#ddd, left);
    //   top: 25%;
    //   height: 50%;
    // }
  }
}
</style>