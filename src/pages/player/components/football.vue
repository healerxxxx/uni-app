<template>
  <view class="statistics">
    <h3>
      技术统计
    </h3>
    <p class="season-title" v-if="info.seasonYear">{{info.seasonYear}}</p>
    <view class="season">
          <view class="title">比赛</view>
          <view class="th"> 
            <view class="des row_1">出场次数</view>
            <view class="row_2">{{[info.matches,'',0] | toPercent}}</view>
            <view class="des row_1">场均时间(min)</view>
            <view class="row_2">{{[info.minutesPlayed,info.matches,0] | toPercent}}</view>
          </view>
          <view class="th">
            <view class="des row_1 float">首发</view>
            <view class="row_2  float">{{isNaN(info.first) ?  '--' : info.first}}</view>
            <view class="des row_1" v-if="isGoalkeeper">场均出击</view>
            <view v-if="isGoalkeeper" class="row_2">{{[info.runsOut,info.matches,1] | toPercent}}</view>
          </view>
          <view class="th"  v-if="isGoalkeeper"> 
            <view class="des row_1" >场均扑救</view>
            <view class="row_2"  >{{[info.saves,info.matches,1] | toPercent}}</view>
            <view class="des row_1"  >场均出击成功</view>
            <view class="row_2"  >{{[info.runsOutSucc,info.matches,1] | toPercent}}</view>
          </view>
          <view class="th" v-if="isGoalkeeper">
            <view class="des row_1">场均拳击球</view>
            <view class="row_2" >{{[info.punches,info.matches,1] | toPercent}}</view>
            <view class="des row_1">场均高空出击</view>
            <view class="row_2">{{[info.goodHighClaim,info.matches,1] | toPercent}}</view>
          </view>
          <view class="title">进球</view>
          <view class="th">
            <view class="des text-orange row_1">进球(点球)</view>
            <view class=" text-orange row_2" >
              {{[info.goals,'', 0] | toPercent }}({{[info.penalty,'',0] | toPercent}})
            </view>
            <view class="des row_1">场均射门</view>
            <view class="row_2">{{[info.shots,info.matches,1] | toPercent}}</view>
          </view>
          <view class="th">
            <view class="des row_1">场均进球</view>
            <view class="row_2">{{[info.goals,info.matches,1] | toPercent}}</view>
            <view class="des row_1">场均射正</view>
            <view class="row_2">{{[info.shotsOnTarget,info.matches,1] | toPercent }}</view>
          </view>
          <view class="title">传球</view>
          <view class="th">
            <view class="des  text-orange row_1">助攻</view>
            <view class=" text-orange row_2">{{[info.assists,'',0] | toPercent }}</view>
            <view class="des row_1">场均成功传球</view>
            <view class="row_2">{{[info.passesAccuracy,info.matches,1] | toPercent }}</view>
          </view>
          <view class="th">
            <view class="des row_1">场均助攻</view>
            <view class="row_2">{{[info.assists,info.matches,1] | toPercent }}</view>
            <view class="des row_1">场均成功长传</view>
            <view class="row_2">{{[info.longBallsAccuracy,info.matches,1] | toPercent }}</view>
          </view>
          <view class="th">
            <view class="des row_1">场均关键传球</view>
            <view class="row_2">{{[info.keyPasses,info.matches,1] | toPercent }}</view>
            <view class="des row_1">场均成功传中</view>
            <view class="row_2">{{[info.crossesAccuracy,info.matches,1] | toPercent }}</view>
          </view>
          <view class="title">防守</view>
          <view class="th">
            <view class="des row_1">场均抢断</view>
            <view class="row_2">{{[info.tackles,info.matches,1] | toPercent }}</view>
            <view class="des row_1">场均封堵</view>
            <view class="row_2">{{[info.blockedShots,info.matches,1] | toPercent }}</view>
          </view>
          <view class="th">
            <view class="des row_1">场均拦截</view>
            <view class="row_2">{{[info.interceptions,info.matches,1] | toPercent}}</view>
            <view class="des row_1">场均解围</view>
            <view class="row_2">{{[info.clearances,info.matches,1] | toPercent }}</view>
          </view>
          <view class="title">其他</view>
          <view class="th">
            <view class="des row_1">黄牌</view>
            <view class="row_2">{{[info.yellowCards,'',0] | toPercent }}</view>
            <view class="des row_1">场均丢球</view>
            <view class="row_2">{{[info.dispossessed,info.matches] | toPercent }}</view>
          </view>
          <view class="th">
            <view class="des row_1">红牌</view>
            <view class="row_2">{{[info.redCards,'',0] | toPercent }}</view>
            <view class="des row_1">场均犯规</view>
            <view class="row_2">{{[info.fouls,info.matches,1] | toPercent}}</view>
          </view>
          <view class="th">
            <view class="des row_1">场均成功过人</view>
            <view class="row_2">{{[info.dribbleSucc,info.matches,0] | toPercent}}</view>
            <view class="des row_1">场均被侵犯</view>
            <view class="row_2">{{[info.wasFouled,info.matches,1] | toPercent}}</view>
          </view>
          <view class="th">
            <view class="des row_1 float">场均1v1拼抢成功</view>
            <view class="row_2 float">{{[info.duelsWon,info.matches,0] | toPercent}}</view>
          </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'football',
  props: ['info'],
  computed: {
    isGoalkeeper () {
      if (this.info && this.info.position && this.info.position === '守门员') {
        return true
      }
      return false
    }
  },
  filters: {
    toPercent ([val1, val2, digit]) {
      function isNumber (v) {
        return typeof v === 'number' && !isNaN(v)
      }
      if (isNumber(val1)) {
        if (val2 === '') {
          return val1.toFixed(digit)
        } else {
          return val1 === 0 ? val1 : (val1 / val2).toFixed(digit)
        }
      } else {
        return '-'
      }
    }
  }
}
</script>

<style lang='scss'>
@import "../../../assets/style/mixin.scss";
.statistics {
  h3 {
    font-size: 32rpx;
    color: #333333;
    font-weight: bold;
    padding-bottom: 30rpx;
    line-height: 44rpx;
    position: relative;
    margin-bottom: 40rpx;
    border-bottom: 1rpx solid #eee;
  }
  .season-title {
    font-weight: bold;
    color: #555;
    font-size: 28rpx;
  }
  .title {
    color: #333;
  }
  .season {
    margin: 30rpx 0 70rpx;
    border:1rpx solid #eee;
    border-bottom: none;
    view{
      height: 60rpx;
      line-height: 60rpx;
      display: inline-block;
      text-align: center;
    }
    .th{
      border-bottom: 1rpx solid #eee;
      width: 100%;
    }
    .float{
      float: left;
    }
    .row_1{
      width: 188rpx;
    }
    .row_2{
      width: 130rpx;
    }
    .row_2+.row_1{
      border-left: 1rpx solid #eee;
    }
    .des {
      text-align: left;
      background: #f9fafb;
      padding-left: 18rpx;
      color: #999999;
      position: relative;
    }
    .title {
      display: block;
      font-weight: bold;
      padding-left: 18rpx;
      font-family: $PFM;
      text-align: left;
      border-bottom: 1rpx solid #eee;
    }
    .text-orange {
      color: #ff6618;
    }
  }     
}
</style>