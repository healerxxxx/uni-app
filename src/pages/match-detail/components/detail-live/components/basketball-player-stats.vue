<template>
  <view class="basketball-player-stats">
    <view class="team">
      <view class="span team-logo">
        <image
          class="img icon"
          :src="(type === 'away' ? liveData.guestTeam.teamIcon : liveData.homeTeam.teamIcon) + '?imageView&thumbnail=76y76&quality=85'"
          @error.once="setErrorImg" />
      </view>
      <text class="span">{{type === "away" ? liveData.guestTeam.teamName : liveData.homeTeam.teamName}}</text>
      <text class="span" v-if="type === 'home'">（主）</text>
      <view class="control">
        <text
          class="span prev"
          @click="prev"
          :class="{'light': left > 0}">
        </text>
        <text
          class="span next"
          @click="next"
          :class="{'light': left < scrollWidth - width}">
        </text>
      </view>
    </view>
    <view class="stat-swiper">
      <view class="stat-content basketball-player-content-width">
        <view class="ul basketball-player-scroll-width" :style="{'transform': `translate3d(-${left}px, 0 ,0)`}">
          <view class="li head">
            <text class="span name">球员</text>
            <text class="span">时间</text>
            <text class="span">得分</text>
            <text class="span rebound"><text class="p">篮板<br />(总/前/后)</text></text>
            <text class="span">助攻</text>
            <text class="span">抢断</text>
            <text class="span">盖帽</text>
            <text class="span">失误</text>
            <text class="span">犯规</text>
          </view>
          <view class="li" v-for="(item, index) in list" :key="index">
            <text class="span avatar">
            </text>
            <text class="span name">
            </text>
            <text class="span">{{item.duration}}</text>
            <text class="span">{{item.score}}</text>
            <text class="span rebound">{{item.attackBackboard + item.defendBackboard}}/{{item.attackBackboard}}/{{item.defendBackboard}}</text>
            <text class="span">{{item.assist}}</text>
            <text class="span">{{item.steal}}</text>
            <text class="span">{{item.cap}}</text>
            <text class="span">{{item.miss}}</text>
            <text class="span">{{item.foul}}</text>
          </view>
        </view>
      </view>
      <view class="ul shadow" :class="{'show': left !== 0}">
        <view class="li head">
          <text class="span name">球员</text>
        </view>
        <view class="li" v-for="(item, index) in list" :key="index">
          <view class="span avatar" @click="toPlayerInfo(item.playerId)">
            <image class="img" v-if="item.playerLogo" :src="item.playerLogo + '?imageView&thumbnail=54y54&quality=85'">
            <view class="uniform" :class="[`uniform-${type}`]"><text class="i">{{item.shirtNumber}}</text></view>
          </view>
          <text class="span name" @click="toPlayerInfo(item.playerId)">
            <text class="p"><text class="label"><text class="i" v-if="item.isBench === 0">首发</text>{{item.position}}</text></text>
            <text class="p player-name">{{item.playerName}}</text>
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'basketball-player-stat',
  props: ['list', 'type', 'liveData'],
  data () {
    return {
      left: 0,
      width: 0,
      scrollWidth: 0
    }
  },
  computed: {
    scale () {
      return (this.scrollWidth - this.width) / 1
    }
  },
  mounted () {
    const query = uni.createSelectorQuery().in(this)
    query.select('.basketball-player-content-width').boundingClientRect(data => {
      this.width = data.width
    }).exec()
    query.select('.basketball-player-scroll-width').boundingClientRect(data => {
      this.scrollWidth = data.width
    }).exec()
  },
  methods: {
    prev () {
      if (this.left <= 0) return
      this.left -= this.scale
    },
    next () {
      if (this.left >= this.scrollWidth - this.width) return
      this.left += this.scale
    },
    toPlayerInfo (id) {
      uni.navigateTo({
        url: `/pages/player/index?categoryId=2&playerId=${id}`
      })
    },
    setErrorImg (e) {
      e.target.src = 'https://relottery.ws.126.net/thread/20191012/H2fpJg.png'
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.basketball-player-stats {
  position: relative;
  padding-bottom: 68rpx;
  .team {
    padding: 22rpx  24rpx 30rpx;
    height: 76rpx;
    line-height: 76rpx;
    .span {
      display: inline-block;
      vertical-align: middle;
      font-weight: bold;
      font-size: 30rpx;
      color: #333;
      &.team-logo {
        width: 76rpx;
        height: 76rpx;
        margin-right: 10rpx;
        .img {
          width: 100%;
          height: 100%;
        }
      }
    }
   .control {
      float: right;
      .span {
        display: inline-block;
        vertical-align: middle;
        height: 52rpx;
        width: 52rpx;
        cursor: pointer;
        &.prev, &.next {
          @include bg-image('/static/match-detail/icon-control-prev.png');
          &.light {
            @include bg-image('/static/match-detail/icon-control-prev-light.png');
          }
        }
        &.next {
          transform: translateZ(0) rotate(180deg);
        }
      }
      .span + .span {
        margin-left: 56rpx;
      }
    }
  }
  .stat-swiper{
    position: relative;
  }
  .stat-content {
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    position: relative;
  }
  .ul {
    padding: 0 30rpx;
    width: 940rpx;
    transition: transform .2s ease-out;
    .li {
      position: relative;
      height: 88rpx;
      line-height: 88rpx;
      color: #333;
      border-bottom: 1rpx solid #e4e4e4;
      .span {
        width: 80rpx;
        height: 88rpx;
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        position: relative;
        font-size: 24rpx;
        &.avatar {
          width: 54rpx;
          height: 54rpx;
          margin-right: 30rpx;
          .img {
            width: 100%;
            height: 100%;
            display: inline-block;
            vertical-align: top;
            border-radius: 100%;
          }
          .uniform {
            position: absolute;
            width: 28rpx;
            height: 36rpx;
            line-height: 36rpx;
            text-align: center;
            right: -15rpx;
            bottom: 0;
            .i {
              font-size: 24rpx;
              display: inline-block;
              transform: scale(.64) translateZ(0);
            }
          }
        }
        &.rebound {
          width: 160rpx;
        }
        &.name {
          width: 136rpx;
          line-height: 1;
          height: 56rpx;
          padding: 16rpx 0;
          text-align: left;
          .p {
            display: block;
            line-height: 32rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &.player-name {
              margin-top: -4rpx;
            }
            .label {
              display: inline-block;
              height: 32rpx;
              transform: scale(.75) translateZ(0);
              transform-origin: 0 50%;
            }
            .i {
              background: #ff2222;
              border-radius: 5rpx;
              padding: 0 4rpx;
              color: #fff;
              margin-right: 6rpx;
            }
          }
        }
      }
      &.head {
        background: #F9FAFB;
        color: #999;
        border-radius: 6rpx;
        &:after {
          display: none;
        }
        .name {
          width: 220rpx;
          text-align: center;
          line-height: 56rpx;
        }
        .rebound {
          width: 160rpx;
          .p {
            display: inline-block;
            vertical-align: middle;
            line-height: 1.2;
          }
        }
      }
    }
    &.shadow {
      width: auto;
      padding-right: 0;
      position: absolute;
      left: 0;
      top: 0;
      background: #fff;
      z-index: 1;
      .li {
        &.head {
          border-radius: 6rpx 0 0 6rpx;
        }
      }
      &.show {
        .li {
          &:before {
            content: '';
            position: absolute;
            width: 54rpx;
            height: 100%;
            left: 100%;
            top: 0;
            background-image: url('/static/match-detail/bg-player-list-shadow.png');
            background-size: 100% auto;
            background-repeat: repeat-y;
          }
          &:after {
            right: -54rpx;
          }
          &.head {
            &:before {
              background-image: url('/static/match-detail/bg-player-list-head-shadow.png');
            }
          }
        }
      }
    }
  }
}
</style>
