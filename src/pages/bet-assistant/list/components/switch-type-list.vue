<template>
  <lottery-popup
    v-model="visible"
    position="bottom"
    pop-class="switch-type-list">
    <view class="switch-type-list__content">
      <view class="ul">
        <view 
          class="li"
          v-for="(value, key) in list"
          :key="key"
          @click="change(key)"
          :class="[value.class]">{{value.name}}</view>
      </view>
      <view
        class="switch-type-list__content--cancle"
        @click="visible = false">取消</view>
    </view>
  </lottery-popup>
</template>

<script>
export default {
  name: 'switch-type-list',
  props: ['value', 'list'],
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
    change (i) {
      this.$emit('switch', i)
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.switch-type-list {
  background: #fff;
  border-radius: 16rpx 16rpx 0 0;
  overflow: hidden;
  transform: translateZ(0);
  &__content {
    background: #f3f5f7;
    &--cancle, .li {
      list-style: none;
      background: #fff;
      height: 90rpx;
      line-height: 90rpx;
      text-align: center;
      color: #333;
      font-size: 32rpx;
    }
    .li + .li {
      position: relative;
      border-top: 1rpx solid #ebebeb;
    }
    &--cancle {
      margin-top: 12rpx;
      font-weight: bold;
    }
  }
}

</style>
