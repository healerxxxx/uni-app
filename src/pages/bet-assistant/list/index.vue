<template>
  <view class="bet-list">
    <nav-bar @back="back">
      <div class="bet-list__nav">
        <text class="title" @click="navClick">{{typeList[type].name || ''}}</text>
        <image class="arrows" src="/static/bet-assistant/icon-nav-arrows.svg" />
      </div>
    </nav-bar>
    <lottery-station :class="{'shadow': scrollTop > 0}" />
    <view class="bet-list__content">
      <scroll-view
        v-if="list.length > 0"
        class="bet-list__content--scroll"
        @scroll="contentScroll"
        scroll-y="true"
        :class="{'sfc': isSFC}">
        <view class="bet-list__content--degree" v-if="isSFC && currentDegree">
          <span @click="showDegreeList">
            <i>{{currentDegree}}</i>期
          </span>
          <span
            class="arrows"
            v-if="degreeList.length > 1"
            @click="showDegreeList">
          </span>
        </view>
        <template v-if="!isSFC">
          <match-list-expand
            v-for="(item, index) in list"
            :key="index">
            <match-by-date-header :info="item.group" slot="header" />
            <template slot="content">
              <match-list-detail
                v-for="_item in item.matchList"
                :key="_item.matchInfoId"
                :info="_item"
                :category-id="type"
                :choose-object="chooseMatchObject[_item.matchInfoId]"
                :is-choose="isChoose"
                :choose-play-item="choosePlayItem"
                @more="detailMore(_item)" />
            </template>
          </match-list-expand>
        </template>
        <template v-else>
          <sfc-list
            :list="list"
            :is-choose="isChoose"
            :choose-play-item="choosePlayItem" />
        </template>
      </scroll-view>
      <loading-data
        v-if="loading" />
      <no-data
        v-if="noData"
        text="暂无数据" />
    </view>
    <bet-footer
      v-if="list.length > 0"
      v-model="multiple"
      :mode="mode"
      :choose-list="chooseMatchList"
      :choose-object="chooseMatchObject"
      :lottery-type="type"
      :choose-play-item="choosePlayItem"
      :choose-mode="chooseMode"
      :is-single="isSingle"
      @save="saveBet"
      @clear-bet-list="clearBetList" />
    <match-detai
      v-model="matchDetailVisible"
      :category-id="type"
      :info="matchDetailInfo"
      :choose-match-object="chooseMatchObject"
      @confirm="matchDetailConfirm" />
    <switch-type-list
      v-model="typeVisible"
      :list="typeList"
      @switch="changeType" />
    <!-- <sfc-degree-list
      v-model="degreeVisible"
      :degree-index="degreeIndex"
      :list="degreeList"
      @confirm="swtchSfcBydegree" /> -->
  </view>
</template>

<script>
import { betList, betSave } from '@/utils/api/bet-assistant'
import LotteryStation from './components/lottery-station'
import MatchListExpand from './components/match-list-expand'
import MatchByDateHeader from './components/match-by-date-header'
import MatchListDetail from './components/match-list-detail'
import MatchDetai from './components/match-detai'
import SfcList from './components/sfc-list'
import BetFooter from './components/bet-footer'
import SwitchTypeList from './components/switch-type-list'
// import SfcDegreeList from './components/sfc-degree-list'
import { mapState, mapGetters, mapActions } from 'vuex'
let that
export default {
  name: 'App',
  data () {
    return {
      loading: false,
      type: 1,
      typeList: {
        1: {
          name: '竞足投注助手',
          class: 'anta-football'
        },
        2: {
          name: '竞篮投注助手',
          class: 'anta-basketball'
        // },
        // 4: {
        //   name: '任九投注助手',
        //   class: 'anta-9'
        // },
        // 3: {
        //   name: '胜负彩投注助手',
        //   class: 'anta-sfc'
        }
      },
      matchDetailVisible: false,
      matchDetailInfo: null,
      typeVisible: false,
      currentDegree: null,
      degreeVisible: false,
      degreeIndex: 0,
      infoList: null,
      chooseMatchList: [],
      chooseMatchObject: {},
      multiple: 1,
      mode: [],
      saveLoading: false,
      localData: null,
      scrollTop: 0
    }
  },
  computed: {
    ...mapGetters(['isLogin']),
    ...mapState(['userInfo']),
    isSFC () {
      const type = this.type + ''
      return type !== '1' && type !== '2'
    },
    list () {
      const { infoList, isSFC } = this
      if (!infoList || infoList.length < 1) return []
      if (isSFC) {
        return infoList[0].matchList || []
      } else {
        return infoList || []
      }
    },
    degreeList () {
      const { infoList, isSFC } = this
      if (isSFC && infoList && infoList[0]) {
        return infoList[0].groupList || []
      }
      return []
    },
    noData () {
      if (!this.loading && this.list.length > 0) {
        return false
      }
      return true
    },
    isSingle () {
      let flag = false
      this.chooseMatchList.map(key => {
        if (this.chooseMatchObject[key] && this.chooseMatchObject[key].playType.single === 1) {
          flag = true
        }
      })
      return flag
    }
  },
  components: {
    LotteryStation,
    MatchListExpand,
    MatchByDateHeader,
    MatchListDetail,
    SfcList,
    BetFooter,
    MatchDetai,
    SwitchTypeList
    // SfcDegreeList
  },
  created () {
    this.loading = true
    that = this
  },
  onLoad (optiaon) {
    const type = parseInt(optiaon.lotteryCategoryId)
    if (type) {
      this.type = type
    }
  },
  onShareAppMessage (res) {
    return {
      title: '竞彩投注助手',
    }
  },
  onShow () {
    this.updateData()
  },
  watch: {
    infoList (val) {
      const { isSFC } = this
      if (isSFC && val && val[0]) {
        this.currentDegree = val[0].group || null
        const i = val[0].groupList.findIndex(v => v === this.currentDegree)
        this.degreeIndex = i > -1 ? i : 0
      }
    },
    chooseMatchList: {
      deep: true,
      handler (val) {
        if (val.length === 0) {
          this.multiple = 1
        }
      }
    },
    list (val) {
      const { localData, type } = this
      const id = type + ''
      if (val.length > 0 && localData && localData.chooseMatchList && localData.chooseMatchList.length > 0) {
        const idArr = []
        const idObject = {}
        this.chooseMatchList = [...localData.chooseMatchList]
        this.chooseMatchObject = { ...localData.chooseMatchObject }
        this.multiple = localData.multiple
        this.mode = [...localData.mode]
        if (id === '3' || id === '4') {
          val.map(info => {
            if (localData.chooseMatchList.findIndex(i => i + '' === info.matchInfoId + '') > -1) {
              idArr.push(info.matchInfoId)
              idObject[info.matchInfoId] = info
            }
          })
        } else {
          val.map(item => {
            item.matchList.map(info => {
              if (localData.chooseMatchList.findIndex(i => i + '' === info.matchInfoId + '') > -1) {
                idArr.push(info.matchInfoId)
                idObject[info.matchInfoId] = info
              }
            })
          })
        }
        localData.chooseMatchList.map(id => {
          if (idArr.findIndex(i => i + '' === id + '') === -1 || (!this.isSFC && localData.chooseMatchObject[id] && idObject[id] && idObject[id].playMap[localData.chooseMatchObject[id].playType.playCode].sellStatus === 0)) {
            this.$delete(this.chooseMatchObject, id)
            this.chooseMatchList.splice(this.chooseMatchList.findIndex(item => item + '' === id + ''), 1)
            this.mode = []
          }
        })
        if ((id === '3' || id === '4') && localData.currentDegree !== this.currentDegree) {
          this.chooseMatchList = []
          this.chooseMatchObject = {}
        }
        this.localData = null
      }
    },
    multiple (val) {
      this.setLocalData()
    },
    mode () {
      this.setLocalData()
    },
    chooseMatchObject: {
      deep: true,
      handler () {
        this.setLocalData()
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
    updateData () {
      /**
       * 获取localStorage数据
       * 如果该彩种数据为空则，清空当前选择
       */
      this.getLocalData()
      if (!this.localData || !this.localData.chooseMatchList || this.localData.chooseMatchList.length === 0) {
        this.chooseMatchList = []
        this.chooseMatchObject = {}
        this.multiple = 1
        this.mode = []
      }
      this.getListByType()
    },
    navClick () {
      !this.loading && (this.typeVisible = true)
    },
    detailMore (info) {
      const string = JSON.stringify({ ...info })
      this.matchDetailInfo = JSON.parse(string)
      this.matchDetailVisible = true
    },
    changeType (val) {
      if ((this.type + '') === (val + '')) return
      this.type = val
      this.loading = true
      this.infoList = null
      this.degreeIndex = 0
      this.currentDegree = null
      this.chooseMatchList = []
      this.chooseMatchObject = {}
      this.multiple = 1
      this.mode = []
      this.getLocalData()
      this.getListByType()
    },
    getListByType () {
      const params = {
        lotteryCategoryId: this.type
      }
      if (this.isSFC && this.currentDegree) {
        params.matchSFCDegree = this.currentDegree
      }
      this.$service(betList, {
        method: 'get',
        data: params
      }).then(res => {
        if (res.code === 200) {
          this.infoList = res.data
        }
      }).finally(() => {
        this.loading = false
      })
    },
    showDegreeList () {
      if (this.degreeList.length < 2) return
      this.degreeVisible = true
    },
    swtchSfcBydegree (i) {
      this.degreeIndex = i
      this.currentDegree = this.degreeList[i]
      this.loading = true
      this.infoList = null
      this.getLocalData()
      this.getListByType()
    },
    isChoose (playItem, playCode, id) {
      const obj = that.chooseMatchObject[id]
      if (!obj) return false
      return obj && obj.playType.playCode === playCode && obj[playItem.playItemCode]
    },
    choosePlayItem (playItem, playType, matchInfo) {
      if (arguments.length === 2) {
        playItem = that.chooseMatchObject[arguments[0]][arguments[1]], 
        playType = {
          playCode: that.chooseMatchObject[arguments[0]].playType.playCode
        }
        matchInfo = { matchInfoId: arguments[0] }
      }
      const type = that.type + ''
      const id = matchInfo.matchInfoId + ''
      if (!that.isSFC && playType.sellStatus === 0) return
      if (!that.chooseMatchObject[id]) {
        if ((type === '1' || type === '2') && that.chooseMatchList.length >= 8) {
          return uni.showToast({title:'最多可选择8场比赛',icon:'none'})
        }
        if (type === '4' && that.chooseMatchList.length >= 9) {
          return uni.showToast({title:'任九只能选择9场比赛哦',icon:'none'})
        }
        that.$set(that.chooseMatchObject, id, {
          single: matchInfo.single,
          homeTeam: matchInfo.homeTeam.teamName,
          guestTeam: matchInfo.guestTeam.teamName,
          leagueMatchColor: matchInfo.leagueMatchColor,
          leagueMatchName: matchInfo.leagueMatchName,
          jcNum: matchInfo.jcNum,
          matchTime: matchInfo.matchTime,
          matchNum: matchInfo.matchNum,
          playType: Object.freeze({
            playId: playType.playId,
            playName: playType.playName,
            playCode: playType.playCode,
            concede: playType.concede,
            single: playType.single
          }),
          chooseList: [playItem.playItemCode]
        })
        that.$set(that.chooseMatchObject[id], playItem.playItemCode, Object.freeze(playItem))
        that.chooseMatchList.push(id)
        that.mode = [that.chooseMatchList.length]
      } else {
        const obj = that.chooseMatchObject[id]
        if (obj.playType.playCode !== playType.playCode) {
          uni.showToast({title:'选择多种玩法，要再开一单进行选择哦',icon:'none'})
        } else {
          if (obj[playItem.playItemCode]) {
            that.$delete(obj, playItem.playItemCode)
            const i = obj.chooseList.findIndex(item => item === playItem.playItemCode)
            if (i > -1) {
              obj.chooseList.splice(i, 1)
            }
          } else {
            that.$set(obj, playItem.playItemCode, playItem)
            obj.chooseList.push(playItem.playItemCode)
          }
          if (obj.chooseList.length === 0) {
            that.$delete(that.chooseMatchObject, id)
            that.chooseMatchList.splice(that.chooseMatchList.findIndex(item => item + '' === id + ''), 1)
            that.mode = []
          }
        }
      }
    },
    matchDetailConfirm (info) {
      const { choose, id } = info
      const i = this.chooseMatchList.findIndex(i => id + '' === i + '')
      if (choose) {
        if (i === -1) {
          if (this.chooseMatchList.length >= 8) {
            return uni.showToast({title:'最多可选择8场比赛',icon:'none'})
          }
          this.chooseMatchList.push(id)
          this.mode = [this.chooseMatchList.length]
        }
        this.chooseMatchObject[id] = choose
      } else {
        this.$delete(this.chooseMatchObject, id)
        if (i > -1) {
          this.chooseMatchList.splice(i, 1)
          this.mode = []
        }
      }
    },
    clearBetList () {
      this.chooseMatchObject = {}
      this.chooseMatchList = []
    },
    chooseMode (val) {
      const i = that.mode.findIndex(i => i === val)
      if (i > -1) {
        that.mode.splice(i, 1)
      } else {
        that.mode.push(val)
      }
    },
    saveBet () {
      if (!this.isLogin) {
        uni.navigateTo({
          url: '/pages/user/login'
        })
        return
      }
      if (this.saveLoading) return
      this.saveLoading = true
      const categoryId = this.type + ''
      const data = {
        lotteryCategoryId: categoryId,
        ggTypes: this.mode.join(','),
        multiple: this.multiple
      }
      if (categoryId === '3' || categoryId === '4') {
        data.matchSFCDegree = this.currentDegree
      } else {
        if (this.mode.length < 1) {
          return uni.showToast({titile:'请选择过关方式',icon:'none'})
        }
      }
      const matchArr = []
      this.chooseMatchList.map(id => {
        const item = this.chooseMatchObject[id]
        const playItemArr = []
        item.chooseList.map(playItemCode => {
          playItemArr.push(`${item[playItemCode].playItemCode}#${item[playItemCode].odds || 0}`)
        })
        matchArr.push(`${id}|${categoryId === '3' || categoryId === '4' ? item.matchNum : item.playType.playId + '|' + item.playType.single}[${playItemArr.join(',')}]`)
      })
      data.betList = matchArr.join('/')
      this.$service(betSave, {
        method: 'post',
        data: data
      }).then(res => {
        if (res.code === 200) {
          uni.showToast({title:'保存成功',icon:'none'})
          uni.navigateTo({
            url: `/pages/bet-assistant/detail/index?betId=${res.data}&from=bet_assistant_list`
          })
        } else {
          uni.showToast({title:res.message,icon:'none'})
        }
      }).catch(err => {
        err && uni.showToast({title:'网络异常，请稍后再试',icon:'none'})
      }).finally(() => {
        this.saveLoading = false
      })
    },
    getLocalData () {
      try {
        let obj = uni.getStorageSync('betassistant')
        if (obj) {
          obj = JSON.parse(obj)
          if (obj[this.type]) {
            this.localData = obj[this.type]
          }
        }
      } catch (error) {
      }
    },
    setLocalData () {
      const data = {
        currentDegree: this.currentDegree,
        chooseMatchList: this.chooseMatchList,
        chooseMatchObject: this.chooseMatchObject,
        multiple: this.multiple,
        mode: this.mode
      }
      try {
        let setObj = {}
        if (uni.getStorageSync('betassistant')) {
          const obj = JSON.parse(uni.getStorageSync('betassistant'))
          if (obj) {
            setObj = obj
          }
        }
        setObj[this.type] = data
        uni.setStorageSync('betassistant', JSON.stringify(setObj))
      } catch (error) {
      }
    },
    contentScroll (e) {
      this.scrollTop = e.detail.scrollTop
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/style/mixin.scss";
.icon-arrows-expand {
  width: 20rpx;
  height: 14rpx;
}
.bet-list {
  width: 750rpx;
  height: 100vh;
  // overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  user-select: none;
  background: #f3f5f7;
  .icon-odds-up, .icon-odds-down {
    height: 16rpx;
    width: 16rpx;
  }
  .icon-odds-up {
    @include bg-image('/static/bet-assistant/icon-odds-up.png');
  }
  .icon-odds-down {
    @include bg-image('/static/bet-assistant/icon-odds-down.png');
  }
  &__nav {
    display: flex;
    justify-content: center;
    align-items: center;
    .arrows {
      margin-left: 12rpx;
      width: 14rpx;
      height: 12rpx;
    }
  }
  &__content {
    flex: auto;
    position: relative;
    display: flex;
    overflow: hidden;
    &--degree {
      position: relative;
      height: 96rpx;
      background: #fff;
      display: flex;
      align-items: center;
      padding-left: 32rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      border-bottom: 1rpx solid #ededed;
      i {
        font-style: normal;
        font-weight: normal;
        font-size: 36rpx;
        font-family: $AGN;
      }
      .arrows {
        width: 12rpx;
        height: 10rpx;
        margin-left: 10rpx;
        @include bg-image('/static/bet-assistant/icon-arrows-down-999.svg');
      }
    }
    &--scroll {
      flex: auto;
      .match-list-expand {
        margin-bottom: 16rpx;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  .shadow {
    box-shadow: 0 1rpx 13rpx 0 rgba(0, 0, 0, 0.1);
    z-index: 10;
  }
}
</style>
