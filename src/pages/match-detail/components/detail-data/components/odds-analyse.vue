<template>
  <view class="odds-analyse">
    <view
      class="odds-analyse__head"
      :class="{'four-cloumns': category === 2 || bjStatus}"
      v-if="hdaOddsPlayVo || hhdaOddsPlayVo">
      <view class="odds-analyse__row name">玩法</view>
      <view class="odds-analyse__row time">时间</view>
      <view class="odds-analyse__row w">{{category===1 ? '主胜' : '客胜'}}</view>
      <view class="odds-analyse__row d" v-if="category===1 && !bjStatus">平</view>
      <view class="odds-analyse__row l">{{category===1 ? '客胜' : '主胜'}}</view>
    </view>
    <!-- 胜平负和胜负让分 -->
    <view
      class="odds-analyse__body"
      v-if="hhdaOddsPlayVo"
      :class="{'four-cloumns': category === 2 || bjStatus}">
      <view class="odds-analyse__row name">
        让球{{hhdaOddsPlayVo.currentConcede}}
      </view>
      <view class="odds-analyse__row time">初<br>即时</view>
      <view class="odds-analyse__row w">
        {{hhdaOddsPlayVo.initOddsList[0].odds}}
        <br>
        <span :class="hhdaOddsPlayVo.currentOddsList[0].oddsChange === 1 ? 'red' : hhdaOddsPlayVo.currentOddsList[0].oddsChange === 2 ? 'green' : ''">{{hhdaOddsPlayVo.currentOddsList[0].odds}}</span>
      </view>
      <view class="odds-analyse__row d" v-if="category===1 && !bjStatus">
        {{hhdaOddsPlayVo.initOddsList[1].odds}}<br><span
          :class="hhdaOddsPlayVo.currentOddsList[1].oddsChange === 1 ? 'red' : hhdaOddsPlayVo.currentOddsList[1].oddsChange === 2 ? 'green' : ''">{{hhdaOddsPlayVo.currentOddsList[1].odds}}</span>
      </view>
      <view class="odds-analyse__row l">
        {{hhdaOddsPlayVo.initOddsList[category===1 && !bjStatus ? 2 : 1].odds}}<br><span
          :class="hhdaOddsPlayVo.currentOddsList[category===1 && !bjStatus ? 2 : 1].oddsChange === 1 ? 'red' : hhdaOddsPlayVo.currentOddsList[category===1 && !bjStatus ? 2 : 1].oddsChange === 2 ? 'green' : ''">{{hhdaOddsPlayVo.currentOddsList[category===1 && !bjStatus ? 2 : 1].odds}}</span>
      </view>
    </view>
    <view
      class="odds-analyse__body"
      v-if="hdaOddsPlayVo"
      :class="{'four-cloumns': category === 2 || bjStatus}">
      <view class="odds-analyse__row name">
        {{category===1?'让球':'主让'}}{{hdaOddsPlayVo.currentConcede}}
      </view>
      <view class="odds-analyse__row time">初<br>即时</view>
      <view class="odds-analyse__row w">
        {{hdaOddsPlayVo.initOddsList[0].odds}}<br>
        <text class="span" :class="hdaOddsPlayVo.currentOddsList[0].oddsChange === 1 ? 'red' : hdaOddsPlayVo.currentOddsList[0].oddsChange === 2 ? 'green' : ''">{{hdaOddsPlayVo.currentOddsList[0].odds}}</text>
      </view>
      <view class="odds-analyse__row d" v-if="category===1 && !bjStatus">
        {{hdaOddsPlayVo.initOddsList[1].odds}}<br>
        <text class="span" :class="hdaOddsPlayVo.currentOddsList[1].oddsChange === 1 ? 'red' : hdaOddsPlayVo.currentOddsList[1].oddsChange === 2 ? 'green' : ''">{{hdaOddsPlayVo.currentOddsList[1].odds}}</text>
      </view>
      <view class="odds-analyse__row l">
        {{hdaOddsPlayVo.initOddsList[category===1 && !bjStatus ? 2 : 1].odds}}<br>
        <text class="span" :class="hdaOddsPlayVo.currentOddsList[category===1 && !bjStatus ? 2 : 1].oddsChange === 1 ? 'red' : hdaOddsPlayVo.currentOddsList[category===1 && !bjStatus ? 2 : 1].oddsChange === 2 ? 'green' : ''">{{hdaOddsPlayVo.currentOddsList[category===1 && !bjStatus ? 2 : 1].odds}}</text>
      </view>
    </view>
    <!-- 大小球 -->
    <view
      class="odds-analyse__head four-cloumns"
      v-if="hiloOddsPlayVo">
      <view class="odds-analyse__row name">玩法</view>
      <view class="odds-analyse__row time">时间</view>
      <view class="odds-analyse__row w">大分</view>
      <view class="odds-analyse__row d">小分</view>
    </view>
    <view
      class="odds-analyse__body four-cloumns"
      v-if="hiloOddsPlayVo">
      <view class="odds-analyse__row name">大小分{{hiloOddsPlayVo.currentConcede}}</view>
      <view class="odds-analyse__row time">初<br>即时</view>
      <view class="odds-analyse__row w">
        {{hiloOddsPlayVo.initOddsList[0].odds}}
        <br>
        <text class="span" :class="hiloOddsPlayVo.currentOddsList[0].oddsChange === 1 ? 'red' : hiloOddsPlayVo.currentOddsList[0].oddsChange === 2 ? 'green' : ''">{{hiloOddsPlayVo.currentOddsList[0].odds}}</text>
      </view>
      <view class="odds-analyse__row d">
        {{hiloOddsPlayVo.initOddsList[1].odds}}
        <br>
        <text class="span" :class="hiloOddsPlayVo.currentOddsList[1].oddsChange === 1 ? 'red' : hiloOddsPlayVo.currentOddsList[1].oddsChange === 2 ? 'green' : ''">{{hiloOddsPlayVo.currentOddsList[1].odds}}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'odds-analyse',
  props: ['category', 'info'],
  computed: {
    bjStatus () {
      if (this.info && this.info.bjStatus) {
        return this.info.bjStatus
      }
      return null
    },
    hdaOddsPlayVo () {
      if (this.info && this.info.hdaOddsPlayVo) {
        return this.info.hdaOddsPlayVo
      }
      return null
    },
    hhdaOddsPlayVo () {
      if (this.info && this.info.hhdaOddsPlayVo) {
        return this.info.hhdaOddsPlayVo
      }
      return null
    },
    hiloOddsPlayVo () {
      if (this.info && this.info.hiloOddsPlayVo) {
        return this.info.hiloOddsPlayVo
      }
      return null
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.odds-analyse {
  position: relative;
  padding: 0 32rpx;
  text-align: center;
  margin-top: 36rpx;
  &__head {
    margin-bottom: 12rpx;
    line-height: 60rpx;
    color: #999;
    background: #f9fafb;
    display: flex;
    align-items: center;
    text-align: center;
  }
  &__body {
    padding: 12rpx 0;
    line-height: 1.5;
    color: #333;
    height: 90rpx;
    position: relative;
    display: flex;
    align-items: center;
    text-align: center;
    .time {
      color: #999;
    }
  }
  .odds-analyse__body + .odds-analyse__body {
    border-top: 1rpx solid #eee;
    // &:before {
    //   @include one-rpx-x(#eee, top);
    // }
  }
  &__row {
    flex-shrink: 0;
    .red {
      color: #ff2222;
    }
    .green {
      color: #2ba86d;
    }
    &.name {
      width: 120rpx;
    }
    &.time {
      width: 110rpx;
      flex: auto;
    }
    &.w {
      width: 150rpx;
    }
    &.d {
      width: 150rpx;
    }
    &.l {
      width: 150rpx;
    }
  }
  .four-cloumns {
    .name {
      width: 170rpx!important;
    }
    .time {
      width: 150rpx!important;
    }
    .w, .d, .l {
      width: 180rpx!important;
    }
  }
}
</style>