<template>
  <view class="match-list-wrap">
    <scroll-view
      style="height: 100%"
      class="match-list__scroll"
      scroll-y="true"
      @scroll="scroll">
      <match-item-card
        v-for="(item, index) in list"
        :index-i="index"
        :key="item.matchInfoId"
        :hidden-border="index === 0"
        :info="item" />
    </scroll-view>
    <loading-data
      v-if="loading" />
    <no-data
      v-if="noData"
      text="本日赛事官方暂未开售<br />祝您天天红单！" />
  </view>
</template>

<script>
import MatchItemCard from './match-item-card'
import { matchListByDay } from '@/utils/api/matchlist'
import { queryMatchEvent } from '@/utils/tools'
export default {
  name: 'match-list-item',
  props: ['visible', 'day', 'num', 'filter', 'categoryId'],
  data () {
    return {
      list: [],
      loading: false,
      timer: null,
      scrollTop: 0
    }
  },
  computed: {
    noData () {
      return !this.loading && (this.num !== -1 && (this.num === 0 || this.list.length < 1))
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.getList()
        this.eventTiming()
      } else {
        clearInterval(this.timer)
      }
    },
    list (val) {
      if (val && val.length > 0) {
        this.scrollUnderway()
      }
    }
  },
  created () {
    this.loading = true
    if (this.visible) {
      this.getList()
      this.eventTiming()
    }
  },
  components: {
    MatchItemCard
  },
  methods: {
    scroll (e) {
      this.scrollTop = e.detail.scrollTop
    },
    scrollUnderway () {
      this.$nextTick(() => {
        // const element = this.$el
        // element.scrollTop = 0
        // const _item = this.list.find(item => item.matchStatus === 2 || item.matchStatus === 1)
        // let itemEle = null
        // if (_item) {
        //   itemEle = this.$refs['item' + _item.matchInfoId][0]
        //   if (itemEle) {
        //     element.scrollTop = itemEle.offsetTop
        //   }
        // }
      })
    },
    getList () {
      const { filter } = this
      const params = {}
      if (filter && filter.type) {
        const type = filter.type 
        params.jcType = {all: 0, jc: 1, bj: 2, bjAndJc: 3 }[type]
        if (filter[type].length !== filter[type + 'List'].length) {
          params.leagueMatchIds = filter[type].join(',')
        }
      }
      if (this.list.length <= 0) {
        this.loading = true
      }
      this.$service(matchListByDay, {
        urlParams: {
          categoryId: this.categoryId
        },
        data: {
          day: this.day,
          ...params
        }
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data || []
        }
      }).finally(() => {
        this.loading = false
      })
    },
    eventTiming () {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.list.length > 0) {
          queryMatchEvent(this.list, this.categoryId, this)
        }
      }, 30000)
    }
  }
}
</script>

<style lang="scss">
.match-list-wrap {
  height: 100%;
  position: relative;
  // &__item{
  //   position: relative;
  //   border-top: 1rpx solid #eee;
  //   &:first-child {
  //     border: none;
  //   }
  // }
}
</style>
