<template>
  <view class="match-list-detail">
    <view class="match-list-detail__info">
      <view
        class="dan">
        <text class="i" v-if="info.single === 1">单</text>
      </view>
      <view class="num" v-if="info.jcNum">
        <text class="i">{{info.jcNum}}</text>
      </view>
      <view
        class="league"
        :style="{'color': info.leagueMatchColor || '#f22'}">
        <text class="i">{{info.leagueMatchName}}</text>
      </view>
      <view class="date">
        <text class="i">{{[info.matchTime, 'hh:mm'] | formatDate}}</text>
      </view>
    </view>
    <view class="match-list-detail__against">
      <view
        class="match-list-detail__against--team-name"
        @click="toMatchDetail(info.matchInfoId)">
        <view class="name">
          <text class="span" v-if="!isBasket">[主]</text>
          <text class="i">{{isBasket ? info.guestTeam.teamName : info.homeTeam.teamName}}</text>
        </view>
        <view class="vs">VS</view>
        <view class="name away">
          <text class="i">{{isBasket ? info.homeTeam.teamName : info.guestTeam.teamName}}</text>
          <text  class="span" v-if="isBasket">[主]</text>
        </view>
      </view>
      <view class="match-list-detail__against--odds">
        <view class="odds">
          <view class="ul" v-if="info.playMap && info.playMap.HDA">
            <view class="play-type li">
              <view class="num">{{info.playMap.HDA.playName}}<br /><b>{{info.playMap.HDA.concede}}</b></view>
            </view>
            <view class="li"
              v-for="(item, index) in info.playMap.HDA.playItemList"
              :key="index"
              :class="{
                'choose': isChoose(item, 'HDA', info.matchInfoId),
                'basket': isBasket,
                'disable': info.playMap.HDA.sellStatus === 0
              }"
              @click="choosePlayItem(item, info.playMap.HDA, info)">
              <view class="num">
                {{item.playItemName}}<br/>
                <b>{{item.odds}}</b>
                <text class="icon-odds-up i" v-if="item.oddsChange === 1"></text>
                <text class=" i icon-odds-down" v-if="item.oddsChange === 2"></text>
              </view>
            </view>
          </view>
          <view class="ul" v-if="info.playMap && info.playMap.HHDA">
            <view  class="play-type li">
              <view class="num">{{info.playMap.HHDA.playName}}<br /><b>{{info.playMap.HHDA.concede}}</b></view>
            </view>
            <view class="li"
              v-for="(item, index) in info.playMap.HHDA.playItemList"
              :key="index"
              :class="{
                'choose': isChoose(item, 'HHDA', info.matchInfoId),
                'basket': isBasket,
                'disable': info.playMap.HHDA.sellStatus === 0
              }"
              @click="choosePlayItem(item, info.playMap.HHDA, info)">
              <view class="num">{{item.playItemName}}<br/><b>{{item.odds}}</b><image class="icon-odds-up " v-if="item.oddsChange === 1"></image><image class="icon-odds-down" v-if="item.oddsChange === 2" /></view>
            </view>
          </view>
          <view class="ul" v-if="info.playMap && info.playMap.HILO">
            <view class="play-type hilo li">
              <view class="num">{{info.playMap.HILO.playName}}<br /><b>{{info.playMap.HILO.concede}}</b></view>
            </view>
            <view class="li"
              v-for="(item, index) in info.playMap.HILO.playItemList"
              :key="index"
              :class="{
                'choose': isChoose(item, 'HILO', info.matchInfoId), 
                'basket': isBasket,
                'disable': info.playMap.HILO.sellStatus === 0
              }"
              @click="choosePlayItem(item, info.playMap.HILO, info)">
              <view class="num">{{item.playItemName}}<br/><b>{{item.odds}}</b><image class="icon-odds-up" v-if="item.oddsChange === 1" /><image class="icon-odds-down" v-if="item.oddsChange === 2" /></view>
            </view>
          </view>
        </view>
        <view
          v-if="isMoreAll"
          class="odds-more"
          @click="$emit('more', info)">
          <text class="column">更多玩法</text>
          <text class="i" v-if="len > 0">{{len}}</text>
        </view>
        <view
          v-else
          class="odds-more"
          @click="$emit('more', info)">
          <text  class="column">更多</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'match-list-detail',
  props: ['info', 'categoryId', 'choose-object', 'is-choose', 'choose-play-item'],
  computed: {
    isBasket () {
      const id = this.categoryId + ''
      return id === '2'
    },
    isMoreAll () {
      const { info } = this
      if (info.playMap) {
        let count = 0
        if (info.playMap.HDA) {
          count++
        }
        if (info.playMap.HHDA) {
          count++
        }
        if (info.playMap.HILO) {
          count++
        }
        if (count > 1) {
          return true
        }
      }
      return false
    },
    len () {
      const { chooseObject } = this
      if (chooseObject) {
        return chooseObject.chooseList.length
      }
      return 0
    }
  },
  methods: {
    toMatchDetail (id) {
      uni.navigateTo({
        url: `/pages/match-detail/index?matchInfoId=${id}`
      })
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.match-list-detail {
  position: relative;
  background: #fff;
  padding: 40rpx 32rpx;
  display: flex;
  &__info {
    flex-shrink: 0;
    width: 86rpx;
    color: #999;
    .i {
      display: inline-block;
      font-style: normal;
      transform: scale(.82) translateZ(0);
      transform-origin: 0 50%;
    }
    .dan {
      height: 40rpx;
      line-height: 40rpx;
      padding-bottom: 22rpx;
      .i {
        width: 36rpx;
        height: 36rpx;
        line-height: 36rpx;
        background: #65AFFF;
        border-radius: 7rpx;
        color: #fff;
        text-align: center;
      }
    }
    .num {
      height: 24rpx;
      line-height: 24rpx;
      .i {
        width: 120%;
        white-space: nowrap;
        text-overflow: clip;
      }
    }
    .league {
      height: 28rpx;
      line-height: 28rpx;
      color: #f22;
      .i {
        height: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 120%;
      }
    }
    .date {
      height: 24rpx;
      line-height: 24rpx;
    }
    .num + .league, .num + .date, .league + .date {
      margin-top: 8rpx;
    }
  }
  &__against {
    width: 600rpx;
    flex-shrink: 0;
    &--team-name {
      display: flex;
      height: 40rpx;
      line-height: 40rpx;
      padding-bottom: 22rpx;
      align-items: center;
      justify-content: center;
      .name {
        width: 268rpx;
        flex-shrink: 0;
        color: #1A1A1A;
        text-align: right;
        white-space: nowrap;
        word-wrap: none;
        font-size: 0;
        text {
          display: inline-block;
          vertical-align: middle;
        }
        .span {
          margin-right: 4rpx;
          font-size: 24rpx;
          text-align: center;
          transform: scale(.66) translateZ(0);
        }
        .i {
          max-width: 234rpx;
          font-style: normal;
          font-size: 28rpx;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &.away {
          text-align: left;
          text {
            margin-left: 4rpx;
            margin-right: 0;
          }
        }
      }
      .vs {
        font-family: $AGN;
        width: 64rpx;
        flex-shrink: 0;
        text-align: center;
        color: #333;
        font-size: 34rpx;
      }
    }
    &--odds {
      border-radius: 6rpx;
      background: #F4F4F4;
      overflow: hidden;
      transform: translateZ(0);
      position: relative;
      .odds {
        width: 536rpx;
      }
      .odds-more {
        position: absolute;
        height: 100%;
        width: 64rpx;
        top: 0;
        right: 0;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        border-left: 0.01rem solid #fff;
        text {
          line-height: 1.1;
          transform: scale(.91) translateZ(0);
          transform-origin: 50% 100%;
          word-break: break-all;
          width: 30rpx;
        }
        .i {
          width: 38rpx;
          height: 38rpx;
          line-height: 38rpx;
          background: #65AFFF;
          border-radius: 100%;
          color: #fff;
          text-align: center;
          transform: scale(.82) translateZ(0);
          font-style: normal;
        }
      }
      .ul {
        display: flex;
        position: relative;
      }
      .ul + .ul {
        box-sizing: border-box;
        border-top: 0.01rem solid #fff;
      }
      .li {
        width: 152rpx;
        height: 80rpx;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #333;
        &.disable {
          color: #999!important;
        }
        &.play-type {
          width: 80rpx;
          background: #f3f5f7;
          &.hilo {
            letter-spacing: -0.01rem;
          }
        }
        &.basket {
          width: 228rpx;
        }
        .num {
          text-align: center;
          line-height: 28rpx;
          position: relative;
          b {
            font-size: 24rpx;
            display: inline-block;
            transform: scale(.82) translateZ(0);
            font-weight: normal;
            letter-spacing: normal;
          }
          .i {
            display: block;
            position: absolute;
            top: 50%;
            margin-top: 4rpx;
            left: 100%;
            margin-left: 4rpx;
          }
        }
        &.choose {
          background: #65AFFF;
          color: #fff;
        }
      }
      .li + .li {
        box-sizing: border-box;
        border-left: 0.01rem solid #fff;
      }
    }
  }
}
.match-list-detail + .match-list-detail {
  &::before {
    // @include one-rpx-x(#ebebeb, top);
    left: 118rpx;
    right: 32rpx;
  }
}
</style>
