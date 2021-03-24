<template>
  <view
    class="detail-data-wrapper"
    @click="detailDataClick"
    @touchstart="touchStart"
    @touchmove="touchMove">
    <view
      class="detail-data-"
      v-if="matchInfo">
      <view class="detail-data__modules">
        <view class="h3">
          <text class="span">指数分析</text>
           <view
            class="span bet"
            v-if="oddsAnalyse && oddsAnalyse.sellStatus"
            @click="toBet">
            <text class="i">投注助手</text>
            <text class="i icon"></text>
          </view>
        </view>
        <odds-analyse
          v-if="oddsAnalyse"
          :category="category"
          :info="oddsAnalyse" />
        <view class="detail-data__no-data" v-if="!oddsAnalyse">暂无数据</view>
        <view class="thread-tips" v-if="threadCount > 0" @click="toDownload">
          <view class="thread-tips__content">
            <text class="span">{{threadCount}}名行业专家分析本场比赛,去红彩APP查看</text>
            <view class="arrows"></view>
          </view>
        </view>
      </view>
      <view class="detail-data__modules">
        <view class="h3">
          <text class="span">积分排名</text>
          <view
            class="span league"
            v-if="league"
            @click="toLeagueRank">
            <text class="i">{{league.leagueName}}</text>
            <text class="i icon"></text>
          </view>
          <view
            class="switch-button"
            v-if="range && category === 2">
            <text class="span" :class="{current: !rangeType}" @click="rangeType = 0">总</text>
            <text class="span" :class="{current: rangeType}" @click="rangeType = 1">主客</text>
          </view>
        </view>
        <view v-if="category === 1">
          <view class="h4" v-if="range"><text class="span">{{matchInfo.homeName}}</text></view>
          <league-rank
            v-if="range"
            :category="category"
            :matchInfo="matchInfo"
            :type="2"
            :info="range" />
          <view class="h4" v-if="range"><text class="span">{{matchInfo.guestName}}</text></view>
          <league-rank
            v-if="range"
            :category="category"
            :matchInfo="matchInfo"
            :type="3"
            :info="range" />
        </view>
        <league-rank
          v-if="range && category === 2"
          :category="category"
          :matchInfo="matchInfo"
          :type="rangeType"
          :info="range" />
        <view class="detail-data__no-data" v-if="!range">暂无数据</view>
      </view>
      <view class="detail-data__modules">
        <view class="h3">
          <text class="span">交锋战绩</text>
          <view class="switch-button" v-if="meeting && (meeting.allMeetingList || meeting.homeMeetingList) ">
            <text class="span" :class="{current: meetingSwitch === 0}" @click="meetingSwitch = 0">全部</text>
            <text class="span" :class="{current: meetingSwitch === 1}" @click="meetingSwitch = 1">主场</text>
          </view>
        </view>
        <view
          v-if="meetingCount.matchNum > 0 && category === 2 "
          class="meeting-vs">
          {{category === 1 ? matchInfo.homeName + ' VS ' + matchInfo.guestName : matchInfo.guestName + ' VS ' + matchInfo.homeName}}&nbsp;
          ({{meetingCount.matchNum || 0}}场)
        </view>
        <view class="meeting-info_football" v-if="category === 1">
          <view
            v-if="meetingCount.matchNum > 0 "
            class="vs">
            {{category === 1 ? matchInfo.homeName + ' VS ' + matchInfo.guestName : matchInfo.guestName + ' VS ' + matchInfo.homeName}}&nbsp;
            ({{meetingCount.matchNum || 0}}场)
          </view>
          <meeting-info
            v-if="meetingCount"
            :team="matchInfo.homeName"
            :count="meetingCount"
            :info="meetingCount"
            :category="category" />
        </view>
        <meeting-info
          v-if="meetingCount && category === 2"
          :team="matchInfo.homeName"
          :info="meetingCount"
          :category="category" />
        <meeting-chart
          v-if="meetingCount && category === 2"
          :count="meetingCount" />
        <flexible-list
          v-if="meetingList.length > 0"
          :teamId="matchInfo.homeId"
          :category="category"
          :list="meetingList" />
        <view class="detail-data__no-data" v-if="meetingList.length === 0">暂无数据</view>
      </view>
      <view class="detail-data__modules">
        <view class="h3"><span class="span">近期战绩</span></view>
        <view class="detail-data__modules--block" v-if="matchData.dishroad">
          <view class="h4">
            <text class="span">{{category === 2 ? matchInfo.guestName : matchInfo.homeName}}</text>
            <text v-if="dishroadHome">({{dishroadHome[dishroadHomeType === 0 ? 'allDishCountVo' : 'teamDishCountVo'].matchNum}}场)</text>
            <text v-else>(0场)</text>
            <view
              v-if="dishroadHome && dishroadHome.beyond"
              class="history-tag"></view>
            <view
              class="switch-button"
              v-if=" dishroadHome && (dishroadHome.allMatchList.length > 0 || dishroadHome.teamMatchList.length > 0) && category === 2 ">
              <text class="span" :class="{current: dishroadHomeType === 0}" @click="dishroadHomeType = 0">全部</text>
              <text class="span" :class="{current: dishroadHomeType === 1}" @click="dishroadHomeType = 1">{{category === 1 ? '主场' : '客场'}}</text>
            </view>
          </view>
          <dish-info
            v-if="dishroadHome"
            :info="dishroadHome"
            :category="category"
            :type="dishroadHomeType" />
          <view
            class="meeting-info_switch"
            v-if="category === 1 ">
            <view
              class="match-button"
              @click.stop="homeDropVisibleChane">
              <text :class="{'disable': dishroadHomeList.length < 0}">{{matchList[homeMatchType].name}}</text>
              <text class="icon" v-if="homeIcon"></text>
            </view>
            <drop-select
              v-model="homeDropVisible"
              :index="homeMatchType"
              :list="matchList"
              @change="homeMatchChange" />
            <view
              class="switch-button"
              v-if="dishroadHome && (dishroadHome.allMatchList.length > 0 || dishroadHome.teamMatchList.length > 0)">
              <text class="span" :class="{current: dishroadHomeType === 0}" @click="dishroadHomeType = 0">全部</text>
              <text class="span" :class="{current: dishroadHomeType === 1}" @click="dishroadHomeType = 1">{{category === 1 ? '主场' : '客场'}}</text>
            </view>
          </view>
          <flexible-list
            v-if="dishroadHomeList.length > 0"
            :teamId="category===1 ? matchInfo.homeId : matchInfo.guestId"
            :category="category"
            :list="dishroadHomeList" />
          <view class="detail-data__no-data" v-else>暂无数据</view>
        </view>
        <view class="detail-data__modules--block"  v-if="matchData.dishroad">
          <view class="h4">
            <text class="span">{{category === 2 ? matchInfo.homeName : matchInfo.guestName}}</text>
            <text v-if="dishroadGuest">({{dishroadGuest[dishroadGuestType === 0 ? 'allDishCountVo' : 'teamDishCountVo'].matchNum}}场)</text>
            <text v-else>(0场)</text>
            <view
              v-if="dishroadGuest && dishroadGuest.beyond"
              class="history-tag"></view>
            <view
              class="switch-button"
              v-if="dishroadHome && (dishroadHome.allMatchList.length > 0 || dishroadHome.teamMatchList.length > 0) && category === 2 ">
              <text class="span" :class="{current: dishroadGuestType === 0}" @click="dishroadGuestType = 0">全部</text>
              <text class="span" :class="{current: dishroadGuestType === 1}" @click="dishroadGuestType = 1">{{category === 2 ? '主场' : '客场'}}</text>
            </view>
          </view>
          <dish-info
            v-if="dishroadGuest"
            :info="dishroadGuest"
            :category="category"
            :type="dishroadGuestType" />
          <view class="meeting-info_switch" v-if="category === 1 ">
            <view
              class="match-button"
              @click.stop="guestDropVisibleChange">
              <span :class="{'disable':dishroadGuestList.length < 0}">{{matchList[guestMatchType].name}}</span>
              <span class="icon" v-if="guestIcon"></span>
            </view>
            <drop-select
              v-model="guestDropVisible"
              :index ="guestMatchType"
              :list="matchList"
              @change="guestMatchChange" />
            <view
              class="switch-button"
              v-if="dishroadGuest && (dishroadGuest.allMatchList.length > 0 || dishroadGuest.teamMatchList.length > 0)">
              <span class="span" :class="{current: dishroadGuestType === 0}" @click="dishroadGuestType = 0">全部</span>
              <span class="span" :class="{current: dishroadGuestType === 1}" @click="dishroadGuestType = 1">{{category === 1 ? '客场' : '主场'}}</span>
            </view>
          </view>
          <flexible-list
            v-if="dishroadGuestList.length > 0"
            :teamId="category===1 ? matchInfo.guestId : matchInfo.homeId"
            :category="category"
            :list="dishroadGuestList" />
          <view class="detail-data__no-data" v-else>暂无数据</view>
        </view>
        <view class="detail-data__no-data" v-if="!matchData.dishroad">暂无数据</view>
      </view>
      <view
        class="detail-data__modules"
        :class="{'dish-continuous': continuousHistory}"
        v-if="category===1">
        <view class="h3"><span class="span">球队连赢盘/输盘明细</span></view>
        <view
          class="detail-data__modules--block"
          v-if="continuousHistory && continuousHistory.homeTeam">
          <view class="h4"><text class="span">{{continuousHistory.homeTeam}}</text></view>
          <dish-win-lose
            v-if="continuousHistory.homeHistory && continuousHistory.homeHistory.length > 1"
            :info="continuousHistory"
            type="home" />
          <view
            class="detail-data__no-data"
            v-else>暂无数据</view>
        </view>
        <view
          class="detail-data__modules--block"
          v-if="continuousHistory && continuousHistory.awayTeam">
          <view class="h4"><text class="span">{{continuousHistory.awayTeam}}</text></view>
          <dish-win-lose
            v-if="continuousHistory.awayHistory && continuousHistory.awayHistory.length > 1"
            :info="continuousHistory"
            type="away" />
          <view
            class="detail-data__no-data"
            v-else>暂无数据</view>
        </view>
        <view
          class="detail-data__no-data"
          v-if="!continuousHistory">暂无数据</view>
      </view>
      <view class="detail-data__modules">
        <view class="h3"><text class="span">未来赛事</text></view>
        <view class="h4"><text class="span">{{category === 1 ? matchInfo.homeName : matchInfo.guestName}}</text></view>
        <match-list
          :teamId="category===1 ? matchInfo.homeId : matchInfo.guestId"
          type="futuer"
          v-if="fixtureHome"
          :category="category"
          :list="fixtureHome" />
        <view class="detail-data__no-data" v-else>暂无数据</view>
        <view class="h4"><text class="span">{{category === 1 ? matchInfo.guestName : matchInfo.homeName}}</text></view>
        <match-list
          :teamId="category===1 ? matchInfo.guestId : matchInfo.homeId"
          type="futuer"
          v-if="fixtureGuest"
          :category="category"
          :list="fixtureGuest" />
        <view class="detail-data__no-data" v-else>暂无数据</view>
      </view>
    </view>
    <loading v-if="loading" />
    <no-data
      @move="val => $emit('move', val)"
      v-if="noData"
      type="match"
      icon="icon-no-data-match"
      text="本场暂无数据" />
  </view>
</template>
<script>
import OddsAnalyse from './components/odds-analyse'
import LeagueRank from './components/league-rank'
import MeetingInfo from './components/meeting-info'
import MeetingChart from './components/meeting-chart'
import DropSelect from './components/drop-select'
import DishInfo from './components/dish-info'
import MatchList from './components/match-list'
import DishWinLose from './components/dish-win-lose'
import FlexibleList from './components/flexible-list'
import { matchDetailData } from '@/utils/api/match-detail'
const matchTypeList = [{id: 0, name: '全部赛事'}, {id: 1, name: '联赛'}, {id: 2, name: '杯赛'}]
let lastY = 0
export default {
  name: 'detail-data',
  props: ['match-info-id', 'status', 'thread-count', 'header-hidden', 'scroll-top'],
  data () {
    return {
      loading: false,
      rangeType: 0, // 0 总; 1 主客
      meetingSwitch: 0,
      dishroadHomeType: 0, // 0, 1
      dishroadGuestType: 0, // 0, 1
      matchList: matchTypeList,
      matchDropVisible: false,
      homeDropVisible: false,
      guestDropVisible: false,
      matchData: null,
      homeMatchType: 0,
      guestMatchType: 0
    }
  },
  computed: {
    homeIcon () {
      const { matchData } = this
      if (matchData && matchData.dishroad) {
        if (!matchData.dishroad.leagueHomeMatchInfo && !matchData.dishroad.trophyHomeMatchInfo) {
          return false
        } else {
          return true
        }
      }
      return false
    },
    guestIcon () {
      const { matchData } = this
      if (matchData && matchData.dishroad) {
        if (!matchData.dishroad.leagueGuestMatchInfo && !matchData.dishroad.trophyGuestMatchInfo) {
          return false
        } else {
          return true
        }
      }
      return false
    },
    matchInfo () {
      return (this.matchData && this.matchData.matchInfo) || null
    },
    category () {
      return (this.matchInfo && this.matchInfo.lotteryCategoryId) || 1
    },
    oddsAnalyse () {
      if (this.matchInfo && this.matchData.oddsAnalyse) {
        return this.matchData.oddsAnalyse
      }
      return null
    },
    range () {
      if (this.matchData && this.matchData.range) {
        const { range } = this.matchData
        if (range.matchBaseInfo && range.matchBaseInfo.matchInfoId) {
          return range
        }
      }
      return null
    },
    meeting () {
      const { matchData } = this
      if (matchData && matchData.meeting) {
        return matchData.meeting
      }
      return null
    },
    meetingList () {
      const { meeting } = this
      if (meeting) {
        if (this.meetingSwitch === 0) {
          return meeting.allMeetingList || []
        } else {
          return meeting.homeMeetingList || []
        }
      }
      return []
    },
    meetingCount () {
      const { meeting } = this
      if (meeting) {
        if (this.meetingSwitch === 0) {
          return meeting.allMeetingCountVo || null
        } else {
          return meeting.homeMeetingCountVo || null
        }
      }
      return null
    },
    dishroadHome () {
      const { matchData, category, homeMatchType } = this
      if (matchData && matchData.dishroad) {
        if (homeMatchType === 0) {
          if (category === 1) {
            return matchData.dishroad.homeMatchInfo || null
          }
          if (category === 2) {
            return matchData.dishroad.guestMatchInfo || null
          }
        }
        if (homeMatchType === 1) {
          return matchData.dishroad.leagueHomeMatchInfo || null
        }
        if (homeMatchType === 2) {
          return matchData.dishroad.trophyHomeMatchInfo || null
        }
      }
      return null
    },
    dishroadHomeList () {
      const { dishroadHome } = this
      if (dishroadHome) {
        if (this.dishroadHomeType === 0) {
          return dishroadHome.allMatchList || []
        } else {
          return dishroadHome.teamMatchList || []
        }
      }
      return []
    },
    dishroadGuest () {
      const { matchData, category, guestMatchType } = this
      if (matchData && matchData.dishroad) {
        if (guestMatchType === 0) {
          if (category === 2) {
            return matchData.dishroad.homeMatchInfo || null
          }
          if (category === 1) {
            return matchData.dishroad.guestMatchInfo || null
          }
        }
        if (guestMatchType === 1) {
          return matchData.dishroad.leagueGuestMatchInfo || null
        }
        if (guestMatchType === 2) {
          return matchData.dishroad.trophyGuestMatchInfo || null
        }
      }
      return null
    },
    dishroadGuestList () {
      const { dishroadGuest } = this
      if (dishroadGuest) {
        if (this.dishroadGuestType === 0) {
          return dishroadGuest.allMatchList || []
        } else {
          return dishroadGuest.teamMatchList || []
        }
      }
      return []
    },
    fixtrue () {
      const { matchData } = this
      let home = null
      let guest = null
      if (matchData && matchData.fixture) {
        const { fixture } = matchData
        if (fixture.homeTeam && fixture.homeTeam.appTeamFixtureDetailDtoList && fixture.homeTeam.appTeamFixtureDetailDtoList.length > 0) {
          home = matchData.fixture.homeTeam.appTeamFixtureDetailDtoList
        }
        if (fixture.guestTeam && fixture.guestTeam.appTeamFixtureDetailDtoList && fixture.guestTeam.appTeamFixtureDetailDtoList.length > 0) {
          guest = matchData.fixture.guestTeam.appTeamFixtureDetailDtoList
        }
      }
      return {
        home: home,
        guest: guest
      }
    },
    fixtureHome () {
      const { category } = this
      const { home, guest } = this.fixtrue
      if (category === 1) {
        return home
      }
      if (category === 2) {
        return guest
      }
      return null
    },
    fixtureGuest () {
      const { category } = this
      const { home, guest } = this.fixtrue
      if (category === 2) {
        return home
      }
      if (category === 1) {
        return guest
      }
      return null
    },
    continuousHistory () {
      const { matchData } = this
      if (matchData && matchData.continuousHistory) {
        return matchData.continuousHistory
      }
      return null
    },
    league () {
      if (this.matchData && this.matchData.hasSeasonDetail && this.matchData.leagueMatch) {
        return this.matchData.leagueMatch
      }
      return null
    },
    noData () {
      return !this.matchInfo && !this.loading
    }
  },
  created () {
    this.getData()
    this.setTimer()
  },
  components: {
    OddsAnalyse,
    LeagueRank,
    MatchList,
    MeetingInfo,
    MeetingChart,
    DishInfo,
    DishWinLose,
    DropSelect,
    FlexibleList
  },
  watch: {
    status (val) {
      this.setTimer()
    }
  },
  methods: {
    touchStart (e) {
      const pageY = e && e.touches && e.touches[0].pageY
      pageY && (lastY = pageY)
    },
    touchMove (e) {
      const pageY = e && e.touches && e.touches[0].pageY
      if (pageY) {
        if (pageY - lastY > 0) {
          if (this.scrollTop <= 10 && this.headerHidden) {
            this.$emit('move', 'down')
          }
        } else {
          if (!this.headerHidden) {
            this.$emit('move', 'up')
          }
        }
      }
    },
    detailDataClick (e) {
      this.homeDropVisible = false
      this.guestDropVisible = false
    },
    homeDropVisibleChane () {
      const { matchData } = this
      if (matchData && matchData.dishroad) {
        if (!matchData.dishroad.leagueHomeMatchInfo && !matchData.dishroad.trophyHomeMatchInfo) {
          this.homeDropVisible = false
        } else {
          this.homeDropVisible = !this.homeDropVisible
        }
      }
    },
    guestDropVisibleChange () {
      const { matchData } = this
      if (matchData && matchData.dishroad) {
        if (!matchData.dishroad.leagueGuestMatchInfo && !matchData.dishroad.trophyGuestMatchInfo) {
          this.guestDropVisible = false
        } else {
          this.guestDropVisible = !this.guestDropVisible
        }
      }
    },
    setTimer () {
      if (this.status === 1 || this.status === 2) {
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.getData(true)
        }, 30000)
      } else {
        clearInterval(this.timer)
      }
    },
    getData (intervalQuery) {
      if (this.loading) return
      if (!intervalQuery) {
        this.loading = true
      }
      this.$service(matchDetailData, {
        urlParams: {
          matchInfoId: this.matchInfoId
        }
      }).then((res) => {
        if (res.code === 200 && res.data.hasOwnProperty('matchInfo')) {
          this.matchData = res.data
        }
      }).finally(() => {
        this.loading = false
      })
    },
    homeMatchChange (i) {
      this.homeMatchType = i
    },
    guestMatchChange (i) {
      this.guestMatchType = i
    },
    toLeagueRank () {
      const { category, league } = this
      uni.navigateTo({
        url: `/pages/league/index?categoryId=${category}&leagueCode=${league.leagueCode}`
      })
    },
    toBet () {
      const { category } = this
      uni.navigateTo({
        url: `/pages/bet-assistant/list?lotteryCategoryId=${category}`
      })
    },
    toDownload () {
      uni.navigateTo({
        url: '/pages/download/index'
      })
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/style/mixin.scss";
.detail-data-wrapper {
  background: #f3f5f7;
  position: relative;
  min-height: 100%;
  .switch-button {
    width: 184rpx;
    height: 44rpx;
    line-height: 44rpx;
    position: absolute;
    right: 32rpx;
    top: 50%;
    border-radius: 22rpx;
    transform: translate3d(0, -50%, 0);
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ff2222;
    box-sizing: border-box;
    .span {
      width: 50%;
      height: 100%;
      color: #ff2222!important;
      text-align: center;
      line-height: 44rpx;
      font-size: 24rpx!important;
      position: relative;
      z-index: 1;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      &.current {
        background: #ff2222;
        color: #fff!important;
      }
      &:first-child {
        border-radius: 22rpx 0 0 22rpx;
      }
      &:last-child {
        border-radius: 0 22rpx 22rpx 0;
      }
    }
  }
  .thread-tips {
    padding: 30rpx 0;
  }
  .thread-tips__content {
    margin: 0 auto;
    width: 525rpx;
    height: 64rpx;
    background: #F2F8FF;
    border: 1px solid #65AFFF;
    border-radius: 44rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #65AFFF;
    box-sizing: border-box;
    .arrows {
      width: 12rpx;
      height: 22rpx;
      margin-left: 10rpx;
      @include bg-image("/static/match-detail/icon-arrows-chart-thread.png");
    }
  }
}
.detail-data {
  &__modules {
    padding: 36rpx 0 0;
    background: #fff;
    margin-top: 20rpx;
    &:first-child {
      margin-top: 0;
    }
    &--block{
      &:last-child{
        padding-bottom: 16rpx;
      }
    }
    &.dish-continuous {
      padding-bottom: 50rpx;
    }
    .h3 {
      padding-left: 32rpx;
      font-size: 32rpx;
      position: relative;
      height: 50rpx;
      line-height: 50rpx;
      display: flex;
      align-items: center;
      .span {
        font-weight: bold;
        color: #333;
        &.league ,&.bet {
          display: flex;
          align-items: center;
          font-size: 24rpx;
          font-weight: normal;
          height: 44rpx;
          line-height: 44rpx;
          position: relative;
          padding: 0 16rpx;
          margin-left: 16rpx;
          border: 1px solid #ffa7a0;
          border-radius: 22rpx;
          box-sizing: border-box;
          .i {
            font-style: normal;
            &.icon {
              width: 12rpx;
              height: 18rpx;
              margin-left: 4rpx;
              @include bg-image("/static/match-detail/icon-data-arrows-league.png");
            }
          }
        }
        &.league{
          color: #ff6618;
        }
        &.bet{
           color: #ff2222;
        }
      }
    }
    .h4 {
      padding-left: 32rpx;
      height: 48rpx;
      line-height: 48rpx;
      font-size: 28rpx;
      margin: 40rpx 0 24rpx;
      position: relative;
      display: flex;
      align-items: center;
      .span {
        font-weight: bold;
      }
      .history-tag {
        height: 30rpx;
        width: 80rpx;
        margin-left: 10rpx;
        @include bg-image("/static/match-detail/icon-match-data-history.png");
      }
    }
    .meeting-vs {
      padding-left: 32rpx;
      height: 48rpx;
      line-height: 48rpx;
      font-weight: bold;
      color: #666;
    }
    .meeting-info_football{
      padding-left:  32rpx;
      .vs{
        margin-top: 30rpx;
        font-size: 28rpx;
        color: #666;
        font-weight: 700;
      }
    }
    .meeting-info_switch{
      position: relative;
      padding: 0 32rpx;
      margin: 40rpx 0 30rpx;
      .match-button{
        width: 172rpx;
        color: #666;
        list-style: none;
        height: 48rpx;
        line-height: 48rpx;
        border-radius: 24rpx;
        transform: translateZ(0);
        z-index: 9;
        font-size: 24rpx;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #B4B4B4;
        box-sizing: border-box;
        position: relative;
        .disable{
          color: #999;
        }
        .icon{
          margin-left: 8rpx;
          width: 12rpx;
          height: 10rpx;
          display: inline-block;
          @include bg-image('/static/match-detail/icon-data-arrows-down.png');
        }
      }
    }
  }
  &__no-data {
    padding: 36rpx 0 55rpx;
    font-size: 28rpx;
    line-height: 1;
    color: #999;
    text-align: center;
  }
}
</style>
