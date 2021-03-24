<template>
  <view class="rank-data-type">
    <view
      class="rank-data-type__picker"
      :class="{'line': scrollTop > 0}"
      v-if="stages.length > 0">
      <view class="rank-data-type__picker--content" :class="{'bg-white': btnShow}" @click="pickerVisible = true">
        <view>{{currentStages}}</view>
        <image src="/static/league/icon-arrows-bottom-999.svg" v-if="stages.length > 1" class="icon" />
      </view>
      <view class="rank-data-type__picker--switchbtn" v-if="btnShow">
        <view :class="{'active': rangeType === 0}" @click="rangeChane(0)">总</view>
        <view :class="{'active': rangeType === 1}" @click="rangeChane(1)">主场</view>
        <view :class="{'active': rangeType === 2}" @click="rangeChane(2)">客场</view>
      </view>
    </view>
    <view
      class="rank-data-type__standing"
      ref="standing"
      @scroll="domScroll"
      :class="{'prevent': pickerVisible}"
      v-if="classifyIndex === 0 && !loading && !noData">
      <view
        class="rank-data-type__standing--mouduls"
        v-for="(item, index) in list"
        :class="{'separate': index > 0 || stages.length > 0}"
        :key="index">
        <view class="rank-data-type__standing--group" v-if="list.length > 1 && item.groupName">
          <view>{{item.groupName}}</view>
        </view>
        <basketball-rank v-if="navIndex === 2" :list="item.rows" :promotions="promotions" />
        <football-rank v-if="navIndex === 1" :list="rangeType === 0 ?  item.rows  : rangeType === 1 ? item.homeRows :item.aWayRows"  :rangType="rangeType" :promotions="promotions" />
      </view>
    </view>
    <view
      class="rank-data-type__standing"
      ref="schedule"
      @scroll="domScroll"
      :class="{'prevent': pickerVisible}"
      v-if="classifyIndex === 1 && !loading && !noData">
      <view
        class="rank-data-type__standing--mouduls"
        v-for="(item, index) in list"
        :class="{'separate':  index > 0 || stages.length > 0}"
        :key="index">
        <view
          class="rank-data-type__standing--group schedule"
          :class="{'basketball': navIndex === 2}"
          v-if="item.group">{{item.group}}</view>
        <league-schedule
          v-for="(_item, _index) in item.matchList"
          :info="_item"
          :key="_index"
          :categoryId="navIndex" />
      </view>
    </view>
    <view
      class="rank-data-type__player"
      ref="footballPlayer"
      @scroll="playerScroll"
      v-if="navIndex === 1 && (classifyIndex === 2 || classifyIndex === 3) && !loading && !noData">
      <football-player-rank
        v-if="classifyIndex === 2"
        :list="list"
        type="goals" />
      <football-player-rank
        v-if="classifyIndex === 3"
        :list="list"
        type="assists" />
    </view>
    <view
      class="rank-data-type__player--basketball"
      v-if="navIndex === 2 && classifyIndex === 2">
      <basketball-player-rank ref="basketballPlayer" :info="info" />
    </view>
    <view
      class="rank-data-type__placeholder"
      v-if="(loading || noData) && !(navIndex === 2 && classifyIndex === 2)">
      <loading
        center
        v-if="loading" />
      <no-data v-if="noData" />
    </view>
  </view>
</template>

<script>
import FootballRank from './football-rank'
import BasketballRank from './basketball-rank'
import LeagueSchedule from './league-schedule'
import FootballPlayerRank from './football-player-rank'
import BasketballPlayerRank from './basketball-player-rank'
export default {
  name: 'rank-data-type',
  props: ['info'],
  data () {
    return {
      scrollTop: 0,
      rangeType: 0,
      pickerVisible: false
    }
  },
  computed: {
    loading () {
      return this.info.loading
    },
    navIndex () {
      return this.info.navIndex
    },
    classifyIndex () {
      return this.info.classifyIndex
    },
    list () {
      const { data } = this.info
      if (Object.prototype.toString.call(data) === '[object Array]') {
        return data || []
      }
      if (Object.prototype.toString.call(data) === '[object Object]') {
        return data.tables || []
      }
      return []
    },
    stages () {
      const { info, classifyIndex } = this
      let stages = null
      if (classifyIndex === 0 && info.data && info.data.stages) {
        stages = info.data.stages
      }
      if (classifyIndex === 1 && info.stages) {
        stages = info.stages
      }
      if (stages && stages.length > 0) {
        return stages
      }
      return []
    },
    tables () {
      const { info, classifyIndex } = this
      let tables = null
      if (classifyIndex === 0 && info.data && info.data.tables) {
        tables = info.data.tables
      }
      if (classifyIndex === 1 && info.tables) {
        tables = info.tables
      }
      if (tables && tables.length > 0) {
        return tables
      }
      return []
    },
    btnShow () {
      if (this.tables[0] && (this.tables[0].homeRows || this.tables[0].aWayRows) && this.tables[0].rows) {
        return true
      }
      return false
    },
    stagesIndex () {
      const { stages } = this
      const { stagesIndex } = this.info
      if (stagesIndex !== undefined) {
        return stagesIndex
      }
      if (stages.length > 0) {
        let i = 0
        stages.map((item, index) => {
          if (item.isCurrent) {
            i = index
          }
        })
        return i
      }
      return null
    },
    stagesSubIndex () {
      const { stagesSubIndex } = this.info
      if (stagesSubIndex !== undefined) {
        return stagesSubIndex
      }
      return null
    },
    currentStages () {
      const { stages, stagesIndex, stagesSubIndex } = this
      let str = null
      if (stages[stagesIndex]) {
        str = stages[stagesIndex].name
        if (stages[stagesIndex].roundList && stages[stagesIndex].roundList[stagesSubIndex]) {
          str += ' ' + stages[stagesIndex].roundList[stagesSubIndex].name
        }
      }
      return str
    },
    promotions () {
      const promotions = this.info && this.info.data && this.info.data.promotions
      const obj = {}
      let upIndex = 0
      let downIndex = 0
      if (promotions) {
        promotions.map(item => {
          if (item.type === 1) {
            item.class = `up-${upIndex++}`
          }
          if (item.type === 2) {
            item.class = `down-${downIndex++}`
          }
          obj[item.id] = item
        })
      }
      return obj
    },
    noData () {
      if (!this.loading && (!this.info.data || this.list.length < 1)) {
        return true
      }
      return false
    }
  },
  components: {
    FootballRank,
    BasketballRank,
    LeagueSchedule,
    FootballPlayerRank,
    BasketballPlayerRank
  },
  watch: {
    list: {
      deep: true,
      handler () {
        this.$nextTick(() => {
          setTimeout(() => {
            this.scrollTop = this.getScrollTop()
          }, 0)
        })
      }
    },
    pickerVisible (val) {
      if (val && this.stages.length > 1) {
        this.$bus.$emit('picker-show', val)
      }
    }
  },
  created () {
    this.$bus.$on('picker-visible-change', val => {
      this.pickerVisible = val
    })
  },
  methods: {
    domScroll (target) {
      this.scrollTop = this.getScrollTop()
      this.$bus.$emit('element-scroll', this.scrollTop)
    },
    playerScroll () {
      this.$bus.$emit('element-scroll', this.getScrollTop())
    },
    showPicker () {
      if (this.stages.length > 1) {
        this.$bus.$emit('picker-show', true)
      }
    },
    rangeChane (i) {
      this.rangeType = i
    },
    getScrollElement () {
      let $el = null
      const { navIndex, classifyIndex } = this
      if (classifyIndex === 0 && this.$refs.standing) {
        $el = this.$refs.standing
      }
      if (classifyIndex === 1 && this.$refs.schedule) {
        $el = this.$refs.schedule
      }
      if (navIndex === 1 && (classifyIndex === 2 || classifyIndex === 3) && this.$refs.footballPlayer) {
        $el = this.$refs.footballPlayer
      }
      if (navIndex === 2 && classifyIndex === 2 && this.$refs.basketballPlayer) {
        $el = this.$refs.basketballPlayer
      }
      return $el
    },
    scrollTo () {
      const $el = this.getScrollElement()
      const position = this.info.position || 0
      this.scrollTop = position
      if ($el) {
        if (this.navIndex === 2 && this.classifyIndex === 2) {
          $el.scroll(position)
        } else {
          $el.scrollTop = position
        }
      }
    },
    getScrollTop () {
      const $el = this.getScrollElement()
      if ($el) {
        if (this.navIndex === 2 && this.classifyIndex === 2) {
          return $el.getScrollTop()
        } else {
          return $el.scrollTop
        }
      }
      return 0
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/style/mixin.scss';
.rank-data-type {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  transform: translate3d(0, 0, 0);
  &__picker {
    flex-shrink: 0;
    padding: 0 34rpx 26rpx;
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    height: 50rpx;
    &.line {
      border-bottom: 1rpx solid #eee;
    }
    &--content {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 72rpx;
      border-radius: 6rpx;
      transform: translateZ(0);
      background: #FBFBFC;
      flex: 1;
      &.bg-white{
        background: #fff;
        padding-left: 5rpx;
        justify-content: left;
      }
      view {
        font-size: 32rpx;
        font-weight: bold;
      }
      .icon {
        margin-left: 9rpx;
        width: 14rpx;
        height: 12rpx;
      }
    }
    &--switchbtn {
      width: 258rpx;
      height: 44rpx;
      background: #fff;
      z-index: 10;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #ff2222;
      border-radius: 22rpx;
      overflow: hidden;
      transform: translateZ(0);
      view {
        width: 86rpx;
        height: 44rpx;
        color: #ff2222;
        text-align: center;
        line-height: 44rpx;
        font-size: 24rpx;
        cursor: pointer;
        &.active {
          color: #fff;
          background: #f22222;
        }
      }
      view + view {
        border-left: 1rpx solid #f22;
      }
    }
  }
  &__standing {
    position: relative;
    flex: auto;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    background: #fff;
    transform: translateZ(0);
    &.prevent {
      pointer-events: none;
      touch-action: none;
    }
    &--mouduls {
      background: #fff;
      padding:  30rpx;
      position: relative;
      font-size: 24rpx;
      &.separate {
        margin-top: 16rpx;
        &:before {
          content: '';
          position: absolute;
          height: 16rpx;
          width: 100%;
          left: 0;
          top: -16rpx;
          background: #f3f5f7;
        }
      }
    }
    &--group {
      padding-bottom: 28rpx;
      line-height: 44rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      position: relative;
      margin-bottom: 30rpx;
      &:before {
        content:"";
        position: absolute;
        left: -30rpx;
        bottom: 0;
        border-bottom: 1rpx solid #eee;
        width: 750rpx;
        left: -30rpx;
      }
      &.schedule {
        margin-bottom: 0;
      }
      &.basketball {
        font-size: 28rpx;
      }
    }
  }
  &__player {
    position: relative;
    padding: 0 30rpx;
    flex: auto;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  &__player--basketball {
    position: relative;
    flex: auto;
    padding: 0 30rpx;
    height: 100%;
    overflow: hidden;
  }
  &__placeholder {
    position: relative;
    flex: auto;
    height: 100%;
  }
}
</style>
