<template>
  <view class="match-filter">
    <view class="match-filter__nav">
      <view
        :class="{'current': tab === 'all'}"
        @click="tab = 'all'">全部</view>
      <view
        :class="{'current': tab === 'jc'}"
        @click="tab = 'jc'">竞彩</view>
      <view
        :class="{'current': tab === 'bj'}"
        @click="tab = 'bj'">北单</view>
      <view
        :class="{'current': tab === 'bjAndJc'}"
        @click="tab = 'bjAndJc'">竞彩+北单</view>
    </view>
    <view class="match-filter__all">
      <image
        class="choosed"
        src="/static/icon-choose.svg"
        @click="chooseAll" 
        v-if="list[tab] && list[tab].length > 0 && list[tab].length === list[tab + 'List'].length" />
      <view
        class="unchoosed"
        v-else
        @click="chooseAll"></view>
      <view
        class="match-filter__all--button"
        @click="chooseAll">全选</view>
    </view>
    <view
      class="match-filter__list"
      v-if="list[tab + 'List'] && list[tab + 'List'].length > 0">
      <view
        class="match-filter__list--item"
        v-for="item in list[tab + 'List']"
        @click="chooseLeague(item.leagueId)"
        :class="{'current': list[tab].includes(item.leagueId)}"
        :key="item.leagueId">{{item.leagueName}}</view>
    </view>
    <view
      v-if="!list[tab + 'List'] || list[tab + 'List'].length < 1"
      class="match-filter__no-data">
      <no-data text="暂无相关赛事" />
    </view>
    <view
      class="match-filter__button"
      :style="{'padding-bottom': `${safeBottom}px`}">
      <view class="select">已选择 <text>{{selectedCount}}</text> 场比赛</view>
      <view
        class="confirm"
        :class="{'disable' : list[tab].length <= 0 }"
        @click="chooseConfirm" >
        <text>确定</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'match-filter',
  data () {
    return {
      categoryId: 1,
      tab: 'jc',
      list: {}
    }
  },
  computed: {
    ...mapState(['matchFilterData']),
    ...mapGetters(['safeBottom']),
    selectedCount () {
      const { list, tab } = this
      let count = 0
      if (list && list[tab] && list[tab].length > 0) {
        list[tab + 'List'].map(item => {
          if (list[tab].findIndex(id => id === item.leagueId) > -1) {
            count += item.matchNum
          }
        })
      }
      return count
    }
  },
  onLoad (options) {
    if (options.categoryId) {
      this.categoryId = parseInt(options.categoryId)
      uni.setNavigationBarTitle({
        title: `${this.categoryId === 1 ? '足球' : '篮球'}筛选`
      })
    }
    this.list = this.matchFilterData
    if (this.list && this.list.type) {
      this.tab = this.list.type
    }
  },
  methods: {
    chooseAll () {
      const { list, tab } = this
      if (list[tab].length === list[tab + 'List'].length) {
        list[tab] = []
      } else {
        list[tab] = []
        list[tab + 'List'].map(item => {
          list[tab].push(item.leagueId)
        })
      }
    },
    chooseLeague (item) {
      const { list, tab } = this
      if (list[tab].includes(item)) {
        list[tab].splice(list[tab].findIndex(_item => {
          return _item === item
        }), 1)
      } else {
        list[tab].push(item)
      }
    },
    chooseConfirm () {
      const { list, tab } = this
      if (!list[tab + 'List'] || list[tab + 'List'].length < 1) return
      if (list[tab] && list[tab].length > 0) {
        const listString = JSON.stringify(list)
        const data = JSON.parse(listString)
        data.type = tab
        uni.$emit('match-filter-confirm', {
          categoryId: this.categoryId,
          data: data
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 50)
      }
    }
  }
}
</script>

<style lang="scss">
.match-filter {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  &__nav {
    height: 80rpx;
    z-index: 2;
    flex-shrink: 0;
    box-shadow: 0 4rpx 6rpx 0 rgba(0,0,0,0.08);
    view {
      display: inline-block;
      vertical-align: middle;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      position: relative;
      color: #666;
      font-size: 30rpx;
      width: 25%;
      &.current {
        color: #ff2222;
        &:after {
          position: absolute;
          content: '';
          left: 50%;
          width: 56rpx;
          height: 6rpx;
          bottom: 0;
          margin-left: -26rpx;
          background: #ff2222;
        }
      }
    }
  }
  &__all {
    padding: 30rpx;
    height: 60rpx;
    line-height: 60rpx;
    border-bottom: 1rpx solid #ddd;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    .unchoosed{
      width: 24rpx;
      height: 24rpx;
      border-radius: 50%;
      border: 1px solid #ff2222;
    }
    .choosed{
      width: 28rpx;
      height: 28rpx;
    }
    &--button {
      padding-left: 12rpx;
      color: #333;
      font-size: 24rpx;
    }
  }
  &__list {
    padding: 30rpx 35rpx;
    flex: auto;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    &--item {
      display: inline-block;
      padding: 0 5rpx;
      width: 140rpx;
      height: 60rpx;
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      background: #F5F8FF;
      border-radius: 30rpx;
      color: #333;
      line-height: 60rpx;
      margin: 15rpx;
      font-size: 24rpx;
      position: relative;
      cursor: pointer;
      box-sizing: border-box;
      &.current {
        background: rgba(255, 34, 34, .05);
        color: #ff2222;
        border: 1px solid #ff2222;
        border-radius: 60rpx;
      }
    }
  }
  &__no-data {
    flex: auto;
    position: relative;
  }
  &__button {
    flex-shrink: 0;
    height: 90rpx;
    color: #999;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .confirm{
      width: 180rpx;
      height: 60rpx;
      background: #ff2222;
      margin-right: 20rpx;
      line-height: 60rpx;
      text-align: center;
      border-radius: 30rpx;
      font-size: 28rpx;
      color: #fff;
      &.disable{
        background: rgba(255,34,34,.3);
      }
    }
    .select{
      color: #333;
      font-size: 28rpx;
      padding-left: 20rpx;
      text{
        color: #ff2222;
      }
    }
  }
}
</style>
