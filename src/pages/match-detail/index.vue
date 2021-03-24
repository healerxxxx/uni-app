<template>
  <view
    class="match-detail">
    <image
      v-if="backgroundImage"
      class="match-detail__background"
      :src="backgroundImage" />
    <view
      class="match-detail__nav-bar"
      :class="{'error': error, 'filter': headerHidden}">
      <view class="match-detail__nav-bar--status" :style="{'height': statusBarHeight + 'px'}"></view>
      <view class="match-detail__nav-bar--custom" :style="{'height': customBar + 'px'}">
        <view
          v-if="!dataLiveCover"
          class="back"
          @click="back">
          <view class="icon"></view>
        </view>
        <view
          v-if="matchInfo && !dataLiveCover"
          class="follow"
          @click="follow"
          :class="{'followed': matchInfo.hasFollowed}" />
        <view class="title" v-if="!headerHidden && !dataLiveCover">
          <view class="league" v-if="matchInfo.leagueMatch">
            <view class="span"
              :class="{'arrows': matchInfo.hasSeasonDetail}"
              @click="toLeague">
              <text>{{matchInfo.categoryName ? `[${matchInfo.categoryName}]` : '' }}{{matchInfo.leagueMatch.leagueName}}</text>
              <view v-if="matchInfo.hasSeasonDetail" class="icon-arrows"></view>
            </view>
          </view>
        </view>
        <view class="title show-team" v-if="headerHidden">
          <view class="p">
            <text class="team">{{homeTeam.teamName}}{{categoryId === 1 ? '(主)' : ''}}</text>
            <text class="vs" v-if="status !== 2 && status !== 3">VS</text>
            <text class="vs" v-else>{{categoryId === 1 ? matchInfo.homeScore : matchInfo.guestScore}}-{{categoryId !== 1 ? matchInfo.homeScore : matchInfo.guestScore}}</text>
            <text class="team right">{{guestTeam.teamName}}{{categoryId !== 1 ? '(主)' : ''}}</text>
          </view>
          <view class="p">
            <view
              v-if="status === 2"
              class="status"
              :class="[`s-${status}`]">
              <view v-if="categoryId === 1">
                <span v-if="liveScore.statusEnum !== 2 && liveScore.statusEnum !== 4 && liveScore.statusEnum !== 5">{{liveScore.status}}</span>
                <span v-else>{{liveScore.statusEnum === 5 ? '加' : '进行中'}}{{[footballMunites, categoryId, liveScore.statusEnum, liveScore.totalMin] | minutesTrans}}</span>
              </view>
              <view v-if="categoryId === 2">
                <span>{{liveScore.status}}</span><span v-if="liveScore.overStatus === 0">{{[basketballMunites, categoryId] | minutesTrans}}</span><span v-else>完</span>
              </view>
            </view>
            <view
              v-else
              class="status"
              :class="[`s-${status}`]">
              <span>{{liveScore.status}}</span>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view
      class="match-detail__content"
      :class="{'show': matchInfo || error}">
      <view class="match-detail__tips" v-if="tips">
        <view class="match-detail__tips--bg">
          <view class="arrow" v-if="customInfo" :style="{'right': `${systemInfo.windowWidth - customInfo.right - (38 * windowScale) + (customInfo.width * 3 / 4)}px`}"></view>
        </view>
        <text class="match-detail__tips--text">点击可分享给微信好友</text>
      </view>
      <view
        class="match-detail__content--main"
        :style="{
          height: contentHeight && headerHeight && !dataLiveCover ? `${contentHeight + headerHeight}px` : '100%',
          transform: `translate3d(0, ${headerHidden && headerHeight && !dataLiveCover ? 0 - headerHeight : 0}px, 0)`
        }">
        <view
          class="match-detail__header"
          @touchstart="touchStart"
          @touchmove="touchMove">
          <view class="match-detail__header--info" v-if="matchInfo">
            <view class="team" v-if="!dataLiveCover">
              <text class="home">{{categoryId === 1 ? '(主)' : ''}}</text>
              <image
                class="logo"
                @click="toTeam(homeTeam.teamId)"
                :src="homeTeam.teamIcon + '?imageView&thumbnail=72y72'"
              />
              <text class="team-name" @click="toTeam(homeTeam.teamId)">{{homeTeam.teamName}}</text>
            </view>
            <view class="vs" v-if="!dataLiveCover">
              <text class="time">{{matchInfo.matchTime}}</text>
              <view class="score" v-if="status !== 2 && status !== 3">
                <text class="i">VS</text>
              </view>
              <view class="score" v-if="status === 2 || status === 3">
                <text class="i">{{categoryId === 1 ? matchInfo.homeScore : matchInfo.guestScore}}</text>
                <text class="span" v-if="categoryId === 1 && liveScore.halfScore">
                  <text class="b">半场</text>
                  <text class="b">({{liveScore.homeHalfScore}}-{{liveScore.guestHalfScore}})</text>
                </text>
                <text class="i" v-else>&nbsp;-&nbsp;</text>
                <text class="i">{{categoryId !== 1 ? matchInfo.homeScore : matchInfo.guestScore}}</text>
              </view>
              <view
                v-if="status === 2"
                class="status"
                :class="[`s-${status}`]">
                <view v-if="categoryId === 1">
                  <span v-if="liveScore.statusEnum !== 2 && liveScore.statusEnum !== 4 && liveScore.statusEnum !== 5">{{liveScore.status}}</span>
                  <span v-else>{{liveScore.statusEnum === 5 ? '加' : '进行中'}}{{[footballMunites, categoryId, liveScore.statusEnum, liveScore.totalMin] | minutesTrans}}</span>
                </view>
                <view v-if="categoryId === 2">
                  <span>{{liveScore.status}}</span><span v-if="liveScore.overStatus === 0">{{[basketballMunites, categoryId] | minutesTrans}}</span><span v-else>完</span>
                </view>
              </view>
              <view
                v-else
                class="status"
                :class="[`s-${status}`]">
                <span>{{liveScore.status}}</span>
              </view>
              <view class="data-live-button" @click="dataLiveShow">
                <view class="icon" :class="{'basketball': categoryId === 2}"></view>
                <text>{{categoryId === 1 ? '数据直播' : '分节数据'}}</text>
              </view>
            </view>
            <view class="team" v-if="!dataLiveCover">
              <text class="home">{{categoryId === 1 ? '' : '(主)'}}</text>
              <image
                class="logo"
                @click="toTeam(guestTeam.teamId)"
                :src="guestTeam.teamIcon + '?imageView&thumbnail=72y72'"
              />
              <text class="team-name" @click="toTeam(guestTeam.teamId)">{{guestTeam.teamName}}</text>
            </view>
            <view
              v-if="dataLiveCover"
              class="data-live-cover"
              :style="{
                'height': (headerHeight + statusBarHeight + customBar) + 'px',
                'top': (0 - statusBarHeight - customBar) + 'px'
              }">
              <view class="status-bar" :style="{'height': statusBarHeight + 'px'}"></view>
              <view class="custom-bar" :style="{'height': customBar + 'px'}">
                <view class="back" @click="back">
                  <view class="icon"></view>
                </view>
                <view class="close" @click="dataLiveShow"></view>
              </view>
              <view
                class="football"
                v-if="categoryId === 1">
                <view class="team">
                  <image
                    class="logo"
                    :src="homeTeam.teamIcon + '?imageView&thumbnail=72y72'" />
                  <text class="team-name">(主){{homeTeam.teamName}}</text>
                  <view class="stat">
                    <view class="li">
                      <view class="icon icon-yellow"></view>
                      <view class="num">{{(liveScore && liveScore.homeYellowCard) || 0}}</view>
                    </view>
                    <view class="li">
                      <view class="icon icon-red"></view>
                      <view class="num">{{(liveScore && liveScore.homeRedCard) || 0}}</view>
                    </view>
                    <view class="li">
                      <view class="icon icon-corner"></view>
                      <view class="num">{{(liveScore && liveScore.homeCornerKick) || 0}}</view>
                    </view>
                  </view>
                </view>
                <view class="vs">
                  <view class="score" v-if="status !== 2 && status !== 3">
                    <text class="i">VS</text>
                  </view>
                  <view class="score" v-else>
                    <text class="i">{{matchInfo.homeScore}}</text>
                    <text class="span" v-if="liveScore.halfScore">
                      <text class="b">半场</text>
                      <text class="b">({{liveScore.homeHalfScore}}-{{liveScore.guestHalfScore}})</text>
                    </text>
                    <text class="i" v-else>&nbsp;-&nbsp;</text>
                    <text class="i">{{matchInfo.guestScore}}</text>
                  </view>
                  <view
                    v-if="status === 2"
                    class="status"
                    :class="[`s-${status}`]">
                    <view>
                      <span v-if="liveScore.statusEnum !== 2 && liveScore.statusEnum !== 4 && liveScore.statusEnum !== 5">{{liveScore.status}}</span>
                      <span v-else>{{liveScore.statusEnum === 5 ? '加' : '进行中'}}{{[footballMunites, categoryId, liveScore.statusEnum, liveScore.totalMin] | minutesTrans}}</span>
                    </view>
                  </view>
                  <view
                    v-else
                    class="status"
                    :class="[`s-${status}`]">
                    <span>{{liveScore.status}}</span>
                  </view>
                </view>
                <view class="team">
                  <image
                    class="logo"
                    :src="guestTeam.teamIcon + '?imageView&thumbnail=72y72'" />
                  <text class="team-name">{{guestTeam.teamName}}</text>
                  <view class="stat">
                    <view class="li">
                      <view class="icon icon-yellow"></view>
                      <view class="num">{{(liveScore && liveScore.guestYellowCard) || 0}}</view>
                    </view>
                    <view class="li">
                      <view class="icon icon-red"></view>
                      <view class="num">{{(liveScore && liveScore.guestRedCard) || 0}}</view>
                    </view>
                    <view class="li">
                      <view class="icon icon-corner"></view>
                      <view class="num">{{(liveScore && liveScore.guestCornerKick) || 0}}</view>
                    </view>
                  </view>
                </view>
              </view>
              <view
                class="basketball"
                v-if="categoryId === 2">
                <view class="against">
                  <view class="team">
                    <image
                      class="logo"
                      :src="homeTeam.teamIcon + '?imageView&thumbnail=72y72'" />
                    <text class="team-name">{{homeTeam.teamName}}</text>
                  </view>
                  <view class="vs">
                    <view class="score" v-if="status !== 2 && status !== 3">
                      <text class="i">VS</text>
                    </view>
                    <view class="score" v-else>
                      <text class="i">{{matchInfo.guestScore}}</text>
                      <text class="i">&nbsp;-&nbsp;</text>
                      <text class="i">{{matchInfo.homeScore}}</text>
                    </view>
                    <view
                      v-if="status === 2"
                      class="status"
                      :class="[`s-${status}`]">
                      <span>{{liveScore.status}}</span><span v-if="liveScore.overStatus === 0">{{[basketballMunites, categoryId] | minutesTrans}}</span><span v-else>完</span>
                    </view>
                    <view
                      v-else
                      class="status"
                      :class="[`s-${status}`]">
                      <span>{{liveScore.status}}</span>
                    </view>
                  </view>
                  <view class="team">
                    <image
                      class="logo"
                      :src="guestTeam.teamIcon + '?imageView&thumbnail=72y72'" />
                    <text class="team-name">(主){{guestTeam.teamName}}</text>
                  </view>
                </view>
                <view class="stat">
                  <view class="li">
                    <text class="span quarter">&nbsp;</text>
                    <text class="span">客队</text>
                    <text class="span">主队</text>
                  </view>
                  <view
                    class="li"
                    v-for="(item, index) in quarterList"
                    :key="index">
                    <text class="span quarter">{{item.name}}</text>
                    <text class="span quarter-score">{{item.guestScore >= 0 ? item.guestScore : '-'}}</text>
                    <text class="span quarter-score">{{item.homeScore >= 0 ? item.homeScore : '-'}}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="match-detail__header--tab">
            <view
              class="item"
              :class="{'current': tabCurrent === 0}"
              @click="swichMenu(0)">直播</view>
            <view
              class="item"
              :class="{'current': tabCurrent === 1}"
              @click="swichMenu(1)">数据</view>
            <view
              class="item"
              :class="{'current': tabCurrent === 2}"
              @click="swichMenu(2)">赛前分析</view>
            <view
              class="item"
              :class="{'current': tabCurrent === 3}"
              @click="swichMenu(3)">阵容</view>
          </view>
        </view>
        <swiper
          :current="tabCurrent"
          class="match-detail__swiper"
          duration="300"
          @change="swiperChange">
          <swiper-item>
            <detail-live
              v-if="matchInfo"
              :chat-num="matchInfo.chatNum"
              :chat-status="matchInfo.chatStatus"
              :match-info-id="matchInfoId"
              :header-hidden="headerHidden"
              :header-height="headerHeight"
              :content-height="contentHeight"
              :status="status"
              @move="swiperItemMove" />
          </swiper-item>
          <swiper-item>
            <scroll-view
              class="match-detail__swiper--item"
              scroll-y="true"
              @scroll="swiperItemScroll">
              <detail-data
                v-if="matchInfo"
                @move="swiperItemMove"
                :header-hidden="headerHidden"
                :scroll-top="scrollTop[1]"
                :thread-count="matchInfo.threadCount"
                :match-info-id="matchInfoId"
                :status="status" />
            </scroll-view>
          </swiper-item>
          <swiper-item>
            <scroll-view
              class="match-detail__swiper--item"
              scroll-y="true"
              @scroll="swiperItemScroll">
              <detail-report
                v-if="matchInfo"
                :header-hidden="headerHidden"
                @move="swiperItemMove"
                :scroll-top="scrollTop[2]"
                :match-info-id="matchInfoId" />
            </scroll-view>
          </swiper-item>
          <swiper-item>
            <scroll-view
              class="match-detail__swiper--item"
              scroll-y="true"
              @scroll="swiperItemScroll">
              <detail-lineup
                :header-hidden="headerHidden"
                :header-height="headerHeight"
                @move="swiperItemMove"
                :scroll-top="scrollTop[3]"
                v-if="matchInfo"
                :match-info-id="matchInfoId" />
            </scroll-view>
          </swiper-item>
        </swiper>
      </view>
      <net-error
        :text="errorText"
        v-if="error" />
    </view>
    <loading-data v-if="loading" />
  </view>
</template>

<script>
import detailLive from './components/detail-live'
import detailData from './components/detail-data'
import detailReport from './components/detail-report'
import detailLineup from './components/detail-lineup'
import { follow, unFollow } from '../../utils/api/common'
import { matchDetailInfo } from '../../utils/api/match-detail'
import { mapState, mapGetters } from 'vuex'
export default {
  data () {
    return {
      tips: false,
      loading: false,
      error: false,
      errorText: '网络错误',
      matchInfoId: null,
      matchInfo: null,
      dataLiveCover: false,
      contentHeight: 0,
      headerHeight: 0,
      tabHeight: 0,
      tabCurrent: 1,
      followLoading: false,
      headerHidden: false,
      lastY: 0,
      scrollTop: {
        0: 0,
        1: 0,
        2: 0,
        3: 0
      },
      basketballMunites: 0,
      footballMunites: 0,
      eventTimer: null,
      pageShow: true
    }
  },
  computed: {
    ...mapGetters(['statusBarHeight', 'customBar', 'windowScale']),
    ...mapState(['systemInfo', 'customInfo', 'userInfo']),
    categoryId () {
      return (this.matchInfo && this.matchInfo.lotteryCategoryId) || null
    },
    backgroundImage () {
      const id = this.categoryId
      let bg = ''
      switch (id) {
        case 1:
          bg = '/static/match-detail/bg-football.jpg'
          break
        case 2:
          bg = '/static/match-detail/bg-basketball.jpg'
          break
        default: 
          bg = ''
          break
      }
      return bg
    },
    homeTeam () {
      const { categoryId, matchInfo } = this
      if (categoryId === 1) {
        return matchInfo.homeTeam
      }
      if (categoryId === 2) {
        return matchInfo.guestTeam
      }
      return null
    },
    guestTeam () {
      const { categoryId, matchInfo } = this
      if (categoryId === 2) {
        return matchInfo.homeTeam
      }
      if (categoryId === 1) {
        return matchInfo.guestTeam
      }
      return null
    },
    status () {
      return (this.matchInfo && this.matchInfo.matchStatus) || 1
    },
    liveScore () {
      if (this.categoryId === 1 && this.matchInfo.footballLiveScore) {
        return this.matchInfo.footballLiveScore
      }
      if (this.categoryId === 2 && this.matchInfo.basketballLiveScore) {
        return this.matchInfo.basketballLiveScore
      }
      return null
    },
    quarterList () {
      const { liveScore } = this
      let list = [
        {
          guestScore: -1,
          homeScore: -1,
          name: '1ST'
        },
        {
          guestScore: -1,
          homeScore: -1,
          name: '2ND',
        },
        {
          guestScore: -1,
          homeScore: -1,
          name: '3RD',
        },
        {
          guestScore: -1,
          homeScore: -1,
          name: '4TH',
        }
      ]
      if (liveScore && liveScore.quarterScoreList && liveScore.quarterScoreList.length > 0) {
        list = liveScore.quarterScoreList
      }
      return list
    }
  },
  components: {
    detailLive,
    detailData,
    detailReport,
    detailLineup
  },
  filters: {
    minutesTrans ([val, categoryId, status, totalMin]) {
      if (categoryId === 2) {
        const minute = Math.floor(val / 60)
        const second = val % 60
        return (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second)
      } else {
        if (status === 4) {
          if (val > totalMin) {
            return `${totalMin}′+`
          } else {
            return `${val}′`
          }
        } else if (status === 5) {
          return `${val}′`
        } else {
          if (val > totalMin / 2) {
            return `${totalMin / 2}′+`
          } else {
            return `${val}′`
          }
        }
      }
    }
  },
  onLoad (options) {
    const tips = uni.getStorageSync('matchDetailShareTips')
    if (!tips) {
      this.tips = true
      setTimeout(() => {
        this.tips = false
        uni.setStorageSync('matchDetailShareTips', true)
      }, 5000)
    }
    this.loading = true
    if (options && options.matchInfoId) {
      this.matchInfoId = parseInt(options.matchInfoId)
      this.getMatchInfo()
    } else {
      this.error = true
    }
  },
  onShareAppMessage (res) {
    let shareVS = ''
    if (this.matchInfo) {
      shareVS = this.matchInfo.lotteryCategoryId === 1 ? this.matchInfo.homeTeam.teamName + 'VS' + this.matchInfo.guestTeam.teamName : this.matchInfo.guestTeam.teamName + 'VS' + this.matchInfo.homeTeam.teamName
    }
    return {
      title: shareVS || '网易欧洲杯'
    }
  },
  onShow () {
    this.pageShow = true
  },
  onHide () {
    this.pageShow = false
  },
  provide () {
    return {
      pageShow: () => this.pageShow,
      headerHidden: () => this.headerHidden,
      headerHeight: () => this.headerHeight,
      contentHeight: () => this.contentHeight,
      tabCurrent: () => this.tabCurrent
    }
  },
  watch: {
    matchInfo: {
      deep: true,
      handler (val, oldVal) {
        if (val && !this.headerHeight) {
          const query = uni.createSelectorQuery().in(this)
          this.$nextTick(() => {
            setTimeout(() => {
              // 获取顶部比赛信息头部高度
              query.select('.match-detail__header--info').boundingClientRect(data => {
                this.headerHeight = data.height
              }).exec()
            }, 16)
          })
        }
        if (val.matchInfoId && oldVal && val.matchInfoId === oldVal.matchInfoId && val.hasFollowed !== oldVal.hasFollowed) {
          this.emitFollow()
        }
        this.setTime(val)
      }
    },
    status (val) {
      const now = new Date()
      const time = now.getTime() + now.getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000
      if (this.matchInfo.matchTimeMill) {
        if (val === 2 || (val === 1 && time > this.matchInfo.matchTimeMill - 2 * 60 * 1000)) {
          this.setEventTimer()
        } else {
          clearInterval(this.eventTimer)
        }
      }
    }
  },
  mounted () {
    const query = uni.createSelectorQuery().in(this)
    // 获取除导航之外整体页面的高度
    query.select('.match-detail__content').boundingClientRect(data => {
      this.contentHeight = data.height
    }).exec()
    query.select('.match-detail__header--tab').boundingClientRect(data => {
      this.tabHeight = data.height
    }).exec()
  },
  methods: {
    setEventTimer () {
      clearInterval(this.eventTimer)
      this.eventTimer = setInterval(() => {
        if (!this.matchInfo.matchInfoId) return
        this.getMatchInfo()
      }, this.categoryId === 1 ? 30 * 1000 : 10 * 1000)
    },
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
    touchStart (e) {
      const pageY = e && e.touches && e.touches[0].pageY
      pageY && (this.lastY = pageY)
    },
    touchMove (e) {
      const pageY = e && e.touches && e.touches[0].pageY
      if (pageY && !this.dataLiveCover) {
        if (pageY - this.lastY > 0) {
          this.headerHidden = false
        } else {
          this.headerHidden = true
        }
      }
    },
    getMatchInfo () {
      this.error = false
      this.$service(matchDetailInfo, {
        urlParams: {
          matchInfoId: this.matchInfoId
        }
      }).then(res => {
        if (res.code === 200 && res.data && res.data.matchInfoId) {
          this.matchInfo = res.data
          const { matchStatus: status } = res.data
          if (status === 2) {
            this.dataLiveCover = true
          } else {
            this.dataLiveCover = false
          }
          if (status === 2 || status === 3) {
            this.tabCurrent = 0
          }
        } else {
          if (!this.matchInfo) {
            this.error = true
            this.errorText = '找不到对应的赛事信息'
          }
        }
      }).catch(err => {
        if (!this.matchInfo) {
          this.error = true
          this.errorText = '网络错误'
        }
      }).finally(() => {
        this.loading = false
      })
    },
    swichMenu (i) {
      if (this.tabCurrent !== i) {
        this.tabCurrent = i
      }
    },
    swiperChange (e) {
      this.tabCurrent = e.target.current
    },
    follow () {
      if (this.userInfo && this.userInfo.userId) {
        this.queryFollow()
      } else {
        uni.navigateTo({
          url: '/pages/user/login'
        })
      }
    },
    queryFollow () {
      if (this.followLoading) return
      this.followLoading = true
      const { hasFollowed, matchInfoId } = this.matchInfo
      this.$service(hasFollowed ? unFollow : follow, {
        method: 'post',
        urlParams: {
          id: matchInfoId,
          type: 'match'
        }
      }).then(res => {
        if (res.code === 200) {
          this.matchInfo.hasFollowed = !hasFollowed
          this.emitFollow()
          uni.showToast({
            title: `${hasFollowed ? '取消' : ''}关注成功`,
            icon: 'none'
          })
        } else if (res.code === 206009) {
          this.matchInfo.hasFollowed = true
          this.emitFollow()
        } else {
          uni.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      }).catch(err => {
        err && uni.showToast({
          title: '网络错误，请稍后再试',
          icon: 'none'
        })
      }).finally(() => {
        this.followLoading = false
      })
    },
    swiperItemScroll (e) {
      const { tabCurrent } = this
      this.scrollTop[tabCurrent] = e.detail.scrollTop < 0 ? 0 : e.detail.scrollTop
    },
    swiperItemMove (val) {
      if (!this.dataLiveCover) {
        if (val === 'up' && !this.headerHidden) {
          this.headerHidden = true
        }
        if (val === 'down' && this.headerHidden) {
          this.headerHidden = false
        }
      }
    },
    emitFollow () {
      this.$bus.$emit('follow-match', this.matchInfo)
      this.$bus.$emit('match-follow-refresh', this.categoryId)
    },
    setTime (val) {
      if (val.lotteryCategoryId === 2) {
        if (val.matchStatus === 2 && val.basketballLiveScore && val.basketballLiveScore.remainingTime) {
          this.basketballMunites = val.basketballLiveScore.remainingTime
          if (val.basketballLiveScore.timeStatus === 0) {
            this.setBasketballTime()
          }
        }
      } else {
        if (val.matchStatus === 2 && val.footballLiveScore && val.footballLiveScore.liveTime) {
          this.footballMunites = val.footballLiveScore.liveTime
          this.setFootballTime()
        }
      }
    },
    setBasketballTime () {
      clearInterval(this.minTimer)
      this.minTimer = setInterval(() => {
        if (this.basketballMunites > 0) {
          this.basketballMunites--
        }
      }, 1000)
    },
    setFootballTime () {
      clearInterval(this.minTimer)
      this.minTimer = setInterval(() => {
        this.footballMunites++
      }, 1000 * 60)
    },
    toLeague () {
      const { categoryId } = this
      if (!this.matchInfo || !this.matchInfo.hasSeasonDetail) return
      uni.navigateTo({
        url: `/pages/league/index?categoryId=${categoryId}&leagueCode=${this.matchInfo.leagueMatch.leagueCode}`
      })
    },
    toTeam (id) {
      uni.navigateTo({
        url: `/pages/team/index?teamId=${id}`
      })
    },
    dataLiveShow () {
      if (this.dataLiveCover) {
        this.dataLiveCover = false
      } else {
        this.dataLiveCover = true
        this.headerHidden = false
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/style/mixin.scss';
.match-detail {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  .uniform-home {
    @include bg-image("/static/match-detail/bg-uniform-home.png");
  }
  .uniform-away {
    @include bg-image("/static/match-detail/bg-uniform-away.png");
  }
  .icon-assist {
    @include bg-image("/static/match-detail/icon-assist.png");
  }
  .icon-corner {
    @include bg-image("/static/match-detail/icon-corner.png");
  }
  .icon-goal {
    @include bg-image("/static/match-detail/icon-goal.png");
  }
  .icon-own-goal {
    @include bg-image("/static/match-detail/icon-own-goal.png");
  }
  .icon-penalty-kick-loss {
    @include bg-image("/static/match-detail/icon-penalty-kick-loss.png");
  }
  .icon-penalty-kick {
    @include bg-image("/static/match-detail/icon-penalty-kick.png");
  }
  .icon-red {
    @include bg-image("/static/match-detail/icon-red.png");
  }
  .icon-trans {
    @include bg-image("/static/match-detail/icon-trans.png");
  }
  .icon-yellow {
    @include bg-image("/static/match-detail/icon-yellow.png");
  }
  .icon-yellow2red {
    @include bg-image("/static/match-detail/icon-yellow2red.png");
  }
  .icon-half {
    @include bg-image("/static/match-detail/icon-half.png");
  }
  .icon-control {
    @include bg-image("/static/match-detail/icon-control.png");
  }
  .icon-attack {
    @include bg-image("/static/match-detail/icon-attack.png");
  }
  .icon-orthonormal {
    @include bg-image("/static/match-detail/icon-orthonormal.png");
  }
  .icon-football-shoot {
    @include bg-image("/static/match-detail/icon-football-shoot.png");
  }
  .icon-basket-shoot {
    @include bg-image("/static/match-detail/icon-basketball-shoot.png");
  }
  .icon-shoot-2 {
    @include bg-image("/static/match-detail/icon-shoot-2.png");
  }
  .icon-shoot-3 {
    @include bg-image("/static/match-detail/icon-shoot-3.png");
  }
  .icon-shot-block {
    @include bg-image('/static/match-detail/icon-shot-block.png');
  }
  .icon-dangerous-attack {
    @include bg-image("/static/match-detail/icon-dangerous-attack.png");
  }
  .icon-backboard {
    @include bg-image("/static/match-detail/icon-backboard.png");
  }
  .icon-basket-assists {
    @include bg-image("/static/match-detail/icon-basket-assists.png");
  }
  .icon-snatch {
    @include bg-image("/static/match-detail/icon-snatch.png");
  }
  .icon-foul {
    @include bg-image("/static/match-detail/icon-foul.png");
  }
  .icon-turnover {
    @include bg-image("/static/match-detail/icon-turnover.png");
  }
  .icon-free-throw {
    @include bg-image("/static/match-detail/icon-free-throw.png");
  }
  &__background {
    position: absolute;
    left: 0;
    top: 0;
    width: 750rpx;
    height: 500rpx;
    z-index: 0;
  }
  &__nav-bar {
    flex-shrink: 0;
    position: relative;
    &.filter {
      z-index: 20;
      overflow: hidden;
      background: rgba(0, 0, 0, .2);
      backdrop-filter: blur(4px);
    }
    &--custom {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      .back {
        width: 32px;
        height: 32px;
        position: absolute;
        top: 50%;
        margin-top: -16px;
        left: 5px;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        .icon {
          width: 11px;
          height: 20px;
          @include bg-image('/static/icon-nav-back.png');
        }
      }
      .follow {
        position: absolute;
        width: 22px;
        height: 22px;
        top: 50%;
        margin-top: -11px;
        left: 50px;
        z-index: 1;
        @include bg-image('/static/match-detail/icon-unfollow-match-detail.png');
        &.followed {
          @include bg-image('/static/match-detail/icon-followed-match-detail.png');
        }
      }
      .title {
        position: relative;
        height: 100%;
        width: 360rpx;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        .league {
          display: flex;
          align-items: center;
          justify-content: center;
          .span {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 40rpx;
            .icon-arrows {
              width: 12rpx;
              height: 18rpx;
              margin-left: 10rpx;
              @include bg-image('/static/match-detail/icon-league-arrows-right.png');
            }
            &.arrows {
              background: rgba(255,255,255,0.12);
              border: 1px solid rgba(153,153,153,0.43);
              border-radius: 20rpx;
              padding: 0 20rpx;
            }
          }
        }
        &.show-team {
          flex-direction: column;
        }
        .p {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          .team {
            width: 125rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: right;
            &.right {
              text-align: left;
            }
          }
          .vs {
            width: 110rpx;
            flex-shrink: 0;
            text-align: center;
          }
          .status {
            height: 28rpx;
            line-height: 28rpx;
            color: #999;
            font-size: 20rpx;
            &.s-1 {
              color: #65afff;
            }
            &.s-2 {
              color: #ff6e25;
            }
          }
        }
      }
    }
    &.error {
      background-color: #f22;
    }
  }
  &--nav-league {
    position: relative;
  }
  &__content {
    flex: auto;
    position: relative;
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
  &__tips {
    position: absolute;
    z-index: 2;
    right: 30rpx;
    top: 6px;
    width: 300rpx;
    height: 64rpx;
    line-height: 64rpx;
    color: #fff;
    display: flex;
    font-size: 24rpx;
    align-items: center;
    justify-content: center;
    &--text {
      z-index: 10;
    }
    &--bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: .8;
      background: #000;
      border-radius: 4rpx;
      .arrow {
        position: absolute;
        right: 52px;
        top: -8rpx;
        content: "";
        width: 18rpx;
        height: 18rpx;
        border-radius: 4rpx;
        margin-left: -8rpx;
        transform: rotate(-45deg) translateZ(0);
        background: #000;
        z-index: 5;
      }
    }
  }
  &__header {
    flex-shrink: 0;
    &--info {
      position: relative;
      height: 300rpx;
      padding: 20rpx;
      z-index: 1;
      display: flex;
      .team {
        width: 240rpx;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
        color: #fff;
        flex-shrink: 0;
        .home {
          height: 34rpx;
          line-height: 34rpx;
          margin-bottom: 8rpx;
        }
        .logo {
          width: 96rpx;
          height: 96rpx;
          border-radius: 100%;
          background: #e4e4e4;
        }
        .team-name {
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-wrap: break-word;
          word-break: break-word;
          font-size: 30rpx;
          line-height: 42rpx;
          margin-top: 12rpx;
          font-weight: bold;
        }
      }
      .vs {
        width: 210rpx;
        margin: 0 10rpx;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
        flex-shrink: 0;
        color: #fff;
        .time {
          height: 34rpx;
          line-height: 34rpx;
          margin-bottom: 8rpx;
        }
        .score {
          height: 96rpx;
          display: flex;
          justify-content: space-around;
          align-items: center;
          width: 100%;
          .i {
            font-size: 64rpx;
            font-family: 'alternategothicno2bt';
          }
          .span {
            font-size: 24rpx;
            color: #b4bdc7;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .b {
              display: block;
            }
          }
        }
        .status {
          height: 34rpx;
          line-height: 34rpx;
          color: #999;
          &.s-1 {
            color: #65afff;
          }
          &.s-2 {
            color: #ff6e25;
          }
        }
        .data-live-button {
          flex-shrink: 0;
          margin-top: 48rpx;
          width: 160rpx;
          height: 44rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(0,0,0,0.50);
          border-radius: 22rpx;
          font-size: 20rpx;
          color: #B4BDC7;
          .icon {
            width: 24rpx;
            height: 18rpx;
            margin-right: 10rpx;
            @include bg-image('/static/match-detail/icon-data-live-football.png');
            &.basketball {
              @include bg-image('/static/match-detail/icon-data-live-basketball.png');
            }
          }
        }
      }
      .data-live-cover {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: rgba(0, 0, 0, .7);
        display: flex;
        flex-direction: column;
        .status-bar, .custom-bar {
          flex-shrink: 0;
          position: relative;
          .back {
            width: 32px;
            height: 32px;
            position: absolute;
            top: 50%;
            margin-top: -16px;
            left: 5px;
            z-index: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            .icon {
              width: 11px;
              height: 20px;
              @include bg-image('/static/icon-nav-back.png');
            }
          }
          .close {
            position: absolute;
            width: 20px;
            height: 20px;
            top: 50%;
            margin-top: -10px;
            left: 50px;
            @include bg-image('/static/match-detail/icon-data-live-close.png');
          }
        }
        .football {
          display: flex;
          flex: auto;
          padding: 0 32rpx;
          justify-content: center;
          align-items: center;
          .team {
            .logo {
              width: 60rpx;
              height: 60rpx;
            }
            .team-name {
              font-size: 24rpx;
              line-height: 34rpx;
              margin-top: 16rpx;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              display: block;
              width: 100%;
            }
            .stat {
              margin-top: 40rpx;
              display: flex;
              justify-content: center;
              align-items: center;
              .li {
                margin-left: 25rpx;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-size: 20rpx;
                .icon {
                  width: 24rpx;
                  height: 28rpx;
                }
              }
            }
          }
          .vs {
            width: 186rpx;
            .score {
              height: 74rpx;
              justify-content: center;
              .span {
                flex-shrink: 0;
                margin-left: 16rpx;
                margin-right: 16rpx;
              }
            }
            .status {
              margin-top: 24rpx;
            }
          }
        }
        .basketball {
          flex: auto;
          padding: 0 32rpx;
          display: flex;
          flex-direction: column;
          .against {
            flex-shrink: 0;
            border-bottom: 1rpx solid #eee;
            display: flex;
            padding-bottom: 42rpx;
            .team {
              .logo {
                width: 60rpx;
                height: 60rpx;
              }
              .team-name {
                font-size: 24rpx;
                line-height: 34rpx;
                margin-top: 16rpx;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                display: block;
                width: 100%;
              }
            }
            .vs {
              width: 186rpx;
              margin: 0 10rpx;
              .score {
                height: 74rpx;
                justify-content: center;
                .span {
                  flex-shrink: 0;
                  margin-left: 16rpx;
                  margin-right: 16rpx;
                }
              }
            }
          }
          .stat {
            flex: auto;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .li {
              .span {
                height: 34rpx;
                line-height: 34rpx;
                display: block;
                font-size: 24rpx;
                color: #fff;
              }
              .span + .span {
                margin-top: 16rpx;
              }
              .quarter {
                height: 26rpx;
                line-height: 26rpx;
                font-size: 18rpx;
                color: #999;
              }
              .quarter-score {
                font-weight: bold;
              }
            }
          }
        }
      }
    }
    &--tab {
      height: 88rpx;
      position: relative;
      background-color: #fff;
      border-radius: 16rpx 16rpx 0 0;
      transform: translateZ(0);
      display: flex;
      justify-content: space-around;
      align-items: center;
      border-bottom: 1rpx solid #ebebeb;
      .item {
        line-height: 88rpx;
        font-size: 30rpx;
        color: #333;
        position: relative;
        &.current {
          color: #f22;
          &:after {
            position: absolute;
            content: '';
            width: 56rpx;
            height: 6rpx;
            background-color: #f22;
            left: 50%;
            bottom: -1rpx;
            margin-left: -28rpx;
            z-index: 1;
          }
        }
      }
    }
  }
  &__swiper {
    background-color: #fff;
    flex: auto;
    position: relative;
    &--item {
      width: 100%;
      height: 100%;
      position: relative;
    }
  }
}
</style>
