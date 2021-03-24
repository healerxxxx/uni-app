<template>
  <view
    class="bet-footer"
    :class="{'popup': popupVisible}">
    <view
      class="bet-footer__config"
      v-if="!isSFC">
      <view
        class="bet-footer__config--choose"
        :class="{'disable': chooseList.length === 0, 'anta-has-choose-odds': chooseList.length > 0 && !popupVisible}"
        @click="pupupShow('choose')">
        <text>已选</text>
        <view class="num" v-if="chooseList.length > 0">
          <text>{{chooseList.length}}</text>
        </view>
      </view>
      <view class="bet-footer__config--mode">
        <text>过关</text>
        <view
          class="select"
          @click="pupupShow('mode')"
          :class="{'anta-mode': chooseList.length > 0 && !popupVisible}">
          <view class="mode">{{modeText}}</view>
          <view class="arrows"><image src="/static/bet-assistant/icon-footer-mode-arrows.svg" /></view>
        </view>
      </view>
      <view class="bet-footer__config--multiple">
        <text>倍数</text>
        <view class="number">
          <view
            class="minus"
            @click="minus"
            :class="{'disable': multiple < 2}">
            <view class = "i">-</view>
          </view>
          <view class="input">
            <input
              :type="isIphone ? 'number' : 'tel'"
              pattern="[0-9]*"
              step="1"
              @keyup="inputKeydown"
              @focus="focus"
              @blur="blur"
              v-model="multiple">
          </view>
          <view
            class="plus"
            @click="plus"
            :class="{'disable': multiple > 49}">
            <view class = "i">+</view>
          </view>
        </view>
      </view>
    </view>
    <view class="bet-footer__result">
      <view class="bet-footer__result--money">
        <view class="text"><text>{{betCountAndMoney.count}}注</text><text class = "i">{{betCountAndMoney.count * 2 * multipleNumber}}</text>元</view>
        <view class="text" v-if="!isSFC"><text>预计奖金</text><text class = "i">{{betCountAndMoney.min * multipleNumber | decimals}}</text>元<template v-if="betCountAndMoney.max > betCountAndMoney.min"> ~ </template><text class = "i" v-if="betCountAndMoney.max > betCountAndMoney.min">{{betCountAndMoney.max * multipleNumber | decimals}}</text><template v-if="betCountAndMoney.max > betCountAndMoney.min">元</template></view>
      </view>
      <view
        class="bet-footer__result--sfc"
        v-if="isSFC">
        <view class="count">已选{{chooseList.length}}</view>
        <view><text>请选择{{lotteryType === 4 || lotteryType === '4' ? 9 : 14}}场比赛</text></view>
      </view>
      <view
        class="bet-footer__result--button"
        :class="{'disable': buttonDisable}"
        @click="save">保存选择</view>
    </view>
    <transition name="bet-foot-fade">
      <view
        class="bet-footer__overlay"
        v-show="popupVisible"
        @click="popupVisible = false"
        @touchmove.prevent
        @mousewheel.prevent>
      </view>
    </transition>
    <transition name="bet-foot-bottom">
      <view
        class="bet-footer__popup"
        v-show="popupVisible">
        <view class="bet-footer__popup--header">
          <view
            class="clear"
            v-if="popupType === 'choose'"
            @click="$emit('clear-bet-list')">
            <text class="icon"></text>
            <text>清除全部</text>
          </view>
          <text v-if="popupType === 'choose'">已选{{chooseList.length}}项</text>
          <text v-if="popupType === 'mode'">过关方式</text>
          <view
            class="close"
            @click="popupVisible = false">
            <image class="icon-arrows-expand i" src="/static/bet-assistant/icon-arrows-expand.svg" />
          </view>
        </view>
        <view class="bet-footer__popup--content">
          <view class="mode" v-if="popupType === 'mode'">
            <view
              class="li"
              v-for="(item, index) in chooseList"
              :key="index"
              v-show="index !== 0 || (index === 0 && isSingle)"
              @click="chooseMode(index + 1)"
              :class="{'choose': mode.indexOf(index + 1) > -1}">{{`${index > 0 ? index + 1 : '单'}`}}关</view>
          </view>
          <view class="choose" v-if="popupType === 'choose'">
            <view
              class="bet-footer-match-detail"
              v-for="item in chooseList"
              :key="item">
              <view class="team">
                <view class="home-left" v-if="!isBasket">[主]</view>
                <text>{{isBasket ? chooseObject[item].guestTeam : chooseObject[item].homeTeam}}</text>
                <text class = "i">VS</text>
                <text>{{isBasket ? chooseObject[item].homeTeam : chooseObject[item].guestTeam}}</text>
                <view class="home-right" v-if="isBasket">[主]</view>
              </view>
              <view class="info">
                <text>{{chooseObject[item].jcNum}}</text>
                <text class="league" :style="{color: chooseObject[item].leagueMatchColor}">{{chooseObject[item].leagueMatchName}}</text>
                <text>{{[chooseObject[item].matchTime, 'hh:mm'] | formatDate}}</text>
              </view>
              <view class="odds">
                <view
                  class="odds-item"
                  v-for="id in chooseObject[item]['chooseList']"
                  :key="id">
                  <view
                    class="del"
                    :id="`${item}-${id}`"
                    @click.stop="delItem">
                  </view>
                  <view class="ul">
                    <view
                      class="li play-type"
                      v-if="showPlayType(chooseObject[item].playType.playCode)">
                      <view class="num">{{chooseObject[item].playType.playName}}<br/><text class="i">{{chooseObject[item].playType.concede}}</text></view>
                    </view>
                    <view
                      class="li"
                      v-if="chooseObject[item].playType.playCode === 'BSFC'">
                      <view class="num">胜分差<br /><text class = "i">{{/w/gi.test(chooseObject[item][id].playItemCode) ? '主胜' : '客胜'}}</text></view>
                    </view>
                    <view class="li">
                      <view class="num">{{chooseObject[item][id].playItemName}}<br/><text class="i">{{chooseObject[item][id].odds}}</text></view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="bet-footer__popup--footer">
        </view>
      </view>
    </transition>
  </view>
</template>

<script>
import { arrayCombine } from '../utils/tools'
let focusTimer
function isNumber (num) {
  return typeof num === 'number' && !isNaN(num)
}
export default {
  name: 'bet-footer',
  props: ['value', 'mode', 'lottery-type', 'choose-list', 'choose-object', 'choose-play-item', 'choose-mode', 'is-single'],
  data () {
    return {
      popupType: null,
      popupVisible: false,
      betCountAndMoney: {
        count: 0,
        min: 0,
        max: 0
      },
      oldmultiple: '1'
    }
  },
  computed: {
    multiple: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    multipleNumber () {
      const num = parseInt(this.multiple)
      if (isNumber(num)) {
        return num
      } else {
        return 0
      }
    },
    isSFC () {
      const type = this.lotteryType + ''
      return type !== '1' && type !== '2'
    },
    isBasket () {
      const id = this.lotteryType + ''
      return id === '2'
    },
    buttonDisable () {
      const id = this.lotteryType + ''
      const len = this.chooseList.length
      if (id === '1' || id === '2') {
        if (len === 0) {
          return true
        }
        if (len > 1 && this.mode.length === 0) {
          return true
        }
      }
      if (id === '3') {
        return len < 14
      }
      if (id === '4') {
        return len < 9
      }
      return false
    },
    modeText () {
      const len = this.chooseList.length
      if (len === 0 || (!this.isSingle && len === 1)) {
        return ''
      }
      if (this.mode.length === 0) {
        return '请选择'
      } else {
        const mode = [...this.mode]
        mode.sort()
        const strArr = []
        mode.map(i => {
          if (i === 1) {
            strArr.push('单关')
          } else {
            strArr.push(`${i}关`)
          }
        })
        return strArr.join(',')
      }
    }
  },
  filters: {
    decimals (val) {
      return Math.round(val * 100) / 100
    }
  },
  mounted () {
    this.betCountAndMoney = this.getCountAndMoney()
  },
  watch: {
    multiple (val, oldVal) {
      if (val && parseInt(val) > 50) {
        this.multiple = oldVal
        uni.showToast({title:'倍数最大可选择50倍',icon:'none'})
      }
    },
    chooseList (val) {
      if (val.length === 0 && this.popupVisible) {
        this.popupVisible = false
      }
    },
    mode (val) {
      this.betCountAndMoney = this.getCountAndMoney()
    },
    chooseObject: {
      deep: true,
      handler () {
        this.betCountAndMoney = this.getCountAndMoney()
      }
    }
  },
  methods: {
    inputKeydown (e) {
      const val = e.target.value + ''
      const _val = val.replace(/[^\d]/g, '')
      e.target.value = _val
    },
    getCountAndMoney () {
      const { buttonDisable, isSFC, mode, chooseList, chooseObject } = this
      const defaultObj = {
        count: 0,
        min: 0,
        max: 0
      }
      if (buttonDisable) {
        return defaultObj
      }
      const id = this.lotteryType + ''
      let modeArr = [...mode]
      if (id === '4') {
        modeArr = [9]
      }
      if (id === '3') {
        modeArr = [14]
      }
      if (modeArr.length === 0) {
        return defaultObj
      }
      let combinationMatchArr = []
      modeArr.map(n => {
        if (!isSFC && n === 1) {
          chooseList.map(key => {
            if (chooseObject[key].playType.single === 1) {
              combinationMatchArr.push([key])
            }
          })
        } else {
          combinationMatchArr = [...combinationMatchArr, ...arrayCombine(chooseList, n)]
        }
      })
      const maxMoney = []
      const minMoney = []
      let count = 0
      combinationMatchArr.map(arr => {
        const oddsArr = []
        let minArrMoney = 2
        let maxArrMoney = 2
        let nCount = 1
        arr.map(matchId => {
          if (chooseObject[matchId] && chooseObject[matchId].chooseList) {
            nCount = nCount * chooseObject[matchId].chooseList.length
            if (!this.isSFC) {
              const originalOdds = chooseObject[matchId][chooseObject[matchId].chooseList[0]].odds
              let minOdds = originalOdds
              let maxOdds = originalOdds
              chooseObject[matchId].chooseList.map(playId => {
                const currentOdds = chooseObject[matchId][playId].odds
                if (currentOdds < minOdds) {
                  minOdds = currentOdds
                }
                if (currentOdds > maxOdds) {
                  maxOdds = currentOdds
                }
              })
              oddsArr.push({
                min: minOdds,
                max: maxOdds
              })
            }
          }
        })
        count += nCount
        if (!this.isSFC) {
          oddsArr.map(item => {
            minArrMoney = minArrMoney * item.min
            maxArrMoney = maxArrMoney * item.max
          })
          minMoney.push(minArrMoney)
          maxMoney.push(maxArrMoney)
        }
      })
      return {
        count: count,
        min: minMoney.length > 0 ? Math.min(...minMoney) : 0,
        max: maxMoney.length > 0 ? maxMoney.reduce((prev, next) => {
          return prev + next
        }) : 0
      }
    },
    minus () {
      if (this.multiple <= 1) return
      this.multiple--
    },
    plus () {
      if (this.multiple >= 50) return
      this.multiple++
    },
    pupupShow (type) {
      if (this.chooseList.length === 0) return
      if (this.popupType === type) {
        if (this.popupVisible) {
          this.popupVisible = false
          return
        }
      } else {}
      if (type === 'mode') {
        if (this.chooseList.length < 2) return
      }
      this.popupType = type
      this.popupVisible = true
    },
    showPlayType (type) {
      const arr = ['HDA', 'HHDA', 'HILO']
      return arr.findIndex(item => item === type) > -1
    },
    save () {
      if (this.buttonDisable) return
      if (!this.isSingle && this.chooseList.length === 1) {
        return uni.showToast({title:'非单关场次请至少选择两场比赛',icon:'none'})
      }
      if (this.multiple === '') {
        return uni.showToast({title:'请填写投注倍数',icon:'none'})
      }
      if (parseInt(this.multiple) === 0) {
        return uni.showToast({title:'投注倍数不允许为0',icon:'none'})
      }
      this.popupVisible = false
      this.$emit('save')
    },
    focus (e) {
      if (this.popupVisible) {
        this.popupVisible = false
      }
      // clearTimeout(focusTimer)
      // setTimeout(() => {
      //   const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      //   document.documentElement.scrollTop = scrollHeight
      //   document.body.scrollTop = scrollHeight
      // }, 50)
    },
    blur () {
      // const top = document.documentElement.scrollTop + document.body.scrollTop
      // focusTimer = setTimeout(() => {
      //   document.documentElement.scrollTop = top
      //   document.body.scrollTop = top
      // }, 50)
    },
    delItem (e) {
      let id = e.target.id
      if (id) {
        id = id.split('-')
        this.choosePlayItem(id[0], id[1])
      }
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.bet-footer {
  flex-shrink: 0;
  background: #FFFFFF;
  box-shadow: 0 -1px 13px 0 rgba(0,0,0,0.10);
  z-index: 20;
  position: relative;
  &.popup {
    border-top: 1rpx solid #ebebeb;
  }
  &__config {
    position: relative;
    height: 106rpx;
    display: flex;
    align-items: center;
    z-index: 5;
    background: #FFFFFF;
    padding: 0 32rpx;
    &--choose {
      width: 90rpx;
      height: 46rpx;
      line-height: 46rpx;
      background: #F3F5F7;
      border-radius: 6rpx;
      color: #333;
      text-align: center;
      position: relative;
      &.disable {
        color: #bdbdbd;
      }
      .num {
        position: absolute;
        width: 32rpx;
        height: 32rpx;
        text-align: center;
        line-height: 32rpx;
        right: -16rpx;
        top: -16rpx;
        background: #65AFFF;
        color: #fff;
        border-radius: 16rpx;
        text {
          display: inline-block;
          transform: scale(.82) translateZ(0);
        }
      }
    }
    &--mode {
      height: 46rpx;
      line-height: 46rpx;
      margin-left: 60rpx;
      display: flex;
      white-space: nowrap;
      text {
        margin-right: 12rpx;
      }
      .select {
        position: relative;
        width: 200rpx;
        height: 100%;
        display: flex;
        border: 1px solid #ddd;
        .mode {
          flex: auto;
          height: 100%;
          padding-left: 8rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #333;
          &.zero {
            color: #f22;
          }
        }
        .arrows {
          width: 36rpx;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #F3F5F7;
          position: relative;
          border-radius: 0 6rpx 6rpx 0;
          flex-shrink: 0;
          border-left: 1rpx solid #ddd;
          image {
            width: 18rpx;
            height: 12rpx;
          }
        }
      }
    }
    &--multiple {
      height: 46rpx;
      line-height: 46rpx;
      margin-left: 50rpx;
      display: flex;
      white-space: nowrap;
      text {
        margin-right: 16rpx;
      }
      .number {
        width: 164rpx;
        height: 100%;
        display: flex;
        border: 1px solid #ddd;
        border-radius: 6rpx;
        .minus, .plus {
          flex-shrink: 0;
          width: 36rpx;
          height: 100%;
          text-align: center;
          background: #F3F5F7;
          position: relative;
          color: #999;
          &.disable {
            color: #d0d0d0;
          }
          .i {
            line-height: 42rpx;
            font-size: 32rpx;
            font-style: normal;
          }
        }
        .minus {
          border-right: 1rpx solid #ddd;
        }
        .plus {
          border-left: 1rpx solid #ddd;
        }
        .input {
          width: 88rpx;
          position: relative;
        }
        input {
          height: 100%;
          width: 88rpx;
          padding: 0;
          border: 0;
          text-align: center;
        }
      }
    }
  }
  &__result {
    position: relative;
    background: #FFFFFF;
    padding: 0 32rpx;
    height: 124rpx;
    align-items: center;
    display: flex;
    z-index: 5;
    &--money {
      height: 78rpx;
      flex: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .text {
        line-height: 34rpx;
        color: #333;
        font-weight: bold;
        text {
          margin-right: 10rpx;
        }
        .i {
          font-style: normal;
          font-weight: normal;
          font-family: $AGN;
          font-size: 32rpx;
          color: #f22;
        }
      }
      .text + .text {
        margin-top: 7rpx;
      }
    }
    &--button {
      width: 180rpx;
      height: 72rpx;
      line-height: 72rpx;
      text-align: center;
      flex-shrink: 0;
      background: #f22;
      color: #fff;
      font-weight: bold;
      font-size: 28rpx;
      border-radius: 36rpx;
      &.disable {
        background: #F3F5F7;
        color: #d0d0d0;
      }
    }
    &--sfc {
      position: absolute;
      right: 232rpx;
      top: 33rpx;
      height: 68rpx;
      text-align: right;
      p {
        line-height: 32rpx;
        color: #999;
        text {
          display: inline-block;
          transform: scale(.82) translateZ(0);
          transform-origin: 100% 50%;
        }
        &.count {
          color: #333;
        }
      }
    }
  }
  .bet-footer__config + .bet-footer__result {
    border-top: 1rpx solid #ebebeb;
  }
  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .7);
    transition: opacity .3s;
    opacity: 1;
  }
  &__popup {
    position: fixed;
    max-height: 85vh;
    overflow: hidden;
    background-color: #fff;
    opacity: 1;
    transition: transform .3s, opacity .3s;
    bottom: 0;
    left: 0;
    width: 100%;
    border-radius: 16rpx 16rpx 0 0;
    transform: translateZ(0);
    z-index: 1;
    display: flex;
    flex-direction: column;
    &--header {
      flex-shrink: 0;
      height: 100rpx;
      line-height: 100rpx;
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      position: relative;
      text-align: center;
      border-bottom: 1rpx solid #ebebeb;
      .close {
        position: absolute;
        cursor: pointer;
        width: 80rpx;
        height: 80rpx;
        right: 0;
        top: 10rpx;
        .i {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: rotate(180deg) translate3d(50%, 50%, 0);
        }
      }
      .clear {
        position: absolute;
        height: 60rpx;
        left: 32rpx;
        top: 20rpx;
        color: #65AFFF;
        display: flex;
        align-items: center;
        text {
          font-size: 24rpx;
          font-weight: normal;
          &.icon {
            width: 26rpx;
            height: 26rpx;
            margin-right: 4rpx;
            @include bg-image('/static/bet-assistant/icon-choose-clear.png');
          }
        }
      }
    }
    &--content {
      position: relative;
      flex: auto;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .mode {
        padding: 50rpx 19rpx 30rpx;
        font-size: 0;
        .li {
          display: inline-block;
          vertical-align: top;
          width: 150rpx;
          height: 60rpx;
          line-height: 60rpx;
          border-radius: 30rpx;
          text-align: center;
          margin: 0 14rpx 30rpx;
          background: #F5F8FF;
          color: #666;
          position: relative;
          font-size: 24rpx;
          cursor: pointer;
          &.choose {
            background: #fff4f4;
            color: #f22;
            border: 1px solid #f22;
            box-sizing: border-box;
          }
        }
      }
    }
    &--footer {
      flex-shrink: 0;
      height: 230rpx;
    }
  }
}
.bet-footer-match-detail {
  position: relative;
  padding: 30rpx 2rpx 10rpx;
  .team {
    height: 40rpx;
    line-height: 40rpx;
    font-size: 28rpx;
    color: #333;
    font-weight: bold;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    .home-left, .home-right {
      font-size: 24rpx;
      text-align: center;
      transform: scale(.66) translateZ(0);
    }
    .home-left {
      transform-origin: 0 50%;
    }
    .home-right {
      transform-origin: 100% 50%;
    }
    text {
      max-width: 300rpx;
      overflow-x: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .i {
      font-style: normal;
      font-weight: normal;
      font-size: 34rpx;
      font-family: $AGN;
      padding: 0 10rpx;
    }
  }
  .info {
    margin-top: 6rpx;
    line-height: 34rpx;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    text {
      margin-right: 26rpx;
      color: #999;
      &.league {
        color: #f22;
      }
    }
  }
  .odds {
    margin-top: 30rpx;
    .odds-item {
      position: relative;
      margin: 0 30rpx 30rpx;
      display: inline-block;
      .del {
        position: absolute;
        top: -16rpx;
        right: -16rpx;
        width: 32rpx;
        height: 32rpx;
        @include bg-image('/static/bet-assistant/icon-choose-del.png');
        z-index: 5;
        transform: translateZ(0);
      }
      .ul {
        background: #f4f4f4;
        border-radius: 6rpx;
        overflow: hidden;
        transform: translateZ(0);
        display: flex;
        position: relative;
        z-index: 0;
      }
      .li {
        position: relative;
        width: 186rpx;
        height: 80rpx;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #333;
        &.play-type {
          width: 80rpx;
          background: #f3f5f7;
        }
        .num {
          text-align: center;
          line-height: 26rpx;
          position: relative;
          font-size: 24rpx;
          .i {
            display: inline-block;
            transform: scale(.82) translateZ(0);
            font-style: normal;
          }
        }
      }
      .li + .li {
        border-left: 1rpx solid #fff;
      }
      &.no-name {
        margin-right: 64rpx;
        .li {
          font-size: 28rpx;
          font-family: $AGN, $PFR;
          .i {
            font-family: $PFR;
          }
        }
      }
      &.no-mr {
        margin-right: 0!important;
      }
    }
  }
}
.bet-footer-match-detail + .bet-footer-match-detail {
  &::before {
    content: '';
    position: absolute;
    top: 0;
    height: 1rpx;
    background: #ebebeb;
    left: 30rpx;
    right: 30rpx;
  }
}
.bet-foot-fade {
  &-enter-active, &-leave-active {
    opacity: 0;
  }
}
.bet-foot-bottom {
  &-enter-active, &-leave-active {
    transform: translate3d(0, 100%, 0);
  }
}
</style>
