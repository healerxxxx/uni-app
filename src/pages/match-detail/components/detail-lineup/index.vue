<template>
  <view
    class="detail-lineup-wrapper"
    @touchstart="touchStart"
    @touchmove="touchMove">
    <view class="detail-lineup-content" v-if="info">
      <view class="detail-lineup__start">
        <view class="h3">{{info.confirmed ? '首发' : '预测'}}阵容</view>
        <view class="detail-lineup__start--stadium" v-if="start.home.length + start.guest.length > 0">
          <view class="detail-lineup__start--stadium--home">
            <view class="span icon">
              <image class="img" :src="info.homeTeam.teamIcon + '?imageView&thumbnail=50y50&quality=85'" @error.once="errorTeamImg" />
            </view>
            <view class="span">{{info.homeTeam.teamName}}</view>
            <view class="formation"><view class="span">{{info.homeFormation}}</view></view>
          </view>
          <view class="detail-lineup__start--stadium--away">
            <view class="span icon">
              <image class="img" :src="info.guestTeam.teamIcon + '?imageView&thumbnail=50y50&quality=85'"
                @error.once="errorTeamImg" />
            </view>
            <view class="span">{{info.guestTeam.teamName}}</view>
            <view class="formation"><view class="span">{{info.awayFormation}}</view></view>
          </view>
          <view class="detail-lineup__start--stadium--player">
            <view class="li" v-for="item in start.home" v-show="item.xaxis !== 0 && item.yaxis !== 0" :key="item.playerId"
              :style="{'left': item.xaxis + '%', 'top': (item.yaxis - 2) + '%', 'transform': 'translate3d(-50%, -50%, 0)'}"
              @click="toPlayer(item.playerId)">
              <view class="avatar">
                <view class="pic">
                  <image class="img" :src="item.logo + '?imageView&thumbnail=50y50&quality=85'" @error.once="errorPlayerImg" />
                </view>
                <view class="uniform uniform-home"><text class="i">{{item.shirtNumber}}</text></view>
                <view class="event-list" v-if="item.incidentsList && item.incidentsList.length > 0">
                  <template v-for="(item, index) in item.incidentsList">
                    <view
                    class="event"
                    :key="index"
                    v-if="eventType2Icon[item.eventType] && index < 3">
                      <view class="icon" :class="eventType2Icon[item.eventType]"></view>
                      <view class="span" v-if="item.eventTime && item.eventType === 9">{{item.eventTime}}′</view>
                    </view>
                  </template>
                </view>
              </view>
              <view class="p">{{item.name}}</view>
            </view>
          </view>
          <view class="detail-lineup__start--stadium--player">
            <view class="li" v-for="item in start.guest" v-show="item.xaxis !== 0 && item.yaxis !== 0" :key="item.playerId"
              :style="{'right': item.xaxis + '%', 'bottom': (item.yaxis - 2) + '%', 'transform': 'translate3d(50%, 50%, 0)'}"
              @click="toPlayer(item.playerId)">
              <view class="avatar">
                <view class="pic">
                  <image class="img" :src="item.logo + '?imageView&thumbnail=50y50&quality=85'" @error.once="errorPlayerImg" />
                </view>
                <view class="uniform uniform-away"><text class="i">{{item.shirtNumber}}</text></view>
                <view class="event-list" v-if="item.incidentsList && item.incidentsList.length > 0">
                  <template v-for="(item, index) in item.incidentsList">
                    <view
                    class="event"
                    :key="index"
                    v-if="eventType2Icon[item.eventType] && index < 3">
                      <view class="icon" :class="eventType2Icon[item.eventType]"></view>
                      <view class="span" v-if="item.eventTime && item.eventType === 9">{{item.eventTime}}′</view>
                    </view>
                  </template>
                </view>
              </view>
              <view class="p">{{item.name}}</view>
            </view>
          </view>
        </view>
        <view class="detail-lineup__no-data" v-if="start.home.length + start.guest.length < 1">暂无数据
        </view>
      </view>
      <view class="detail-lineup__trans" v-if="sub.home.length + sub.guest.length > 0">
        <view class="h3">本场换人</view>
        <view class="li" v-if="sub.home.length > 0">
          <view class="team" @click="toTeam(info.homeTeam.teamId)">
            <view class="span icon">
              <image class="img" :src="info.homeTeam.teamIcon + '?imageView&thumbnail=50y50&quality=85'" @error.once="errorTeamImg" />
            </view>
            <view class="span">{{info.homeTeam.teamName}}</view>
          </view>
          <view class="player" v-for="(item, index) in sub.home" :key="index">
            <view class="name"
              @click="toPlayer(item.playerInId)">
              <view class="span icon">
                <image class="img" :src="item.playerInInfo.logo + '?imageView&thumbnail=50y50&quality=85'"
                  @error.once="errorPlayerImg" />
                <view class="uniform uniform-home"><view class="i">{{item.playerInInfo.shirtNumber}}</view></view>
              </view>
              <view class="span">{{item.playerInInfo.name}}</view>
            </view>
            <view class="trans">
              <view class="span icon icon-trans"></view><view class="span">{{item.eventTime}}′</view>
            </view>
            <view class="name"
              @click="toPlayer(item.playerId)">
              <view class="span icon">
                <image class="img" :src="item.playerOutInfo.logo + '?imageView&thumbnail=50y50&quality=85'"
                  @error.once="errorPlayerImg" />
                <view class="uniform uniform-home"><text class="i">{{item.playerOutInfo.shirtNumber}}</text></view>
              </view>
              <view class="span">{{item.playerOutInfo.name}}</view>
            </view>
          </view>
        </view>
        <view class="li" v-if="sub.guest.length > 0">
          <view class="team" @click="toTeam(info.guestTeam.teamId)">
            <view class="span icon">
              <image class="img" :src="info.guestTeam.teamIcon + '?imageView&thumbnail=50y50&quality=85'"
                @error.once="errorTeamImg" />
            </view>
            <view class="span">{{info.guestTeam.teamName}}</view>
          </view>
          <view class="player" v-for="(item, index) in sub.guest" :key="index">
            <view class="name"
              @click="toPlayer(item.playerInId)">
              <view class="span icon">
                <image class="img" :src="item.playerInInfo.logo + '?imageView&thumbnail=50y50&quality=85'"
                  @error.once="errorPlayerImg" />
                <view class="uniform uniform-home"><view class="i">{{item.playerInInfo.shirtNumber}}</view></view>
              </view>
              <view class="span">{{item.playerInInfo.name}}</view>
            </view>
            <view class="trans">
              <view class="span icon icon-trans"></view><view class="span">{{item.eventTime}}′</view>
            </view>
            <view class="name"
              @click="toPlayer(item.playerId)">
              <view class="span icon">
                <image class="img" :src="item.playerOutInfo.logo + '?imageView&thumbnail=50y50&quality=85'"
                  @error.once="errorPlayerImg" />
                <view class="uniform uniform-home"><view class="i">{{item.playerOutInfo.shirtNumber}}</view></view>
              </view>
              <view class="span">{{item.playerOutInfo.name}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="detail-lineup__bench">
        <view class="h3">本场替补</view>
        <view class="ul" v-if="bench.home.length + bench.guest.length > 0">
          <view class="li" :class="{'left': bench.home.length >= bench.guest.length}">
            <view class="team" @click="toTeam(info.homeTeam.teamId)">
              <view class="span icon">
                <image class="img" :src="info.homeTeam.teamIcon + '?imageView&thumbnail=50y50&quality=85'"
                  @error.once="errorTeamImg" />
              </view>
              <view class="span">{{info.homeTeam.teamName}}</view>
            </view>
            <view class="player" v-for="item in bench.home" :key="item.playerId"
              @click="toPlayer(item.playerId)">
              <view class="span icon">
                <image class="img" :src="item.logo + '?imageView&thumbnail=50y50&quality=85'" @error.once="errorPlayerImg" />
                <view class="uniform uniform-home"><view class="i">{{item.shirtNumber}}</view></view>
              </view>
              <view class="span">{{item.name}}</view>
            </view>
          </view>
          <view class="li away" :class="{'right': bench.home.length < bench.guest.length}">
            <view class="team" @click="toTeam(info.guestTeam.teamId)">
              <view class="span icon">
                <image class="img" :src="info.guestTeam.teamIcon + '?imageView&thumbnail=50y50&quality=85'"
                  @error.once="errorTeamImg" />
              </view>
              <view class="span">{{info.guestTeam.teamName}}</view>
            </view>
            <view class="player" v-for="item in bench.guest" :key="item.playerId"
              @click="toPlayer(item.playerId)">
              <view class="span icon">
                <image class="img" :src="item.logo + '?imageView&thumbnail=50y50&quality=85'" @error.once="errorPlayerImg" />
                <view class="uniform uniform-away"><view class="i">{{item.shirtNumber}}</view></view>
              </view>
              <view class="span">{{item.name}}</view>
            </view>
          </view>
        </view>
        <view class="detail-lineup__no-data" v-if="bench.home.length + bench.guest.length < 1">暂无数据
        </view>
      </view>
    </view>
    <loading-data
      v-if="loading" />
    <sign-modal
      v-if="!loading && !noData"
      :categoryId="1"
      top-hidden />
    <no-data
      type="match"
      v-if="!loading && noData"
      icon="icon-no-data-match"
      text="本场暂无数据" />
  </view>
</template>

<script>
import { matchDetailLineup } from '@/utils/api/match-detail'
import SignModal from '../common/sign-modal'
let lastY = 0
export default {
  name: 'detail-lineup',
  props: ['match-info-id', 'header-hidden', 'header-height', 'scroll-top'],
  data () {
    return {
      loading: false,
      modalShow: false,
      info: null,
      start: {
        home: [],
        guest: []
      },
      bench: {
        home: [],
        guest: []
      },
      sub: {
        home: [],
        guest: []
      },
      eventType2Icon: {
        2: 'icon-corner',
        1: 'icon-goal',
        0: 'icon-assist',
        17: 'icon-own-goal',
        16: 'icon-penalty-kick-loss',
        8: 'icon-penalty-kick',
        4: 'icon-red',
        9: 'icon-trans',
        3: 'icon-yellow',
        15: 'icon-yellow2red',
        1000: 'icon-assist'
      },
      timer: null,
      webViewSize: null,
      lastY: 0
    }
  },
  computed: {
    noData () {
      return !this.info || this.start.home.length + this.start.guest.length + this.bench.home.length + this.bench.guest.length < 1
    },
    shouldUpdate () {
      return this.info && this.info.matchStatus === 2
    }
  },
  components: {
    SignModal
  },
  created () {
    this.getInfo()
  },
  watch: {
    info (val) {
      if (val) {
        const start = {
          home: [],
          guest: []
        }
        const bench = {
          home: [],
          guest: []
        }
        const sub = {
          home: [],
          guest: []
        }
        const homeId = {}
        const guestId = {}

        if (val.homePlayList) {
          val.homePlayList.forEach(item => {
            if (item.firstStatus) {
              start.home.push(item)
            } else {
              bench.home.push(item)
            }
            homeId[item.playerId] = item
          })

          this.start.home = this.fixStat(start.home)
          this.bench.home = bench.home
        }

        if (val.awayPlayList) {
          val.awayPlayList.forEach(item => {
            if (item.firstStatus) {
              start.guest.push(item)
            } else {
              bench.guest.push(item)
            }
            guestId[item.playerId] = item
          })

          this.start.guest = this.fixStat(start.guest)
          this.bench.guest = bench.guest
        }

        if (val.substitutionList) {
          val.substitutionList.forEach(item => {
            if (homeId[item.playerOutId] && homeId[item.playerInId]) {
              item['playerOutInfo'] = homeId[item.playerOutId]
              item['playerInInfo'] = homeId[item.playerInId]
              sub.home.push(item)
            }
            if (guestId[item.playerOutId] && guestId[item.playerInId]) {
              item['playerOutInfo'] = guestId[item.playerOutId]
              item['playerInInfo'] = guestId[item.playerInId]
              sub.guest.push(item)
            }
          })

          this.sub.home = sub.home
          this.sub.guest = sub.guest
        }
      }
    },
    shouldUpdate (val) {
      this.setTimer(val)
    }
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
    setTimer (val) {
      if (val) {
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.getInfo()
        }, 30000)
      } else {
        clearInterval(this.timer)
      }
    },
    getInfo () {
      if (this.loading) return
      if (!this.info) {
        this.loading = true
      }
      this.$service(matchDetailLineup, {
        data: {
          matchInfoId: this.matchInfoId
        }
      }).then(res => {
        if (res.code === 200 && res.data.matchInfoId) {
          this.info = res.data
        }
      }).finally(() => {
        this.loading = false
      })
    },
    toPlayer (id) {
      uni.navigateTo({
        url: `/pages/player/index?categoryId=1&playerId=${id}`
      })
    },
    toTeam (id) {
      uni.navigateTo({
        url: `/pages/team/index?teamId=${id}`
      })
    },
    errorTeamImg (e) {
      e.target.src = 'https://relottery.ws.126.net/thread/20191012/H2fpJg.png'
    },
    errorPlayerImg (e) {
      e.target.src = 'https://relottery.ws.126.net/thread/20191115/oWbNQe.png'
    },
    // 寻找Y值相同的数据，放进同一个数组中
    fixStat (arr) {
      if (!arr || arr.length < 1) return arr
      const _Y = {}
      arr.forEach(item => {
        if (!_Y[item.yaxis]) {
          _Y[item.yaxis] = [item]
        } else {
          _Y[item.yaxis].push(item)
        }
      })
      let _arr = []
      Object.keys(_Y).forEach(key => {
        if (_Y[key].length >= 4) {
          _arr = [..._arr, ...this.fixArr(_Y[key])]
        } else {
          _arr = [..._arr, ..._Y[key]]
        }
      })
      return _arr
    },
    // 数组长度4、5的中间两个位置数值减小
    fixArr (arr) {
      const _arr = arr.sort(this.objSort('xaxis'))
      _arr.forEach((item, index) => {
        // 两边球员往两边靠
        if (_arr.length === 4) {
          if (index === 0) {
            item.xaxis -= 4
          }
          if (index === 4) {
            item.xaxis += 4
          }
        }
        // 中间的球员偏下
        if (index === 1) {
          item.yaxis -= 4
        }
        if (index === 2) {
          if (_arr.length === 4) {
            item.yaxis -= 4
          } else {
            item.yaxis -= 8
          }
        }
        if (index === 3) {
          if (_arr.length === 5) {
            item.yaxis -= 4
          }
        }
      })
      return _arr
    },
    // 数组根据对象某个key值排序
    objSort (prop, desc) {
      const isNumber = (num) => {
        return typeof num === 'number' && !isNaN(num)
      }
      return function (objA, objB) {
        let valA = objA[prop]
        let valB = objB[prop]
        if (!isNumber(Number(valA)) && !isNumber(Number(valB))) {
          valA = Number(valA)
          valB = Number(valB)
        }
        if (desc) {
          return valA < valB ? 1 : valA > valB ? -1 : 0
        } else {
          return valA < valB ? -1 : valA > valB ? 1 : 0
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.detail-lineup {
  &-wrapper {
    background: #f3f5f7;
    position: relative;
    min-height: 100%;
  }
  &__start,
  &__trans,
  &__bench {
    background: #fff;
    padding-top: 30rpx;
    .h3 {
      height: 44rpx;
      line-height: 44rpx;
      padding-left: 32rpx;
      font-family: $PFM;
      font-size: 32rpx;
      color: #333333;
      position: relative;
      font-weight: bold;
    }
  }
  &__start {
    padding-bottom: 60rpx;
    .detail-lineup__no-data {
      padding: 64rpx 0 44rpx;
    }
    &--stadium {
      width: 634rpx;
      height: 1412rpx;
      padding: 75rpx 26rpx;
      margin: 36rpx auto 0;
      @include bg-image("/static/match-detail/bg-lineup-stadium.png");
      position: relative;
      &--home,
      &--away {
        position: absolute;
        left: 0;
        font-size: 0;
        right: 0;
        .span {
          display: inline-block;
          vertical-align: middle;
          line-height: 40rpx;
          color: #fff;
          font-size: 28rpx;
          font-family: $PFM;
          &.icon {
            width: 40rpx;
            height: 40rpx;
            margin-right: 14rpx;
            margin-left: 25rpx;
            background: #ececec;
            border-radius: 100%;
            font-size: 0;
            .img {
              display: inline-block;
              width: 100%;
              height: 100%;
              border-radius: 100%;
            }
          }
        }
        .formation {
          position: absolute;
          right: 37rpx;
          .span {
            font-size: 24rpx;
            display: inline-block;
            transform: scale(0.916) translateZ(0);
            transform-origin: 100% 50%;
            line-height: 1;
          }
        }
      }
      &--home {
        top: 15rpx;
        .formation {
          top: 74rpx;
        }
      }
      &--away {
        bottom: 15rpx;
        .formation {
          bottom: 74rpx;
        }
      }
      &--player {
        position: relative;
        height: 706rpx;
        .li {
          list-style: none;
          position: absolute;
          width: 100rpx;
          .avatar {
            height: 54rpx;
            width: 54rpx;
            margin: 0 auto;
            position: relative;
            .pic {
              height: 50rpx;
              width: 50rpx;
              padding: 2rpx;
              background: #fff;
              border-radius: 100%;
              font-size: 0;
              box-shadow: 0rpx 6rpx 5rpx -3rpx rgba(33, 33, 33, 0.3);
              .img {
                display: block;
                background: #d8d8d8;
                width: 100%;
                height: 100%;
                border-radius: 100%;
              }
            }
            .uniform {
              position: absolute;
              width: 28rpx;
              height: 36rpx;
              line-height: 36rpx;
              text-align: center;
              left: -18rpx;
              top: 9rpx;
              .i {
                font-style: normal;
                font-size: 24rpx;
                display: inline-block;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%) scale(0.64) translateZ(0);
              }
            }
            .event-list {
              position: absolute;
              bottom: 4rpx;
              left: 45rpx;
              font-size: 0;
              .event {
                width: 20rpx;
                position: relative;
                line-height: 20rpx;
                .icon {
                  width: 20rpx;
                  height: 20rpx;
                  background-color: #fff;
                  border-radius: 100%;
                }
                .span {
                  display: inline-block;
                  position: absolute;
                  left: 20rpx;
                  top: 0;
                  line-height: 1;
                  font-size: 24rpx;
                  transform: scale(0.82) translateZ(0);
                  color: #fff;
                }
              }
              .event + .event {
                margin-top: 8rpx;
              }
            }
          }
          .p {
            margin-top: 6rpx;
            font-size: 24rpx;
            text-align: center;
            color: #fff;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
  &__trans {
    margin-top: 16rpx;
    .h3 {
      padding-bottom: 25rpx;
    }
    .li {
      list-style: none;
      padding-left: 32rpx;
      padding-right: 32rpx;
      padding-bottom: 60rpx;
      .team {
        padding-left: 16rpx;
        height: 96rpx;
        background: #f9fafb;
        display: flex;
        align-items: center;
        .span {
          font-weight: bold;
          font-size: 28rpx;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 580rpx;
          &.icon {
            height: 50rpx;
            width: 50rpx;
            padding: 2rpx;
            margin-right: 27rpx;
            background: #d8d8d8;
            border-radius: 100%;
            flex-shrink: 0;
            .img {
              display: block;
              background: #fff;
              width: 100%;
              height: 100%;
              border-radius: 100%;
            }
          }
        }
      }
      .player {
        position: relative;
        height: 92rpx;
        padding-left: 16rpx;
        display: flex;
        align-items: center;
        .span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 200rpx;
          flex: auto;
        }
        .name {
          width: 270rpx;
          display: flex;
          align-items: center;
          .span {
            color: #333;
            position: relative;
            &.icon {
              width: 54rpx;
              height: 54rpx;
              margin-right: 25rpx;
              border-radius: 100%;
              position: relative;
              overflow: inherit;
              flex-shrink: 0;
              .img {
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 100%;
              }
              .uniform {
                position: absolute;
                width: 28rpx;
                height: 36rpx;
                line-height: 36rpx;
                text-align: center;
                right: -15rpx;
                bottom: 0;
                .i {
                  font-style: normal;
                  font-size: 24rpx;
                  display: inline-block;
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%) scale(0.64) translateZ(0);
                }
              }
            }
          }
        }
        .trans {
          display: flex;
          align-items: center;
          width: 128rpx;
          text-align: left;
          .span {
            color: #333;
            font-size: 24rpx;
            position: relative;
            &.icon {
              width: 44rpx;
              height: 44rpx;
              border-radius: 100%;
              flex-shrink: 0;
            }
          }
        }
      }
      .player + .player {
        border-top: 1rpx solid #eee;
      }
    }
  }
  &__bench {
    margin-top: 16rpx;
    padding-bottom: 40rpx;
    .h3 {
      padding-bottom: 40rpx;
    }
    font-size: 0;
    .ul {
      padding-left: 32rpx;
    }
    .li {
      display: inline-block;
      vertical-align: top;
      width: 343rpx;
      position: relative;
      &.left {
        border-right: 1rpx solid #eee;
      }
      &.right {
        border-left: 1rpx solid #eee;
      }
      .team {
        padding-left: 16rpx;
        line-height: 96rpx;
        background: #f9fafb;
        font-size: 0;
        .span {
          display: inline-block;
          vertical-align: middle;
          font-family: $PFM;
          font-size: 28rpx;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 200rpx;
          &.icon {
            height: 50rpx;
            width: 50rpx;
            padding: 2rpx;
            margin-right: 27rpx;
            background: #d8d8d8;
            border-radius: 100%;
            font-size: 0;
            .img {
              display: block;
              background: #fff;
              width: 100%;
              height: 100%;
              border-radius: 100%;
            }
          }
        }
      }
      .player {
        position: relative;
        line-height: 92rpx;
        padding-left: 16rpx;
        font-size: 0;
        .span {
          display: inline-block;
          vertical-align: middle;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 200rpx;
          color: #333;
          font-size: 24rpx;
          position: relative;
          &.icon {
            width: 54rpx;
            height: 54rpx;
            margin-right: 27rpx;
            border-radius: 100%;
            font-size: 0;
            position: relative;
            overflow: inherit;
            .img {
              display: block;
              width: 100%;
              height: 100%;
              border-radius: 100%;
            }
            .uniform {
              position: absolute;
              width: 28rpx;
              height: 36rpx;
              line-height: 36rpx;
              text-align: center;
              right: -15rpx;
              bottom: 0;
              .i {
                font-style: normal;
                font-size: 24rpx;
                display: inline-block;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%) scale(0.64) translateZ(0);
              }
            }
          }
        }
      }
      .player + .player {
        border-top: 1rpx solid #eee;
      }
      &.away {
        .team,
        .player {
          padding-left: 50rpx;
        }
      }
    }
  }
  &__no-data {
    background: #fff;
    height: 40rpx;
    line-height: 40rpx;
    padding: 24rpx 0 64rpx;
    font-size: 28rpx;
    color: #bbb;
    text-align: center;
  }
}
</style>
