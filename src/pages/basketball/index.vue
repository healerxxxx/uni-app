<template>
	<view class="basketball-list">
		<nav-bar :is-back="false">
      <image
        v-if="navTab === 1"
        class="nav-filter"
        @click="toFilter"
        src="/static/icon-filter.svg"></image>
      <view class="nav-tab">
        <view
          class="li"
          :class="{'current': navTab === 0}"
          @click="navTab = 0">
          <text>关注</text>
        </view>
        <view
          class="li"
          :class="{'current': navTab === 1}"
          @click="navTab = 1">
          <text>全部</text>
        </view>
      </view>
    </nav-bar>
    <subnav-tab
      v-show="navTab === 1"
      v-model="subnavTab"
      :day-tab="dayTab" />
    <view class="basketball-list__content">
      <!-- 关注 begin -->
      <focus-list
        v-show="navTab === 0"
        categoryId="2"
        :visible="pageVisible && navTab === 0" />
      <!-- 关注 end -->
      <swiper
        v-show="navTab === 1"
        :current="subnavTab"
        class="basketball-list__content--swiper"
        duration="300"
        @change="e => subnavTab = e.target.current">
        <swiper-item
          v-for="(item, index) in dayTab"
          :key="index">
          <match-list-item
            categoryId="2"
            :day="item.day"
            :num="item.num"
            :filter="item.filter"
            :visible="pageVisible && navTab === 1 && subnavTab === index" />
        </swiper-item>
      </swiper>
    </view>
    <user-package
      @close="setNewUserPackageVisible"
      v-if="isNewUser && newUserPackageVisible" />
	</view>
</template>

<script>
import  { matchListInitByDay } from '@/utils/tools'
import { mapGetters, mapMutations } from 'vuex'
import { matchCountByDay, leagueListyByDay } from '../../utils/api/matchlist'
import MatchListItem from '@/components/match-list/match-list-item'
import SubnavTab from '@/components/match-list/subnav-tab'
import FocusList from '@/components/match-list/focus-list'
import UserPackage from '@/components/match-list/user-package'
export default {
  data () {
    return {
      navTab: 1,
      subnavTab: 1,
      dayTab: matchListInitByDay(),
      newUserPackageVisible: true,
      pageVisible: true
    }
  },
  created () {
    this.getMatchCount()
    this.getNewUserPackageVisible()
    uni.$on('match-filter-confirm', this.filterConfirm)
  },
  onShow (options) {
    this.getNewUserPackageVisible()
    this.pageVisible = true
  },
  onHide () {
    this.pageVisible = false
  },
  onShareAppMessage (res) {
    return {
      title: '网易欧洲杯',
    }
  },
  computed: {
    ...mapGetters(['isNewUser'])
  },
  components:{
    SubnavTab,
    MatchListItem,
    FocusList,
    UserPackage
  },
  methods: {
    ...mapMutations(['setMatchFilterData']),
    getNewUserPackageVisible () {
      const hidden = uni.getStorageSync('newUserPackageHidden')
      if (hidden) {
        this.newUserPackageVisible = false
      }
    },
    setNewUserPackageVisible () {
      this.newUserPackageVisible = false
      uni.setStorageSync('newUserPackageHidden', true)
    },
    toFilter () {
      const subTab = this.subnavTab
      this.getLeagueList(subTab).then(res => {
        const filterString = JSON.stringify(res)
        this.setMatchFilterData(JSON.parse(filterString))
        uni.navigateTo({
          url: '/pages/match-filter/index?categoryId=2'
        })
      }, err => {
        err && uni.showToast({title: '加载联赛列表错误，请稍后再试', icon: 'none'})
      }).catch(error => {
        error && uni.showToast({title: '加载联赛列表错误，请稍后再试', icon: 'none'})
      })
    },
    getMatchCount () {
      this.$service(matchCountByDay, {
        urlParams: {
          categoryId: 2
        }
      }).then(res => {
        if (res.code === 200 && res.data.length > 0) {
          this.dayTab = res.data
          let i = 0
          res.data.forEach((item, index) => {
            const day = new Date(item.day.replace(/-/g, '/'))
            const now = new Date()
            const today = now.getTime() + now.getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000
            if (today > day && today - day < 24 * 60 * 60 * 1000) {
              i = index
            }
          })
          this.subnavTab = i
        } else {
          this.dayTab.forEach(item => {
            item.num = 0
          })
        }
      })
    },
    filterConfirm ({ categoryId, data }) {
      if (categoryId === 2) {
        this.dayTab[this.subnavTab].filter = data
      }
    },
    getLeagueList (subTab) {
      const subData = this.dayTab[subTab]
      if (subData.filter) {
        return Promise.resolve(subData.filter)
      }
      return this.$service(leagueListyByDay, {
        urlParams: {
          categoryId: 2
        },
        data: {
          day: subData.day
        }
      }).then(res => {
        if (res.code === 200 && res.data) {
          const { data } = res
          data.all = data.allList.map(item => {
            return item.leagueId
          })
          data.jc = data.jcList.map(item => {
            return item.leagueId
          })
          data.bj = data.bjList.map(item => {
            return item.leagueId
          })
          data.bjAndJc = data.bjAndJcList.map(item => {
            return item.leagueId
          })
          subData.filter = data
          return Promise.resolve(subData.filter)
        } else {
          return Promise.reject(new Error('获取联赛列表失败'))
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/style/mixin.scss';
.basketball-list{
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f3f5f7;
  .nav-filter{
    position: absolute;
    left: 32rpx;
    bottom: 26rpx;
    width: 40rpx;
    height: 36rpx;
  }
  .nav-tab{
    display: flex;
    justify-content: center;
    align-items: center;
    .li {
      text-align: center;
      font-size: 32rpx;
      width: 116rpx;
      height: 52rpx;
      line-height: 52rpx;
      color: rgba(255, 255, 255, .8);
      cursor: pointer;
      &.current {
        font-weight: bold;
        color: #fff;
        background: #CB1D14;
        border-radius: 52rpx;
      }
    }
  }
  &__content{
    height: 80vh;
    flex: auto;
    position: relative;
    &--swiper {
      height: 100%;
      position: relative;
    }
  }
}
</style>
