<template>
  <view class="bet-detail bet-detail-bg">
    <nav-bar
      @back="back"
      transparent>
      <text>模拟投注详情</text>
    </nav-bar>
    <view
      class="bet-detail__content"
      id="capture">
      <scroll-view
        style="height: 100%"
        scroll-y="true">
        <view
          class="bet-detail__content--detail"
          v-if="info">
          <view
            class="bet-detail__winning"
            v-if="info.winResult === 1">
          </view>
          <view
            class="bet-detail__content--header"
            :class="{
              'football': categoryId === 1,
              'basketball': categoryId === 2,
              'sfc': isSFC
            }">{{titleObj[categoryId] + `${isSFC ? info.matchSFCDegree + '期' : ''}`}}</view>
          <view class="bet-detail__content--info">
            <view class="mode" v-if="!isSFC">
              <view class="li">
                <view class="p" v-if="justSingle">
                  <text class="span">{{mode[0]}}</text><text class="b">场</text><text class="b"> - </text><text class="span"><text class="i">单</text></text><text class="b">关</text>
                </view>
                <view class="p" v-else>
                  <text class="span">{{mode[0]}}</text><text class="b">场</text><text class="b"> - </text><text class="span"><template v-if="isSingle"><text class="i">单</text>,</template>{{mode[1]}}</text><text class="b">关</text>
                </view>
                <view class="p note"><text class="span">过关</text></view>
              </view>
              <view class="li">
                <view class="p"><text class="span">{{info.multiple}}</text><text class="b">倍</text></view>
                <view class="p note"><text class="span">倍数</text></view>
              </view>
            </view>
            <view class="money">
              <view class="li">
                <view class="p"><text class="span">{{info.betNum}}</text><text class="b">注</text> <text class="span">{{info.betPrice}}</text><text class="b">元</text></view>
                <view class="p note"><text class="span">注数</text></view>
              </view>
              <view class="li" v-if="!isSFC && info.winResult === 0">
                <view class="p"><text class="span">{{numberCutOut(info.minBonus)}}<text class="i" v-if="info.minBonus !== info.maxBonus">~</text>{{info.minBonus !== info.maxBonus ? numberCutOut(info.maxBonus) : ''}}</text><text class="b">元</text></view>
                <view class="p note"><text class="span">预计金额</text></view>
              </view>
              <view class="li" v-if="info.winResult === 1">
                <view class="p"><text class="span" style="color: #f22">{{info.winPrice}}</text><text class="b">元</text></view>
                <view class="p note"><text class="span">中奖金额</text></view>
              </view>
              <view class="li" v-if="info.winResult === 2">
                <view class="p"><text class="span lose">未中奖</text></view>
                <view class="p note"><text class="span">中奖金额</text></view>
              </view>
            </view>
            <view class="tips" v-if="info.betNumDesc" v-html="info.betNumDesc.replace(/\s/g, '<br />')"></view>
          </view>
          <view class="bet-detail__content--cutting-line">
            <view class="ul">
              <view class="li" v-for="i in 26" :key="i"></view>
            </view>
          </view>
          <view class="bet-detail__content--odds">
            <view class="h4">投注详情</view>
            <view class="table ball" v-if="!isSFC">
              <view class="thead">
                <view class="tr">
                  <view class="th w-1"><text class="span">玩法</text></view>
                  <view class="th w-2"><text class="span">选择</text></view>
                  <view class="th w-3"><text class="span">赛果</text></view>
                </view>
              </view>
              <view
                class="tbody"
                v-for="(item, index) in info.userBetItemList"
                :key="index">
                <view class="tr">
                  <view class="td fixture">
                    <view
                      class="against"
                      :class="{'basketball': categoryId === 2 && (item.matchStatus === 2 || item.matchStatus === 3)}">
                      <view class="team left">
                        <text class="label">{{item.jcNum}}</text>
                        <text class="b" v-if="categoryId !== 2">[主]</text>
                        <text class="span">{{categoryId === 2 ? item.guestTeam.teamName : item.homeTeam.teamName}}</text>
                      </view>
                      <text class="i">{{item.matchStatus === 2 || item.matchStatus === 3 ? (categoryId === 2 ? item.guestScore + ':' + item.homeScore : item.homeScore + ':' + item.guestScore) : 'VS'}}</text>
                      <view class="team">
                        <text class="span">{{categoryId === 2 ? item.homeTeam.teamName : item.guestTeam.teamName}}</text>
                        <text class="b" v-if="categoryId === 2">[主]</text>
                      </view>
                    </view>
                  </view>
                </view>
                <view class="tr">
                  <view class="td play-name w-1">
                    <text class="span">{{item.playName}}<template v-if="item.concede"><br />{{item.concede}}</template></text>
                  </view>
                  <view class="td choose score-gap w-2" v-if="item.playName === '胜分差'">
                    <view
                      class="ul"
                      v-for="(_item, _index) in getScoreGapList(item)"
                      :key="_index">
                      <view class="li name">{{_item.playItemName}}</view>
                      <view class="li list">
                        <template
                          v-for="(__item, __index) in _item.list">
                          <template v-if="__index > 0">，</template>
                          <text class="span" :key="__index"><text class="b">{{__item.playItemName}}</text><text class="i">({{__item.odds}})</text></text>
                        </template>
                      </view>
                    </view>
                  </view>
                  <view class="td choose w-2" v-else>
                    <template
                      v-for="(_item, _index) in item.playItemList">
                      <template v-if="_index > 0">，</template>
                      <text class="span" :key="_index"><text class="b">{{_item.playItemName}}</text><text class="i">({{_item.odds}})</text></text>
                    </template>
                  </view>
                  <view class="td result w-3">{{item.itemResult || '-'}}</view>
                </view>
              </view>
            </view>
            <view class="table sfc" v-if="isSFC">
              <view class="thead">
                <view class="tr">
                  <view class="th w-1"><text class="span">场次</text></view>
                  <view class="th w-2"><text class="span">对阵</text></view>
                  <view class="th w-3"><text class="span">选择</text></view>
                  <view class="th w-4"><text class="span">结果</text></view>
                </view>
              </view>
              <view class="tbody">
                <view
                  class="tr"
                  v-for="(item, index) in info.userBetItemList"
                  :key="index">
                  <view class="td w-1">{{item.matchNum}}</view>
                  <view class="td no-left w-2">
                    <view class="against">
                      <text class="span left">{{item.homeTeam.teamName}}</text><text class="i">{{item.matchStatus === 2 || item.matchStatus === 3 ? item.homeScore + ':' + item.guestScore : 'VS'}}</text><text class="span">{{item.guestTeam.teamName}}</text>
                    </view>
                  </view>
                  <view class="td w-3"><template v-for="(_item, _index) in item.playItemList">{{(_index > 0 ? ',' : '') + _item.playItemName}}</template></view>
                  <view class="td w-4">{{item.itemResult || '-'}}</view>
                </view>
              </view>
            </view>
            <view class="note">
              <view class="trans">
                *投注助手不能购买彩票，如需购买，请到线下彩票站<br v-if="!isSFC" />
                <template v-if="!isSFC">
                  *注：单场投注，单注最高奖金限额为10万元；2或3场过关投注，单注最高奖金限额为20万元；4或5场过关投注，单注最高奖金限额为50万元；6场过关投注，单注最高奖金限额100万元。
                </template>
              </view>
            </view>
          </view>
          <view class="bet-detail__content--bottom-twig"></view>
        </view>
        <view class="bet-detail__content--copyright"><text class="span">Copyright©{{copyrightYear}} NetEase</text></view>
      </scroll-view>
      <loading-data
        v-if="loading" />
      <no-data
        v-if="noData"
        text="暂无数据" />
    </view>
    <view
      class="bet-detail__footer"
      v-if="info"
      :style="{'padding-bottom': `${safeBottom}px`}">
      <view class="station" @click="toStation"></view>
      <button class="li odds" @click="betMore">再来一单</button>
      <button open-type="share" class="li share">分享</button>
    </view>
  </view>
</template>

<script>
import { betDetail } from '@/utils/api/bet-assistant'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'bet-detail',
  data () {
    return {
      from: null,
      betId: null,
      loading: false,
      noData: false,
      info: null,
      titleObj: {
        1: '竞彩足球', 2: '竞彩篮球', 4: '任九', 3: '胜负彩'
      }
    }
  },
  computed: {
    ...mapGetters(['safeBottom']),
    categoryId () {
      return (this.info && this.info.lotteryCategoryId) || 1
    },
    isSFC () {
      return this.categoryId === 3 || this.categoryId === 4
    },
    copyrightYear () {
      const year = new Date().getFullYear()
      return year >= 2021 ? year : 2021
    },
    isSingle () {
      const { info } = this
      return info && info.ggTypes && info.ggTypes.split('-')[1].indexOf('1') > -1
    },
    justSingle () {
      const { info } = this
      if (info && info.ggTypes) {
        const mode = info.ggTypes.split('-')[1].split(',')
        return mode.length === 1 && mode.indexOf('1') > -1
      }
      return false
    },
    mode () {
      const { info } = this
      if (info && info.ggTypes) {
        const arr = info.ggTypes.split('-')
        return {
          0: arr[0],
          1: arr[1].replace('1,', '')
        }
      }
      return {
        0: 0,
        1: 0
      }
    }
  },
  onLoad (options) {
    if (options.betId) {
      this.betId = options.betId
    } else {
      this.noData = true
    }
    this.getInfo()
  },
  onReady () {
    this.getSystemInfo()
  },
  onShareAppMessage (res) {
    return {
      title: '模拟投注详情',
    }
  },
  methods: {
    ...mapMutations(['getSystemInfo']),
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
    numberCutOut (val) {
      if (/\./.test(val)) {
        return val.toFixed(2)
      }
      return val
    },
    getInfo () {
      if (this.loading) return
      this.loading = true
      this.noData = false
      this.$service(betDetail, {
        method: 'get',
        data: {
          betId: this.betId
        }
      }).then(res => {
        if (res.code === 200) {
          this.info = res.data
        } else {
          this.noData = true
        }
      }).catch(err => {
        err && (this.noData = true)
      }).finally(() => {
        this.loading = false
      })
    },
    betMore () {
      try {
        let setObj = {}
        if (uni.getStorageSync('betassistant')) {
          const obj = JSON.parse(uni.getStorageSync('betassistant'))
          if (obj) {
            setObj = obj
          }
        }
        setObj[this.categoryId] = {}
        uni.setStorageSync('betassistant', JSON.stringify(setObj))
      } catch (error) {
      }
      const pages = getCurrentPages();
      const currentPage = pages[pages.length-1];
      if (currentPage.options && currentPage.options.from === 'bet_assistant_list') {
        uni.navigateBack({ delta: 1 })
      } else {
        uni.navigateTo({
          url: '/pages/bet-assistant/list/index'
        })
      }
    },
    getScoreGapList (data) {
      const result = []
      const w = {
        playItemName: '主胜',
        list: []
      }
      const l = {
        playItemName: '客胜',
        list: []
      }
      data.playItemList.map(item => {
        if (/^w/i.test(item.playItemCode)) {
          w.list.push(item)
        } else {
          l.list.push(item)
        }
      })
      if (w.list.length > 0) {
        result.push(w)
      }
      if (l.list.length > 0) {
        result.push(l)
      }
      return result
    },
    toStation () {
      uni.navigateTo({
        url: '/pages/map/index'
      })
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/style/mixin.scss";
.bet-detail-bg {
  background-color: #F24614;
  background-image: url('/static/bet-assistant/detail-bg.png');
  background-repeat: repeat-y;
  background-size: 100% auto;
}
.bet-detail {
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  &__winning {
    position: absolute;
    width: 122rpx;
    height: 120rpx;
    top: 45rpx;
    right: 12rpx;
    @include bg-image('/static/bet-assistant/icon-bet-detail-winning.png');
    z-index: 2;
  }
  &__content {
    height: 50vh;
    flex: auto;
    position: relative;
    &--detail {
      margin: 0 auto;
      width: 686rpx;
      position: relative;
    }
    &--header {
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      font-size: 32rpx;
      font-weight: bold;
      color: #fff;
      border-radius: 14rpx 14rpx 0 0;
      transform: translateZ(0);
      &.football {
        @include gradient-y(#FFA700, #FB8C1F);
      }
      &.basketball {
        @include gradient-y(#52A5FF, #5DB5FF);
      }
      &.sfc {
        @include gradient-y(#FE8A64, #FE792E);
      }
    }
    &--info {
      background: #fff;
      padding-top: 60rpx;
      padding-bottom: 25rpx;
      &.sfc {
        padding-bottom: 56rpx;
      }
      .mode {
        position: relative;
        padding-bottom: 16rpx;
      }
      .mode + .money {
        margin-top: 22rpx;
      }
      .money {
        display: flex;
        justify-content: center;
      }
      .li {
        width: 50%;
        display: inline-block;
        vertical-align: top;
        text-align: center;
        .p {
          line-height: 50rpx;
          overflow: hidden;
          .b {
            font-weight: bold;
          }
          .span {
            font-size: 44rpx;
            font-family: $AGN;
            .i {
              font-size: 38rpx;
              font-weight: bold;
              font-style: normal;
            }
            &.lose {
              font-size: 32rpx;
              font-weight: bold;
            }
          }
          &.note {
            line-height: 28rpx;
            margin-top: 2rpx;
            .span {
              font-size: 24rpx;
              display: inline-block;
              transform: scale(.82) translateZ(0);
              color: #999;
            }
          }
        }
      }
      .tips {
        transform: scale(.82) translateZ(0);
        margin: 13rpx auto;
        width: 550rpx;
        padding: 12rpx 24rpx;
        line-height: 36rpx;
        color: #65afff;
        background: #f4f9ff;
        word-wrap: break-word;
        word-break: break-all;
        position: relative;
        &:before {
          content: '';
          position: absolute;
          bottom: 100%;
          background: #f4f9ff;
          width: 20rpx;
          height: 20rpx;
          margin-bottom: -14rpx;
          left: 80rpx;
          border-radius: 4rpx;
          -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
        }
      }
    }
    &--odds {
      background: #fff;
      padding: 42rpx 34rpx 10rpx;
      .h4 {
        line-height: 40rpx;
        padding-bottom: 30rpx;
        font-size: 28rpx;
        font-weight: bold;
        text-align: center;
      }
      .ball, .sfc {
        width: 100%;
        position: relative;
        border-radius: 6rpx;
        border: 1px solid #dfdfdf;
        .w-1 {
          width: 19.8%;
          justify-content: center;
        }
        .w-2 {
          width: 64.7%;
        }
        .w-3 {
          width: 15.5%;
          justify-content: center;
        }
        .w-4 {
          width: 14.2%;
        }
        .tr {
          display: flex;
        }
        .th {
          height: 60rpx;
          line-height: 60rpx;
          text-align: center;
          font-weight: normal;
          flex-shrink: 0;
          box-sizing: border-box;
          .span {
            display: inline-block;
            transform: scale(.91) translateZ(0);
          }
        }
        .td {
          text-align: center;
          line-height: 40rpx;
          position: relative;
          border-top: 1rpx solid #dfdfdf;
          flex-shrink: 0;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          .i {
            font-style: normal;
          }
          &.no-left {
            &::after {
              display: none;
            }
          }
        }
        .td + .td {
          border-left: 1rpx solid #dfdfdf;
        }
        .tbody {
          tr:nth-child(odd) {
            background: #fbfbfc;
          }
        }
      }
      .ball {
        .td {
          &.fixture {
            padding: 23rpx 0;
            .against {
              display: flex;
              align-items: flex-start;
              justify-content: center;
              .i {
                width: 60rpx;
                font-family: $AGN;
                font-size: 30rpx;
              }
              .team {
                width: 265rpx;
                text-align: left;
                &.left {
                  width: 293rpx;
                  text-align: right;
                }
              }
              .b {
                display: inline-block;
                font-weight: normal;
                font-size: 24rpx;
                text-align: center;
                transform: scale(.66) translateZ(0);
              }
              .label {
                display: inline-block;
                transform: scale(.82) translateZ(0);
                color: #999;
              }
              .span {
                display: inline-block;
                vertical-align: top;
                max-width: 144rpx;
                font-weight: bold;
              }
              &.basketball {
                .i {
                  width: 110rpx;
                }
                .team {
                  width: 240rpx;
                  &.left {
                    width: 268rpx;
                  }
                }
                .span {
                  max-width: 120rpx
                }
              }
            }
          }
          &.play-name {
            line-height: 32rpx;
            .span {
              display: inline-block;
              transform: scale(.91) translateZ(0);
              color: #999;
            }
          }
          &.choose {
            text-align: left;
            padding: 25rpx 0;
            padding-left: 20rpx;
            .span {
              .b {
                font-weight: normal;
                font-family: $AGN;
                font-size: 24rpx;
                color: #1a1a1a;
              }
              .i {
                display: inline-block;
                transform: scale(.82) translateZ(0);
                color: #666;
              }
            }
          }
          &.result {
            font-family: $AGN;
            font-size: 24rpx;
          }
          &.score-gap {
            padding: 0!important;
            .ul {
              position: relative;
              display: flex;
              align-items: center;
              padding: 30rpx 0;
              .li {
                position: relative;
                &.name {
                  flex-shrink: 0;
                  width: 80rpx;
                  text-align: center;
                }
                &.list {
                  flex: auto;
                  padding-left: 15rpx;
                }
              }
              .li + .li {
                &:before {
                  // @include one-rpx-y(#dfdfdf, left);
                  position: absolute;
                  content: '';
                  width: 1px;
                  left: 0;
                  top: -30rpx;
                  bottom: -30rpx;
                  background: #dfdfdf;
                }
              }
            }
            .ul + .ul {
              border-top: 1rpx solid #dfdfdf;
            }
          }
        }
      }
      .sfc {
        .w-1 {
          width: 13.2%;
        }
        .w-2 {
          width: 58.4%;
        }
        .w-3 {
          width: 14.2%;
        }
        .td {
          padding: 30rpx 0;
          .against {
            display: flex;
            justify-content: center;
            align-items: flex-start;
          }
          .span, .i {
            display: inline-block;
            vertical-align: middle;
          }
          .i {
            font-family: $AGN;
            width: 56rpx;
            font-size: 42rpx;
          }
          .span {
            text-align: left;
            width: 152rpx;
            &.left {
              text-align: right;
            }
          }
        }
      }
      .note {
        padding-top: 32rpx;
        color: #f22;
        word-wrap: break-word;
        word-break: break-all;
        .trans {
          transform: scale(.82) translateZ(0);
          transform-origin: 0 0;
          width: 120%;
          line-height: 36rpx;
        }
      }
    }
    &--cutting-line {
      height: 32rpx;
      margin: -2rpx 0;
      background: #fff;
      position: relative;
      overflow: hidden;
      .ul {
        width: 610rpx;
        height: 32rpx;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .li {
          width: 16rpx;
          height: 16rpx;
          background: #F73131;
          border-radius: 100%;
          transform: scale(.375) translateZ(0);
        }
      }
      &::before {
        content: '';
        width: 28rpx;
        height: 28rpx;
        background-color: #F43D1F;
        border-radius: 100%;
        position: absolute;
        top: 2rpx;
        left: -14rpx;
      }
      &::after {
        content: '';
        width: 28rpx;
        height: 28rpx;
        background-color: #F43D1F;
        border-radius: 100%;
        position: absolute;
        top: 2rpx;
        right: -14rpx;
      }
    }
    &--bottom-twig {
      border-radius: 0 0 14rpx 14rpx;
      padding-top: 4rpx;
      margin-top: -4rpx;
      height: 30rpx;
      overflow: hidden;
      transform: translateZ(0);
      position: relative;
      background: #fff;
      &::before {
        content: '';
        width: 60rpx;
        height: 60rpx;
        background-color: #F3411B;
        border-radius: 100%;
        position: absolute;
        top: 4rpx;
        left: 50%;
        margin-left: -30rpx;
      }
    }
    &--copyright {
      padding: 34rpx 0 40rpx;
      text-align: center;
      color: #fff;
      line-height: 28rpx;
      .span {
        display: inline-block;
        transform: scale(.82) translateZ(0);
      }
    }
  }
  &__footer {
    position: relative;
    flex-shrink: 0;
    height: 136rpx;
    background: #fff;
    box-shadow: 0 -1px 13px 0 rgba(0,0,0,0.10);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
    .station {
      width: 84rpx;
      height: 80rpx;
      @include bg-image('/static/bet-assistant/icon-station-big.png');
    }
    .li {
      width: 240rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      color: #fff;
      font-size: 32rpx;
      font-weight: bold;
      border-radius: 40rpx;
      position: relative;
      margin: 0;
      margin-left: 45rpx;
      &.odds {
        color: #f22;
        border: 1px solid #f22;
        box-sizing: border-box;
      }
      &.share {
        background: #f22;
      }
    }
  }
}
</style>
