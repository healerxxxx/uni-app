<template>
  <lottery-popup
    v-model="visible"
    position="bottom"
    pop-class="league-list-pop"
    pop-style="height: 80vh;"
    closeable>
    <view class="league-list-pop__info">
      <text>全部赛事</text>
    </view>
    <view class="league-list-pop__ul">
      <view
        class="li"
        v-for="(item, i) in list"
        :key="i"
        :class="{'current': index === i}"
        @click="choose(i)">{{item.name}}</view>
    </view>
  </lottery-popup>
</template>

<script>
export default {
  name: 'league-list-pop',
  props: ['value', 'list', 'top', 'index'],
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
      if (this.index === i) return
      this.$emit('change', i)
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/style/mixin.scss';
.league-list-pop {
  z-index: 30;
  display: flex;
  flex-direction: column;
  position: absolute;
  background: #fff;
  height: 100vh;
  &__info {
    padding: 20rpx 40rpx;
    line-height: 40rpx;
    color: #333;
    font-size: 28rpx;
    position: relative;
    flex-shrink: 0;
    border-bottom: 1rpx solid #eee;
  }
  &__icon{
    position: absolute;
    cursor: pointer;
    width: 80rpx;
    height: 80rpx;
    top: 0;
    right: 0;
    .img {
      position: absolute;
      left: 50%;
      top: 50%;
      margin-top: -10rpx;
      margin-left: -10rpx;
      width: 20rpx;
      height: 20rpx;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
  &__ul {
    flex: auto;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding: 12rpx 15rpx;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    .li {
      list-style: none;
      width: 150rpx;
      height: 60rpx;
      margin: 15rpx;
      font-size: 24rpx;
      position: relative;
      text-align: center;
      line-height: 60rpx;
      border-radius: 30rpx;
      background: #F5F8FF;
      color: #666;
      &.current {
        color: #ff2222;
        background: rgba(255, 34, 34, .05);
        border: 1px solid #ff2222;
      }
    }
  }
}
</style>
