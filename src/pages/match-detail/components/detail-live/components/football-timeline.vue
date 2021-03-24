<template>
  <view class="timeline">
    <template v-for="(item, index) in list">
      <view class="custom-swiper" :key="index" v-if="item.countType === 1 ">
        <view
          class="custom-left"
          v-if="getIncidentsArr(item).left.length > 0">
          <view class="time">
            <text class="text">{{item.time}}'</text>
          </view>
          <view
            class="custom"
            v-for="(_item, i) in getIncidentsArr(item).left"
            :key="i"
            v-html="_item.content"></view>
        </view>
        <view
          class="custom-right"
          v-if="getIncidentsArr(item).right.length > 0">
          <view class="time" v-if="getIncidentsArr(item).left.length === 0">
            <span class="text">{{item.time}}'</span>
          </view>
          <view
            class="custom"
            v-for="(_item, i) in getIncidentsArr(item).right"
            :key="i"
            v-html="_item.content"></view>
        </view>
      </view>
      <template v-for="(_item, i) in item.incidentsList">
        <view
          class=""
          :key="i"
          :class="{
            'timeline__home': _item.position === 1,
            'timeline__guest': _item.position === 2
          }"
          v-if="_item.position !== 0 && item.countType === 0">
          <view class="time">
            <span class="text">{{item.time}}'</span>
          </view>
          <view
            :class="{
              'left': _item.position === 1,
              'right': _item.position === 2
            }"
            v-if="_item.countType === 0">
            <view class="span icon" :class="[`${icon[_item.typeValue]}`]"></view>
            <view class="span des">
              <text class="teamName">{{_item.typeValue === 9 ? _item.inPlayerName: _item.playerName }}</text>
              <text>&nbsp;{{_item.typeValue === 9 ? '换下' : event[_item.typeValue]}}</text>
              <text class="score" v-if="_item.typeValue === 1">比分{{_item.homeScore}}-{{_item.awayScore}}</text>
              <text class="teamName" v-if="_item.typeValue === 9">{{_item.outPlayerName}}</text>
            </view>
          </view>
        </view>
        <view
          class="timeline__label"
          :class="{'time-swiper':_item.typeValue === 19 }"
          :key="i"
          v-if="item.countType === 0 && _item.position === 0">
          <view class="time icon-time" v-if="_item.typeValue === 19">
            <text class="text">{{_item.time}}'</text>
            <text class="i"></text>
          </view>
          <view
            v-if="_item.typeValue !== 19"
            class="span icon"
            :class="[`${icon[_item.typeValue]}`]">
          </view>
          <view
            class="span des"
            v-if="_item.typeValue !== 19">
              {{item.time}}'
              {{event[_item.typeValue]}}
          </view>
        </view>
      </template>
    </template>
    <view class="timeline__label">
      <view class="span icon icon-whistle"></view>
      <view class="span des">00'比赛开始</view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'football-timeline',
  props: ['incidentsList', 'iconType', 'eventType'],
  computed: {
    list () {
      return [...this.incidentsList].reverse()
    },
    icon () {
      const icon = this.iconType
      icon['11'] = 'icon-half'
      icon['13'] = 'icon-half'
      return icon
    },
    event () {
      const event = this.eventType
      event['11'] = '半场休息'
      event['12'] = '全场比赛结束'
      return event
    }
  },
  methods: {
    getIncidentsArr (data) {
      const left = []
      const right = []
      data.incidentsList.map(item => {
        if (item.position === 1) {
          left.push(item)
        }
        if (item.position === 2) {
          right.push(item)
        }
      })
      return {
        left: left,
        right: right
      }
    }
  }
}
</script>
<style lang='scss'>
@import "@/assets/style/mixin.scss";
.timeline {
  position: relative;
  &::after {
    position: absolute;
    content: '';
    left: 50%;
    height: 100%;
    top: 0;
    width: 1px;
    background: #ddd;
  }
  &__label {
    position: relative;
    z-index: 10;
    background: #fff;
    height: 60rpx;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    clear: both;
    &::after {
      content: '';
      display: table;
    }
    &.time-swiper{
      height: 40rpx;
      .time{
        top: 0;
        right:50%;
        transform: translate3d(50%, 0, 0);
      }
    }
    .des {
      font-family: $PFR;
      font-size: 24rpx;
      transform: scale(0.83);
      font-weight: bold;
      padding-left: 4rpx;
      display: inline-block;
      transform-origin: 0 50%;
    }
    .icon-half {
      margin-bottom: 4rpx;
    }
    .icon-whistle{
      margin-bottom: 10rpx;
    }
  }
  .icon {
    width: 32rpx;
    height: 32rpx;
    display: inline-block;
    vertical-align: middle;
  }
  .timeline-swiper{
    height: 100%;
  }
  &__home,
  &__guest {
    position: relative;
    width: 50%;
    margin-bottom: 20rpx;
    &::after {
      content: '';
      display: table;
    }
  }
  .time {
    background: #fff;
    text-align: center;
    width: 64rpx;
    height: 40rpx;
    line-height: 40rpx;
    position: absolute;
    top: 15rpx;
    z-index: 10;
    border: 1px solid #ddd;
    border-radius: 20rpx;
    &.icon-time {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .text {
      font-size: 24rpx;
      color: #333;
      font-weight: bold;
      transform: scale(0.83);
      display: inline-block;
      transform-origin: 50% 60%;
    }
    .i {
      width: 15rpx;
      height: 15rpx;
      display: inline-block;
      @include bg-image('/static/match-detail/icon-add.png')
    }
  }
  .timeline__guest + .timeline__guest,
  .timeline__home + .timeline__home,
  .timeline__home + .timeline_lable,
  .timeline__guest + .timeline_lable,
  .timeline_lable + .timeline__home,
  .timeline_lable + .timeline__home {
    margin-top: 20rpx;
  }
  .timeline__home + .timeline__guest {
    clear: right;
    margin-top: 100rpx;
  }
  .timeline__guest + .timeline__home {
    clear: left;
    margin-top: 100rpx;
  }
  .timeline__guest + .timeline__guest {
    clear: right;
  }
  .timeline__home + .timeline__home {
    clear: left;
  }
  &__home {
    float: left;
    clear: left;
    .time {
      left: 100%;
      transform: translate3d(-50%, 0, 0);
    }
  }
  &__guest {
    float: right;
    clear: right;
    .time {
      right: 100%;
      transform: translate3d(50%, 0, 0);
    }
  }
  .start {
    position: absolute;
    bottom: -22rpx;
    left: 50%;
    transform: translate(-50%, 50%);
  }
  .left,
  .right {
    background: #f9fafb;
    font-size: 24rpx;
    line-height: 32rpx;
    width: 230rpx;
    padding: 24rpx 24rpx;
    border-radius: 24rpx;
    position: relative;
    &::after {
      position: absolute;
      content: "";
      width: 0;
      height: 0;
      top: 15rpx;
      right: -25rpx;
      border-top: 18rpx solid transparent;
      border-left: 30rpx solid #f9fafb;
      border-bottom: 18rpx solid transparent;
    }
    .icon {
      width: 44rpx;
      height: 44rpx;
      display: inline-block;
      vertical-align: middle;
      position: absolute;
      top: 20rpx;
    }
    .des {
      display: inline-block;
      word-break: break-all;
      color: #999;
      padding-left: 56rpx;
      .teamName,.score {
        color: #333333;
      }
    }
  }
  .left{
    float: left;
    clear: right;
  }
  .right{
    float: right;
    clear: left;
  }
  .custom-swiper{
    display: inline-block;
    height: 100%;
    width: 100%;
  }
  .custom-right{
    float: right;
    clear: right;
    .time{
      position: absolute;
      right: 100%;
      transform: translate(-50%,0);
    }
  }
  .custom-left{
    float: left;
    clear: left;
     .time{
      position: absolute;
      left: 100%;
      transform: translate(50%,0);
    }
  }
  .custom-left, .custom-right {
    position: relative;
    .custom {
      position: relative;
      background: rgba(255,34,34,0.10);
      padding: 24rpx 26rpx 30rpx  30rpx;
      margin-bottom: 20rpx;
      width: 222rpx;
      color: #333;
      line-height: 32rpx;
      font-size: 24rpx;
      border-radius: 24rpx;
      text-align: justify;
      .red{
        color: #ff2222;
      }
    }
  }
  &__guest {
    .right {
      float: right;
      &::after {
        left: -25rpx;
        border-right: 30rpx solid #f9fafb;
        border-left: 0;
      }
    }
  }
  .tips {
    background: rgba(255, 34, 34, 0.1);
    padding: 24rpx;
    font-size: 24rpx;
    width: 230rpx;
    color: #333333;
    border-radius: 24rpx;
    margin: 16rpx 0;
    line-height: 32rpx;
    display: inline-block;
  }
}
</style>
