/*
 * @Description: file content
 * @Company: Netease
 * @Author: lijida@corp.netease.com
 * @Date: 2021-02-23 18:35:05
 * @LastEditors: lijida
 * @LastEditTime: 2021-03-19 20:52:17
 */

import Vue from 'vue'
import Vuex from 'vuex'
import { userInfo, getCookie, userInit, userMiniInit } from '../utils/api/common'
import service from '../utils/service'
Vue.use(Vuex)

const state = {
  systemInfo: null,
  customInfo: null,
  cookie: null,
  userInfo: {},
  matchFilterData: null
}

const getters = {
  statusBarHeight (state) {
    const { systemInfo } = state
    return (systemInfo && systemInfo.statusBarHeight) || 20
  },
  customBar () {
    const { systemInfo, customInfo } = state
    if (systemInfo && customInfo) {
      return customInfo.height + (customInfo.top - systemInfo.statusBarHeight) * 2 + 4
    }
    return 44
  },
  windowScale (state) {
    return state.systemInfo.windowWidth / 750
  },
  isLogin (state) {
    const { userInfo } = state
    return !!(userInfo && userInfo.userId)
  },
  isNewUser (state) {
    const { userInfo } = state
    return userInfo && userInfo.newUser
  },
  safeBottom (state) {
    const { systemInfo } = state
    return (systemInfo && systemInfo.safeAreaInsets && systemInfo.safeAreaInsets.bottom) || 0
  }
}
const mutations = {
  getSystemInfo (state) {
    const systemInfo = uni.getSystemInfoSync()
    if (systemInfo) {
      state.systemInfo = systemInfo
    }
  },
  getCustomInfo (state, info) {
    const custom = uni.getMenuButtonBoundingClientRect()
    if (custom) {
      state.customInfo = custom
    }
  },
  setCookie (state, cookie) {
    state.cookie = cookie
  },
  setUserInfo (state, userInfo) {
    state.userInfo = userInfo
  },
  setMatchFilterData (state, data) {
    state.matchFilterData = data
  }
}

const actions = {
  getUserInfo ({ commit }) {
    return service(userInfo).then(res => {
      if (res.code === 200) {
        commit('setUserInfo', res.data)
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    }, err => {
      return Promise.reject(err)
    })
  },
  userInit ({ dispatch, commit }, params) {
    let url = userInit
    if (params && (params.from === 'miniProPhone' || params.from === 'miniProUrs')) {
      url = userMiniInit
    }
    const postParams = {}
    if (params && params.from === 'miniProPhone') {
      if (params.avatar) {
        postParams['avatar'] = params.avatar
      }
      if (params.nickname) {
        postParams['nickname'] = params.nickname
      }
      if (typeof params.gender !== 'undefined') {
        postParams['gender'] = params.gender
      }
      if (params.avatar) {
        postParams['platform'] = params.platform
      }
    }
    return service(url, {
      method: 'post',
      data: postParams
    }).then(res => {
      if (res.code === 200) {
        // 调取登录信息
        return dispatch('getUserInfo')
      } else {
        return Promise.reject(new Error(res.message))
      }
    }, err => {
      return Promise.reject(err)
    })
  },
  getUrsLoginCookie ({dispatch, commit}) {
    return service(getCookie, {
      method: 'post',
      data: {
        token: uni.getStorageSync('urs_loginToken').val
      }
    }).then(res => {
      if (res.code === 200) {
        uni.removeStorageSync('urs_loginToken')
        const cookies = res.data.cookies
        const userInfoCookie = `NTES_SESS=${cookies['NTES_SESS']};misc=${cookies['misc']};mobile=${cookies['mobile']};ssn=${cookies['ssn']}`
        // 本地存储Cookie
        uni.setStorageSync('COOKIE', userInfoCookie)
        // Vuex全局设置Cookie
        commit('setCookie', userInfoCookie)
        // 初始化用户
        return dispatch('userInit', {
          from: 'miniProUrs'
        })
      } else {
        return Promise.reject(new Error(res.message))
      }
    }, err => {
      if (err) {
        return Promise.reject(err)
      }
    })
  },
  loginOut ({ commit }) {
    commit('setUserInfo', {})
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
