<template>
  <view class="drop-select" v-if="visible" :style="{'top': '60rpx', 'left': '10rpx','z-index':'10'}">
    <view class="drop-select__bg"></view>
    <view class="drop-select__content">
      <view
        v-for="item in list"
        :key="item.id"
        class="drop-select__content--item"
        :class="{'current': index === item.id}"
        @click="choose(item.id)">
        {{item.name}}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'drop-select',
  props: ['value', 'list', 'label', 'index', 'disabled'],
  computed: {
    visible: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    choose (i) {
      this.visible = false
      if (this.disabled || i === this.index) return
      this.$emit('change', i)
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/style/mixin.scss';
.drop-select {
  position: absolute;
  right: 0;
  width: 180rpx;
  &__bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    bottom: 100%;
    background: #333;
    border-radius: 6rpx;
    transform: translateZ(0);
    opacity: .9;
    box-shadow: 0 0 18rpx 0 #999;
    &:before {
      content: '';
      width: 20rpx;
      height: 20rpx;
      margin-bottom: -14rpx;
      background: #333;
      position: absolute;
      right: 10rpx;
      bottom: 100%;
      border-radius: 4rpx;
      transform: rotate(-45deg);
    }
  }
  &__content {
    &--item {
      list-style: none;
      height: 62rpx;
      line-height: 62rpx;
      position: relative;
      color: #fff;
      text-align: center;
      &.current {
        color: #f22;
      }
    }
  }
}
</style>
