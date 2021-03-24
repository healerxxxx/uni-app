<template>
  <view
    class="nav-bar"
    :class="{'transparent': transparent}"
    :style="style">
    <view class="nav-bar__status" :style="{'height': statusBarHeight + 'px'}"></view>
    <view class="nav-bar__custom" :style="{'height': customBar + 'px'}">
      <view
        class="nav-bar__custom--back"
        v-if="isBack"
        @click="back">
        <view class="icon"></view>
      </view>
      <slot></slot>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'nav-bar',
  props: {
    transparent: {
      type: Boolean | String,
      default: false
    },
    isBack: {
      type: Boolean,
      default: true
    },
    style: {
      type: [String | Object],
      default: ''
    }
  },
  computed: {
    ...mapGetters(['statusBarHeight', 'customBar'])
  },
  methods: {
    back () {
      this.$emit('back')
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/style/mixin.scss';
.nav-bar {
  width: 100vw;
  flex-shrink: 0;
  background: #ff2222;
  &.transparent {
    background: transparent;
  }
  &__custom {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 36rpx;
    font-weight: bold;
    &--back {
      width: 32px;
      height: 32px;
      position: absolute;
      top: 50%;
      margin-top: -16px;
      left: 5px;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        width: 11px;
        height: 20px;
        @include bg-image('/static/icon-nav-back.png');
      }
    }
  }
}
</style>