<template>
  <view
    class="swiper-item"
    @touchstart="touchStart"
    @touchmove="touchMove"
    @touchend="touchEnd">
    <view
      class="swiper-item__info"
      @click="chooseId"
      :style="itemStyle">
      <view class="info">
        <view class="title">{{item.lotteryCategoryName}}</view>
        <view class="detail">
         <text>详情：</text><rich-text class="span" :nodes="item.firstMatchDesc"></rich-text>
        </view>
        <view class="time">
          <text>
            {{item.firstMatchTime | dateFormat}}
          </text>
        </view>
      </view>
      <view class="price">
        <text class="top">{{item.betNum}}注</text>
        <text class="bottom">{{item.betPrice}}元</text>
      </view>
    </view>
    <view
      class="swiper-item__delete"
      :style="itemStyle"
      @click="del">
      <text>删除</text>
    </view>
  </view>
</template>
<script>
import { formatDate } from '@/utils/filters'
export default {
  name: 'swiperitem',
  props: ['item', 'active-id'],
  data () {
    return {
      btnsWidth: 120,
      startX: 0,
      translateX: 0,
      oldPoint: null,
      speed: 300
    }
  },
  filters: {
    dateFormat (val) {
      const day = new Date(val).getDay()
      let weekDay = ''
      switch (day) {
        case 0:
          weekDay = '周日'
          break
        case 1:
          weekDay = '周一'
          break
        case 2:
          weekDay = '周二'
          break
        case 3:
          weekDay = '周三'
          break
        case 4:
          weekDay = '周四'
          break
        case 5:
          weekDay = '周五'
          break
        case 6:
          weekDay = '周六'
          break
        default:
          weekDay = ''
          break
      }
      return formatDate([val, 'MM.dd']) + ' (' + weekDay + ')  ' + formatDate([val, 'hh:mm:ss'])
    }
  },
  computed: {
    itemStyle () {
      return `transform: translate3d(${this.translateX}rpx, 0, 0); transition: transform ${this.speed}ms linear;`
    }
  },
  watch: {
    activeId (val) {
      if (val !== this.item.betId && this.translateX !== 0) {
        this.translateX = 0
      }
    }
  },
  methods: {
    touchStart (e) {
      this.oldPoint = e.touches[0]
      this.speed = 0
      this.startX = this.translateX
      uni.$emit('bet-history-update-active-id', this.item.betId)
    },
    touchMove (e) {
      let moveX = e.touches[0].pageX - this.oldPoint.pageX
      const moveY = e.touches[0].pageY - this.oldPoint.pageY
      if (Math.abs(moveX) < Math.abs(moveY) || Math.abs(moveX) < 20 || Math.abs(moveY) > 30) return
      moveX = this.startX * 1 + moveX * 1
      if (moveX < -this.btnsWidth) {
        moveX = -this.btnsWidth
      } else if (moveX > 0) {
        moveX = 0
      }
      this.translateX = moveX
    },
    touchEnd () {
      const moveX = -this.translateX > 30 ? 0 - this.btnsWidth : 0
      this.speed = 300
      this.translateX = moveX
    },
    del () {
      if (this.item.loading) return
      uni.$emit('bet-del-id', this.item.betId)
    },
    chooseId () {
      uni.navigateTo({
        url: `/pages/bet-assistant/detail/index?betId=${this.item.betId}`
      })
    }
  }
}
</script>
<style lang='scss'>
@import "@/assets/style/mixin.scss";
.swiper-item {
  position: relative;
  overflow: hidden;
  &__info {
    position: relative;
    display: flex;
    padding: 38rpx 32rpx 34rpx 36rpx;
    flex-direction: row;
    justify-items: center;
    align-items: center;
    height: 108rpx;
    background: #fff;
    &::after {
      content: '';
      position: absolute;
      height: 1px;
      bottom: 0;
      background: #eee;
      left: 22rpx;
      right: 12rpx;
    }
    .info {
      flex: auto;
      .title {
        padding-bottom: 6rpx;
        line-height: 44rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
      .detail {
        line-height: 34rpx;
        font-size: 24rpx;
        color: #666666;
        display: flex;
        align-items: center;
        .desc {
          display: inline-block;
          width: 420rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: middle;
          .VS {
            display: inline-block;
            width: 50rpx;
            text-align: center;
            font-family: $AGN;
            font-size: 28rpx;
          }
        }
      }
      .time {
        font-size: 24rpx;
        color: #999999;
        transform: scale(0.82);
        transform-origin: 0 100%;
        margin-top: 4rpx;
      }
    }
    .price {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      .top{
        padding-bottom: 10rpx;
      }
    }
  }
  &__delete {
    position: absolute;
    left: 100%;
    bottom: 0;
    background: #f22;
    color: #fff;
    text-align: center;
    width: 120rpx;
    line-height: 180rpx;
    height: 180rpx;
  }
}
</style>
