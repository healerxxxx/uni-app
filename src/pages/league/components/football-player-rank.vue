<template>
  <view class="football-player-rank">
    <view class="football-player-rank__head">
      <view class="rank"></view>
      <view class="player"><text>球员</text></view>
      <view class="team"><text>球队</text></view>
      <view class="goals" v-if="type === 'goals'"><text>进球/点球数</text></view>
      <view class="goals" v-if="type === 'assists'"><text>助攻数</text></view>
    </view>
    <view class="football-player-rank__detail" v-for="(item, index) in list" :key="index">
      <view class="rank">{{index + 1}}</view>
      <view class="player" @click="toPlayerInfo(item.playerId)">
        <view class="pic">
          <image :src="/relottery|(126.net)/.test(item.logo) ? item.logo + '?imageView&thumbnail=54y54&quality=85' : item.logo" v-if="item.logo"/>
          <image src="https://relottery.ws.126.net/thread/20191115/oWbNQe.png" v-else />
        </view>
        <text>{{item.playerName}}</text>
      </view>
      <view class="team">{{item.teamName}}</view>
      <view class="goals" v-if="type === 'goals'"><text>{{item.goals}}/{{item.penalty}}</text></view>
      <view class="goals" v-if="type === 'assists'"><text>{{item.assists}}</text></view>
    </view>
    <view class="football-player-rank__no-more">
      <text>没有更多了~</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'football-player-rank',
  props: ['list', 'type'],
  methods: {
    toPlayerInfo (playerId) {
      uni.navigateTo({
        url:`/pages/player/index?playerId=${playerId}&categoryId=1`
      })
    }
  }
}
</script>

<style lang="scss">
@import "../../../assets/style/mixin.scss";
.football-player-rank {
  font-size: 24rpx;
  border-radius: 6rpx;
  overflow: hidden;
  transform: translateZ(0);
  .rank {
    flex-shrink: 0;
    width: 72rpx;
    color: #999;
    text-align: center;
  }
  .player {
    flex-shrink: 0;
    overflow: hidden;
    padding: 0 8rpx 0 0;
    width: 240rpx;
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
  .goals {
    flex-shrink: 0;
    width: 160rpx;
    padding: 0 10rpx;
    text-align: right;
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
    text {
      display: inline-block;
      transform: scale(0.92) translateZ(0);
      transform-origin: 0 50%;
    }
    .player {
      text {
        padding-left: 18rpx;
      }
    }
    .team {
      text {
        padding-left: 8rpx;
      }
    }
    .goals {
      text {
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
      text {
        flex: auto;
        padding-left: 10rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .goals {
      text {
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
