<template>
  <view class="bet-history">
    <swiper-item
      v-for="item in list"
      :key="item.betId"
      :item="item"
      :active-id="activeId" />
    <loading-more v-if="loading && list.length > 0" />
    <view class="no-more" v-if="noMore">没有更多了~</view>
    <loading-data v-if="loading && list.length === 0" />
    <no-data v-if="!loading && noData" text="暂无数据" />
  </view>
</template>

<script>
import { betHistory, betDel } from '@/utils/api/bet-assistant'
import SwiperItem from './components/swiper-item'
export default {
  name: 'bet-history',
  data () {
    return {
      noData: false,
      loading: false,
      noMore: false,
      limit: 20,
      list: [],
      activeId: null
    }
  },
  created () {
    this.loading = true
    this.getList()
    uni.$on('bet-history-update-active-id', id => this.activeId = id)
    uni.$on('bet-del-id', this.queryDel)
  },
  onReachBottom () {
    if (!this.loading && !this.noData && !this.noMore) {
      if (this.loading) return
      this.loading = true
      setTimeout(this.getList, 300)
    }
  },
  components: {
    SwiperItem
  },
  methods: {
    queryDel (id) {
      const i = this.list.findIndex(item => item.betId === id)
      if (i === -1) return
      const data = this.list[i]
      if (data.loading) return
      this.$set(data, 'loading', true)
      this.$service(betDel, {
        data: {
          betId: id
        }
      }).then(res => {
        if (res.code === 200) {
          uni.showToast({title:'删除成功' ,icon:'none'})
          this.list.splice(i, 1)
        } else {
          data.loading = false
          uni.showToast({title: res.message, icon:'none'})
        }
      }).catch(err => {
        if (err) {
          data.loading = false
          uni.showToast({title: '网络异常，请稍后再试', icon: 'none'})
        }
      })
    },
    getList () {
      const offset = this.list.length
      this.$service(betHistory, {
        data: {
          offset: offset,
          limit: this.limit
        }
      }).then(res => {
        if (res.code === 200) {
          this.list = [...this.list, ...res.data]
          this.noMore = res.data.length < this.limit
        }
      }).finally(() => {
        this.loading = false
        this.noData = this.list.length < 1
      })
    }
  }
}
</script>

<style lang='scss'>
@import "@/assets/style/mixin.scss";
.bet-history {
  position: relative;
  width: 750rpx;
  min-height: 100vh;
  .no-more {
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    font-size: 24rpx;
    color: #999999;
  }
}
</style>
