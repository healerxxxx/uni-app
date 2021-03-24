<template>
  <view
    class="detail-report"
    @touchstart="touchStart"
    @touchmove="touchMove">
    <view class="detail-report__modules">
      <view class="h3">伤停状态</view>
      <view class="team-info" v-if="homeInjure">
        <view class="team-header">
          <view class="team-image"><img :src="homeTeam.teamIcon" @error.once="errorTeamImg" /></view>
          <view class="team-name">{{homeTeam.teamName}}</view>
        </view>
        <view class="row-head">
          <view class="row">球员</view>
          <view class="row row-2">球衣号</view>
          <view class="row row-3">位置</view>
          <view class="row row-4">状态</view>
        </view>
        <view class="row-body"
          v-for="(item, index) in homeInjure"
          :key="index"
          @click="goPlayerInfo(item.playerId)">
          <view class="row">
            <text class="span">{{item.playerName ? item.playerName.slice(0,7) : '-'}}</text>
            <text class="span icon"></text>
          </view>
          <view class="row row-basket">{{item.shirtNumber || "-"}}</view>
          <view class="row row-3">{{item.position || '-'}}</view>
          <view class="row row-4">{{item.state || '-'}}</view>
        </view>
      </view>
      <view class="team-info" v-if="guestInjure">
        <view class="team-header">
          <view class="team-image"><img :src="guestTeam.teamIcon" @error.once="errorTeamImg" /></view>
          <view class="team-name">{{guestTeam.teamName}}</view>
        </view>
        <view class="row-head">
          <view class="row">球员</view>
          <view class="row row-2">球衣号</view>
          <view class="row row-3">位置</view>
          <view class="row row-4">状态</view>
        </view>
        <view class="row-body" v-for="(item, index) in guestInjure" :key="index" @click="goPlayerInfo(item.playerId)">
          <view class="row  ">
            <text class="span">{{item.playerName ? item.playerName.slice(0,7) : '-'}}</text>
            <text class="span icon"></text>
          </view>
          <view class="row row-basket">{{item.shirtNumber || "-"}}</view>
          <view class="row row-3">{{item.position || '-'}}</view>
          <view class="row row-4">{{item.state || '-'}}</view>
        </view>
      </view>
      <view class="no-data" v-if="!homeInjure && !guestInjure">暂无数据</view>
    </view>
    <view class="detail-report__modules focus">
      <view class="h3">重点关注</view>
      <view class="team-info">
        <view class="team-header" v-if="homeTeam">
          <view class="team-image">
            <img :src="homeTeam.teamIcon" @error.once="errorTeamImg" />
          </view>
          <view class="team-name">{{homeTeam.teamName}}</view>
        </view>
        <view class="ul" v-if="homeAnalyseVo">
          <view class="li" v-for="(item, index) in homeAnalyseVo" :key="index">
            <rich-text class="p" :nodes="item.content"></rich-text>
          </view>
        </view>
        <view class="no-data" v-if="!homeAnalyseVo">暂无数据</view>
      </view>
      <view class="team-info">
        <view class="team-header" v-if="guestTeam">
          <view class="team-image">
            <img :src="guestTeam.teamIcon" @error.once="errorTeamImg" />
          </view>
          <view class="team-name">{{guestTeam.teamName}}</view>
        </view>
        <view class="ul" v-if="guestAnalyseVo">
          <view class="li" v-for="(item, index) in guestAnalyseVo" :key="index">
            <rich-text class="p" :nodes="item.content"></rich-text>
          </view>
        </view>
        <view class="no-data" v-if="!guestAnalyseVo">暂无数据</view>
      </view>
      <view class="team-info" v-if="info && info.lotteryCategoryId === 2">
        <view class="team-header meeting" v-if="homeTeam || guestTeam">
          <view class="left">
            <view class="team-image">
              <img :src="homeTeam.teamIcon" @error.once="errorTeamImg" />
            </view>
            <view class="team-name">{{homeTeam.teamName}}</view>
          </view>
          <view class="vs">vs</view>
          <view class="right">
            <view class="team-image">
              <img :src="guestTeam.teamIcon" @error.once="errorTeamImg" />
            </view>
            <view class="team-name">{{guestTeam.teamName}}</view>
          </view>
        </view>
        <view class="ul" v-if="meetingAnalyseVo">
          <view class="li" v-for="(item, index) in meetingAnalyseVo" :key="index">
            <rich-text class="p" :nodes="item.content"></rich-text>
          </view>
        </view>
        <view class="no-data" v-if="!meetingAnalyseVo">暂无数据</view>
      </view>
    </view>
    <loading-data v-if="loading" />
    <no-data
      @move="val => $emit('move', val)"
      type="match"
      v-if="noData"
      text="`本场暂无数据" />
  </view>
</template>

<script>
import { matchDetailReport } from '@/utils/api/match-detail'
let lastY = 0
export default {
  name: 'detail-report',
  props: ['match-info-id', 'header-hidden', 'scroll-top'],
  data () {
    return {
      info: null,
      loading: false
    }
  },
  computed: {
    categoryId () {
      const { info } = this
      if (info && info.lotteryCategoryId) {
        return info.lotteryCategoryId
      }
      return 1
    },
    homeInjure () {
      const { info, categoryId } = this
      if (info && info.homeInjure && info.homeInjure.length > 0) {
        if (categoryId === 1) {
          return info.homeInjure || null
        }
        if (categoryId === 2) {
          return info.guestInjure || null
        }
      }
      return null
    },
    guestInjure () {
      const { info, categoryId } = this
      if (info && info.guestInjure && info.guestInjure.length > 0) {
        if (categoryId === 1) {
          return info.guestInjure || null
        }
        if (categoryId === 2) {
          return info.homeInjure || null
        }
      }
      return null
    },
    homeAnalyseVo () {
      const { info, categoryId } = this
      if (info && info.homeAnalyseVo && info.homeAnalyseVo.length > 0) {
        if (categoryId === 1) {
          return info.homeAnalyseVo || null
        }
        if (categoryId === 2) {
          return info.guestAnalyseVo || null
        }
      }
      return null
    },
    guestAnalyseVo () {
      const { info, categoryId } = this
      if (info && info.guestAnalyseVo && info.guestAnalyseVo.length > 0) {
        if (categoryId === 1) {
          return info.guestAnalyseVo || null
        }
        if (categoryId === 2) {
          return info.homeAnalyseVo || null
        }
      }
      return null
    },
    meetingAnalyseVo () {
      const { info } = this
      if (info && info.meetingAnalyseVo && info.meetingAnalyseVo.length > 0) {
        return info.meetingAnalyseVo
      }
      return null
    },
    guestTeam () {
      const { info, categoryId } = this
      if (info) {
        if (categoryId === 1) {
          return info.guestTeam || null
        }
        if (categoryId === 2) {
          return info.homeTeam || null
        }
      }
      return null
    },
    homeTeam () {
      const { info, categoryId } = this
      if (info) {
        if (categoryId === 1) {
          return info.homeTeam || null
        }
        if (categoryId === 2) {
          return info.guestTeam || null
        }
      }
      return null
    },
    noData () {
      if (!this.info || JSON.stringify(this.info) === '{}' || (!this.homeInjure && this.guestInjure && this.homeAnalyseVo && this.guestAnalyseVo && this.meetingAnalyseVo)) {
        return true
      }
      return false
    }
  },
  created () {
    this.getReportData()
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
    errorTeamImg (e) {
      e.target.src = 'https://relottery.ws.126.net/thread/20191012/H2fpJg.png'
    },
    getReportData () {
      if (this.loading) return
      this.loading = true
      this.$service(matchDetailReport, {
        urlParams: {
          matchInfoId: this.matchInfoId
        }
      }).then((res) => {
        if (res.code === 200) {
          this.info = res.data
        }
      }).finally(() => {
        this.loading = false
      })
    },
    goPlayerInfo (id) {
      uni.navigateTo({
        url: `/pages/player/index?categoryId=${this.categoryId}&playerId=${id}`
      })
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/style/mixin.scss";
.detail-report {
  background: #f3f5f7;
  position: relative;
  min-height: 100%;
  .red {
    color: #ff2222;
  }
  .blue {
    color: #65afff;
  }
  &__modules {
    background: #fff;
    .h3 {
      padding: 0 32rpx;
      height: 110rpx;
      line-height: 110rpx;
      font-size: 32rpx;
      color: #333333;
      position: relative;
      font-weight: bold;
      border-bottom: 1rpx solid #eee;
    }
    .team-info {
      position: relative;
      padding: 32rpx 32rpx 0;
    }
    .team-info + .team-info {
      padding-top: 60rpx;
    }
    .team-image {
      height: 50rpx;
      width: 50rpx;
      padding: 2rpx;
      background: #d8d8d8;
      border-radius: 100%;
      font-size: 0;
      display: inline-block;
      vertical-align: middle;
      img {
        display: inline-block;
        background: #fff;
        width: 100%;
        height: 100%;
        border-radius: 100%;
        vertical-align: baseline;
      }
    }
    .team-name {
      display: inline-block;
      padding-left: 28rpx;
      line-height: 1;
      font-size: 28rpx;
      vertical-align: middle;
      font-weight: bold;
    }
    .team-header {
      margin-bottom: 24rpx;
    }
    .row-head, .row-body {
      padding-left: 34rpx;
      line-height: 60rpx;
      color: #999;
      background: #fafafb;
      overflow: hidden;
    }
    .row-body {
      // padding: 22rpx 28rpx 22rpx 32rpx;
      line-height: 1.2;
      position: relative;
      height: 92rpx;
      line-height: 92rpx;
      color: #333;
      background: #fff;
      // &:not(:last-child) {
      //   &::after {
      //     @include one-rpx-x(#ebebeb, bottom);
      //   }
      // }
    }
    .row {
      float: left;
      width: 186rpx;
      text-align: left;
      .span {
        vertical-align: middle;
      }
      .icon {
        width: 12rpx;
        height: 14rpx;
        display: inline-block;
        margin-left: 8rpx;
        @include bg-image("/static/match-detail/icon-arrows-right-player.png");
      }
    }
    .row-basket {
      width: 124rpx;
      padding-left: 16rpx;
    }
    .row-2 {
      width: 140rpx;
    }
    .row-3 {
      width: 116rpx;
    }
    .row-4 {
      width: 210rpx;
    }
    .no-data {
      font-size: 28rpx;
      color: #bbb;
      text-align: center;
      line-height: 1;
      padding: 76rpx 0 78rpx;
    }
    &.focus {
      margin-top: 16rpx;
      padding-bottom: 32rpx;
      .team-info {
        margin: 32rpx 32rpx 0;
        border-radius: 6rpx;
        padding: 0 !important;
        border: 1px solid #ebebeb;
      }
      .team-header {
        position: relative;
        padding-left: 26rpx;
        line-height: 96rpx;
        height: 96rpx;
        background: #f9fafb;
        font-size: 0;
        border-radius: 6rpx;
        margin: 0;
        &.meeting {
          padding-left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          .team-name {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            max-width: 220rpx;
          }
        }
        .left, .right {
          width: 320rpx;
          display: inline-block;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .team-image {
        margin-left: 0;
      }
      .team-name {
        padding: 0 10rpx 0 18rpx;
        line-height: 96rpx;
      }
      .ul {
        padding: 20rpx 32rpx;
        .li {
          position: relative;
          padding-bottom: 24rpx;
          &:before {
            content: "";
            width: 6rpx;
            height: 6rpx;
            border-radius: 100%;
            background: #d8d8d8;
            position: absolute;
            top: 17rpx;
          }
          .p {
            display: inline-block;
            font-size: 28rpx;
            color: #333;
            font-family: $PFR;
            line-height: 40rpx;
            margin-left: 26rpx;
          }
        }
      }
      .vs {
        font-size: 40rpx;
        display: inline-block;
        color: #333;
        font-family: "alternategothicno2bt";
        font-weight: bold;
        padding: 0 10rpx;
      }
    }
  }
}
</style>
