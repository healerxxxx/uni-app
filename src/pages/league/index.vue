<template>
  <view class="rank-wrapper"
    @click="seasonDropVisible = false">
    <nav-bar @back="back">
      <view class="rank__nav">
        <view class="rank__nav--title">{{navIndex === 1 ? '足球资料库' : '篮球资料库'}}</view>
        <view
          class="rank__nav--season"
          v-if="currentLeague">
          <view
            class="content"
            @click.stop="seasonDropVisible = !seasonDropVisible">
            <text class="span">{{currentLeague.seasonList[currentLeague.seasonIndex || 0].year}}</text>
            <view class="span icon"></view>
          </view>
          <drop-select
            v-model="seasonDropVisible"
            drop-style="top: 50rpx; right:0rpx"
            :list="currentLeague.seasonList"
            :disabled="currentLeague.loading"
            label="year"
            :index="currentLeague.seasonIndex || 0"
            @change="seasonChange" />
        </view>
      </view>
    </nav-bar>
    <view
      class="rank-content"
      ref="content">
      <view
        class="rank-content__main">
        <view
          class="rank-content__subnav"
          v-if="!loading && !error">
          <scroll-view
            id="league-list"
            class="scroll"
            scroll-x="true"
            :scroll-left="scrollLeft">
            <view class="ul">
              <view
                class="li"
                v-for="(item, index) in leagueList[navIndex]"
                :key="item.id"
                :class="{'current': leagueIndex === index}"
                @click="leagueChange(index)">
                <span>{{item.name}}</span>
              </view>
            </view>
          </scroll-view>
          <view
            class="rank-content__subnav--menu"
            v-if="navIndex === 1"
            @click="leagueVisible = true">
            <image src="/static/league/icon-subnav-menu.svg"/>
          </view>
        </view>
        <view
          class="rank-content__classify"
          :class="{'basketball': navIndex === 2, 'line': scrollTop > 0 && stages.length === 0}"
          v-if="!loading && !error">
          <view
            class="li"
            :class="{'rank': navIndex === 2, 'current': currentLeague.classifyIndex === 0}"
            @click="classifyChange(0)"
            >{{navIndex === 2 ? '排名' : '积分榜'}}</view>
          <view
            class="schedule li"
            :class="{'current': currentLeague.classifyIndex === 1}"
            @click="classifyChange(1)"
            >赛程赛果</view>
          <view
            class="li"
            :class="{'current': currentLeague.classifyIndex === 2}"
            @click="classifyChange(2)"
            v-if="navIndex === 1">射手榜</view>
          <view
            class="li"
            :class="{'current': currentLeague.classifyIndex === 3}"
            @click="classifyChange(3)"
            v-if="navIndex === 1">助攻榜</view>
          <view
            class="li"
            :class="{'current': currentLeague.classifyIndex === 2}"
            @click="classifyChange(2)"
            v-if="navIndex === 2">球员榜</view>
          <view class="division" v-if="navIndex === 2 && (currentLeague.id === 1 || currentLeague.id === 2) && currentLeague.classifyIndex === 0">
            <b :class="{'active': !currentLeague.divisionType || currentLeague.divisionType === 1}" @click="divisionSwitch(1)">联盟</b>
            <b :class="{'active': currentLeague.divisionType === 2}" @click="divisionSwitch(2)">分区</b>
          </view>
        </view>
        <rank-swiper
          v-if="!loading && !error"
          ref="swiper"
          :style="{     
            'flex':'auto',
            'position': 'relative',
            'display': 'flex',
            'flex-direction': 'column'
          }"
          :is-prev-disabled="swiperPrevDisabled"
          :is-next-disabled="swiperNextDisabled"
          :prev="prevData"
          :active="activeData"
          :next="nextData"
          @changed="swiperChanged"
          @active-scoll-top="setActivePosition">
        </rank-swiper>
        <view
          class="rank-content__loading"
          v-if="loading || error">
          <loading v-if="loading" />
          <error
            v-if="error"
            btnText="点击重试"
            @btn-click="leagueInit" />
        </view>
      </view>
    </view>
    <league-list-pop
      v-model="leagueVisible"
      :list="leagueList[navIndex]"
      :index="leagueIndex"
      :visible="leagueVisible"
      @change="leagueChange" />
    <schedule-picker
      v-if="stages.length > 0"
      v-model="pickerVisible"
      :list="stages"
      :picker-index="stagesIndex"
      :picker-sub-index="stagesSubIndex"
      @confirm="pickerConfirm" />
  </view>
</template>

<script>
import {
  leagueList,
  footballLeagueRankById,
  basketballLeagueRankById,
  footballPlayersByGoals,
  footballPlayersByAssists,
  basketballPlayerStats,
  footballScheduleById,
  footballScheduleStages,
  basketballScheduleById,
  basketballScheduleStages } from '../../utils/api/league'
import DropSelect from './components/drop-select'
import RankSwiper from './components/rank-swiper'
import LeagueListPop from './components/league-list-pop'
import schedulePicker from './components/schedule-picker'
import {
  newClassifyData,
  newClassifyBasketData,
  lastIndex,
  getLeagueInfoObject } from './utils/tools'
let swiperIndex = 1
export default {
  name: 'league',
  data () {
    return {
      scrollTop: 0,
      loading: false,
      error: false,
      navIndex: 1,
      leagueCode:0,
      leagueVisible: false,
      seasonDropVisible: false,
      division: 0, // 0 联盟 1 分区
      leagueList: {
        1: [],
        2: []
      },
      leagueIndex: 0, // 联赛列表指针
      activeData: null,
      prevData: null,
      nextData: null,
      pickerVisible: false,
      scrollLeft: 0
    }
  },
  computed: {
    currentLeague () {
      return this.leagueList[this.navIndex][this.leagueIndex]
    },
    currentSeason () {
      return this.currentLeague && this.currentLeague.seasonList[this.currentLeague.seasonIndex || 0].year
    },
    swiperPrevDisabled () {
      if (this.currentLeague) {
        return this.leagueIndex === 0 && this.currentLeague.classifyIndex === 0
      }
      return false
    },
    swiperNextDisabled () {
      const { leagueList, navIndex, leagueIndex, currentLeague } = this
      const len = leagueList[navIndex].length
      const lastLeague = leagueList[navIndex][len - 1]
      if (!lastLeague) return true
      let classifyLength = 4
      if (navIndex === 2) {
        classifyLength = 3
      }
      if (leagueIndex === len - 1 && currentLeague.classifyIndex === classifyLength - 1) {
        return true
      }
      return false
    },
    stages () {
      const { currentLeague } = this
      if (currentLeague) {
        const { classifyIndex } = currentLeague
        const info = currentLeague[classifyIndex]
        if (info) {
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
        }
      }
      return []
    },
    stagesIndex () {
      const { stages, currentLeague } = this
      if (currentLeague) {
        const { classifyIndex } = currentLeague
        const stagesIndex = currentLeague[classifyIndex] && currentLeague[classifyIndex].stagesIndex
        if (stagesIndex !== 'undefined') {
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
      }
      return null
    },
    stagesSubIndex () {
      const { currentLeague } = this
      if (currentLeague) {
        const { classifyIndex } = currentLeague
        const stagesSubIndex = currentLeague[classifyIndex] && currentLeague[classifyIndex].stagesSubIndex
        if (stagesSubIndex !== 'undefined') {
          return stagesSubIndex
        }
      }
      return null
    }
  },
  onShareAppMessage (res) {
    return {
      title: '网易欧洲杯',
    }
  },
  onLoad(optiaon){
    // 获取
    if (/[1-2]/.test(optiaon.categoryId)) {
      this.navIndex = parseInt(optiaon.categoryId)
      this.leagueInit()
      this.leagueCode = parseInt(optiaon.leagueCode)
    }
    this.$bus.$on('basketball-player-rank', this.playerSwitchTab)
    this.$bus.$on('picker-show', val => {
      this.pickerVisible = true
    })
    this.$bus.$on('element-scroll', val => {
      this.scrollTop = val
    })
  },
  components: {
    DropSelect,
    RankSwiper,
    LeagueListPop,
    schedulePicker
  },
  watch: {
    leagueIndex (val) {
      lastIndex[this.navIndex].leagueIndex = val
    },
    pickerVisible (val) {
      if (!val) {
        this.$bus.$emit('picker-visible-change', false)
      }
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
    navChange (i) {
      if (this.loading || this.navIndex === i) return
      this.setActivePosition()
      this.navIndex = i
      this.leagueIndex = lastIndex[i].leagueIndex
      if (this.leagueList[i].length === 0) {
        swiperIndex = 1
        this.leagueInit()
      } else {
        this.leagueScroll(this.leagueIndex)
        this.swiperChanged()
      }
    },
    leagueInit () {
      if (this.loading) return
      this.loading = true
      this.error = false
      this.queryLeagueList().then(() => {
        this.swiperChanged()
        this.leagueScroll(this.leagueIndex)
      }).catch(err => {
        this.error = true
        uni.showToast({
          title: err
        })
      }).finally(() => {
        this.loading = false
      })
    },
    swiperChanged (data) {
      if (data) {
        const { direction, type } = data
        swiperIndex = data.index
        if (type === 'auto') {
          let newIndex = null
          if (direction === 'prev') {
            newIndex = this.getPrevIndex()
          }
          if (direction === 'next') {
            newIndex = this.getNextIndex()
          }
          this.leagueIndex = newIndex.league
          this.currentLeague.classifyIndex = newIndex.classify
          this.leagueScroll(this.leagueIndex)
        }
      }
      const prevIndex = this.getPrevIndex()
      const nextIndex = this.getNextIndex()
      this.setActiveData(this.leagueIndex, this.currentLeague.classifyIndex)
      if (prevIndex) {
        this.setPrevData(prevIndex.league, prevIndex.classify)
      }
      if (nextIndex) {
        this.setNextData(nextIndex.league, nextIndex.classify)
      }
    },
    setActivePosition () {
      this.currentLeague[this.currentLeague.classifyIndex].position = this.$refs.swiper.getActiveScrollTop()
    },
    leagueChange (i) {
      if (this.leagueIndex === i) return
      const classifyIndex = this.leagueList[this.navIndex][i].classifyIndex
      this.setActivePosition()
      if (this.leagueIndex > i) {
        this.setPrevData(i, classifyIndex)
        this.$refs.swiper.goPrev()
      }
      if (this.leagueIndex < i) {
        this.setNextData(i, classifyIndex)
        this.$refs.swiper.goNext()
      }
      this.leagueIndex = i
      this.leagueScroll(i)
    },
    leagueScroll (i) {
      this.$nextTick(() => {
        const itemWidth = 120 * this.$store.getters.windowScale
        const view = uni.createSelectorQuery().in(this).select('#league-list')
        view.fields({
          scrollOffset: true
        }, data => {
          let targetScroll = data.scrollLeft
          if (data.scrollLeft < (i - 4) * itemWidth) {
            targetScroll = (i - 4) * itemWidth
          }
          if (data.scrollLeft > i * itemWidth) {
            targetScroll = i * itemWidth
          }
          this.scrollLeft = targetScroll
        }).exec()
      })
    },
    classifyChange (i) {
      const { currentLeague } = this
      if (currentLeague.classifyIndex === i) return
      this.setActivePosition()
      if (currentLeague.classifyIndex > i) {
        this.setPrevData(this.leagueIndex, i)
        this.$refs.swiper.goPrev()
      }
      if (currentLeague.classifyIndex < i) {
        this.setNextData(this.leagueIndex, i)
        this.$refs.swiper.goNext()
      }
      this.currentLeague.classifyIndex = i
    },
    seasonChange (i) {
      this.currentLeague.seasonIndex = i
      this.resetCurrentLeagueData()
      this.swiperChanged()
    },
    resetCurrentLeagueData () {
      const { $set, navIndex, currentLeague } = this
      if (navIndex === 2) {
        $set(currentLeague, 0, JSON.parse(JSON.stringify({...newClassifyData, ...getLeagueInfoObject(2, 0)})))
        $set(currentLeague, 1, JSON.parse(JSON.stringify({...newClassifyData, ...getLeagueInfoObject(2, 1)})))
        $set(currentLeague, 2, JSON.parse(JSON.stringify({...newClassifyBasketData, ...{index: (currentLeague[2] && currentLeague[2].index) || 0}, ...getLeagueInfoObject(2, 2)})))
      } else {
        $set(currentLeague, 0, JSON.parse(JSON.stringify({...newClassifyData, ...getLeagueInfoObject(1, 0)})))
        $set(currentLeague, 1, JSON.parse(JSON.stringify({...newClassifyData, ...getLeagueInfoObject(1, 1)})))
        $set(currentLeague, 2, JSON.parse(JSON.stringify({...newClassifyData, ...getLeagueInfoObject(1, 2)})))
        if (currentLeague.type) {
          $set(currentLeague, 3, JSON.parse(JSON.stringify({...newClassifyData, ...getLeagueInfoObject(1, 3)})))
        }
      }
    },
    divisionSwitch (id) {
      const { navIndex, currentLeague, leagueIndex } = this
      if (currentLeague.classifyIndex.loading || currentLeague.divisionType === id) return
      this.$set(currentLeague, 'divisionType', id)
      this.queryData(navIndex, leagueIndex, currentLeague.classifyIndex)
    },
    playerSwitchTab (i) {
      const { navIndex, currentLeague, leagueIndex } = this
      currentLeague[currentLeague.classifyIndex].index = i
      currentLeague[currentLeague.classifyIndex].position = 0
      if (!currentLeague[currentLeague.classifyIndex][i].data) {
        this.queryData(navIndex, leagueIndex, currentLeague.classifyIndex)
      }
    },
    pickerConfirm (info) {
      const { currentLeague, stages } = this
      const { classifyIndex } = currentLeague
      currentLeague[classifyIndex].stagesIndex = info.index
      if (info.subIndex !== null) {
        currentLeague[classifyIndex].stagesSubIndex = info.subIndex
      }
      let stageId = null
      if (stages[info.index]) {
        stageId = stages[info.index].id
      }
      if (stages[info.index].roundList && stages[info.index].roundList[info.subIndex]) {
        stageId += '_' + stages[info.index].roundList[info.subIndex].id
      }
      if (stageId) {
        this.queryData(this.navIndex, this.leagueIndex, classifyIndex, stageId)
      }
    },
    setPrevData (leagueIndex, classifyIndex) {
      const _data = this.setClassifyData(leagueIndex, classifyIndex)
      switch (swiperIndex) {
      case 0:
        this.nextData = _data
        break
      case 1:
        this.prevData = _data
        break
      case 2:
        this.activeData = _data
        break
      }
    },
    setActiveData (leagueIndex, classifyIndex) {
      const _data = this.setClassifyData(leagueIndex, classifyIndex)
      switch (swiperIndex) {
      case 0:
        this.prevData = _data
        break
      case 1:
        this.activeData = _data
        break
      case 2:
        this.nextData = _data
        break
      }
    },
    setNextData (leagueIndex, classifyIndex) {
      const _data = this.setClassifyData(leagueIndex, classifyIndex)
      switch (swiperIndex) {
      case 0:
        this.activeData = _data
        break
      case 1:
        this.nextData = _data
        break
      case 2:
        this.prevData = _data
        break
      }
    },
    setClassifyData (leagueIndex, classifyIndex) {
      const { navIndex } = this
      const targetData = this.leagueList[navIndex][leagueIndex]
      if (targetData[classifyIndex] === undefined) {
        const obj = navIndex === 2 && classifyIndex === 2 ? newClassifyBasketData : newClassifyData
        this.$set(targetData, classifyIndex, JSON.parse(JSON.stringify({...obj, ...getLeagueInfoObject(navIndex, classifyIndex)})))
      }
      const _data = targetData[classifyIndex]
      if (navIndex === 2 && classifyIndex === 2) {
        const index = _data.index
        if (!_data[index].data) {
          this.queryData(navIndex, leagueIndex, classifyIndex)
        }
      } else {
        if (!_data.data) {
          this.queryData(navIndex, leagueIndex, classifyIndex)
        }
      }
      return _data
    },
    getPrevIndex () {
      if (this.swiperPrevDisabled) return null
      const { navIndex, leagueIndex, currentLeague } = this
      const classifyIndex = currentLeague.classifyIndex
      let prevLeagueIndex = null
      let prevClassifyIndex = null
      if (leagueIndex === 0) {
        prevLeagueIndex = leagueIndex
        prevClassifyIndex = classifyIndex - 1
      } else {
        if (classifyIndex === 0) {
          prevLeagueIndex = leagueIndex - 1
          if (navIndex === 2) {
            prevClassifyIndex = 2
          }
          if (navIndex === 1) {
            prevClassifyIndex = 3
          }
        } else {
          prevLeagueIndex = leagueIndex
          prevClassifyIndex = classifyIndex - 1
        }
      }
      return {
        league: prevLeagueIndex,
        classify: prevClassifyIndex
      }
    },
    getNextIndex () {
      if (this.swiperNextDisabled) return null
      const { navIndex, leagueIndex, currentLeague } = this
      const classifyIndex = currentLeague.classifyIndex
      let nextLeagueIndex = null
      let nextClassifyIndex = null
      if ((navIndex === 2 && classifyIndex === 2) || (navIndex === 1 && classifyIndex === 3)) {
        nextLeagueIndex = leagueIndex + 1
        nextClassifyIndex = 0
      } else {
        nextLeagueIndex = leagueIndex
        nextClassifyIndex = classifyIndex + 1
      }
      return {
        league: nextLeagueIndex,
        classify: nextClassifyIndex
      }
    },
    queryLeagueList () {
      const type = this.navIndex
      return this.$service(leagueList, {
        data: {
          sportType: type
        }
      }).then(res => {
        if (res.code === 200) {
          this.leagueList[type] = res.data
          if (this.leagueCode) {
            const id = this.leagueCode
            const i = res.data.findIndex(v => v.id === id)
            if (i > -1) {
              this.leagueIndex = i
            }
          }
          this.leagueList[type].forEach(item => {
            this.$set(item, 'classifyIndex', 0)
          })
          return Promise.resolve()
        } else {
          return Promise.reject(new Error(res.message))
        }
      })
    },
    queryData (navIndex, leagueIndex, classifyIndex, stageId) {
      const league = this.leagueList[navIndex][leagueIndex]
      const leagueData = league[classifyIndex]
      const { seasonList } = league
      const seasonIndex = league.seasonIndex || 0
      let basketballPlayerIndex = 0
      const params = {
        competitionId: league.id,
        seasonId: seasonList[seasonIndex].seasonId
      }
      let url = ''
      if (classifyIndex === 0) {
        if (navIndex === 1) {
          url = footballLeagueRankById
        }
        if (navIndex === 2) {
          url = basketballLeagueRankById
          if (league.id === 1 || league.id === 2) {
            params.type = league.divisionType || 1
          }
        }
      }
      if (classifyIndex === 1) {
        if (navIndex === 1) {
          url = footballScheduleById
        }
        if (navIndex === 2) {
          url = basketballScheduleById
        }
      }
      if (classifyIndex === 2) {
        if (navIndex === 1) {
          url = footballPlayersByGoals
        }
        if (navIndex === 2) {
          url = basketballPlayerStats
          basketballPlayerIndex = leagueData.index
          params.type = leagueData[basketballPlayerIndex].type
        }
      }
      if (classifyIndex === 3) {
        url = footballPlayersByAssists
      }
      // loading
      if (navIndex === 2 && classifyIndex === 2) {
        if (leagueData[basketballPlayerIndex].loading) return
        leagueData[basketballPlayerIndex].loading = true
      } else {
        if (leagueData.loading) return
        leagueData.loading = true
      }
      const queryClassifyData = (url, params) => {
        this.$service(url, {
          data: params
        }).then(res => {
          if (res.code === 200) {
            if (navIndex === 2 && classifyIndex === 2) {
              leagueData[basketballPlayerIndex].data = Object.freeze(res.data)
            } else {
              leagueData.data = Object.freeze(res.data)
            }
          }
        }).finally(() => {
          if (navIndex === 2 && classifyIndex === 2) {
            leagueData[basketballPlayerIndex].loading = false
          } else {
            leagueData.loading = false
          }
        })
      }
      const getStageId = (data) => {
        let result = null
        if (data) {
          result = data
        } else {
          const { stages, stagesIndex, stagesSubIndex } = leagueData
          if (stages[stagesIndex]) {
            result = stages[stagesIndex].id
            if (stages[stagesIndex].roundList && stages[stagesIndex].roundList[stagesSubIndex]) {
              result += '_' + stages[stagesIndex].roundList[stagesSubIndex].id
            }
          }
        }
        return {
          stageId: /_/.test(result) ? result.split('_')[0] : result,
          roundId: /_/.test(result) ? result.split('_')[1] : null
        }
      }
      if (classifyIndex === 1) {
        if (!leagueData.stages) {
          this.$service(this.navIndex === 2 ? basketballScheduleStages : footballScheduleStages, {
            data: params
          }).then(res => {
            if (res.code === 200) {
              this.$set(leagueData, 'stagesIndex', 0)
              res.data.map((item, index) => {
                if (item.isCurrent) {
                  this.$set(leagueData, 'stagesIndex', index)
                }
                if (item.roundList && item.roundList.length > 0) {
                  item.roundList.map((_item, _index) => {
                    if (_item.isCurrent) {
                      this.$set(leagueData, 'stagesSubIndex', _index)
                    }
                  })
                }
              })
              this.$set(leagueData, 'stages', res.data)
              const newStageId = getStageId()
              params.stageId = newStageId.stageId
              if (newStageId.roundId) {
                params.roundId = newStageId.roundId
              }
              queryClassifyData(url, params)
            } else {
              if (navIndex === 2 && classifyIndex === 2) {
                leagueData[basketballPlayerIndex].loading = false
              } else {
                leagueData.loading = false
              }
            }
          }).catch(() => {
            if (navIndex === 2 && classifyIndex === 2) {
              leagueData[basketballPlayerIndex].loading = false
            } else {
              leagueData.loading = false
            }
          })
        } else {
          const newStageId = getStageId(stageId)
          params.stageId = newStageId.stageId
          if (newStageId.roundId) {
            params.roundId = newStageId.roundId
          }
          queryClassifyData(url, params)
        }
      } else {
        if (stageId) {
          const newStageId = getStageId(stageId)
          params.stageId = newStageId.stageId
          if (newStageId.roundId) {
            params.roundId = newStageId.roundId
          }
        }
        queryClassifyData(url, params)
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/style/mixin.scss';
.rank {
  &-wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
    user-select: none;
  }
  &__nav {
    display: flex;
    justify-content: center;
    align-items: center;
    &--season {
      z-index: 30;
      font-size: 24rpx;
      position: relative;
      margin-left: 8rpx;
      .content {
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        z-index: 1;
      }
      .span {
        color: #fff;
        &.icon {
          margin-left: 8rpx;
          width: 14rpx;
          height: 12rpx;
          @include bg-image('/static/league/icon-arrow-bottom.png');
        }
      }
    }
  }
}
.rank-content {
  flex: auto;
  position: relative;
  overflow: hidden;
  &__main {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    transition: transform .1s linear;
  }
  &__subnav {
    height: 80rpx;
    background: #fff;
    flex-shrink: 0;
    overflow: hidden;
    box-shadow: 0 4rpx 6rpx 0 rgba(0,0,0,0.08);
    position: relative;
    .scroll {
      width: 675rpx;
      height: 100%;
    }
    .ul {
      display: flex;
      flex-wrap: nowrap;
      padding-bottom: 0.1rem;
      .li {
        display: inline-block;
        height: 80rpx;
        width: 120rpx;
        flex-shrink: 0;
        font-size: 28rpx;
        line-height: 80rpx;
        color: #333;
        text-align: center;
        position: relative;
        &.current {
          font-weight: bold;
          color: #f22222;
          &:after {
            position: absolute;
            content: '';
            width: 52rpx;
            height: 6rpx;
            background: #f22222;
            left: 50%;
            bottom: 0;
            margin-left: -26rpx;
          }
        }
      }
    }
    &--menu {
      position: absolute;
      top: 0;
      right: 0;
      height: 80rpx;
      width: 92rpx;
      z-index: 1;
      cursor: pointer;
      background-image: linear-gradient(270deg, #FFFFFF 82%, rgba(255,255,255,0.00) 100%);
      image {
        margin: 29rpx 0 29rpx 36rpx;
        width: 28rpx;
        height: 22rpx;
        display: block;
      }
    }
  }
  &__classify {
    padding: 0 34rpx;
    height: 104rpx;
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    position: relative;
     &.line {
       border-bottom: 1rpx solid #eee;
    }
    &.basketball {
      justify-content: flex-start;
    }
    .li {
      list-style: none;
      width: 140rpx;
      height: 52rpx;
      line-height: 52rpx;
      text-align: center;
      position: relative;
      font-size: 28rpx;
      border-radius: 26rpx;
      transform: translateZ(0);
      color: #999;
      z-index: 9;
      font-size: 28rpx;
      cursor: pointer;
      border: 1px solid #eee;
      &.rank {
        width: 120rpx;
      }
      &.schedule {
        width: 160rpx;
      }
      &.current {
        color: #fff;
        background: #f22222;
        &:after {
          display: none;
        }
      }
    }
    .li + .li {
      margin-left: 20rpx;
    }
    .division {
      position: absolute;
      width: 368rpx;
      height: 104rpx;
      top: 26rpx;
      right: 34rpx;
      background: #fff;
      z-index: 10;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #f22;
      box-sizing: border-box;
      border-radius: 104rpx;
      transform: scale(.5) translateZ(0);
      transform-origin: 100% 0%;
      overflow: hidden;
      b {
        font-weight: normal;
        flex: auto;
        height: 100%;
        color: #f22;
        text-align: center;
        line-height: 104rpx;
        font-size: 48rpx;
        position: relative;
        z-index: 1;
        cursor: pointer;
        &.active {
          color: #fff;
          background: #f22;
        }
        // &:first-child {
        //   border-radius: 52rpx 0 0 52rpx;
        // }
        // &:last-child {
        //   border-radius: 0 52rpx 52rpx 0;
        // }
      }
    }
  }
  &__loading {
    flex: auto;
    position: relative;
  }
}
</style>