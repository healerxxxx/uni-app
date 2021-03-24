<template>
  <view class="league-rank" :class="{'switch': type === 1, 'basketball': category === 2}">
    <template v-if="category === 1">
      <view class="league-rank__head" v-if="home || guest">
        <view class="league-rank__row team">全场</view>
        <view class="league-rank__row rank">排名</view>
        <view class="league-rank__row point">积分</view>
        <view class="league-rank__row game">场次</view>
        <view class="league-rank__row w">胜/平/负</view>
        <view class="league-rank__row score">进/失</view>
      </view>
      <view class="league-rank__body">
        <view class="league-rank__row rangeType">总</view>
        <view class="league-rank__row rank">{{total.rank}}</view>
        <view class="league-rank__row point">{{total.point}}</view>
        <view class="league-rank__row game">{{total.game}}</view>
        <view class="league-rank__row w">{{total.win}}/{{total.draw}}/{{total.loss}}</view>
        <view class="league-rank__row score">{{total.score}}/{{total.lossScore}}</view>
      </view>
      <view class="league-rank__body">
        <view class="league-rank__row rangeType">主</view>
        <view class="league-rank__row rank">{{home.rank}}</view>
        <view class="league-rank__row point">{{home.point}}</view>
        <view class="league-rank__row game">{{home.game}}</view>
        <view class="league-rank__row w">{{home.win}}/{{home.draw}}/{{home.loss}}</view>
        <view class="league-rank__row score">{{home.score}}/{{home.lossScore}}</view>
      </view>
      <view class="league-rank__body">
        <view class="league-rank__row rangeType">客</view>
        <view class="league-rank__row rank">{{guest.rank}}</view>
        <view class="league-rank__row point">{{guest.point}}</view>
        <view class="league-rank__row game">{{guest.game}}</view>
        <view class="league-rank__row w">{{guest.win}}/{{guest.draw}}/{{guest.loss}}</view>
        <view class="league-rank__row score">{{guest.score}}/{{guest.lossScore}}</view>
      </view>
    </template>
    <template v-if="category === 2">
      <view class="league-rank__head" v-if="guest || home">
        <view class="league-rank__row type" v-if="type === 1">主客</view>
        <view class="league-rank__row team">球队</view>
        <view class="league-rank__row rank">排名</view>
        <view class="league-rank__row point">场次</view>
        <view class="league-rank__row game">胜/负</view>
        <view class="league-rank__row w">进/失/净</view>
        <view class="league-rank__row score">胜率</view>
      </view>
      <view class="league-rank__body" v-if="guest">
        <view class="league-rank__row type" v-if="type === 1">客</view>
        <view class="league-rank__row team">{{matchInfo.guestName}}</view>
        <view class="league-rank__row rank">{{guest.rank || '-'}}</view>
        <view class="league-rank__row point">{{guest.game}}</view>
        <view class="league-rank__row game">{{guest.win}}/{{guest.loss}}</view>
        <view class="league-rank__row w">{{guest.score}}/{{guest.lossScore}}/{{guest.scoreDiff}}</view>
        <view class="league-rank__row score">{{guest.winRate}}</view>
      </view>
      <view class="league-rank__body" v-if="home">
        <view class="league-rank__row type" v-if="type === 1">主</view>
        <view class="league-rank__row team">{{matchInfo.homeName}}</view>
        <view class="league-rank__row rank">{{home.rank || '-'}}</view>
        <view class="league-rank__row point">{{home.game}}</view>
        <view class="league-rank__row game">{{home.win}}/{{home.loss}}</view>
        <view class="league-rank__row w">{{home.score}}/{{home.lossScore}}/{{home.scoreDiff}}</view>
        <view class="league-rank__row score">{{home.winRate}}</view>
      </view>
    </template>
  </view>
</template>

<script>
export default {
  name: 'league-rank',
  props: ['category', 'info', 'type', 'matchInfo'],
  computed: {
    home () {
      const { type } = this
      if (this.info && this.info.guestTeam && this.info.homeTeam) {
        if (type === 0) {
          return this.info.homeTeam.total || null
        }
        if (type === 1) {
          return this.info.homeTeam.home || null
        }
        if (type === 2) {
          return this.info.homeTeam.home || null
        }
        if (type === 3) {
          return this.info.guestTeam.home || null
        }
      }
      return null
    },
    guest () {
      const { type } = this
      if (this.info && this.info.guestTeam && this.info.guestTeam) {
        if (type === 0) {
          return this.info.guestTeam.total || null
        }
        if (type === 1) {
          return this.info.guestTeam.guest || null
        }
        if (type === 2) {
          return this.info.homeTeam.guest || null
        }
        if (type === 3) {
          return this.info.guestTeam.guest || null
        }
      }
      return null
    },
    total () {
      const { type } = this
      if (this.info && this.info.guestTeam && this.info.homeTeam) {
        if (type === 2) {
          return this.info.homeTeam.total || null
        }
        if (type === 3) {
          return this.info.guestTeam.total || null
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.league-rank {
  position: relative;
  padding: 0 32rpx;
  text-align: center;
  // margin-top: 36rpx;
  &__head {
    // margin-bottom: 12rpx;
    line-height: 60rpx;
    color: #999;
    background: #f9fafb;
    display: flex;
    align-items: center;
    text-align: center;
  }
  &__body {
    line-height: 1.5;
    color: #333;
    height: 70rpx;
    position: relative;
    display: flex;
    align-items: center;
    text-align: center;
    .type {
      color: #ff6e25;
    }
  }
  .league-rank__body {
    border-bottom: 1rpx solid #eee;
    // &::after {
    //   @include one-rpx-x(#eee, bottom);
    // }
  }
  &__row {
    flex-shrink: 0;
    &.type {
      width: 80rpx;
    }
    &.team {
      width: 130rpx;
      flex: auto;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &.rangeType {
      width: 130rpx;
      color: #ff2222;
    }
    &.rank {
      width: 100rpx;
    }
    &.point {
      width: 100rpx;
    }
    &.game {
      width: 100rpx;
    }
    &.w {
      width: 150rpx;
    }
    &.score {
      width: 110rpx;
    }
  }
  &.switch {
    .rank,
    .point,
    .game {
      width: 80rpx;
    }
    .w {
      width: 120rpx;
    }
  }
  &.basketball {
    .type {
      width: 60rpx;
    }
    .team {
      width: 100rpx;
      flex: auto;
    }
    .rank {
      width: 70rpx;
    }
    .point {
      width: 70rpx;
    }
    .game {
      width: 90rpx;
    }
    .w {
      width: 230rpx;
    }
    .score {
      width: 90rpx;
    }
    &.switch {
      .score {
        width: 80rpx;
      }
      .w {
        width: 200rpx;
      }
    }
  }
}
</style>