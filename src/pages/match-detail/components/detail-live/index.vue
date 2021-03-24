<template>
  <view
    class="detail-live-wrapper"
    @touchstart="touchStart"
    @touchmove="touchMove">
    <live-football
      v-if="liveData.matchInfoId && categoryId === 1 && !noData"
      :header-hidden="headerHidden"
      :liveData="liveData"
      :chat-num="chatNum"
      :chat-stuats="chatStatus"
      @scroll="e => scrollTop = e.detail.scrollTop"
      @move="val => $emit('move', val)" />
    <live-basketball
      v-if="liveData.matchInfoId && categoryId === 2  && !noData"
      :header-hidden="headerHidden"
      :liveData="liveData"
      :chat-num="chatNum"
      :chat-stuats="chatStatus"
      @scroll="e => scrollTop = e.detail.scrollTop"
      @move="val => $emit('move', val)" />
    <sign-modal
      :categoryId="categoryId"
      :scroll-top="scrollTop"
      v-if="liveData.matchInfoId && !noData"/>
    <loading-data
      v-if="loading" />
    <view
      class="detail-lineup__no-data"
      @touchstart="touchStart"
      @touchmove="touchMove">
      <no-data
        type="match"
        v-if="noData"
        icon="icon-no-data-match"
        :text="liveData.matchStatus === 1 ? '比赛即将开始，稍后网易红彩为您直播' : '暂无直播数据'" />
    </view>
  </view>
</template>

<script>
import LiveFootball from './components/live-football'
import LiveBasketball from './components/live-basketball'
import SignModal from '../common/sign-modal'
import { matchDetailLive } from '@/utils/api/match-detail'
let lastY = 0
export default {
  name: 'detail-live',
  props: ['match-info-id', 'status', 'header-hidden', 'header-height', 'content-height', 'chat-num', 'chat-status'],
  data () {
    return {
      loading: true,
      isRequest: false,
      liveData: {},
      timer: null,
      scrollTop: 0
    }
  },
  computed: {
    categoryId () {
      return this.liveData.lotteryCategoryId || 1
    },
    noData () {
      if (!this.loading) {
        if (this.status === 1) return true
        if (!this.liveData.statsLiveList && !this.liveData.textLiveList) return true
        if (this.liveData.statsLiveList && this.liveData.statsLiveList.length === 0 && this.liveData.textLiveList && this.liveData.textLiveList.length === 0) return true
      }
      return false
    }
  },
  components: {
    LiveFootball,
    LiveBasketball,
    SignModal
  },
  created () {
    if (this.status === 2) {
      this.httpRequest()
    } else {
      this.getMatchLive()
    }
  },
  destroyed () {
    this.clearTimer()
  },
  watch: {
    status (val) {
      if (val === 2) {
        this.httpRequest()
      } else {
        this.clearTimer()
      }
    },
  },
  methods: {
    touchStart (e) {
      const pageY = e && e.touches && e.touches[0].pageY
      pageY && (lastY = pageY)
    },
    touchMove (e) {
      const pageY = e && e.touches && e.touches[0].pageY
      if (pageY) {
        if (pageY - lastY > 0) {
          if (this.scrollTop <= 10 && this.headerHidden) {
            this.$emit('move', 'down')
          }
        } else {
          if (!this.headerHidden) {
            this.$emit('move', 'up')
          }
        }
      }
    },
    httpRequest () {
      this.getMatchLive()
      if (this.timer) {
        this.clearTimer()
      } else {
        this.timer = setInterval(this.getMatchLive, this.categoryId === 1 ? 30 * 1000 : 10 * 1000)
      }
    },
    clearTimer () {
      clearInterval(this.timer)
      this.timer = null
    },
    getMatchLive () {
      if (this.isRequest) return
      this.isRequest = true
      this.$service(matchDetailLive, {
        urlParams: {
          matchInfoId: this.matchInfoId
        }
      }).then(res => {
        if (res.code === 200) {
          if (res.data.textLiveList) {
            res.data.textLiveList.reverse()
          }
          this.liveData = res.data
        } else {
          this.$toast(res.message)
        }
        this.loading = false
        this.isRequest = false
      }, err => {
        if (err) {
          this.loading = false
          this.isRequest = false
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.detail-live {
  &-wrapper {
    height: 100%;
    position: relative;
    background: #f3f5f7;
  }
  &__no-data {
    position: relative;
    height: 100%;
  }
}
</style>
