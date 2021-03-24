<template>
  <view class="basketball-rank">
    <view class="basketball-rank__head">
      <view class="rank"><view>排名</view></view>
      <view class="team"><view>球队</view></view>
      <view class="games"><view>场次</view></view>
      <view class="win"><view>胜场</view></view>
      <view class="loss"><view>负场</view></view>
    </view>
    <view class="basketball-rank__detail" :class="{'playoffs': list.length > 5 && item.position < 9}"
      v-for="(item, index) in list" :key="index">
      <view class="rank">{{item.position}}</view>
      <view class="team">
        <view class="pic">
          <image :src="/relottery|(126.net)/.test(item.logo) ? item.logo + '?imageView&thumbnail=54y54&quality=85' : item.logo"  v-if="item.logo" />
          <image src="https://relottery.ws.126.net/thread/20191115/oWbNQe.png" v-else />
        </view>
        <view>{{item.name}}</view>
      </view>
      <view class="games">{{item.all}}</view>
      <view class="win">{{item.won}}</view>
      <view class="loss">{{item.lost}}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'basketball-rank',
  props: ['list', 'promotions'],
}
</script>

<style lang="scss">
@import "../../../assets/style/mixin.scss";
.basketball-rank {
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
    padding: 0 8rpx;
    display: flex;
    align-items: center;
    text-align: left;
    justify-content: flex-start;
  }
  .games {
    flex-shrink: 0;
    width: 130rpx;
  }
  .win {
    flex-shrink: 0;
    width: 100rpx;
  }
  .loss {
    flex-shrink: 0;
    width: 130rpx;
  }
  &__head,
  &__detail {
    position: relative;
    display: flex;
    text-align: center;
  }
  &__head {
    height: 60rpx;
    line-height: 60rpx;
    color: #999;
    background: #fbfbfc;
    view {
      display: inline-block;
      transform: scale(0.92) translateZ(0);
    }
    .team {
      padding: 0 8rpx 0 54rpx;
    }
  }
  &__detail {
    height: 90rpx;
    line-height: 90rpx;
    color: #333;
    &:not(:last-child){
      border-bottom: 1rpx solid #eee;
    }
    &.playoffs {
      background: #fff7f7;
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
      view {
        flex: auto;
        padding-left: 10rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
