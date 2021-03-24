var inputBase=require("../base/inputBase/inputBase");Component({behaviors:[inputBase],properties:{placeholderValue:{type:String,value:"请输入手机帐号"},autoFocus:{type:Boolean,value:true}},data:{area:"86",hide:true,maxLength:11,inputFocus:true},ready:function(){this.setOptions()},methods:{setArea:function(obj){this.setData({area:obj.area,maxLength:obj.area==="86"?11:50});this.selectComponent("#areaPicker").setArea(obj)},setMb:function(obj){this.setData({iValue:obj.mb})},onclear:function(){this.setData({iValue:""});this.doFocus();this.triggerEvent("mobileChange",{mobile:this.data.area+"-"+this.data.iValue})},onMobileInput:function(e){let obj={iValue:e.detail.value};this.setData(obj);this.triggerEvent("mobileChange",{mobile:this.data.area+"-"+this.data.iValue})},onHideArea:function(){this.data.hide=true;this.selectComponent("#areaPicker").onToggle({hide:this.data.hide})},onChangeArea:function(e){this.data.hide=!this.data.hide;this.selectComponent("#areaPicker").onToggle({hide:this.data.hide});if(!this.data.hide){this.triggerEvent("inputBlur",{});this.triggerEvent("focus",{from:"username-err"})}},onFocus:function(){this.triggerEvent("focus",{from:"username-err"})},onAreaChange:function(e){let area=e.detail.val;var maxLength=11;var tempValue;if(area!="86"){maxLength=50;tempValue=this.data.iValue}else{tempValue=this.data.iValue.slice(0,11)}this.setData({area:area,hide:true,maxLength:maxLength,iValue:tempValue});this.triggerEvent("areaChange",{area:this.data.area},{});this.triggerEvent("mobileChange",{mobile:this.data.area+"-"+this.data.iValue})},getValue:function(){return this.data.area+"-"+this.data.iValue},getNm:function(){return this.selectComponent("#areaPicker").getNm()},selectNm:function(_num){return this.selectComponent("#areaPicker").selectNm(_num)},changeMobileReg:function(){this.triggerEvent("areaChange",{area:this.data.area},{})}}});