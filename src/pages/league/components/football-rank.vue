<template>
  <scroll-view scroll-y="true" class="football-rank">
    <view class="football-rank__head">
      <view class="rank"><text>排名</text></view>
      <view class="team"><text>球队</text></view>
      <view class="games"><text>场次</text></view>
      <view class="overall"><text>胜/平/负</text></view>
      <view class="goals"><text>进/失</text></view>
      <view class="pts"><text>积分</text></view>
    </view>
    <view class="football-rank__detail"
      :class="rangType === 0 && [promotions[item.promotionId] && promotions[item.promotionId].class, promotionsSign(item, index > 0 ? list[index - 1] : null) ? 'has-sign' : '']"
      v-for="(item, index) in list" :key="index">
      <view class="sign" v-if="promotionsSign(item, index > 0 ? list[index - 1] : null)">
        {{promotions[item.promotionId].name}}</view>
      <view class="rank">{{item.position}}</view>
      <view class="team">
        <view class="pic">
          <image :src="/relottery|(126.net)/.test(item.logo) ? item.logo + '?imageView&thumbnail=54y54&quality=85' : item.logo" v-if="item.logo"/>
          <image src="https://relottery.ws.126.net/thread/20191012/H2fpJg.png" v-else />
        </view>
        <text>{{item.name}}</text>
      </view>
      <view class="games">{{item.total}}</view>
      <view class="overall">{{item.won}}/{{item.draw}}/{{item.loss}}</view>
      <view class="goals">{{item.goals}}/{{item.goalsAgainst}}</view>
      <view class="pts">{{item.points}}</view>
    </view>
  </scroll-view>
</template>

<script>
export default {
  name: 'football-rank',
  props: ['list', 'promotions', 'rangType'],
  methods: {
    promotionsSign (active, prev) {
      if (this.promotions[active.promotionId] && !prev) { return true }
      if (this.promotions[active.promotionId] && active.promotionId !== prev.promotionId) { return true }
    }
  }
}
</script>

<style lang="scss">
@import "../../../assets/style/mixin.scss";
.football-rank {
  border-radius: 6rpx;
  overflow: hidden;
  transform: translateZ(0);
  .rank {
    flex-shrink: 0;
    width: 80rpx;
    color: #999;
  }
  .team {
    flex: auto;
    overflow: hidden;
    padding: 0 8rpx 0 0;
    display: flex;
    align-items: center;
    text-align: left;
    justify-content: flex-start;
  }
  .games {
    flex-shrink: 0;
    width: 88rpx;
  }
  .overall {
    flex-shrink: 0;
    width: 140rpx;
  }
  .goals {
    flex-shrink: 0;
    width: 98rpx;
  }
  .pts {
    flex-shrink: 0;
    width: 78rpx;
  }
  &__head,
  &__detail {
    position: relative;
    display: flex;
    text-align: center;
    position: relative;
  }
  &__head {
    height: 60rpx;
    line-height: 60rpx;
    color: #999;
    background: #fbfbfc;
    text {
      display: inline-block;
      transform: scale(0.92) translateZ(0);
    }
    .team {
      padding: 0 8rpx 0 46rpx;
    }
  }
  &__detail {
    height: 110rpx;
    line-height: 110rpx;
    color: #333;
    .sign {
      position: absolute;
      height: 36rpx;
      line-height: 36rpx;
      padding: 0 20rpx;
      left: 0;
      top: 0;
      color: #fff;
      border-radius: 0 18rpx 18rpx 10rpx;
      transform: scale(0.92) translateZ(0);
      transform-origin: 0 50%;
    }
    &.has-sign {
      padding-top: 20rpx;
    }
    &.up-0 {
      background: #fff7f7;
      .sign {
        @include gradient-x(#ff5d26, #ff9564);
      }
    }
    &.up-1 {
      background: #f9fafe;
      .sign {
        @include gradient-x(#66a5ff, #81b5ff);
      }
    }
    &.up-2 {
      background: #f4f8ff;
      .sign {
        @include gradient-x(#52a5ff, #69bbff);
      }
    }
    &.up-3 {
      background: #f4f8ff;
      .sign {
        @include gradient-x(#52a5ff, #69bbff);
      }
    }
    &.down-0 {
      background: #f9f9f9;
      .sign {
        @include gradient-x(#ababab, #bdbdbd);
      }
    }
    &.down-1 {
      background: #f9f9f9;
      .sign {
        @include gradient-x(#999999, #ababab);
      }
    }
    &.down-2 {
      background: #f9f9f9;
      .sign {
        @include gradient-x(#999999, #ababab);
      }
    }
    .team {
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
      text {
        flex: auto;
        padding-left: 10rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .pts {
      font-weight: bold;
    }
  }
  .football-rank__detail + .football-rank__detail {
    border-top: 1rpx solid #eee;
  }
}
</style>
