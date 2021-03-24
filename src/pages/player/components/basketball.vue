<template>
  <view class="statistics">
    <h3>技术统计</h3>
    <p class="season-title" v-if="latestSeasonStats">{{latestSeasonStats.seasonYear}}</p>
    <view class="season" v-if="latestSeasonStats">
        <view class="row-head">
          <text class="title">出场</text>
        </view>
        <view class="row-body">
          <text class="des">出场次数</text>
          <text>{{[latestSeasonStats.court,'', 0] | toPercent}}</text>
          <text class="des">场均时间(min)</text>
          <text>{{[latestSeasonStats.minutesPlayed,latestSeasonStats.court,1] | toPercent}}</text>
        </view>
        <view class="row-head">
          <text class="title">得分</text>
        </view>
        <view class="row-body">
          <text class="des text-orange">场均得分</text>
          <text class=" text-orange">{{[latestSeasonStats.points,latestSeasonStats.court,1] | toPercent}}</text>
          <text class="des">联盟排名</text>
          <text>{{latestSeasonStats.pointsRank | format}}</text>
        </view>
        <view class="row-body">
          <text class="des">场均两分球数</text>
          <text>{{[latestSeasonStats.twoPointsTotal,latestSeasonStats.court,1] | toPercent}}</text>
          <text class="des">两分球命中率</text>
          <text v-if="latestSeasonStats.twoPointsAccuracy">{{latestSeasonStats.twoPointsAccuracy}}%</text>
          <text v-else>-</text>
        </view>
        <view class="row-body">
          <text class="des">场均三分球数</text>
          <text>{{[latestSeasonStats.threePointsTotal,latestSeasonStats.court,1] | toPercent}}</text>
          <text class="des">三分球命中率</text>
          <text v-if="latestSeasonStats.threePointsAccuracy">{{latestSeasonStats.threePointsAccuracy}}%</text>
          <text v-else>-</text>
        </view>
        <view class="row-body">
          <text class="des">场均投篮数</text>
          <text>{{[latestSeasonStats.fieldGoalsTotal,latestSeasonStats.court,1] | toPercent}}</text>
          <text class="des">投篮命中率</text>
          <text v-if="latestSeasonStats.fieldGoalsAccuracy">{{latestSeasonStats.fieldGoalsAccuracy}}%</text>
          <text v-else>-</text>
        </view>
        <view class="row-body">
          <text class="des">场均罚球数</text>
          <text>{{[latestSeasonStats.freeThrowsTotal,latestSeasonStats.court,1] | toPercent}}</text>
          <text class="des">罚球命中率</text>
          <text v-if="latestSeasonStats.freeThrowsAccuracy">{{latestSeasonStats.freeThrowsAccuracy}}%</text>
          <text v-else>-</text>
        </view>
        <view class="row-head">
          <text class="title">篮板</text>
        </view>
        <view class="row-body">
          <text class="des  text-orange">场均篮板</text>
          <text class=" text-orange">{{[latestSeasonStats.rebounds,latestSeasonStats.court,1] | toPercent}}</text>
          <text class="des">联盟排名</text>
          <text>{{latestSeasonStats.reboundsRank | format}}</text>
        </view>
        <view class="row-body">
          <text class="des">前场篮板</text>
          <text>{{[latestSeasonStats.offensiveRebounds,latestSeasonStats.court,1]| toPercent}}</text>
          <text class="des">后场篮板</text>
          <text>{{[latestSeasonStats.defensiveRebounds,latestSeasonStats.court,1] | toPercent}}</text>
        </view>
        <view class="row-head">
            <text class="title">其他</text>
        </view>
        <view class="row-body">
          <text class="des">助攻</text>
          <text>{{[latestSeasonStats.assists,latestSeasonStats.court,1] | toPercent}}</text>
          <text class="des">联盟排名</text>
          <text>{{latestSeasonStats.assistsRank | format}}</text>
        </view>
        <view class="row-body"> 
          <text class="des">抢断</text>
          <text>{{[latestSeasonStats.steals,latestSeasonStats.court,1] | toPercent}}</text>
          <text class="des">联盟排名</text>
          <text>{{latestSeasonStats.stealsRank | format}}</text>
        </view>
        <view class="row-body"> 
          <text class="des">失误</text>
          <text>{{[latestSeasonStats.turnovers,latestSeasonStats.court,1] | toPercent}}</text>
          <text class="des">联盟排名</text>
          <text>{{latestSeasonStats.turnoversRank | format}}</text>
        </view>
        <view class="row-body">
          <text class="des">盖帽</text>
          <text>{{[latestSeasonStats.blocks,latestSeasonStats.court,1] | toPercent}}</text>
          <text class="des">联盟排名</text>
          <text>{{latestSeasonStats.blocksRank | format}}</text>
        </view>
    </view>
    <p class="season-title" v-if="last10MatchStatsList">近十场数据</p>
    <view class="ten-games" v-if="last10MatchStatsList">
      <!-- 固定列 -->
      <view class="fixed shadow">
        <view class="ele-full fixTable">
          <view class="row-head">
            <text class="date">时间</text>
            <text class="vs">对阵</text>
          </view>
          <view class="row-body">
            <view class="th" v-for="(item,index) in last10MatchStatsList" :key="index">
              <view class="date">
                <text >
                  {{[item.matchTime, 'MM-dd'] | formatDate}}
                  {{[item.matchTime, 'yyyy']| formatDate}}
                </text>
              </view>
              <view class="vs"><text>{{item.teamVS | format}}</text></view>
            </view>
          </view>
        </view>
      </view>
      <!-- 滚动部分 -->
        <scroll-view class="scroll" scroll-x="true" >
            <view class="row-head">
                <text>是否首发</text>
                <text>时间</text>
                <text>得分</text>
                <text class="row_1">篮板(总/前/后)</text>
                <text>助攻</text>
                <text>盖帽</text>
                <text>抢断</text>
                <text>失误</text>
                <text>犯规</text>
                <view style="min-width:0rpx"></view>
            </view>
            <view class="row-body">
              <view class="th"  v-for="(item,index) in last10MatchStatsList" :key="index">
                <view>{{item.isBench === 0 ? '是' : '否'}}</view>
                <view>{{item.duration | format}}'</view>
                <view>{{item.score | format}}</view>
                <view  class="row_3">{{item.totalBackboard | format}}/{{item.attackBackboard | format}}/{{item.defendBackboard | format}}</view>
                <view>{{item.assist | format}}</view>
                <view>{{(item.cap || item.cap === 0 )? item.cap : '-' }}</view>
                <view>{{item.steal | format}}</view>
                <view>{{item.miss | format}}</view>
                <view>{{item.foul | format}}</view>
                <view style="min-width:0rpx"></view>
              </view>
            </view>
        </scroll-view>
      </view>
    <p class="season-title" v-if="historySeasonStatsList">历史数据</p>
    <view class="history ten-games" v-if="historySeasonStatsList">
      <!-- 固定列 -->
      <view class="fixed shadow">
        <view class="ele-full">
          <view class="full-view" ref="historyFixTable">
              <view class="row-head">
                <text class="date">赛季</text>
                <text>球队</text>
              </view>
              <view class="row-body">
                <view class="th" v-for="(item,index) in historySeasonStatsList" :key="index">
                  <view class="date">
                    {{item.seasonYear ? item.seasonYear.slice(2,5):''}}{{item.seasonYear ? item.seasonYear.slice(7,9):''}}
                  </view>
                  <view class="team">{{item.teamName | format}}</view>
                </view>
              </view>
          </view>
        </view>
      </view>
      <!-- 滚动部分 -->
      <scroll-view class="scroll" scroll-x="true">
        <view class="row-head">
          <text>场数</text>
          <text>先发次数</text>
          <text>时间</text>
          <text>得分</text>
          <text class="row_1">篮板</text>
          <text>助攻</text>
          <text>盖帽</text>
          <text>抢断</text>
          <text>失误</text>
          <text>犯规</text>
          <view style="min-width:0rpx"></view>
        </view>
        <view class="row-body" >
          <view class="th" v-for="(item,index) in historySeasonStatsList" :key="index">
            <view>{{item.court | format}}</view>
            <view>{{item.first | format}}</view>
            <view>{{[item.minutesPlayed,item.court,0]|  toPercent}}'</view>
            <view>{{[item.points,item.court,1] |  toPercent}}</view> 
            <view class="row_3">{{[item.rebounds,item.court,1] | toPercent}}/{{[item.offensiveRebounds,item.court,1] | toPercent}}/{{[item.defensiveRebounds,item.court,1 ]|  toPercent}}</view>
            <view>{{[item.assists,item.court,1] | toPercent}}</view>
            <view>{{[item.blocks,item.court,1] | toPercent}}</view>
            <view>{{[item.steals,item.court,1] | toPercent}}</view>
            <view>{{[item.turnovers,item.court,1] | toPercent}}</view>
            <view>{{[item.personalFouls,item.court,1] | toPercent}}</view>
            <view style="min-width:0rpx"></view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'basketball',
  props: {
    info: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      scrollLeft: 0,
      historyScrollLeft: 0
    }
  },
  onReady () {
  },
  filters: {
    format(val) {
      if (val || val === 0) {
        return val
      }
        return '-'
    },
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
  },
  computed: {
    latestSeasonStats () {
      const { info } = this
      if (info && info.latestSeasonStats) {
        return info.latestSeasonStats || null
      }
      return null
    },
    historySeasonStatsList () {
      const { info } = this
      if (info && info.historySeasonStatsList && info.historySeasonStatsList.length > 0) {
        return info.historySeasonStatsList || null
      }
      return null
    },
    last10MatchStatsList () {
      const { info } = this
      if (info && info.last10MatchStatsList && info.last10MatchStatsList.length > 0) {
        return info.last10MatchStatsList || null
      }
      return null
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
    &::after{
      content: "";
      position: absolute;
      bottom: 0;
      left: -32rpx;
      width: 750rpx;
      border-bottom: 1rpx solid #eee;
    }
  }
  .season-title {
    font-weight: bold;
    color: #555;
    font-size: 28rpx;
  }
  .title {
    color: #333;
    &::before {
      content: none !important;
    }
  }
  .season {
    border: 1px solid #eee;
    margin: 30rpx 0 70rpx;
      view {
        height: 60rpx;
        position: relative;
        line-height: 60rpx;
        border-bottom: 1rpx solid #eee;
        font-size: 24rpx;
        text{
          display: inline-block;
          min-width: 114rpx;
          text-align: center;
        }
      }
      .des {
        width: 200rpx;
        text-align: left;
        background: #f9fafb;
        padding-left: 18rpx;
        color: #999999;
        position: relative;
        border-left: 1rrpx solid #eee;
      }
      .title {
        font-weight: bold;
        padding-left: 18rpx;
        font-family: $PFM;
        text-align: left;
        border-top: none;
        border-left: 1rrpx solid #eee;        
      }
      .text-orange {
        color: #ff6618;
      }
    }
  .ten-games {
    display: flex;
    flex-direction: row;
    flex: auto;
    flex: 1;
    overflow: hidden;
    width: 718rpx;
    margin: 30rpx 0 70rpx;
    transition: viewansform 0.2s linear;
    transform-origin: 0 100%;
    .row-head{
      text {
        display: inline-block;
        height: 60rpx;
        line-height:60rpx; 
        background: #f9fafb;
        color: #999999;
        font-size: 24rpx;
        white-space: nowrap;
        min-width: 100rpx;
        text-align: center;
      }
      .date{
        width: 108rpx;
      }
      .vs{
        width: 180rpx;
      }
    }
    .row-body{
      .th{
        height: 90rpx;
        line-height: 90rpx;
        text-align: center; 
        display: flex;
        flex-direction: row;
         &:not(:last-child){
           border-bottom: 1rpx solid  #eee;
         }
        .date{
          padding: 0 20rpx;
          vertical-align: middle;
          height: 90rpx;
          line-height: 40rpx;
          display: flex;
          align-items: center;
          text{
            font-size: 24rpx;
            line-height: 30rpx;
            transform: scale(.82);
            color: #999;
            font-family: $PFR;
            display: inline-block;
          }
        }
        .vs{
          padding: 0 20rpx;
          width: 140rpx;
          text-align: center;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
    .fixed {
      z-index: 3;
      position: relative;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      border: 1px solid #eee;
    }
    .scroll {
      z-index: 1;
      flex: auto;
      position: relative;
      display: flex;
      overflow: hidden;
      flex-direction: column;
      flex-shrink: 0;
      width: 212rpx;
      border-left: none;
      .row-head{
        width: 962rpx;
        border-right: 1rpx solid #eee;
        border-top: 1rpx solid #eee;
      }
      .row-body{
        width: 962rpx;
        border-right: 1rpx solid #eee;
        border-bottom: 1rpx solid #eee;
      }
      .th{
        view{
          padding: 0 20rpx;
          min-width: 60rpx;  
          &.row_3{
            min-width: 122rpx;
          }  
        }
      }
      .row_1{
         width: 162rpx;
      }
     
    }
    .shadow {
      .ele-full {
        box-shadow: 5rpx 0 8rpx 0rpx rgba(51, 51, 51, 0.02);
      }
    }
  }
  .history{
    .scroll{
      .row-head,.row-body{
        width: 1064rpx;
      }
    }
    .date{
      color: #999
    }
    .team{
      padding: 0 20rpx;
      min-width: 60rpx;
    }
  }
}
</style>