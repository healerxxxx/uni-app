<template>
  <view class="player-info">
    <image class="player-info__bg" src="/static/icon-team-bg.svg" />
    <nav-bar
      transparent
      :style="isScroll ? 'background: #333;' : ''"
      @back="back">
      <text v-if="isScroll && baseInfo">{{baseInfo.playerNameZh ? baseInfo.playerNameZh : baseInfo.playerNameEn}}</text>
    </nav-bar>
    <view class="player-info__content">
      <scroll-view
        class="player-info__scroll"
        @scroll="e => {isScroll = e.detail.scrollTop > statusBarHeight + customBar}"
        scroll-y="true">
        <view class="player-info__head" v-if="baseInfo">
          <view class="top">
            <view class="avatar">
              <image :src="baseInfo.playerLogo + '?imageView&thumbnail=137y137&quality=85'" v-if="baseInfo.playerLogo" />
              <image src="https://relottery.ws.126.net/thread/20191115/oWbNQe.png" v-else />
            </view>
            <view class="right-info">
              <text class="name">
                {{baseInfo.playerNameZh ? baseInfo.playerNameZh : baseInfo.playerNameEn}}
              </text>
              <text v-if="baseInfo.playerNameEn && baseInfo.playerNameZh !== baseInfo.playerNameEn"
                :class="{'en-name':baseInfo.playerNameZh.length > 8}">
                {{baseInfo.playerNameZh.length > 11 ? '' : baseInfo.playerNameEn }}
              </text>
            </view>
            <view class="bottom-info">
              <text class="num" v-if="categoryId === 1">{{baseInfo.shirtNumber ? baseInfo.shirtNumber : '- '}}号</text>
              <text class="num" v-if="categoryId === 2">{{baseInfo.shirtNumber}}号</text>
              <text class="location">{{baseInfo.position ? baseInfo.position : '- '}}</text>
              <text class="group">{{baseInfo.teamName ? baseInfo.teamName : '- '}}</text>
              <view class="country" v-if="baseInfo.country">
                <image :src="baseInfo.countryLogo" v-if="baseInfo.countryLogo" />
                {{baseInfo.country}}
              </view>
              <view class="country" v-if="baseInfo.city">
                <image :src="baseInfo.countryLogo" v-if="baseInfo.countryLogo" />
                {{baseInfo.city}}
              </view>
            </view>
          </view>
          <view class="bottom">
            <view>
              <text>{{baseInfo.birthday ? baseInfo.birthday : '-'}}</text>
              <text class="des">出生日期</text>
            </view>
            <view>
              <text>{{baseInfo.age ? baseInfo.age : '- '}}岁</text>
              <text class="des">年龄</text>
            </view>
            <view>
              <text>{{baseInfo.height ? baseInfo.height : '- '}}cm</text>
              <text class="des">身高</text>
            </view>
            <view>
              <text>{{baseInfo.weight ? baseInfo.weight : '- '}}kg</text>
              <text class="des">体重</text>
            </view>
          </view>
        </view>
        <view class="player-info__stats" v-if="info">
          <football
            :info="info"
            v-if="categoryId === 1 && info.matches" />
          <basketball
            :info="info"
            v-if="categoryId === 2 && info.latestSeasonStats && info.latestSeasonStats.court" />
          <no-data
            v-if="noSeasonData"
            icon="icon-no-data-list"
            text="暂无数据" />
        </view>
        <loading-data v-if="loading" />
        <no-data v-if="noData" text="暂无数据" />
      </scroll-view>
    </view>
  </view>
</template>
<script>
import Football from './components/football'
import Basketball from './components/basketball'
import { football, basketball } from '../../utils/api/playerInfo'
import { mapGetters } from 'vuex'
export default {
  name: 'PlayerInfo',
  data () {
    return {
      categoryId: 1,
      loading: false,
      info: null,
      baseInfo: null,
      isScroll: false,
      noData: false
    }
  },
  components: {
    Football,
    Basketball
	},
	onLoad (optiaon){
    this.categoryId = parseInt(optiaon.categoryId)
    this.getData(optiaon.playerId, this.categoryId)
  },
  computed: {
		 ...mapGetters(['statusBarHeight', 'customBar']),
    noSeasonData () {
      const { categoryId } = this
      let _noSeasonData = false
      if (categoryId === 1) {
        this.info && this.info.matches ? _noSeasonData = false : _noSeasonData = true
      }
      if (categoryId === 2) {
        this.info && this.info.latestSeasonStats && this.info.latestSeasonStats.court ? _noSeasonData = false : _noSeasonData = true
      }
      return _noSeasonData
    }
  },
  methods: {
    back () {
      uni.navigateBack()      
    },
    getData (playerId, categoryId) {
      const url = categoryId === 1 ? football : basketball
      if (this.loading) return
      this.loading = true
      this.$service(url, {
        data: {
          playerId: playerId
        }
      }).then((res) => {
        if (res.code === 200) {
          this.info = res.data
          this.baseInfo = categoryId === 1 ? res.data : res.data.latestSeasonStats
        }
      }).finally(() => {
        this.loading = false
        this.noData = !this.info || Object.keys(this.info).length === 0
      })
    }
  }
}
</script>

<style lang="scss" >
@import "@/assets/style/mixin.scss";
.player-info {
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  &__bg {
    width: 750rpx;
    height: 444rpx;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  &__content {
    height: 80vh;
    flex: auto;
    position: relative;
  }
  &__scroll {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  &__head {
    color: #999;
    height: 304rpx;
    position: relative;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .top {
      position: absolute;
      left: 54rpx;
      top: 0;
      width: 700rpx;
      .right-info {
        display: inline-block;
        position: absolute;
        left: 118rpx;
        bottom: 50rpx;
        height: 36rpx;
      }
      text {
        display: inline-block;
        white-space: nowrap;
      }
      .avatar {
        height: 100rpx;
        width: 100rpx;
        border-radius: 100%;
        display: inline-block;
        font-size: 0;
        image {
          display: inline-block;
          background: #d8d8d8;
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }
      }
      .name {
        font-size: 36rpx;
        color: #fff;
        font-weight: bold;
        padding: 0 10rpx 0 0rpx;
      }
      .en-name {
        width: 150rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .country {
        display: flex;
        align-items: center;
        image {
          width: 36rpx;
          height: 24rpx;
          margin-right: 10rpx;
          margin-left: 2rpx;
        }
      }
      .bottom-info {
        position: absolute;
        display: inline-block;
        left: 118rpx;
        bottom: 4rpx;
        text {
          padding: 0 13rpx;
          float: left;
          &.num {
            padding: 0 10rpx 0 0.01rem;
          }
        }
        text + text {
          position: relative;
          &::before {
            content: '';
            height: 20rpx;
            position: absolute;
            left: 0;
            bottom: 0;
						top: 25% !important;
						border-left: 1rpx solid #666;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      left: 54rpx;
      bottom: 40rpx;
      view {
        list-style: none;
        float: left;
        position: relative;
        &:not(:last-child) {
          padding-right: 46rpx;
        }
        text {
          line-height: 40rpx;
          font-size: 28rpx;
          color: #fff;
        }
        .des {
          margin-top: 6rpx;
          font-size: 24rpx;
          color: #999999;
          display: block;
          text-align: center;
          line-height: 34rpx;
        }
      }
      view + view {
        padding-left: 46rpx;
        &:before {
          content: '';
          position: absolute;
          left: 0;
          height: 52rpx;
					top: 20% !important;
					border-left: 1rpx solid #666;
        }
      }
    }
  }
  &__stats {
    position: relative;
    flex: auto;
    background: #fff;
    border-radius: 16rpx 16rpx 0 0;
    padding: 30rpx 36rpx 50rpx 32rpx;
  }
}
</style>