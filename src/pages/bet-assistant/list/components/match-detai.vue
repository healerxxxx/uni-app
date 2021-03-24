<template>
  <lottery-popup
    v-model="visible"
    position="bottom"
    round
    closeable
    close-style="margin-top: 20rpx;">
    <view class="match-detail-bet">
      <view class="match-detail__title">
        {{title}}
      </view>
      <view class="match-detail__scroll" v-if="info">
        <scroll-view
          style="height: 100%"
          scroll-y="true">
          <view class="match-detail__content">
            <view
              class="match-detail__content--info"
              @click="toMatchDetail(info.matchInfoId)">
              <view class="dan" v-if="info.single === 1">单</view>
              <view v-if="!isBasket" class="home-left">[主]</view>
              <text class="span">{{isBasket ? info.guestTeam.teamName : info.homeTeam.teamName}}</text>
              <text class="i">VS</text>
              <text class="span">{{isBasket ? info.homeTeam.teamName : info.guestTeam.teamName}}</text>
              <view v-if="isBasket" class="home-right">[主]</view>
              <view class="arrows"></view>
            </view>
            <view
              class="match-detail__content--title"
              v-if="info.playMap.HDA || info.playMap.HHDA">胜平负</view>
            <view
              class="match-detail__content--win-lose"
              v-if="info.playMap.HDA || info.playMap.HHDA">
              <view class="play-type">
                <view class="ul" v-if="info.playMap.HDA">
                  <view class="li">
                    <view class="num">{{info.playMap.HDA.playName}}<br/><b>{{info.playMap.HDA.concede}}</b></view>
                  </view>
                </view>
                <view class="ul" v-if="info.playMap.HHDA">
                  <view class="li">
                    <view class="num">{{info.playMap.HHDA.playName}}<br/><b>{{info.playMap.HHDA.concede}}</b></view>
                  </view>
                </view>
              </view>
              <view class="odds">
                <view class="ul" v-if="info.playMap.HDA">
                  <view class="li"
                    v-for="(item, index) in info.playMap.HDA.playItemList"
                    :key="index"
                    :class="{
                      'choose': isChoose(item, 'HDA'),
                      'basket': isBasket,
                      'disable': info.playMap.HDA.sellStatus === 0
                    }"
                    @click="choosePlayItem(item, info.playMap.HDA)">
                    <view class="num">{{item.playItemName}}<br/><b>{{item.odds}}</b><i class="icon-odds-up" v-if="item.oddsChange === 1"></i><i class="icon-odds-down" v-if="item.oddsChange === 2"></i></view>
                  </view>
                </view>
                <view class="ul" v-if="info.playMap.HHDA">
                  <view
                    class="li"
                    v-for="(item, index) in info.playMap.HHDA.playItemList"
                    :key="index"
                    :class="{
                      'choose': isChoose(item, 'HHDA'),
                      'basket': isBasket,
                      'disable': info.playMap.HHDA.sellStatus === 0
                    }"
                    @click="choosePlayItem(item, info.playMap.HHDA)">
                    <view class="num">{{item.playItemName}}<br/><b>{{item.odds}}</b><i class="icon-odds-up" v-if="item.oddsChange === 1"></i><i class="icon-odds-down" v-if="item.oddsChange === 2"></i></view>
                  </view>
                </view>
              </view>
            </view>
            <view
              class="match-detail__content--title"
              v-if="info.playMap.FBF">比分</view>
            <view
              class="match-detail__content--score"
              v-if="info.playMap.FBF">
              <view class="ul">
                <view class="li"
                  v-for="(item, index) in info.playMap.FBF.playItemList"
                  :key="index"
                  :class="{
                    'choose': isChoose(item, 'FBF'),
                    'no-line': index === 7 || index === 13 || index === 13 || index === 18 || index === 25,
                    'line-top': index > 6,
                    'others': index === 12 || index === 30,
                    'draw-others': index === 17,
                    'disable': info.playMap.FBF.sellStatus === 0
                  }"
                  @click="choosePlayItem(item, info.playMap.FBF)">
                  <view class="num">{{item.playItemName}}<br/><b>{{item.odds}}</b><i class="icon-odds-up" v-if="item.oddsChange === 1"></i><i class="icon-odds-down" v-if="item.oddsChange === 2"></i></view>
                </view>
              </view>
            </view>
            <view
              class="match-detail__content--title"
              v-if="info.playMap.FJQ">总进球</view>
            <view
              class="match-detail__content--goals"
              v-if="info.playMap.FJQ">
              <view class="ul">
                <view class="li"
                  v-for="(item, index) in info.playMap.FJQ.playItemList"
                  :key="index"
                  :class="{
                    'choose': isChoose(item, 'FJQ'),
                    'no-line': index === 4,
                    'line-top': index > 3,
                    'disable': info.playMap.FJQ.sellStatus === 0
                  }"
                  @click="choosePlayItem(item, info.playMap.FJQ)">
                  <view class="num">{{item.playItemName}}<br/><b>{{item.odds}}</b><i class="icon-odds-up" v-if="item.oddsChange === 1"></i><i class="icon-odds-down" v-if="item.oddsChange === 2"></i></view>
                </view>
              </view>
            </view>
            <view
              class="match-detail__content--title"
              v-if="info.playMap.FBQC">半全场</view>
            <view
              class="match-detail__content--hafl-all"
              v-if="info.playMap.FBQC">
              <view class="ul">
                <view class="li"
                  v-for="(item, index) in info.playMap.FBQC.playItemList"
                  :key="index"
                  :class="{
                    'choose': isChoose(item, 'FBQC'),
                    'no-line': index === 3 || index === 6,
                    'line-top': index > 2,
                    'disable': info.playMap.FBQC.sellStatus === 0
                  }"
                  @click="choosePlayItem(item, info.playMap.FBQC)">
                  <view class="num">{{item.playItemName}}<br/><b>{{item.odds}}</b><i class="icon-odds-up" v-if="item.oddsChange === 1"></i><i class="icon-odds-down" v-if="item.oddsChange === 2"></i></view>
                </view>
              </view>
            </view>
            <view
              class="match-detail__content--title"
              v-if="info.playMap.HILO">大小分</view>
            <view
              class="match-detail__content--win-lose"
              v-if="info.playMap.HILO">
              <view class="play-type">
                <view class="ul">
                  <view class="li hilo">
                    <view class="num">{{info.playMap.HILO.playName}}<br/><b>{{info.playMap.HILO.concede}}</b></view>
                  </view>
                </view>
              </view>
              <view class="odds">
                <view class="ul">
                  <view
                    class="li"
                    v-for="(item, index) in info.playMap.HILO.playItemList"
                    :key="index"
                    :class="{
                      'choose': isChoose(item, 'HILO'),
                      'basket': isBasket,
                      'disable': info.playMap.HILO.sellStatus === 0
                    }"
                    @click="choosePlayItem(item, info.playMap.HILO)">
                    <view class="num">{{item.playItemName}}<br/><b>{{item.odds}}</b><i class="icon-odds-up" v-if="item.oddsChange === 1"></i><i class="icon-odds-down" v-if="item.oddsChange === 2"></i></view>
                  </view>
                </view>
              </view>
            </view>
            <view
              class="match-detail__content--title"
              v-if="info.playMap.BSFC">胜分差</view>
            <view
              class="match-detail__content--between"
              v-if="info.playMap.BSFC">
              <view class="play-type">
                <view class="ul">
                  <view class="li">
                    <view class="num">客胜</view>
                  </view>
                </view>
                <view class="ul">
                  <view class="li">
                    <view class="num">主胜</view>
                  </view>
                </view>
              </view>
              <view class="odds">
                <view class="ul" v-if="info.playMap.BSFC">
                  <view class="li"
                    v-for="(item, index) in info.playMap.BSFC.playItemList"
                    :key="index"
                    :class="{
                      'choose': isChoose(item, 'BSFC'),
                      'disable': info.playMap.BSFC.sellStatus === 0,
                      'no-line': index === 6,
                      'line-top': index > 5,
                    }"
                    @click="choosePlayItem(item, info.playMap.BSFC)">
                    <view class="num">{{item.playItemName}}<br/><b>{{item.odds}}</b><i class="icon-odds-up" v-if="item.oddsChange === 1"></i><i class="icon-odds-down" v-if="item.oddsChange === 2"></i></view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
      <view class="match-detail__confirm">
        <view
          class="match-detail__confirm--button"
          :class="{'disable': len === 0}"
          @click="confirm">确定</view>
      </view>
    </view>
  </lottery-popup>
</template>

<script>
export default {
  name: 'match-detail',
  props: ['value', 'info', 'category-id', 'choose-match-object'],
  data () {
    return {
      chooseObject: {}
    }
  },
  computed: {
    visible: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    isBasket () {
      const id = this.categoryId + ''
      return id === '2'
    },
    len () {
      const { chooseObject } = this
      let len = 0
      if (chooseObject && chooseObject.chooseList) {
        len = chooseObject.chooseList.length
      }
      return len
    },
    title () {
      return this.len > 0 ? `已选${this.len}项` : '更多玩法'
    }
  },
  mounted () {
  },
  watch: {
    visible (val) {
      if (val) {
        // this.$nextTick(() => {
        //   setTimeout(() => {
        //     this.$refs.scroll.scrollTop = 0
        //   })
        // })
      }
      const obj = this.chooseMatchObject[this.info.matchInfoId]
      if (obj) {
        this.chooseObject = JSON.parse(JSON.stringify(obj))
      } else {
        this.chooseObject = {}
      }
    }
  },
  methods: {
    toMatchDetail (id) {
      uni.navigateTo({
        url: `/pages/match-detail/index?matchInfoId=${id}`
      })
    },
    confirm () {
      if (this.len === 0) return
      this.visible = false
      this.$emit('confirm', {
        choose: Object.keys(this.chooseObject).length > 0 ? this.chooseObject : null,
        id: this.info.matchInfoId
      })
    },
    isChoose (playItem, playCode) {
      return this.chooseObject.playType && this.chooseObject.playType.playCode === playCode && this.chooseObject[playItem.playItemCode]
    },
    choosePlayItem (playItem, playType) {
      if (playType.sellStatus === 0) return
      const { info, chooseObject } = this
      if (chooseObject.chooseList) {
        if (chooseObject.playType.playCode !== playType.playCode) {
          uni.showToast({title:'选择多种玩法，要再开一单进行选择哦',icon:'none'})
        } else {
          if (chooseObject[playItem.playItemCode]) {
            this.$delete(chooseObject, playItem.playItemCode)
            const i = chooseObject.chooseList.findIndex(item => item === playItem.playItemCode)
            if (i > -1) {
              chooseObject.chooseList.splice(i, 1)
            }
          } else {
            this.$set(chooseObject, playItem.playItemCode, playItem)
            chooseObject.chooseList.push(playItem.playItemCode)
          }
          if (chooseObject.chooseList.length === 0) {
            this.chooseObject = {}
          }
        }
      } else {
        this.$set(chooseObject, 'single', info.single)
        this.$set(chooseObject, 'homeTeam', info.homeTeam.teamName)
        this.$set(chooseObject, 'guestTeam', info.guestTeam.teamName)
        this.$set(chooseObject, 'leagueMatchColor', info.leagueMatchColor)
        this.$set(chooseObject, 'leagueMatchName', info.leagueMatchName)
        this.$set(chooseObject, 'jcNum', info.jcNum)
        this.$set(chooseObject, 'matchTime', info.matchTime)
        this.$set(chooseObject, 'matchNum', info.matchNum)
        this.$set(chooseObject, 'playType', Object.freeze({
          playId: playType.playId,
          playName: playType.playName,
          playCode: playType.playCode,
          concede: playType.concede,
          single: playType.single
        }))
        this.$set(chooseObject, playItem.playItemCode, playItem)
        this.$set(chooseObject, 'chooseList', [playItem.playItemCode])
      }
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/style/mixin.scss";
.match-detail {
  &-bet {
    height: 85vh!important;
    display: flex;
    flex-direction: column;
  }
  &__title {
    flex-shrink: 0;
    height: 100rpx;
    line-height: 100rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    position: relative;
    text-align: center;
    border-bottom: 1rpx solid #ebebeb;
  }
  &__scroll {
    height: 40vh;
    flex: auto;
    position: relative;
  }
  &__content {
    padding: 0 32rpx;
    position: relative;
    &--info {
      padding: 50rpx 0 20rpx;
      line-height: 40rpx;
      display: flex;
      align-items: center;
      font-size: 28rpx;
      color: #333;
      font-weight: bold;
      position: relative;
      .dan {
        width: 36rpx;
        height: 36rpx;
        line-height: 36rpx;
        background: #65AFFF;
        border-radius: 7rpx;
        color: #fff;
        text-align: center;
        transform: scale(.82) translateZ(0);
        transform-origin: 0 50%;
        margin-right: 10rpx;
      }
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
      .span {
        max-width: 220rpx;
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
      .arrows {
        position: absolute;
        right: 0;
        top: 58rpx;
        width: 14rpx;
        height: 24rpx;
        @include bg-image('/static/bet-assistant/icon-arrows-right-999.png');
      }
    }
    &--title {
      line-height: 40rpx;
      color: #1a1a1a;
      font-size: 28rpx;
      font-weight: bold;
      text-align: center;
      padding: 32rpx 0 20rpx;
    }
    &--win-lose, &--score, &--goals, &--hafl-all, &--hilo, &--between {
      .ul {
        display: flex;
        flex-wrap: wrap;
      }
      .ul, .li {
        position: relative;
      }
      .li {
        position: relative;
        height: 80rpx;
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
        color: #333;
        &.disable {
          color: #999!important;
        }
        &.hilo {
          letter-spacing: -1px;
        }
        .num {
          text-align: center;
          line-height: 28rpx;
          position: relative;
          font-size: 24rpx;
          .b {
            font-size: 24rpx;
            display: inline-block;
            transform: scale(.82) translateZ(0);
            font-weight: normal;
            font-family: $PFR;
            letter-spacing: normal;
          }
          .i {
            display: block;
            position: absolute;
            top: 50%;
            margin-top: 4rpx;
            left: 100%;
            margin-left: 4rpx;
          }
        }
        &.choose {
          background: #65AFFF;
          color: #fff;
        }
        &.line-top {
          box-sizing: border-box;
          border-top: 1px solid #fff;
        }
        &.no-line {
          border-left: 0;
        }
      }
      .ul + .ul {
        box-sizing: border-box;
        border-top: 1px solid #fff;
      }
      .li + .li {
        box-sizing: border-box;
        border-left: 1px solid #fff;
      }
    }
    &--score, &--goals, &--hafl-all, &--hilo {
      background: #f4f4f4;
      border-radius: 6rpx;
      overflow: hidden;
      transform: translateZ(0);
    }
    &--win-lose, &--between {
      display: flex;
      .play-type, .odds {
        .ul {
          background: #f4f4f4;
          border-radius: 6rpx;
          overflow: hidden;
          transform: translateZ(0);
        }
      }
      .play-type {
        flex-shrink: 0;
        width: 80rpx;
        margin-right: 48rpx;
        .ul {
          background: #F3F5F7;
        }
        .li {
          width: 80rpx;
        }
      }
      .odds {
        width: 558rpx;
        .li {
          width: 186rpx;
          &.basket {
            width: 279rpx;
          }
        }
      }
    }
    &--between {
      .play-type {
        margin-right: 18rpx;
      }
      .odds {
        width: 588rpx;
        .li {
          width: 98rpx;
        }
      }
    }
    &--score, &--goals, &--hilo, &--between .odds {
      .li {
        .num {
          font-size: 28rpx;
          font-family: $AGN, $PFR;
        }
      }
    }
    &--score {
      .li {
        width: 98rpx;
        &.others {
          width: 196rpx;
          .num {
            font-size: 24rpx!important;
          }
        }
        &.draw-others {
          width: 294rpx;
          .num {
            font-size: 24rpx!important;
          }
        }
      }
    }
    &--goals {
      .li {
        width: 25%;
      }
    }
    &--hafl-all {
      .li {
        width: 33.33333%;
      }
    }
    &--hilo {
      .li {
        width: 50%;
      }
    }
  }
  &__confirm {
    padding: 32rpx 30rpx;
    flex-shrink: 0;
    &--button {
      height: 88rpx;
      line-height: 88rpx;
      border-radius: 44rpx;
      text-align: center;
      background: #ff2222;
      color: #fff;
      font-size: 28rpx;
      font-weight: bold;
      &.disable {
        background: #F3F5F7;
        color: #d0d0d0;
      }
    }
  }
}
</style>
