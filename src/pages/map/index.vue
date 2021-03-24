<template>
  <view class="map-wrapper">
    <view class="map__content">
      <map
        id="map"
        style="width: 100%; height: 100%;"
        :latitude="latitude"
        :longitude="longitude"
        :markers="markers"
        :scale="scale"
        @markertap="markerTap"
        @regionchange="regionchange">
        <cover-view
          class="map__content--current"
          @click="toCurrentLocation">
          <cover-image src="https://relottery.ws.126.net/thread/20210322/6TsxHw.png" />
        </cover-view>
        <cover-view class="map__content--marker-tip" v-if="markerTip && markerObj">
          <cover-view class="arrow"></cover-view>
          <cover-view class="main">
            <cover-view class="content">
              <cover-view class="p title">{{markerObj.title}}</cover-view>
              <cover-view class="p">{{markerObj.address}} | {{markerObj.distance}}米</cover-view>
            </cover-view>
            <cover-view class="to" @click.stop="openLocation">去这里</cover-view>
          </cover-view>
        </cover-view>
      </map>
    </view>
    <view class="map__list" @click="listPackUp = !listPackUp">
      <view class="map__list--title">
        <text>附近的彩票站（{{coversLen}}）</text>
        <view
          class="icon-arrows"
          v-if="covers.length > 0"
          :class="{'expend': !listPackUp}">
          <view class="i"></view>
        </view>
      </view>
      <view class="map__list--authorize" v-if="!authorize">
        <text class="tips">暂时无法获取您的位置</text>
        <button class="button" open-type="openSetting" @opensetting="getUserLocation">获取定位</button>
      </view>
      <view class="map__list--covers" v-else-if="!listPackUp && covers.length > 0">
        <scroll-view
          class="scroll"
          ref="scroll"
          scroll-y="true">
          <template v-for="item in covers">
            <view
              v-if="item.id !== 0"
              class="item"
              :key="item.id"
              @click="markerTap({detail: {markerId: item.id}})">
              <view class="title">{{item.title}}</view>
              <view class="address">{{item.address}} | {{item.distance}}米</view>
            </view>
          </template>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
const QQMapWX = require('../../utils/qqmap-wx-jssdk')
let qqmapsdk
let map = null
let markerObjTemp = null
export default {
  data () {
    return {
      authorize: true,
      listPackUp: false,
      id: 0, // 使用 marker点击事件 需要填写id
      title: 'map',
      latitude: 39.909,
      longitude: 116.39742,
      covers: [],
      scale: 13,
      markerObj: null,
      markerTip: false
    }
  },
  computed: {
    coversLen () {
      const { length } = this.covers
      return length === 0 ? 0 : length - 1
    },
    markers () {
      return this.covers.slice(0)
    }
  },
  created () {
    qqmapsdk = new QQMapWX({key: 'KTPBZ-FVUKU-P42VS-BEWML-BQIQV-CRBPQ'})
    this.getUserLocation()
  },
  mounted () {
    map = uni.createMapContext('map', this)
  },
  methods: {
    getUserLocation () {
      const that = this
      uni.getLocation({
        type: 'gcj02',
        success (res) {
          that.latitude = res.latitude
          that.longitude = res.longitude
          that.covers.push({
            id: 0,
            latitude: res.latitude,
            longitude: res.longitude
          })
          that.searchLotteryStation(1)
          that.authorize = true
        },
        fail () {
          uni.showToast({
            title: '获取定位失败',
            icon: 'none'
          })
          that.authorize = false
        }
      })
    },
    searchLotteryStation (pageIndex) {
      const pageSize = 20
      const that = this
      qqmapsdk.search({
        keyword: '彩票站',
        location: {
          latitude: this.latitude,
          longitude: this.longitude
        },
        page_size: pageSize,
        page_index: pageIndex,
        address_format: 'short',
        success: function (res) {
          res.data.map(item => {
            that.covers.push({
              id: parseInt(item.id),
              latitude: item.location.lat,
              longitude: item.location.lng,
              address: item.address,
              title: item.title,
              distance: item._distance,
              iconPath: '/static/icon-lottery-station-covers.png',
              width: '40rpx',
              height: '50rpx',
              callout: {
                bgColor: 'transparent',
                display: 'NONE'
              }
            })
          })
          if (res.count > pageSize && pageIndex * pageSize < res.count && pageIndex < 4) {
            that.searchLotteryStation(pageIndex + 1)
          }
        }
      })
    },
    toCurrentLocation () {
      this.markerTip = false
      markerObjTemp = null
      this.markerObj = null
      this.toLocation(this.longitude, this.latitude)
    },
    toLocation (lon, lat) {
      const that = this
      const move = () => {
        map.moveToLocation({
          longitude: lon,
          latitude: lat,
          success () {
            setTimeout(() => {
              if (markerObjTemp) {
                that.markerObj = markerObjTemp
                that.markerTip = true
              }
            }, 250)
          }
        })
      }
      if (markerObjTemp) {
        that.listPackUp = true
        this.$nextTick(() => {
          setTimeout(move, 100)
        })
      } else {
        move()
      }
    },
    markerTap (e) {
      this.scale = 13
      const id = e.detail.markerId
      const obj = this.covers.find(item => item.id === id && id !== 0)
      if (markerObjTemp) {
        if (markerObjTemp.id !== id) {
          this.markerTip = false
        }
      }
      if (obj) {
        markerObjTemp = obj
        this.toLocation(obj.longitude, obj.latitude)
      }
    },
    openLocation () {
      const local = this.markerObj
      if (!local) return
      const obj = {
        latitude: Number(local.latitude),
        longitude: Number(local.longitude),
        scale: 14,
        name: local.title,
        address: local.address
      }
      uni.openLocation(obj)
    },
    regionchange (e) {
      if (this.markerTip) {
        this.markerTip = false
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/style/mixin.scss'; 
.map {
  &-wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  &__content {
    width: 100%;
    height: 200rpx;
    flex: auto;
    position: relative;
    &--current {
      position: absolute;
      bottom: 10rpx;
      right: 10rpx;
      width: 96rpx;
      height: 96rpx;
    }
    &--marker-tip {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, 0, 0);
      background: transparent;
      .arrow {
        margin: 2px auto -10px;
        width: 18rpx;
        height: 18rpx;
        border-radius: 4rpx;
        transform: rotate(-45deg) translateZ(0);
        transform-origin: 50% 50%;
        background: #fff;
        z-index: 5;
      }
      .main {
        padding: 30rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
        margin-top: 8rpx;
        border-radius: 6rpx;
        .content {
          .p {
            color: #999;
            line-height: 34rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 400rpx;
            &.title {
              color: #333;
              font-size: 28rpx;
              line-height: 40rpx;
            }
          }
        }
        .to {
          margin-left: 40rpx;
          width: 110rpx;
          height: 44rpx;
          line-height: 44rpx;
          border: 1px solid #65afff;
          color: #65afff;
          border-radius: 22rpx;
          text-align: center;
        }
      }
    }
  }
  &__list {
    flex: 0;
    flex-shrink: 0;
    width: 100%;
    &--title {
      padding: 32rpx;
      display: flex;
      align-items: center;
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      position: relative;
      border-bottom: 1rpx solid #eee;
      .icon-arrows {
        width: 60rpx;
        height: 60rpx;
        position: absolute;
        right: 15rpx;
        top: 50%;
        margin-top: -30rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        .i {
          width: 16rpx;
          height: 26rpx;
          @include bg-image('/static/icon-arrows-right-d2.png');
          transform: rotate(-90deg) translateZ(0);
        }
        &.expend {
          .i {
            transform: rotate(90deg) translateZ(0);
          }
        }
      }
    }
    &--authorize {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20rpx 0 72rpx;
      .tips {
        margin-top: 75rpx;
        margin-bottom: 24rpx;
        color: #999;
        font-size: 28rpx;
      }
      .button {
        width: 180rpx;
        height: 72rpx;
        text-align: center;
        line-height: 72rpx;
        color: #fff;
        background: #f22;
        font-size: 28rpx;
        border-radius: 32rpx;
        font-weight: bold;
      }
    }
    &--covers {
      height: 500rpx;
      .scroll {
        width: 100%;
        height: 100%;
      }
      .item {
        padding: 40rpx 32rpx;
        position: relative;
        .title {
          color: #333;
          line-height: 40rpx;
          font-weight: bold;
          font-size: 28rpx;
        }
        .address {
          color: #999;
          margin-top: 4rpx;
          font-size: 24rpx;
          line-height: 34rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        &:first-child {
          padding-top: 24rpx;
        }
      }
      .item + .item {
        &::after {
          position: absolute;
          content: '';
          left: 32rpx;
          right: 0;
          top: 0;
          height: 1px;
          background: #ebebeb;
        }
      }
    }
  }
}
</style>
