import Vue from 'vue'
import App from './App'
import store from './store'
import * as filters from './utils/filters'
import service from './utils/service'
import { EventBus } from './utils/tools'
import LoadingData from './components/common/loading-data'
import LoadingMore from './components/common/loading-more'
import NetError from './components/common/net-error'
import NoData from './components/common/no-data'
import NavBar from './components/common/nav-bar'
import NoMore from './components/common/no-more'
import LotteryPopup from './components/common/lottery-popup'
import { mapActions } from 'vuex'
// 引入公共样式
import './assets/style/common.scss';

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus
    }
  }
})

App.mpType = 'app'
Vue.prototype.$service = service
Vue.component('loading-data', LoadingData)
Vue.component('loading-more', LoadingMore)
Vue.component('net-error', NetError)
Vue.component('no-data', NoData)
Vue.component('nav-bar', NavBar)
Vue.component('no-more', NoMore)
Vue.component('lottery-popup', LotteryPopup)

Vue.mixin({
  onShow () {
    if (!this.$store.state.userInfo.userId || !uni.getStorageSync('COOKIE')) {
      if (uni.getStorageSync('urs_loginToken')) {
        this.getUrsLoginCookie()
      }
    }
  },
  methods: {
    ...mapActions(['getUrsLoginCookie'])
  }
})

const app = new Vue({
  ...App,
  store
})
app.$mount()
