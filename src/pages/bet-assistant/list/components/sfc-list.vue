<template>
  <view class="sfc-list">
    <view
      class="sfc-list__item"
      v-for="item in list"
      :key="item.matchInfoId">
      <view class="sfc-list__item--info">
        <view class="num"><i>{{item.matchNum}}</i></view>
        <view class="league" :style="{'color': item.leagueMatchColor || '#f22'}"><i>{{item.leagueMatchName}}</i></view>
        <view class="date"><i>{{[item.matchTime, 'MM.dd'] | formatDate}}<br />{{[item.matchTime, 'hh:mm'] | formatDate}}</i></view>
      </view>
      <view class="sfc-list__item--against">
        <view class="team-name" @click="toMatchDetail(item.matchInfoId)">
          <view class="name"><span>[主]</span><i>{{item.homeTeam.teamName}}</i></view>
          <view class="vs">VS</view>
          <view class="name away"><i>{{item.guestTeam.teamName}}</i></view>
        </view>
        <view class="odds" v-if="item.playMap && item.playMap.HDA">
          <li
            v-for="_item in item.playMap.HDA.playItemList"
            :key="_item.playItemId"
            :class="{'choose': isChoose(_item, 'HDA', item.matchInfoId)}"
            @click="choosePlayItem(_item, item.playMap.HDA, item)">
            <view class="num">{{_item.playItemName}}<br/><b>{{_item.odds || '-'}}</b><i class="icon-odds-up" v-if="_item.oddsChange === 1"></i><i class="icon-odds-down" v-if="_item.oddsChange === 2"></i></view>
          </li>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'sfc-list',
  props: ['list', 'is-choose', 'choose-play-item'],
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
.sfc-list {
  background: #fff;
  padding: 30rpx 32rpx;
  &__item {
    padding: 30rpx 0;
    display: flex;
    &--info {
      flex-shrink: 0;
      width: 86rpx;
      color: #999;
      i {
        display: inline-block;
        font-style: normal;
        display: inline-block;
        transform: scale(.82) translateZ(0);
        transform-origin: 0 50%;
      }
      .num {
        height: 40rpx;
        line-height: 40rpx;
      }
      .league {
        margin-top: 22rpx;
        height: 28rpx;
        line-height: 28rpx;
        color: #f22;
        i {
          height: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 120%;
        }
      }
      .date {
        margin-top: 8rpx;
        height: 24rpx;
        line-height: 24rpx;
      }
    }
    &--against {
      width: 600rpx;
      flex-shrink: 0;
      .team-name {
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
          span, i {
            display: inline-block;
            vertical-align: middle;
          }
          span {
            margin-right: 4rpx;
            font-size: 24rpx;
            text-align: center;
            transform: scale(.66) translateZ(0);
          }
          i {
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
          }
        }
        .vs {
          font-family: $AGN;
          width: 64rpx;
          flex-shrink: 0;
          text-align: center;
          color: #333;
          font-size: 46rpx;
        }
      }
      .odds {
        height: 80rpx;
        border-radius: 6rpx;
        background: #F4F4F4;
        overflow: hidden;
        transform: translateZ(0);
        display: flex;
        li {
          width: 33.3333%;
          height: 100%;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #333;
          .num {
            text-align: center;
            line-height: 28rpx;
            position: relative;
            b {
              font-size: 24rpx;
              display: inline-block;
              transform: scale(.82) translateZ(0);
              font-weight: normal;
              font-family: $PFR;
            }
            i {
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
        li + li {
          box-sizing: border-box;
          border-left: 0.01rem solid #fff;
        }
      }
    }
  }
}
</style>
