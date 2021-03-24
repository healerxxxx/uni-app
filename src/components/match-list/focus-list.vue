<template>
  <view class="match-focus">
    <scroll-view
      v-if="listLen > 0"
      :scroll-top="scrollTop"
      style="height: 100%"
      class="match-focus__scroll"
      lower-threshold="10"
      @scrolltolower="getList(listLen)"
      scroll-y="true">
      <match-item-card
        v-for="(item, index) in list"
        :key="item.matchInfoId"
        :hidden-border="index === 0"
        :info="item" />
      <view
        class="match-focus__no-more"
        v-if="noMore">
        <no-more text="没有更多赛事啦~" />
      </view>
      <loading-more
        v-if="loading && listLen > 0" />
    </scroll-view>
    <view
      class="match-focus__no-data"
      v-if="!isLogin || (!loading && listLen < 1)">
      <no-data
        v-if="!isLogin"
        text="您还没有登录，点击进行登录"
        btn-text="点击登录"
        @btn-click="toLogin" />
      <no-data
        v-else
        text="您还没有关注赛事" />
    </view>
    <view class="match-focus__hot" v-if="hotList.length > 0 && listLen < 1">
      <span>热门赛事</span>
    </view>
    <match-item-card
      v-for="(item, index) in hotList"
      :hidden-border="index === 0"
      :key="item.matchInfoId"
      :info="item" />
    <loading-data v-if="loading && listLen < 1" />
  </view>
</template>

<script>
import { focusMatchList } from '../../utils/api/matchlist'
import MatchItemCard from './match-item-card'
import { mapGetters } from 'vuex'
import { queryMatchEvent } from '@/utils/tools'
export default {
  name: 'focus',
  props: ['categoryId', 'visible'],
  data () {
    return {
      loading: false,
      noMore: false,
      list: [],
      hotList: [],
      limit: 20,
      timer: null,
      scrollTop: 0
    }
  },
  computed: {
    ...mapGetters(['isLogin']),
    listLen () {
      return this.list.length
    }
  },
  components: {
    MatchItemCard
  },
  watch: {
    visible (val) {
      if (val) {
        const arr = [...this.list, ...this.hotList]
        if (arr.length < 1) {
          this.getList()
        } else {
          queryMatchEvent(arr, this.categoryId)
          clearInterval(this.timer)
          this.timer = setInterval(() => {
            queryMatchEvent(arr, this.categoryId)
          }, parseInt(this.categoryId) === 1 ? 30000 : 10000)
        }
      } else {
        clearInterval(this.timer)
      }
    },
    isLogin () {
      this.getList()
    }
  },
  created () {
    if (this.visible) {
      this.loading = true
      this.getList()
    }
    this.$bus.$on('match-follow-refresh', id => {
      if (this.categoryId + '' === id + '') {
        this.$nextTick(() => {
          this.liveScrollTop = 0
        })
        this.getList()
      }
    })
  },
  beforeDestroy () {
    this.$bus.$off('match-follow', {})
  },
  methods: {
    toLogin () {
      uni.navigateTo({
        url: '/pages/user/login'
      })
    },
    getList (offset) {
      if (offset === undefined) {
        offset = 0
      }
      this.$service(focusMatchList, {
        urlParams: {
          offset: offset,
          limit: this.limit
        },
        data: {
          lotteryCategoryId: this.categoryId
        }
      }).then(res => {
        if (res.code === 200) {
          const followList = res.data.followList || []
          const hotList = res.data.hotList || []
          if (offset === 0) {
            this.list = followList
          } else {
            this.list = [...this.list, ...followList]
          }
          this.noMore = this.list.length > 0 && followList.length < this.limit
          this.hotList = hotList
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
.match-focus {
  position: relative;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  &__scroll {
    height: 100%;
    flex: auto;
    position: relative;
  }
  &__no-data {
    flex: auto;
    position: relative;
  }
  &__no-more {
    border-top: 1rpx solid #eee;
  }
  &__hot {
    position: relative;
    height: 90rpx;
    line-height: 90rpx;
    padding-left: 32rpx;
    font-size: 32rpx;
    background: #fff;
    position: relative;
    flex-shrink: 0;
    border-bottom: 1rpx solid #eee;
  }
}
</style>