<template>
	<view class="subnav-tab">
	  <view
      class="subnav-tab__item"
      v-for="(item, index) in dayTab"
      :key="index" 
      @click="tab = index"
      :class="{
        'zero': item.num === 0,
        'today': isToday(item.day),
        'current': tab === index
      }"
      :style="{'width': (100 / dayTab.length) + '%'}">
      <view class="span day">{{item.day | dayFormart}}</view>
      <view class="span day-tip">{{item.day | dayTips2CH}}</view>
    </view>
	</view>
</template>

<script>
export default {
  name: 'subnav-tab',
  props:['day-tab', 'value'],
  computed: {
    tab: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
  },
  filters: {
    dayFormart (day) {
      day = new Date(day.replace(/-/g, '/'))
      const month = day.getMonth()
      const _day = day.getDate()
      return (month < 9 ? '0' + (month + 1) : month + 1) + '.' + (_day < 10 ? '0' + _day : _day)
    },
    dayTips2CH (day) {
      if (typeof day === 'string') {
        day = day.replace(/-/g, '/')
      }
      day = new Date(day)
      if (!day) return ''
      const now = new Date()
      const today = now.getTime() + now.getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000
      if (today > day && today - day < 24 * 60 * 60 * 1000) return '今天'
      return {
        0: '日',
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六'
      }[day.getDay()]
    }
  },
  methods: {
    isToday (day) {
      day = new Date(day.replace(/-/g, '/'))
      if (!day) return false
      const now = new Date()
      const today = now.getTime() + now.getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000
      if (today > day && today - day < 24 * 60 * 60 * 1000) return true
      return false
    },
  }
}
</script>

<style lang="scss">
.subnav-tab {
  flex-shrink: 0;
  height: 80rpx;
  position: relative;
  background: #fff;
  box-shadow: 0 2rpx 3rpx 0 rgba(0,0,0,0.08);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  &__item {
    flex-shrink: 0;
    padding: 16rpx 0;
    height: 48rpx;
    text-align: center;
    line-height: 24rpx;
    position: relative;
    &.current{
      &::after{ 
        content: "";
        position: absolute;
        width: 80rpx;
        height: 4rpx;
        background: #f22;
        left: 50%;
        margin-left: -40rpx;
        bottom: 0;
        z-index: 2;
      }
      .span {
        color: #f22;
      }
    }
    .span {
      display: block;
      font-size: 24rpx;
    }
    .span + .span{
      margin-top: 4rpx;
    }
    .day {
      color: #333;
    }
    .day-tip {
      color: #999;
    }
  }
}
</style>
