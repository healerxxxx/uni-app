<template>
  <view class="match-list-expand">
    <view
      class="match-list-expand__header"
      @click="isExpand = !isExpand"
      :class="{'no-line': !isExpand}">
      <slot name="header"></slot>
      <view class="match-list-expand__header--icon">
        <image src="/static/bet-assistant/icon-arrows-expand.svg" class="icon-arrows-expand img" :class="{'down': !isExpand}"></image>
      </view>
    </view>
    <view
      class="match-list-expand__hidden"
      v-show="isExpand">
      <slot name="content"></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'match-list-expand',
  data () {
    return {
      isExpand: true
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.match-list-expand {
  position: relative;
  &__header {
    position: relative;
    border-bottom: 1rpx solid #ebebeb;
    &.no-line {
      border: none;
    }
    &--icon {
      position: absolute;
      width: 70rpx;
      height: 70rpx;
      bottom: 16rpx;
      right: 9rpx;
      z-index: 1;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
      .img {
        transition: transform .3s linear;
        &.down {
          transform: rotate(180deg) translateZ(0);
        }
      }
    }
  }
  &__hidden {
    position: relative;
  }
}
</style>
