<template>
  <view class="team-info" >
    <image class="team-info__bg" src="/static/icon-team-bg.svg" />
    <nav-bar
      :transparent="!error"
      @back="back">
      <text v-if="headerHidden && teamData">{{teamData.teamName}}</text>
    </nav-bar>
    <view
      class="team-info__content"
      :class="{'show': teamData || error}">
      <view class="team-info__content--main"
        :style="{
          height: contentHeight && headerHeight ? `${contentHeight + headerHeight}px` : '100%',
          transform: `translate3d(0, ${headerHidden && headerHeight ? 0 - headerHeight : 0}px, 0)`
        }">
        <view
          class="team-info__head"
          @touchstart="touchStart"
          @touchmove="touchMove">
          <view class="team-info__head--info" v-if="teamData">
            <view class="avatar">
              <image src="https://relottery.ws.126.net/thread/20191012/H2fpJg.png" v-if="!teamData.teamIcon"></image>
              <image v-else :src="/relottery|(126.net)/.test(teamData.teamIcon) ? teamData.teamIcon + '?imageView&thumbnail=54y54&quality=85' : teamData.teamIcon">
            </view>
            <view class="other">
              <view class="name">{{teamData.teamName}}</view>
              <view class="b_other">
                <view class="country" v-if="teamData.country">
                <image :src="teamData.countryLog"
                  v-if="teamData.countryLog" />{{teamData.country}}</view>
                <view class="match" v-if="teamData.leagueMatch">{{teamData.leagueMatch}}</view>
              </view>
            </view>
          </view>
          <view class="team-info__tab" :class="{'fixed-border': headerHidden}">
            <view class="team-info__tab--item" :class="{'current': navIndex === 0}" @click="navChange(0)">资料</view>
            <view class="team-info__tab--item" :class="{'current': navIndex === 1}" @click="navChange(1)">赛程</view>
          </view>
        </view>
        <swiper
          class="team-info__swiper"
          v-if="teamData"
          :current="navIndex"
          duration="300"
          @change="swiperChange"
          :class="{'animate': animate}">
          <swiper-item>
            <scroll-view
              class="team-info__swiper--item info"
              @scroll="swiperItemScroll"
              scroll-y="true">
              <view
                class="team-info__scroll"
                @touchstart="scrollTouchStart"
                @touchmove="scrollTouchMove">
                <view class="team-info__modules" v-if="teamData.lotteryCategoryId === 1">
                  <view class="title">球队资料</view>
                  <view class="information">
                    <view class="des">主教练</view>
                    <view class="content">{{teamData.managerName || '-' }}</view>
                  </view>
                  <view class="information">
                    <view class="des">球场</view>
                    <view class="content">{{teamData.venueName || '-' }}</view>
                  </view>
                  <view class="information">
                    <view class="des">球场容量</view>
                    <view class="content">{{teamData.capacity ? teamData.capacity + '观众' : '-' }}</view>
                  </view>
                </view>
                <view class="team-info__modules">
                  <view class="title">球队阵容</view>
                  <template v-for="(item,index) in lineupList">
                    <view
                      class="player-info"
                      v-if="lineupList[index].length > 0"
                      :key="index">
                      <view class="title">{{item[0].position === '未知' ? '其他': item[0].position}}</view>
                      <view class="head">
                        <view class="player"><view>球员</view></view>
                        <view class="number"><view>球衣号</view></view>
                      </view>
                      <view
                        class="detail"
                        v-for="(_item,_index) in lineupList[index]" :key="_index"
                        @click="toPlayerInfo(_item.playerId,teamData.lotteryCategoryId)">
                        <view class="player">
                          <image v-if="!_item.playerLogo" src="https://relottery.ws.126.net/thread/20191115/oWbNQe.png"/>
                          <image :src="_item.playerLogo + '?imageView&thumbnail=54y54&quality=85'" v-else>
                          <view class="name">{{_item.playerName}}</view>
                        </view>
                        <view class="number" v-if="_item.shirtNumber || _item.shirtNumber ===0 ">{{_item.shirtNumber}}</view>
                        <view class="number" v-else>-</view>
                      </view>
                    </view>
                  </template>
                  <no-data
                    v-if="noLineup"
                    icon="icon-no-data-list"
                    text="暂无信息" />
                </view>
              </view>
            </scroll-view>
          </swiper-item>
          <swiper-item>
            <scroll-view
              class="team-info__swiper--item info"
              @scroll="swiperItemScroll"
              scroll-y="true">
              <view
                class="team-info__scroll"
                @touchstart="scrollTouchStart"
                @touchmove="scrollTouchMove">
                <view class="team-info__modules" :style="{'padding':' 0 32rpx 30rpx'}">
                  <view class="h3">
                    <text class="course">近期赛程</text>
                    <text class="tip">(近十场)</text>
                    <view class="switch-button">
                      <view class="b" :class="{'active': rangeType === 0}" @click="rangeType = 0">
                        <view class="i">总</view>
                      </view>
                      <view class="b" :class="{'active': rangeType === 1}" @click="rangeType = 1">
                        <view class="i">主场</view>
                      </view>
                      <view class="b" :class="{'active': rangeType === 2}" @click="rangeType = 2">
                        <view class="i">客场</view>
                      </view>
                    </view>
                  </view>
                  <match-form
                    v-if="recentList.length > 0"
                    type="match"
                    :list="recentList"
                    :category="teamData.lotteryCategoryId"
                    :teamId="teamData.teamId" />
                  <view
                    v-else
                    class="no-data">
                    <text>暂无数据</text>
                  </view>
                </view>
                <view class="team-info__modules" :style="{'padding':' 0 32rpx 30rpx'}">
                  <view class="h3">
                    <text class="course">未来赛程</text>
                    <text class="tip">(近五场)</text>
                  </view>
                  <match-form
                    v-if="featureList.length > 0"
                    type="futuer"
                    :list="featureList"
                    :category="teamData.lotteryCategoryId"
                    :teamId="teamData.teamId" />
                  <view
                    v-else
                    class="no-data">
                    <text>暂无数据</text>
                  </view>
                </view>
              </view>
            </scroll-view>
          </swiper-item>
        </swiper>
      </view>
    </view>
    <loading-data v-if="loading" />
    <error
      v-if="error"
      btn-text="点击重试"
      @btn-click="getData" />
  </view>
</template>

<script>
import { data, match } from '../../utils/api/team'
import MatchForm from './components/match-form'
let queryDom
let lastY = 0
let scrollLastY = 0
export default {
  name: 'TeamInfo',
  data () {
    return {
      teamId: null,
      loading: false,
      error: false,
      teamData: null,
      matchList: null,
      navIndex: 0,
      rangeType: 0,
      contentHeight: 0,
      headerHeight: 0,
      headerHidden: false,
      scrollTop: {
        0: 0,
        1: 0
      }
    }
  },
  onLoad (option) {
    this.teamId = option.teamId
    this.getData()
    this.getMatch()
  },
  onShareAppMessage (res) {
    return {
      title: this.teamData && this.teamData.teamName ? this.teamData.teamName + '资料' : '网易欧洲杯',
    }
  },
  created () {
    queryDom = uni.createSelectorQuery().in(this)
  },
  mounted () {
    // 获取除导航之外整体页面的高度
    queryDom && queryDom.select('.team-info__content').boundingClientRect(data => {
      this.contentHeight = data.height
    }).exec()
  },
  watch:{
    teamData (val) {
      if (val && !this.headerHeight) {
        this.$nextTick(() => {
          // 获取顶部比赛信息头部高度
          queryDom && queryDom.select('.team-info__head--info').boundingClientRect(data => {
            this.headerHeight = data.height
          }).exec()
        })
      }
    }
  },
  components: {
    MatchForm
  },
  computed: {
    featureList () {
      const { matchList } = this
      return (matchList && matchList.featureMatchList) || []
    },
    lineupList () {
      const { teamData } = this
      if (teamData && teamData.playerList && teamData.playerList.length > 0) {
        const list = [[], [], [], [], [], [], [], []]
        const { lotteryCategoryId: id } = teamData
        teamData.playerList.map(item => {
          if (item.position === '前锋') {
            list[0].push(item)
            list[0]['position'] = '前锋'
          }
          if (item.position === '中场' || item.position === '小前锋') {
            list[1].push(item)
            list[1].position = id === 1 ? '中场' : '小前锋'
          }
          if (item.position === '后卫') {
            list[2].push(item)
            list[2].position = '后卫'
          }
          if (item.position === '守门员' || item.position === '大前锋') {
            list[3].push(item)
            list[3].position = id === 1 ? '守门员' : '大前锋'
          }
          if (item.position === '中锋') {
            list[4].push(item)
            list[4].position = '中锋'
          }
          if (item.position === '得分后卫') {
            list[5].push(item)
            list[5].position = '得分后卫'
          }
          if (item.position === '组织后卫') {
            list[6].push(item)
            list[6].position = '组织后卫'
          }
          if (item.position === '未知') {
            list[7].push(item)
            list[7].position = '其他'
          }
        })
        return list
      }
      return []
    },
    noLineup () {
      const { teamData } = this
      return !(teamData && teamData.playerList && teamData.playerList.length > 0)
    },
    recentList () {
      const { matchList } = this
      const i = this.rangeType
      if (matchList) {
        if (i === 0) {
          return this.matchList.allMatchList
        }
        if (i === 1) {
          return this.matchList.teamMatchList
        }
        if (i === 2) {
          return this.matchList.teamGuestMatchList
        }
      }
      return []
    }
  },
  methods: {
    back () {
      const route = getCurrentPages()
      if (route.length > 1) {
        uni.navigateBack({ delta: 1 })
      } else {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }
    },
    swiperItemScroll (e) {
      const { navIndex } = this
      this.scrollTop[navIndex] = e.detail.scrollTop
    },
    toPlayerInfo (id, categoryId) {
      uni.navigateTo({
        url: `/pages/player/index?categoryId=${categoryId}&playerId=${id}`
      })
    },
    navChange (i) {
      if (this.navIndex !== i) {
        this.navIndex = i
      }
    },
    swiperChange (e) {
      this.navIndex = e.target.current
    },
    getData () {
      if (this.loading) return
      this.loading = true
      this.error = false
      this.$service(data, {
        urlParams: {
          teamId: this.teamId
        }
      }).then((res) => {
        if (res.code === 200) {
          this.teamData = res.data
        } else {
          this.error = true
        }
      }).catch(err => {
        if (err) {
          this.error = true
        }
      }).finally(() => {
        this.loading = false
      })
    },
    getMatch () {
      this.error = false
      this.$service(match, {
        urlParams: {
          teamId: this.teamId
        }
      }).then((res) => {
        if (res.code === 200) {
          this.matchList = res.data
        }
      })
    },
    touchStart (e) {
			const pageY = e && e.touches && e.touches[0].pageY
			pageY && (lastY = pageY)
		},
    touchMove (e) {
      const pageY = e && e.touches && e.touches[0].pageY
      if (pageY) {
        if (pageY - lastY > 0) {
          this.headerHidden = false
        } else {
          this.headerHidden = true
        }
      }
    },
    scrollTouchStart (e) {
      const pageY = e && e.touches && e.touches[0].pageY
      pageY && (scrollLastY = pageY)
    },
    scrollTouchMove (e) {
      const pageY = e && e.touches && e.touches[0].pageY
      if (pageY) {
        if (pageY - scrollLastY > 0) {
          const scrollTop = this.scrollTop[this.navIndex]
          if (scrollTop <= 10 && this.headerHidden) {
            this.$emit('move', 'down')
            this.headerHidden = false
          }
        } else {
          if (!this.headerHidden) {
            this.headerHidden = true
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.team-info {
  height: 100vh;
  width: 750rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  font-size: 24rpx;
  &__bg{
    width: 750rpx;
    height: 444rpx;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  &__head {
    flex-shrink: 0;
    &--info{
      position: relative;
      height: 220rpx;
      padding: 20rpx;
      z-index: 1;
      display: flex;
    }
    .avatar {
      position: absolute;
      height: 100rpx;
      width: 100rpx;
      border-radius: 100%;
      left: 54rpx;
      bottom: 78rpx;
      image {
        display: inline-block;
        background: #d8d8d8;
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }
    .other {
      position: absolute;
      left: 170rpx;
      bottom: 78rpx;
      width: 580rpx;
      color: #fff;
      .name {
        width: 580rpx;
        font-size: 36rpx;
        line-height: 50rpx;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .b_other {
        width: 580rpx;
        height: 24rpx;
        line-height: 24rpx;
        padding-top: 16rpx;
        padding-bottom: 6rpx;
        .country {
          display: flex;
          align-items: center;
          padding-left: 0;
          image {
            display: inline-block;
            vertical-align: middle;
            width: 36rpx;
            height: 24rpx;
            margin-right: 10rpx;
            margin-left: 1px;
          }
        }
        view {
          white-space: nowrap;
          font-size: 24rpx;
          padding: 0 13rpx;
          float: left;
        }
        view {
          position: relative;
          &:not(:last-child) {
					  border-right: 1rpx solid #666;
          }
        }
      }
    }
  }
  &__content {
    flex: auto;
    position: relative;
    overflow: hidden;
    z-index: 1;
    visibility: hidden;
    &.show {
      visibility: inherit;
    }
    &--main {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      transition: transform .1s linear;
    }
  }
  &__tab {
    position: relative;
    flex-shrink: 0;
    width: 750rpx;
    height: 88rpx;
    background: #fff;
    border-radius: 16rpx 16rpx 0 0;
    transform: translateZ(0);
    display: flex;
    flex-direction: row;
		justify-content: center;
    border-bottom: 1rpx solid #eee;
    &--item {
      height: 42rpx;
      line-height: 42rpx;
      padding: 20rpx 84rpx 26rpx;
      font-size: 30rpx;
      color: #333333;
      position: relative;
      &.current {
        color: #ff2222;
        &::after {
          content: "";
          position: absolute;
          bottom: -1rpx;
          left: 50%;
          height: 6rpx;
          width: 56rpx;
          margin-left: -28rpx;
          background: #ff2222;
          z-index: 2;
        }
      }
    }
  }
  &__swiper {
    flex: auto;
    position: relative;
    background: #fff;
    &--item {
      width: 100%;
      height: 100%;
      position: relative;
    }
  }
  &__scroll {
    position: relative;
    min-height: 100%;
  }
  &__modules {
    position: relative;
    padding: 0 32rpx 15rpx;
    overflow: hidden;;
    &::after {
      content: "";
      position: absolute;
      height: 16rpx;
      width: 100%;
      left: 0;
      top: -16rpx;
      background: #f3f5f7;
    }
    .title {
      width: 100%;
      padding: 0 32rpx;
      margin-left: -32rpx;
      position: relative;
      height: 100rpx;
      line-height: 100rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
      border-bottom: 1rpx solid #eee;
    }
    .h3 {
      padding: 38rpx 0;
      position: relative;
      display: flex;
      align-items: center;
      .course {
        font-size: 32rpx;
        color: #333;
        font-weight: bold;
      }
      .tip {
        color: #666666;
        font-weight: normal;
        margin-left: 10rpx;
      }
      .switch-button {
        position: absolute;
        width: 258rpx;
        height: 44rpx;
        top: 50%;
        right: 0;
        background: #fff;
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        transform: translate3d(0, -50%, 0);
        border: 1px solid #f22;
        border-radius: 22rpx;
        .b {
          width: 33.333333%;
          height: 100%;
          color: #f22;
          position: relative;
          z-index: 1;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          &.active {
            color: #fff;
            background: #f22222;
          }
          .i {
            line-height: 1;
          }
        }
        .b + .b {
          border-left: 1rpx solid #f22;
        }
      }
    }
    .information {
      line-height: 90rpx;
      padding: 0 24rpx;
      border-bottom: 1rpx solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:last-child {
        border-bottom: none;
      }
      .des {
        color: #999;
      }
      .content {
        color: #333;
        font-weight: bold;
      }
    }
    .player-info {
      padding-bottom: 14rpx;
      .title {
        line-height: 90rpx;
        text-align: center;
        font-size: 28rpx;
        font-weight: bold;
        color: #555;
        border: none;
      }
      .head {
        padding: 0 24rpx 0 134rpx;
        border-radius: 6rpx;
        display: flex;
        line-height: 60rpx;
        color: #999;
        background: #f9fafb;
        view {
          display: inline-block;
          transform: scale(0.92) translateZ(0);
          transform-origin: 0 50%;
        }
      }
      .player {
        flex: auto;
        text-align: left;
      }
      .number {
        flex-shrink: 0;
        width: 72rpx;
        text-align: center;
      }
      .detail {
        display: flex;
        padding: 0 24rpx;
        line-height: 90rpx;
        color: #333;
        border-bottom: 1rpx solid #eee;
        &:last-child {
          border: none;
        }
        .player {
          padding-left: 30rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          image {
            width: 36rpx;
            height: 36rpx;
            border-radius: 100%;
            vertical-align: text-bottom;
          }
          .name {
            color: #4a4a4a;
            vertical-align: middle;
            padding-left: 6rpx;
            display: inline;
          }
        }
      }
    }
  }
  .team-info__modules + .team-info__modules {
    margin-top: 16rpx;
    &::after {
      content: "";
      position: absolute;
      height: 16rpx;
      width: 100%;
      left: 0;
      top: -16rpx;
      background: #f3f5f7;
    }
  }
}
</style>
