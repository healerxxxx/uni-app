<template>
  <view
    class="match-list-item"
    :class="{'hide-border': hideBorder}">
    <view class="match-list-item__row date">
      <view class="p" v-if="type === 'futuer'">
        {{'20'+info.date.split('-')[0]+'.'+info.date.split('-')[1]+'.'+info.date.split('-')[2]}}</view>
      <view class="p" v-else>
        {{'20'+info.matchTime.split('-')[0]+'.'+info.matchTime.split('-')[1]+'.'+info.matchTime.split('-')[2]}}</view>
      <view class="p">{{info.leagueMatchName}}</view>
    </view>
    <view
      class="match-list-item__row team"
      v-if="type === 'futuer'"
      :class="{'home': category === 1 ? info.homeId === teamId : info.guestId === teamId}">{{category === 1 ? info.homeTeamName : info.guesteTeamName}}</view>
    <view
      class="match-list-item__row team"
      v-if="type !== 'futuer' && category === 2" :class="{home: category === 1 ? info.homeId=== teamId : info.guestId === teamId}">{{category === 1 ? info.homeName : info.guestName}}</view>
    <view
      class="match-list-item__row team"
      v-if="type !== 'futuer' && category === 1" :style="homeTeamStyle">{{category === 1 ? info.homeName : info.guestName}}</view>
    <view
      class="match-list-item__row score"
      v-if="type === 'futuer'">vs</view>
    <view
      class="match-list-item__row score"
      v-if="category === 2 && type !== 'futuer'"
      :style="scoreStyle">
      {{category === 1 ? info.homeScore + ' : ' +info.guestScore : info.guestScore + ' : ' + info.homeScore}}</view>
    <view 
      class="match-list-item__row score football"
      v-if="category === 1 && type !== 'futuer'">
      {{category === 1 ? info.homeScore + ' : ' +info.guestScore : info.guestScore + ' : ' + info.homeScore}}
    </view>
    <view
      class="match-list-item__row team"
      v-if="type === 'futuer'"
      :class="{home: category === 1 ? info.guestId === teamId :info.homeId === teamId}">{{category === 1 ? info.guesteTeamName : info.homeTeamName}}</view>
    <view
      class="match-list-item__row team"
      v-if="type !== 'futuer' && category === 2"
      :class="{home: category === 1? info.guestId === teamId :info.homeId === teamId}">{{category === 1 ? info.guestName : info.homeName}}</view>
    <view
      class="match-list-item__row team"
      v-if="type !== 'futuer' && category === 1"
      :style="guestTeamScore">{{category === 1 ? info.guestName : info.homeName}}</view>
    <view
      class="match-list-item__row pan"
      v-if="type === 'futuer'">{{info.timeInterval}}天</view>
    <view
      class="match-list-item__row pan"
      v-if="type !== 'futuer'"
      :class="{'win': info.status === 0, 'loss': info.status === 1, 'draw': info.status === 2 }">
      {{handicapText}}</view>
  </view>
</template>
<script>
export default {
  name: 'match-list',
  props: {
    info: {
      type: Object,
      default: {}
    },
    category: {
      type: Number,
      default: 1
    },
    type: {
      type: String,
      default: ''
    },
    teamId: {
      type: Number,
      default: 0
    },
    hideBorder: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    scoreStyle () {
      const { info } = this
      if (info.homeScore === info.guestScore) return { color: '#65afff' }
      if (this.teamId === info.homeId) {
        if (info.homeScore > info.guestScore) return { color: '#f22' }
        if (info.homeScore < info.guestScore) return { color: '#2ba86d' }
      }
      if (this.teamId === info.guestId) {
        if (info.homeScore < info.guestScore) return { color: '#f22' }
        if (info.homeScore > info.guestScore) return { color: '#2ba86d' }
      }
      return {}
    },
    homeTeamStyle () {
      const { info } = this
      if (this.teamId === info.homeId) {
        if (info.homeScore > info.guestScore) return 'color: #f22' 
        if (info.homeScore < info.guestScore) return  'color: #2ba86d'
        if (info.homeScore === info.guestScore) return 'color: #65afff'
      }
      return 'color: #999999'
    },
    guestTeamScore () {
      const { info } = this
      if (this.teamId === info.guestId) {
        if (info.homeScore < info.guestScore) return 'color: #f22'
        if (info.homeScore > info.guestScore) return 'color: #2ba86d'
        if (info.homeScore === info.guestScore) return 'color: #65afff'
      }
      return 'color: #999999'
    },
    handicapText () {
      const { handicap, status } = this.info
      const dict = {
        0: '赢',
        1: '输',
        2: '走'
      }
      return typeof handicap === 'number' ? (handicap + dict[status] || '') : '-'
    }
  }
}
</script>

<style lang="scss">
.match-list-item {
  line-height: 1.5;
  color: #999;
  height: 90rpx;
  position: relative;
  display: flex;
  align-items: center;
  text-align: center;
  border-top: 1rpx solid #eee;
  &.hide-border {
    border-top: none;
  }
  .score {
    font-family: 'alternategothicno2bt';
    font-size: 32rpx;
  }
  &__row {
    flex-shrink: 0;
    &.loss {
      color: #2ba86d;
    }
    &.draw {
      color: #65afff;
    }
    &.win {
      color: #ff2222;
    }
    &.date {
      width: 160rpx;
      .p {
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    &.team {
      width: 150rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &.score {
      width: 120rpx;
      flex: auto;
    }
    &.football{
      color: #333;
    }
    &.pan {
      width: 110rpx;
    }
    &.home {
      color: #333;
    }
  }
}
</style>

