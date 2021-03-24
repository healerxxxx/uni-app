<template>
  <div class="no-data">
    <div class="no-data__icon"></div>
    <div class="no-data__text">暂无信息</div>
  </div>
</template>
<script>
export default {
  name: 'no-data'
}
</script>

<style lang="scss">
@import '@/assets/style/mixin.scss';
.no-data {
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  &__icon {
    width: 2.42rem;
    height: 2.42rem;
    @include bg-image('/static/icon-no-data-list.png');
  }
  &__text {
    font-size: .28rem;
    line-height: .4rem;
    color: #999;
    margin-top: .2rem;
  }
}
</style>