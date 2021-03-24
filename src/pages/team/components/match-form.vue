<template>
  <view class="match-list">
    <view class="match-list__head">
      <view class="match-list__row date">赛事日期</view>
      <view class="match-list__row team">{{category===1 ? '主队' : '客队'}}</view>
      <view class="match-list__row score" v-html="type==='futuer'?'&nbsp;':'比赛'"></view>
      <view class="match-list__row team">{{category===1 ? '客队' : '主队'}}</view>
      <view class="match-list__row pan">{{type==='futuer'?'间隔':'盘路'}}</view>
    </view>
    <view
      class="match-list__body"
      :key="index"
      v-for="(item, index) in list">
      <view class="match-list__row date">
        <view class="p">
          {{'20' + item.matchTime.split('-')[0] + '.' + item.matchTime.split('-')[1 ] + '.' + item.matchTime.split('-')[2]}}</view>
        <view class="p">{{item.leagueMatchName}}</view>
      </view>
      <view
        class="match-list__row team"
        :class="{'home': category === 1 ? item.homeId === teamId : item.guestId === teamId}">
        {{category === 1 ? item.homeName : item.guestName}}
      </view>
      <view
        class="match-list__row score"
        v-if="type==='futuer'">vs</view>
      <view
        class="match-list__row score"
        v-else
        :style="{
          color: scoreStyle(item)
        }">
        {{category === 1 ? item.homeScore + ' : ' + item.guestScore : item.guestScore + ' : ' + item.homeScore}}  
      </view>
      <view
        class="match-list__row team"
        :class="{home: category===1? item.guestId === teamId :item.homeId === teamId}">
        {{category === 1 ? item.guestName : item.homeName}}
      </view>
      <view
        class="match-list__row pan"
        v-if="type==='futuer'">
        {{item.timeInterval + '天'}}
      </view> 
      <view
        class="match-list__row pan"
        v-else
        :class="{'win': item.status === 0, 'loss': item.status === 1, 'draw': item.status === 2 }">
          {{judge(item.handicap) ? item.handicap + handStatus[item.status] || '' : '-'}}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'match-form',
  props: {
    list: {
      type: Array,
      default: []
    },
    category: {
      type: Number,
      default: 1
    },
    type: {
      type: String,
      default: 'match'
    },
    teamId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      handStatus: {
        0: '赢',
        1: '输',
        2: '走'
      }
    }
  },
  methods: {
    judge (i) {
      return typeof i === 'number' ? true : false
    },
    scoreStyle (item) {
      let color = null
      if (item.homeScore === item.guestScore) { color = '#65afff' }
      if (this.teamId === item.homeId) {
        if (item.homeScore > item.guestScore) { color = '#f22' }
        if (item.homeScore < item.guestScore) { color = '#2ba86d' }
      }
      if (this.teamId === item.guestId) {
        if (item.homeScore < item.guestScore) { color = '#f22' }
        if (item.homeScore > item.guestScore) { color = '#2ba86d' }
      }
      return color
    }
  }
}
</script>

<style lang="scss">
.match-list {
  margin-top: 30rpx;
  text-align: center;
  position: relative;
  &__head {
    line-height: 60rpx;
    color: #999;
    background: #f9fafb;
    display: flex;
    align-items: center;
    text-align: center;
  }
  &__body {
    line-height: 1.5;
    color: #999;
    height: 90rpx;
    position: relative;
    display: flex;
    align-items: center;
    text-align: center;
    border-bottom: 1rpx solid #eee;
    &:last-child {
      border: none;
    }
    .score {
      font-family: 'alternategothicno2bt';
      font-size: 32rpx;
    }
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
    &.pan {
      width: 110rpx;
    }
    &.home {
      color: #333;
    }
  }
}
</style>


