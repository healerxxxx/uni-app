Component({lifetimes:{detached:function(){this.destroyCap();this.clearSto()}},detached:function(){this.destroyCap();this.clearSto()},properties:{screenwidthForCap:{type:String,default:"440rpx"},capkey:{type:String,default:""},aicapkey:{type:String,default:""},capFlag:{type:Number,default:0},autoVerify:{type:Boolean,default:false}},data:{capValue:"",apiServer:["webzjcaptcha.reg.163.com","c.dun.163yun.com"]},methods:{clearSto:function(){if(this.sto){clearTimeout(this.sto)}},handlerError:function(e){wx.showToast({title:"网络异常,请关闭小程序重试",icon:"none",duration:1500});this.sto=setTimeout(function(){this.triggerEvent("popupEnd",{},{})}.bind(this),1500)},handlerClose:function(){if(this.data.capFlag===6){}else{this.triggerEvent("close",{},{})}},handlerVerify:function(e){if(e.detail&&e.detail[1]){let cap=e.detail[1];this.setData({capValue:cap});this.triggerEvent("capCheck",{val:cap},{})}else{this.triggerEvent("firsterror",{})}},handlerReady:function(){this.triggerEvent("aiInitOk");if(this.data.autoVerify){this.triggerEvent("popupEnd",{notUnlock:true});this.doVerify()}},onStateSuccess:function(e){},onStateFail:function(){this.setData({capValue:""})},doVerify:function(){if(this.data.capFlag===6){this.selectComponent("#neCaptcha").verify()}else{this.selectComponent("#neCaptcha").popup()}},doReset:function(){this.selectComponent("#neCaptcha").reset()},handlerInit:function(){this.doVerify();this.triggerEvent("popupEnd",{},{})},destroyCap:function(){this.setData({capFlag:0})}}});