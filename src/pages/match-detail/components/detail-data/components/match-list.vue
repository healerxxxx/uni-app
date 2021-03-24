<template>
  <view class="match-list">
    <view class="match-list__head">
      <view class="match-list__row date">赛事日期</view>
      <view class="match-list__row team">{{category === 1 ? '主队' : '客队'}}</view>
      <view class="match-list__row score">{{type === 'futuer' ? ' ': category === 1 ? '比分' : '比赛'}}</view>
      <view class="match-list__row team">{{category === 1 ? '客队' : '主队'}}</view>
      <view class="match-list__row pan">{{type === 'futuer' ? '间隔' : '盘路'}}</view>
    </view>
    <match-list-item
      :key="index"
      v-for="(item, index) in list"
      :info="item"
      :category="category"
      :teamId="teamId"
      :type="type"
      :hide-border="index === 0" />
  </view>
</template>
<script>
import MatchListItem from './match-list-item'
export default {
  name: 'match-list',
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
      default: ''
    },
    teamId: {
      type: Number,
      default: 0
    }
  },
  components: {
    MatchListItem
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.match-list {
  position: relative;
  padding: 0 32rpx;
  text-align: center;
  margin-top: 30rpx;
  &__head {
    margin-bottom: 12rpx;
    line-height: 60rpx;
    color: #999;
    background: #f9fafb;
    display: flex;
    align-items: center;
    text-align: center;
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

