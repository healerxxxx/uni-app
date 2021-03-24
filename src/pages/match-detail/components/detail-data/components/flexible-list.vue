<template>
  <view class="flexible-list">
    <match-list
      :teamId="teamId"
      :category="category"
      :list="list.slice(0,  expand ? 30 : 10)" />
    <view
      v-if="len > 10"
      class="flexible-list__button">
      <view
        class="flexible-list__button--content"
        @click="buttonClick">
        <text class="span">{{expand ? '收起' : `查看剩余${len - 10}场比赛`}}</text>
        <text
          class="icon"
          :class="{'up': expand}">
        </text>
      </view>
    </view>
  </view>
</template>
<script>
import MatchList from './match-list'
import MatchListItem from './match-list-item'
export default {
  name: 'flexible-list',
  props: {
    list: {
      type: Array,
      default: []
    },
    category: {
      type: Number,
      default: 1
    },
    teamId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      expand: false
    }
  },
  computed: {
    len () {
      return this.list.length
    }
  },
  components: {
    MatchList,
    MatchListItem
  },
  methods: {
    buttonClick () {
      this.expand = !this.expand
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.flexible-list {
  position: relative;
  &__expand {
    position: relative;
    height: 0;
    overflow: hidden;
    // transition: height .3s linear;
    &--content {
      position: absolute;
      left: 32rpx;
      right: 32rpx;
      top: 0;
      .match-list-item {
        border-top: 1rpx solid #eee;
        // &:before {
        //   @include one-rpx-x(#eee, top);
        // }
      }
    }
  }
  &__button {
    padding: 16rpx 32rpx 0 32rpx;
    height: 60rpx;
    position: relative;
    &--content {
      position: absolute;
      left: 32rpx;
      right: 32rpx;
      top: 16rpx;
      cursor: pointer;
      background: #F9FAFB;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      .span {
        color: #999;
        transform: translateZ(0);
      }
      .icon {
        margin-left: 10rpx;
        width: 12rpx;
        height: 10rpx;
        @include bg-image('/static/match-detail/icon-data-arrows-down.png');
        &.up {
          transform: rotate(180deg) translateZ(0);
        }
      }
    }
  }
  &.pd0 {
    .flexible-list__button {
      padding-bottom: 0;
    }
  }
}
</style>
