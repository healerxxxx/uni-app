<template>
  <view class="no-data-wrapper"> 
    <view class="no-data-content" :class="{'match': type === 'match'}">
      <view class="icon" :class="[icon || 'default']"></view>
      <view class="text" v-html="text || '暂无数据'"></view>
      <view
        class="button"
        v-if="btnText"
        @click="$emit('btn-click')">
        {{btnText}}
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'no-data',
  props: ['text', 'type', 'icon', 'btn-text']
}
</script>

<style lang="scss">
.no-data {
  &-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    background: #f3f5f7;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    &.live{
      height: 4.86rem;
      background: #fff;
      position: relative;
      .no-data-content{
        position: absolute;
        text-align: center;
        width: 80%;
        left: 50%;
        top: 18%;
        transform: translate3D(-50%,0,0);
      }
    }
  }
  &-content {
    text-align: center;
    &.match {
      position: absolute;
      top: 400rpx;
      left: 0;
      right: 0;
      -webkit-transform: translate3d(0, -50%, 0);
      transform: translate3d(0, -50%, 0);
    }
    .icon {
      margin: 0 auto;
      &.default {
        width: 244rpx;
        height: 251rpx;
        background-image: url('/static/icon-no-data.png');
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
    .text {
      font-size: 30rpx;
      line-height: 1.5;
      color: #999;
      margin-top: 20rpx;
    }
    .button {
      margin-top: 30rpx;
      display: inline-block;
      font-size: 28rpx;
      color: #999;
      padding: 12rpx 40rpx;
      position: relative;
      min-width: 100rpx;
      cursor: pointer;
      border-radius: 6rpx;
      border: 1px solid #c8c8c8;
    }
  }
}
</style>
