
<template>
  <view class="league-schedule">
    <view
      class="league-schedule__detail"
      v-if="info.homeTeam"
      :class="{'overall': info.matchList, 'basketball': !info.matchList && categoryId === 2}"
      @click="toMatchDetail(info.matchInfoId)">
      <view class="league-schedule__detail--time" v-if="!info.matchList">
        <view v-if="info.matchTime">{{[info.matchTime, 'yyyy.MM.dd'] | formatDate}}<br />{{[info.matchTime, 'hh:mm'] | formatDate}}</view>
        <view v-else></view>
      </view>
      <view class="league-schedule__detail--vs">
        <view class="li">
          <view class="team">
            <view class="pic" v-if="info.matchList">
              <image :src="/relottery|(126.net)/.test(getTeamLogo(info, 'home')) ? getTeamLogo(info, 'home') + '?imageView&thumbnail=54y54&quaviewty=85' : getTeamLogo(info, 'home')" v-if="info.homeTeam.logo" />
              <image src="https://relottery.ws.126.net/thread/20191012/H2fpJg.png" v-else >
            </view>
            <text>{{getTeamName(info, 'home')}}</text>
          </view>
          <view class="vs" v-if="status === 2 || status === 3 || info.matchStatus === 2 || info.matchStatus === 3">
            <text class="i" :class="[scoreColor(info, 'home', 'red')]">{{getTeamScore(info, 'home')}}</text>
             - 
            <text class="i" :class="[scoreColor(info, 'away', 'red')]">{{getTeamScore(info, 'away')}}</text>
          </view>
          <view class="vs" v-else> VS </view>
          <view class="team guest">
            <text>{{getTeamName(info, 'away')}}</text>
            <view class="pic" v-if="info.matchList">
              <image :src="/relottery|(126.net)/.test(getTeamLogo(info, 'away')) ? getTeamLogo(info, 'away') + '?imageView&thumbnail=54y54&quaviewty=85' : getTeamLogo(info, 'away')" v-if="info.awayTeam.logo" />
              <image src="https://relottery.ws.126.net/thread/20191012/H2fpJg.png" v-else />
            </view>
          </view>
        </view>
      </view>
    </view>
    <view
      class="league-schedule__detail"
      :class="{'basketball': categoryId === 2}"
      v-for="(item, index) in info.matchList"
      :key="index"
      @click="toMatchDetail(item.matchInfoId)">
      <view class="league-schedule__detail--time">
        <view>{{[item.matchTime, 'yyyy.MM.dd'] | formatDate}}{{[item.matchTime, 'hh:mm'] | formatDate}}</view>
      </view>
      <view class="league-schedule__detail--vs">
        <view class="li">
          <view class="team">
            <text class="no-logo">{{getTeamName(item, 'home')}}</text>
          </view>
          <view class="vs" v-if="item.matchStatus === 2 || item.matchStatus === 3">
            <text class="i" :class="[scoreColor(item, 'home', 'red')]">{{getTeamScore(item, 'home')}}</text>
             - 
            <text class="i" :class="[scoreColor(item, 'away', 'red')]">{{getTeamScore(item, 'away')}}</text>
          </view>
          <view class="vs" v-else>VS</view>
          <view class="team guest">
            <text class="no-logo">{{getTeamName(item, 'away')}}</text>
          </view>
        </view>
        <view v-if="item.penaltyKickStatus">
          <label><view>点球</view></label>
          <view class="vs small"><view>[{{item.homePenaltyKick}}-{{item.awayPenaltyKick}}]</view></view>
          <label></label>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'league-schedule',
  props: ['info', 'categoryId'],
  computed: {
    status () {
      let status = 1
      if (this.info && this.info.matchList) {
        this.info.matchList.map(item => {
          if (item.matchStatus === 2 || item.matchStatus === 3) {
            status = item.matchStatus
          }
        })
      }
      return status
    }
  },
  methods: {
    toMatchDetail (id) {
      if (!id) return
      uni.navigateTo({
        url: '/pages/match-detail/index?matchInfoId=' + id
      })
    },
    getTeamName (info, type) {
      const { categoryId } = this
      if (categoryId === 1) {
        if (type === 'home') {
          return info.homeTeam.name
        }
        if (type === 'away') {
          return info.awayTeam.name
        }
      }
      if (categoryId === 2) {
        if (type === 'away') {
          return info.homeTeam.name
        }
        if (type === 'home') {
          return info.awayTeam.name
        }
      }
    },
    getTeamLogo (info, type) {
      const { categoryId } = this
      if (categoryId === 1) {
        if (type === 'home') {
          return info.homeTeam.logo
        }
        if (type === 'away') {
          return info.awayTeam.logo
        }
      }
      if (categoryId === 2) {
        if (type === 'away') {
          return info.homeTeam.logo
        }
        if (type === 'home') {
          return info.awayTeam.logo
        }
      }
    },
    getTeamScore (info, type) {
      const { categoryId } = this
      if (categoryId === 1) {
        if (type === 'home') {
          return info.homeScore
        }
        if (type === 'away') {
          return info.awayScore
        }
      }
      if (categoryId === 2) {
        if (type === 'away') {
          return info.homeScore
        }
        if (type === 'home') {
          return info.awayScore
        }
      }
    },
    scoreColor (info, type, color) {
      color = color || 'red'
      const homeScore = color === 'red' ? this.getTeamScore(info, 'home') : this.getTeamScore(info, 'away')
      const awayScore = color === 'red' ? this.getTeamScore(info, 'away') : this.getTeamScore(info, 'home')
      if (type === 'home') {
        if (homeScore > awayScore) {
          return color
        }
      }
      if (type === 'away') {
        if (awayScore > homeScore) {
          return color
        }
      }
      return ''
    }
  }
}
</script>

<style lang="scss">
@import "../../../assets/style/mixin.scss";
.league-schedule {
  &__detail {
    height: 90rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-bottom: 1rpx solid #eee;
    &--time {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 165rpx;
      line-height: 1.2;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      view {
        display: inline-block;
        color: #999;
        transform: scale(0.84) translateZ(0);
        transform-origin: 0% 50%;
      }
    }
    &--vs {
      flex-shrink: 0;
      width: 430rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      .li {
        height: 34rpx;
        line-height: 34rpx;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .team {
      flex-shrink: 0;
      width: 140rpx;
      text-align: right;
      white-space: nowrap;
      word-wrap: none;
      font-size: 0;
      &:before {
        content: "";
        width: 0;
        height: 100%;
        display: inline-block;
        vertical-align: middle;
      }
      .pic,
      text {
        display: inline-block;
        vertical-align: middle;
      }
      .pic {
        flex-shrink: 0;
        width: 36rpx;
        height: 36rpx;
        border-radius: 100%;
        overflow: hidden;
        text-align: center;
        margin-right: 10rpx;
        image {
          display: inline-block;
          vertical-align: middle;
          max-width: 36rpx;
          max-height: 36rpx;
        }
      }
      text {
        font-size: 24rpx;
        max-width: 134rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: elviewpsis;
        text-align: left;
        &.no-logo {
          max-width: 100%!important;
        }
      }
      &.guest {
        text-align: left;
        .pic {
          margin-right: 0;
          margin-left: 10rpx;
        }
      }
    }
    label {
      width: 120rpx;
      text-align: right;
      view {
        color: #ff6618;
        display: inline-block;
        transform: scale(0.84) translateZ(0);
      }
    }
    .vs {
      font-family: "alternategothicno2bt", sans-serif;
      margin: 0 10rpx;
      max-width: 70rpx;
      font-size: 32rpx;
      text-align: center;
      line-height: 36rpx;
      &.small {
        margin: 0;
        view {
          color: #ff6618;
          display: inline-block;
          transform: scale(0.92) translateZ(0);
          transform-origin: 0 100%;
        }
      }
      .i {
        font-style: normal;
        &.red {
          color: #ff2222;
        }
      }
    }
    &.basketball {
      .team {
        width: 145rpx;
        text {
          max-width: 118rpx;
        }
      }
      .vs {
        max-width: 140rpx;
      }
    }
    &.overall {
      margin-top: 40rpx;
      .league-schedule__detail--vs {
        width: 100%;
      }
      .team {
        width: 280rpx;
        text {
          max-width: 140rpx;
          font-weight: bold;
        }
      }
      .vs {
        margin: 0 15rpx;
        font-size: 36rpx;
        max-width: 100rpx;
      }
    }
  }
  &:first-child {
    .overall {
      margin-top: 0!important;
    }
  }
  &:last-child {
    .league-schedule__detail:last-child {
      &:before {
        display: none;
      }
    }
  }
}
</style>