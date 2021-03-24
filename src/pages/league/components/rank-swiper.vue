<template>
  <view
    class="rank-swiper"
    duration="300"
    :current="index"
    @touchstart="touchStart"
    @touchmove="touchMove"
    @touchend="touchEnd">
    <view
      class="rank-swiper__content"
      :style="prevStyle"
      :class="{'animate': animate}">
      <rank-data-type
        :info="prev"
        v-if="prev"
        ref="prev"
        key="prev" />
    </view>
    <view
      class="rank-swiper__content"
      :style="activeStyle"
      :class="{'animate': animate}">
      <rank-data-type
        :info="active"
        v-if="active"
        ref="active"
        key="active" />
    </view>
    <view
      class="rank-swiper__content"
      :style="nextStyle"
      :class="{'animate': animate}">
      <rank-data-type
        :info="next"
        v-if="next"
        ref="next"
        key="next" />
    </view>
  </view>
</template>

<script>
import RankDataType from './rank-data-type'
export default {
  name: 'rank-swiper',
  props: {
    isPrevDisabled: {
      type: Boolean,
      default: false
    },
    isNextDisabled: {
      type: Boolean,
      default: false
    },
    prev: {
      type: Object,
      default () {
        return null
      }
    },
    active: {
      type: Object,
      default () {
        return null
      }
    },
    next: {
      type: Object,
      default () {
        return null
      }
    }
  },
  data () {
    return {
      elWidth: 0,
      index: 1,
      lastIndex: 1,
      offsetX: 0,
      touchTime: 0,
      animate: false,
      direction: null,
      moveDirection: null,
      isTouch: true,
      timer: null
    }
  },
  computed: {
    prevStyle () {
      return this.setStyle({
        0: 0,
        1: -1,
        2: 1
      }[this.index])
    },
    activeStyle () {
      return this.setStyle({
        0: 1,
        1: 0,
        2: -1
      }[this.index])
    },
    nextStyle () {
      return this.setStyle({
        0: -1,
        1: 1,
        2: 0
      }[this.index])
    }
  },
  mounted () {
    const query = uni.createSelectorQuery().in(this)
    query.select('.rank-swiper').boundingClientRect(data => {
      if (data) {
        this.elWidth = data.width
      }
    }).exec()
  },
  components: {
    RankDataType
  },
  watch: {
    prev: {
      deep: true,
      handler () {
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.prev && this.$refs.prev.scrollTo()
          }, 0)
        })
      }
    },
    active: {
      deep: true,
      handler () {
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.active && this.$refs.active.scrollTo()
          }, 0)
        })
      }
    },
    next: {
      deep: true,
      handler () {
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.next && this.$refs.next.scrollTo()
          }, 0)
        })
      }
    }
  },
  methods: {
    setTimer () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.transitionend()
      }, 210)
    },
    touchStart (e) {
      if (this.animate || e.touches.length > 1) return
      const touch = e.touches[0] || e.targetTouches[0]
      this.startY = touch.pageY
      this.startX = touch.pageX
      this.touchTime = new Date().getTime()
      this.lastIndex = this.index
    },
    touchMove (e) {
      if (this.animate || e.touches.length > 1) return
      const touch = e.touches[0] || e.targetTouches[0]
      const pageX = touch.pageX
      const pageY = touch.pageY
      if (Math.abs(pageY - this.startY) < Math.abs(pageX - this.startX)) {
        if (this.moveDirection === 'y') {
          return
        }
        this.moveDirection = 'x'
        if ((pageX - this.startX > 0 && this.isPrevDisabled) || (pageX - this.startX < 0 && this.isNextDisabled)) {
          return
        }
        this.offsetX = pageX - this.startX
        e.preventDefault()
        e.stopPropagation()
      } else {
        if (this.moveDirection === 'x') {
          return
        }
        this.moveDirection = 'y'
        this.offsetX = 0
      }
    },
    touchEnd (e) {
      if (e.touches.length > 0) return
      this.moveDirection = null
      const time = new Date().getTime()
      const offsetX = Math.abs(this.offsetX)
      if ((time - this.touchTime < 300 && offsetX > 20) || offsetX > this.elWidth / 3) {
        if (this.offsetX > 0) {
          this.direction = 'prev'
        } else {
          this.direction = 'next'
        }
      }
      if (offsetX > 0) {
        this.animate = true
        this.offsetX = 0
        this.setTimer()
        // this.$el.addEventListener('transitionend', this.transitionend)
        e.preventDefault()
        e.stopPropagation()
      } else {
        this.animate = false
      }
      if (this.direction === 'prev') {
        this.$emit('active-scoll-top', this.getActiveScrollTop())
        this.isTouch = true
        this.indexPrev()
        return
      }
      if (this.direction === 'next') {
        this.$emit('active-scoll-top', this.getActiveScrollTop())
        this.isTouch = true
        this.indexNext()
        return
      }
    },
    transitionend (e) {
      if (this.index !== this.lastIndex) {
        this.$emit('changed', {
          direction: this.direction,
          type: this.isTouch ? 'auto' : 'none',
          index: this.index
        })
        this.lastIndex = this.index
      }
      this.animate = false
      this.direction = null
      this.$bus.$emit('element-scroll', this.getActiveScrollTop())
      // this.$el.removeEventListener('transitionend', this.transitionend)
    },
    setStyle (num) {
      const { elWidth, offsetX, direction } = this
      const zIndex = num === 0 || (direction === 'prev' && num === 1) || (direction === 'next' && num === -1) ? 'z-index: 5' : ''
      return `transform: translate3d(${num * elWidth + offsetX}px, 0, 0);${zIndex}`
    },
    goPrev () {
      this.direction = 'prev'
      this.lastIndex = this.index
      this.indexPrev()
      this.isTouch = false
    },
    goNext () {
      this.direction = 'next'
      this.lastIndex = this.index
      this.indexNext()
      this.isTouch = false
    },
    indexPrev () {
      // this.$el.addEventListener('transitionend', this.transitionend)
      this.animate = true
      this.index--
      if (this.index < 0) {
        this.index = 2
      }
      this.setTimer()
    },
    indexNext () {
      // this.$el.addEventListener('transitionend', this.transitionend)
      this.animate = true
      this.index++
      if (this.index > 2) {
        this.index = 0
      }
      this.setTimer()
    },
    getActiveScrollTop () {
      switch (this.lastIndex) {
      case 0:
        return this.$refs.prev.getScrollTop()
      case 1:
        return this.$refs.active.getScrollTop()
      case 2:
        return this.$refs.next.getScrollTop()
      }
      return 0
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/style/mixin.scss';
.rank-swiper {
  width: 100%;
  height: 100%;
  position: relative;
  flex: auto;
  &__content {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1;
    background: #fff;
    backface-visibility: hidden;
    &.animate {
      will-change: transform;
      transition: transform .2s linear;
    }
  }
}
</style>
