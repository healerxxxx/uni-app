<template>
  <view class="match-item-card-wrapper">
    <view
      class="match-item-card"
      :class="{
        'basketball': categoryId === 2,
        'high-light': categoryId === 1 && highLight !== 0,
        'no-border': hiddenBorder
      }"
      @click="toMatchDetail(matchData.matchInfoId)">
      <view class="match-item-card--left">
        <view><text>{{matchData.leagueMatch.leagueName}}</text></view>
        <view v-if="matchData.jcNum"><text>{{matchData.jcNum}}</text></view>
        <view class="status" v-if="matchStatus === 2 && categoryId !== 2">
          <text>进行中</text>
        </view>
        <view class="team-name" v-if="categoryId === 2" :class="{'high-light': highLight === (2 || 3)}">{{matchData.guestTeam.teamName}}</view>
        <view class="team-name" v-if="categoryId === 2" :class="{'high-light': highLight === (1 || 3)}">{{matchData.homeTeam.teamName}}</view>
        <view class="status" v-if="matchStatus === 2 && categoryId === 2"><text>进行中</text></view>
      </view>
      <view class="match-item-card--middle">
        <view class="match-item-card--middle__info">
          <view class="time text-right">
            <view>{{[matchData.matchTime, 'MM.dd hh:mm'] | formatDate}}</view>
          </view>
          <view class="play-time text-center" v-if="matchStatus === 2">
            <view
              v-if="categoryId === 1"
              class="minute">
              <text v-if="liveScore.statusEnum !== 2 && liveScore.statusEnum !== 4">{{liveScore.status}}</text>
              <text v-else>{{[footballMunites, categoryId, liveScore.statusEnum, liveScore.totalMin] | minutesTrans}}</text>
            </view>
            <view
              v-else
              class="minute">
              <text>{{liveScore.status}}</text> <text v-if="liveScore.overStatus === 0">{{[basketballMunites, categoryId] | minutesTrans}}</text><text v-else>完</text>
            </view>
          </view>
          <view class="play-time text-center" v-else>
            <view>{{liveScore.status}}</view>
          </view>
          <view class="score" v-if="liveScore">
            <view v-if="liveScore.halfScore">{{liveScore.halfScore}}</view>
            <view v-if="liveScore.cornerKick">{{liveScore.cornerKick}}</view>
          </view>
        </view>
        <view
          class="match-item-card--middle__team"
          v-if="categoryId !== 2">
          <view class="team-name text-right" :class="{'high-light': highLight === (1 || 3)}">
            <text class="yellow-card" v-if="liveScore && liveScore.homeYellowCard">{{liveScore.homeYellowCard}}</text>
            <text class="red-card" v-if="liveScore && liveScore.homeRedCard">{{liveScore.homeRedCard}}</text>
            <view :class="{
              'one-card': (liveScore && liveScore.homeYellowCard && !liveScore.homeRedCard) || (liveScore && !liveScore.homeYellowCard && liveScore.homeRedCard),
              'two-card': liveScore && liveScore.homeYellowCard && liveScore.homeRedCard 
            }">{{matchData.homeTeam.teamName}}</view>
          </view>
          <view class="vs text-center" v-if="matchStatus === 2 || matchStatus === 3">
            <span class="b" :class="{'high-light': highLight === (1 || 3)}">{{liveScore && liveScore.homeScore ? liveScore.homeScore : 0}}</span><span class="b"> - </span><span class="b" :class="{'high-light': highLight === (2 || 3)}">{{liveScore && liveScore.guestScore ? liveScore.guestScore : 0}}</span>
          </view>
          <view class="vs text-center" v-else>VS</view>
          <view class="team-name" :class="{'high-light': highLight === (2 || 3)}">
            <view :class="{
              'one-card': (liveScore && liveScore.guestRedCard && !liveScore.guestYellowCard) || (liveScore && !liveScore.guestRedCard && liveScore.guestYellowCard),
              'two-card': liveScore && liveScore.guestRedCard && liveScore.guestYellowCard
            }">{{matchData.guestTeam.teamName}}</view>
            <text class="red-card" v-if="liveScore && liveScore.guestRedCard">{{liveScore.guestRedCard}}</text>
            <text class="yellow-card" v-if="liveScore && liveScore.guestYellowCard">{{liveScore.guestYellowCard}}</text>
          </view>
        </view>
        <view
          v-if="categoryId === 2 && (matchStatus === 2 || matchStatus === 3) && liveScore"
          class="match-item-card--middle__score"
          :class="{'jcNum': matchData.jcNum}">
          <view
            v-for="(item, index) in liveScore.quarterScoreList"
            :key="item.type"
            :class="{'all': item.type === 0}">
            <p :class="{'high-light': basketballHighLightScore === index && highLight === (2 || 3)}">{{item.guestScore >= 0 ? item.guestScore : '-'}}</p>
            <p :class="{'high-light': basketballHighLightScore === index && highLight === (1 || 3)}">{{item.homeScore >= 0 ? item.homeScore : '-'}}</p>
            <p><text>{{item.name}}</text></p>
          </view>
        </view>
        <view
          v-if="categoryId === 2 && matchStatus !== 2 && matchStatus !== 3"
          class="match-item-card--middle__vs"
          :class="{'jcNum': matchData.jcNum}">VS</view>
      </view>
      <view class="match-item-card--right">
        <image
          src="/static/icon-match-unfollow.svg"
          v-if="(matchStatus === 1 || matchStatus === 2) &&  !matchData.hasFollowed"
          @click.stop.prevent="followMatch"
          class="follow">
        </image>
        <image
          src="/static/icon-match-followed.svg"
          v-if="(matchStatus === 1 || matchStatus === 2) && matchData.hasFollowed"
          @click.stop.prevent="followMatch"
          class="followed">
        </image>
      </view>
      <view class="match-item-card--suprise" v-if="matchData.hasSurprise"><view>冷</view></view>
    </view>
    <view
      v-if="matchExplain"
      class="match-item-card--tip">
      <view>{{matchExplain}}</view>
    </view>
  </view>
</template>

<script>
import { follow, unFollow } from '@/utils/api/common'
import { mapState } from 'vuex'
export default {
  name: 'match-item-card',
  props: ['info', 'hidden-border', 'index-i'],
  data () {
    return {
      matchData: {},
      loading: false,
      basketballMunites: 0,
      footballMunites: 0,
      timer: null,
      highLight: 0
    }
  },
  computed: {
    ...mapState(['userInfo']),
    categoryId () {
      return this.info.lotteryCategoryId
    },
    matchStatus () {
      return this.matchData.matchStatus
    },
    liveScore () {
      if (this.categoryId === 1 && this.matchData.footballLiveScore) {
        return this.matchData.footballLiveScore
      }
      if (this.categoryId === 2 && this.matchData.basketballLiveScore) {
        return this.matchData.basketballLiveScore
      }
      return null
    },
    matchExplain () {
      if (this.liveScore && this.liveScore.matchExplain) {
        return this.liveScore.matchExplain
      }
      return null
    },
    basketballHighLightScore () {
      let index = -1
      if (this.matchStatus === 2 && this.liveScore && this.liveScore.quarterScoreList && this.liveScore.quarterScoreList.length > 0) {
        const arr = this.liveScore.quarterScoreList
        for (let i = 0; i < arr.length - 1; i++) {
          if ((arr[i].guestScore >= 0 || arr[i].homeScore >= 0) &&
            (i === arr.length - 2 || (!arr[i + 1].guestScore && !arr[i + 1].homeScore))) {
            index = i
          }
        }
      }
      return index
    }
  },
  filters: {
    minutesTrans ([val, categoryId, status, totalMin]) {
      if (categoryId === 2) {
        const minute = Math.floor(val / 60)
        const second = val % 60
        return (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second)
      } else {
        if (status === 4) {
          if (val > totalMin) {
            return `${totalMin}′+`
          } else {
            return `${val}′`
          }
        } else {
          if (val > totalMin / 2) {
            return `${totalMin / 2}′+`
          } else {
            return `${val}′`
          }
        }
      }
    }
  },
  created () {
    this.matchData = this.info
    this.$bus.$on('match-detail-event', data => {
      if (data.matchInfoId === this.matchData.matchInfoId) {
        this.matchData = data
      }
    })
    this.$bus.$on('match-follow', res => {
      if (res.matchInfoId === this.matchData.matchInfoId) {
        this.matchData.hasFollowed = res.hasFollowed
      }
    })
  },
  methods: {
    toMatchDetail (id) {
      uni.navigateTo({
        url: `/pages/match-detail/index?matchInfoId=${id}`
      })
    },
    emitFollow () {
      this.$bus.$emit('match-follow', this.matchData)
      this.$bus.$emit('match-follow-refresh', this.categoryId)
    },
    followMatch () {
      if (this.userInfo && this.userInfo.userId) {
        return this.queryFollowMatch()
      } else {
        uni.navigateTo({
          url: '/pages/user/login'
        })
      }
    },
    queryFollowMatch () {
      if (this.loading) return
      this.loading = true
      this.$service(this.matchData.hasFollowed ? unFollow : follow, {
        method: 'post',
        urlParams: {
          type: 'match',
          id: this.matchData.matchInfoId
        }
      }).then(res => {
        let title = ''
        if (res.code === 200) {
          title = `${this.matchData.hasFollowed ? '取消' : ''}关注成功`
          this.matchData.hasFollowed = !this.matchData.hasFollowed
          this.emitFollow()
        } else if (res.code === 42217) {
          title = '您不可以关注自己哦'
        } else if (res.code === 42219) {
          this.matchData.hasFollowed = !this.matchData.hasFollowed
          this.emitFollow()
          return
        } else {
          title = res.message
        }
        uni.showToast({title: title, icon: 'none'})
      }).catch(err => {
        err && uni.showToast({title:'网络请求错误',icon:'none'})
      }).finally(() => {
        this.loading = false
      })
    },
    setTime (val) {
      if (val.lotteryCategoryId === 2) {
        if (val.matchStatus === 2 && val.basketballLiveScore && val.basketballLiveScore.remainingTime) {
          this.basketballMunites = val.basketballLiveScore.remainingTime
          if (val.basketballLiveScore.timeStatus === 0) {
            this.setBasketballTime()
          }
        }
      } else {
        if (val.matchStatus === 2 && val.footballLiveScore && val.footballLiveScore.liveTime) {
          this.footballMunites = val.footballLiveScore.liveTime
          this.setFootballTime()
        }
      }
    },
    setBasketballTime () {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.basketballMunites > 0) {
          this.basketballMunites--
        }
      }, 1000)
    },
    setFootballTime () {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.footballMunites++
      }, 1000 * 60)
    }
  },
  watch: {
    info (val) {
      this.matchData = val
    },
    matchData: {
      deep: true,
      handler (val) {
        this.setTime(val)
        if (this.categoryId === 1) {
          if (val.footballLiveScore && val.footballLiveScore.highLight !== undefined && val.footballLiveScore.highLight !== 0) {
            this.highLight = val.footballLiveScore.highLight
          }
        } else {
          if (val.basketballLiveScore && val.basketballLiveScore.highLight !== undefined && val.basketballLiveScore.highLight !== 0) {
            this.highLight = val.basketballLiveScore.highLight
          }
        }
      }
    },
    highLight (val) {
      if (val !== 0) {
        setTimeout(() => {
          this.highLight = 0
        }, 3000)
      }
    }
  },
  beforeDestroy () {
    this.$bus.$off('match-follow', {})
    this.$bus.$off('match-detail-event', {})
  }
}
</script>

<style lang="scss">
@import '../../assets/style/mixin.scss';
.match-item-card {
  padding: 24rpx 32rpx;
  background: #fff;
  font-size: 0;
  flex-shrink: 0;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 32rpx;
    right: 0;
    height: 0;
    border-top: 1rpx solid #eee;
    z-index: 1;
  }
  &.no-border {
    &:before {
      display: none;
    }
  }
  &.high-light {
    background: #FFF7F7;
  }
  .text-right{
    text-align: right;
  }
  .text-center{
    text-align: center;
  }
  .text-left{
    text-align: left;
  }
  &--tip {
    height: 40rpx;
    line-height: 40rpx;
    text-align: center;
    color: #999;
    font-size: 20rpx;
    view {
      display: inline-block;
      transform: scale(0.83) translateZ(0);
    }
  }
  &--left, &--middle, &--right {
    display: inline-block;
    vertical-align: top;
  }
  &--left {
    width: 130rpx;
    view {
      display: block;
      height: 24rpx;
      line-height: 24rpx;
      font-size: 24rpx;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text {
        display: inline-block;
        transform: scale(0.74) translateZ(0);
        transform-origin: 0 50%;
        font-style: normal;
      }
      &.status {
        margin-top: 6rpx;
        height: 26rpx;
        text {
          height: 40rpx;
          line-height: 40rpx;
          padding: 0 10rpx;
          background: #F2F3F4;
          border-radius: 40rpx;
          display: inline-block;
          transform: scale(0.66) translateZ(0);
          transform-origin: 0 0;
          font-style: normal;
          color: #FF6E25;
          background: #FFF0E9;
        }
      }
    }
  }
  &--middle {
    width: 430rpx;
    &__team {
      view {
        line-height: 34rpx;
        padding: 4rpx 0;
        display: inline-block;
        vertical-align: top;
        font-family: $PFM;
        color: #1a1a1a;
        word-wrap: break-word;
        word-break: break-all;
        &.team-name {
          width: 170rpx;
          view {
            font-weight: normal;
            display: inline-block;
            vertical-align: top;
            max-width: 170rpx;
            font-size: 26rpx;
            &.one-card {
              max-width: 132rpx;
            }
            &.two-card {
              max-width: 112rpx;
            }
          }
          &.high-light {
            color: #ff2222;
          }
        }
        text {
          display: inline-block;
          vertical-align: top;
          text-align: center;
          font-style: normal;
          margin: 2rpx 0 0;
          width: 22rpx;
          height: 30rpx;
          line-height: 30rpx;
          font-size: 24rpx;
          color: #fff;
          transform: scale(0.66) translateZ(0);
          &.yellow-card {
            background: #F5A218;
          }
          &.red-card {
            background: #E43131;
          }
        }
        text + text {
          margin-left: -2rpx;
        }
        &.vs {
          width: 90rpx;
          font-size: 40rpx;
          font-family: 'alternategothicno2bt',sans-serif;
          span {
            font-weight: bold;
            font-size: normal;
            display: inline-block;
            &.high-light {
              color: #f22222;
            }
          }
        }
      }
    }
    &__info {
      height: 28rpx;
      line-height: 28rpx;
      color: #999;
      .time, .play-time, .score {
        display: inline-block;
        vertical-align: middle;
        font-size: 24rpx;
        view {
          display: inline-block;
          transform: scale(0.83) translateZ(0);
          &.minute {
            color: #ff2222;
            text {
              font-style: normal;
            }
          }
        }
      }
      .time, .score {
        width: 170rpx;
      }
      .time {
        view {
          transform-origin: 100% 50%;
        }
      }
      .play-time {
        width: 90rpx;
      }
      .score {
        color: #333;
        view {
          transform-origin: 0 50%;
        }
      }
    }
  }
  &--right {
    width: 126rpx;
    text-align: right;
    .follow, .followed{
      display: inline-block;
      width: 30rpx;
      height: 28rpx;
    }
    .read {
      margin-top: 18rpx;
      font-size: 24rpx;
      line-height: 28rpx;
      color: #999;
      view {
        display: inline-block;
        transform: scale(0.74) translateZ(0);
        transform-origin: 100%;
      }
    }
  }
  &--suprise {
    position: absolute;
    left: 0;
    top: 0;
    width: 32rpx;
    height: 34rpx;
    line-height: 30rpx;
    border-radius: 0 0 34rpx 0;
    background: #65AFFF;
    font-size: 24rpx;
    color: #FFFFFF;
    padding-left: 2rpx;
    view {
      display: inline-block;
      transform: scale(.82) translateZ(0);
    }
  }
  &.basketball {
    .match-item-card--left {
      width: 260rpx;
      .team-name {
        height: 36rpx;
        line-height: 36rpx;
        font-size: 26rpx;
        font-family: $PFM;
        color: #1a1a1a;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        &.high-light {
          color: #ff2222;
        }
      }
    }
    .match-item-card--middle {
      width: 300rpx;
      .match-item-card--middle__info {
        height: 24rpx;
        line-height: 24rpx;
        .time, .play-time {
          width: auto;
          view {
            transform-origin: 0 50%;
          }
        }
      }
      .match-item-card--middle__vs {
        line-height: 72rpx;
        font-size: 28rpx;
        color: #1a1a1a;
        font-family: 'alternategothicno2bt';
        width: 42rpx;
        text-align: center;
        &.jcNum {
          margin-top: 24rpx;
        }
      }
      .match-item-card--middle__score {
        &.jcNum {
          margin-top: 24rpx;
        }
        view {
          display: inline-block;
          vertical-align: top;
          width: 42rpx;
          line-height: 36rpx;
          text-align: center;
          view {
            font-size: 28rpx;
            color: #1a1a1a;
            font-family: 'alternategothicno2bt';
            height: 36rpx;
            &.high-light {
              color: #ff2222;
            }
            text {
              color: #999;
              display: inline-block;
              font-size: 24rpx;
              transform: scale(0.66) translateZ(0);
              font-family: $PFR;
              font-style: normal;
            }
          }
          &.all {
            view {
              color: #ff2222;
              text {
                color: #ff2222;
                transform: scale(0.84) translateZ(0);
              }
            }
          }
        }
      }
    }
  }
}
</style>
