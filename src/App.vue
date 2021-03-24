<script>
import { mapMutations, mapActions } from 'vuex'
export default {
  // onLaunch () {
  //   this.initApp()
  // },
  onShow () {
    this.initApp()
  },
  methods: {
    ...mapMutations(['getSystemInfo', 'getCustomInfo', 'setCookie']),
    ...mapActions(['getUserInfo']),
    initApp () {
      // #ifndef H5
      this.getSystemInfo()
      this.getCustomInfo()
      const cookie = uni.getStorageSync('COOKIE')
      if (cookie) {
        this.setCookie(cookie)
        this.getUserInfo()
      }
      // #endif
      // #ifdef H5
      this.getUserInfo()
      // #endif 
    }
  }
}
</script>
