<template>
  <view class="lottery-popup">
    <view
      class="lottery-popup__overlay"
      :class="{'enter': showIn, 'leave': showOut}"
      v-show="overlay && visible"
      @click.stop="overylayClick"
      @touchmove.prevent
      @mousewheel.prevent>
    </view>
    <view
      class="lottery-popup__content"
      ref="conent"
      v-show="visible"
      :class="[`lottery-popup__content--${position}`, popClass, {'round': round}, {'enter': showIn, 'leave': showOut}]"
      :style="popStyle">
      <view
        v-if="closeable"
        @click.stop="close()"
        class="lottery-popup__content--close-icon"
        :style="closeStyle"
        :class="[closeIconPosition, closeClass]">
        <image class="img" v-if="closeIcon" :src="closeIcon" />
        <view class="i" v-else></view>
      </view>
      <slot></slot>
    </view>
  </view>
</template>

<script>
let context = 2000
let isCloseing = false
export default {
  name: 'lottery-popup',
  props: {
    value: Boolean, // 双向绑定 v-model
    overlay: { // 是否需要遮罩层
      type: Boolean,
      default: true
    },
    closeOnClickOverlay: { // 是否允许遮罩层点击关闭
      type: Boolean,
      default: true
    },
    popClass: { // 内容层自定义Class
      type: String
    },
    popStyle: { // 内容层样式
      type: [String, Object]
    },
    position: { // 出现的方向 center/top/right/bottom/left
      type: String
    },
    closeable: { // 是否出现关闭按钮
      type: Boolean,
      default: false
    },
    closeIconPosition: { // 关闭按钮位置 'top-right', 'top-left', 'bottom-left', 'bottom-right'
      type: String,
      default: 'top-right'
    },
    closeClass: { // 关闭按钮自定义class
      type: String,
      default: ''
    },
    closeStyle: { // 关闭按钮自定义class
      type: [String, Object],
      default: ''
    },
    closeIcon: { // 关闭按钮图片链接
      type: String,
      default: ''
    },
    round: { // 是否圆角，默认10rpx，不符合要求可在styles自定义设置
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: false,
      showIn: false,
      showOut: false,
      zIndex: 2000
    }
  },
  created () {
    context++
    this.zIndex = context
    this.visible = this.value
  },
  watch: {
    value (val) {
      if (val) {
        this.visible = val
      } else {
        if (this.visible) {
          this.close()
        }
      }
    },
    visible (val) {
      if (val) {
        this.showIn = true
        this.showOut = false
      }
      this.$emit('input', val)
    }
  },
  methods: {
    overylayClick () {
      if (this.closeOnClickOverlay) {
        this.close()
      }
    },
    close () {
      if (isCloseing) return
      this.isCloseing = true
      this.showIn = false
      this.showOut = true
      setTimeout(() => {
        this.visible = false
        this.isCloseing = false
      }, 300)
    }
  }
}
</script>

<style lang="scss">
.lottery-popup {
  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .7);
    z-index: 2000;
    opacity: 0;
    &.enter {
      animation: 'lottery-popup-fade-enter' .3s ease forwards;
    }
    &.leave {
      animation: 'lottery-popup-fade-leave' .3s ease forwards;
    }
  }
  &__content {
    position: fixed;
    max-height: 100%;
    overflow: hidden;
    transform: translateZ(0);
    background-color: #fff;
    transition: transform .3s, opacity .3s;
    z-index: 2002;
    &--center {
      top: 50%;
      left: 50%;
      opacity: 0;
      -webkit-transform: translate3d(-50%, -50%, 0);
      transform: translate3d(-50%, -50%, 0);
      &.round {
        border-radius: 16rpx;
      }
      &.enter {
        animation: 'lottery-popup-center-enter' .3s ease forwards;
      }
      &.leave {
        animation: 'lottery-popup-center-leave' .3s ease forwards;
      }
    }
    &--bottom {
      bottom: 0;
      left: 0;
      width: 100%;
      &.round {
        border-radius: 16rpx 16rpx 0 0;
      }
      &.enter {
        animation: 'lottery-popup-bottom-enter' .3s ease forwards;
      }
      &.leave {
        animation: 'lottery-popup-bottom-leave' .3s ease forwards;
      }
    }
    &--close-icon {
      position: absolute;
      cursor: pointer;
      width: 80rpx;
      height: 80rpx;
      z-index: 20;
      .i {
        position: absolute;
        left: 50%;
        top: 50%;
        margin-top: -10rpx;
        margin-left: -10rpx;
        width: 20rpx;
        height: 20rpx;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiPjxwYXRoIGQ9Ik0uNzU3Ljc1N0w5LjI0MyA5LjI0M00uNzU3IDkuMjQzTDkuMjQzLjc1NyIvPjwvZz48L3N2Zz4=');
        background-repeat: no-repeat;
        background-size: contain;
      }
      .img {
        width: 100%;
        height: 100%;
        display: inline-block;
      }
      &.top-right {
        top: 0;
        right: 0;
      }
      &.top-left {
        top: 0;
        left: 0;
      }
      &.bottom-right {
        top: 0;
        right: 0;
      }
      &.bottom-left {
        top: 0;
        left: 0;
      }
    }
  }
}
@keyframes lottery-popup-fade-enter {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes lottery-popup-fade-leave {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes lottery-popup-center-enter {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes lottery-popup-center-leave {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes lottery-popup-bottom-enter {
  0% {
    transform: translate3d(0, 100%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
@keyframes lottery-popup-bottom-leave {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(0, 100%, 0);
  }
}
</style>
