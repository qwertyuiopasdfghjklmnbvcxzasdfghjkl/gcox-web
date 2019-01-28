<template>
  <div class="page">
    <cp-top-back :showRight="false">
      <h1>{{$t('business.MERCHANT_APPLICATION')}}<!--商家申请--></h1>
    </cp-top-back>

    <div class="page-main content">
      <div class="inner">
        <label for="">{{$t('business.MOBILE')}}：</label>
        <div class="inpwp">
          <input 
            @blur="valVerify('mobile','blur')" 
            @input="valVerify('mobile','input')" 
            name="mobile" 
            v-model="formData.mobile" 
            :placeholder="$t('public0.public287')+$t('business.MOBILE')"
            :class="{error:showTip.mobile}"><!--手机号-->
          <p v-show="showTip.mobile" class="infor"><img width="14" src="../../assets/img/i-tiperr.png" alt=""> {{megTip.mobile}}</p>
        </div>
      </div>
      <div class="inner">
        <label for="">{{$t('business.WECHAT')}}：</label>
        <div class="inpwp">
          <input
            @blur="valVerify('wechat','blur')" 
            @input="valVerify('wechat','input')" 
            name="wechat" 
            v-model="formData.wechat" 
            :placeholder="$t('public0.public287')+$t('business.WECHAT')"
            :class="{error:showTip.wechat}"><!--微信号-->
          <p v-show="showTip.wechat" class="infor"><img width="14" src="../../assets/img/i-tiperr.png" alt="">  {{megTip.wechat}}</p>
        </div>
      </div>
      <div class="inner">
        <label for="">{{$t('business.QQ')}}：</label>
        <div class="inpwp">
          <input
            @blur="valVerify('qq','blur')" 
            @input="valVerify('qq','input')" 
            name="qq" 
            v-model="formData.qq" 
            :placeholder="$t('business.QQ')"
            :class="{error:showTip.qq}"><!--QQ号-->
          <p v-show="showTip.qq" class="infor"><img width="14" src="../../assets/img/i-tiperr.png" alt="">  {{megTip.qq}}</p>
        </div>
      </div>
      <div class="inner">
        <label for="">{{$t('login_register.email')}}：</label>
        <div class="inpwp">
          <input
            @blur="valVerify('email','blur')" 
            @input="valVerify('email','input')" 
            name="email" v-model="formData.email" 
            :placeholder="$t('login_register.email')"
            :class="{error:showTip.email}"><!--邮件-->
          <p v-show="showTip.email" class="infor"><img width="14" src="../../assets/img/i-tiperr.png" alt="">  {{megTip.email}}</p>
        </div>
      </div>
      <div class="inner">
        <label for="">{{$t('business.CHOOSE_COMMUNITY')}}：</label>
        <div class="inpwp sel">
          <input
            readonly="readonly" 
            name="community" 
            v-model="formData.community" 
            :placeholder="$t('business.CHOOSE_COMMUNITY')" 
            @click="showcommunity=!showcommunity"
            :class="{error:showTip.community}"><!--手机号-->
          <input readonly="readonly" @click="showcommunity=!showcommunity" class="sel-btnicon">
          <ul class="mues" v-show="showcommunity">
            <li @click="formData.community=item.communityName;showcommunity=false;showTip.community=false" v-for="item in communities">
              {{item.communityName}}
            </li>
          </ul>
          <p v-show="showTip.community" class="infor"><img width="14" src="../../assets/img/i-tiperr.png" alt="">  {{megTip.community}}</p>
        </div>
      </div>
      <div class="inner">
        <input type="checkbox" v-model="ckeckVal" id="agreeCheck">
        <label class="otcLab" for="agreeCheck">{{$t('login_register.agree_Service')}}
          <a :href="getAgreementUrl" target="_blank">{{$t('login_register.bitark_service').format('OTC')}}</a><!--商家申请介绍-->
        </label>
      </div>
      <div class="inner btn">
        <mt-button 
          type="primary" 
          size="large"
          @click="applyBtn()"
          >{{$t('business.APPLY')}}</mt-button>
      </div>
    </div>

    <mt-popup class="popul70" v-model="showSubSucces" position="center">
    <div class="digTap">
      <div class="top">
        <div class="tl">
          <img width="50" src="../../assets/img/i-subok.png" alt="">
        </div>
        <div class="meg">{{$t('seller_apply.successNote')}}</div>
      </div>
      <div class="bot">
        <span class="btnok" @click="OKBtn()">{{$t('seller_apply.btnOK')}}</span>
      </div>
    </div>
  </mt-popup>
  </div>
</template>

<script>
import userApi from '@/api/individual'
import Tip from '@/assets/js/tip'
import { MessageBox } from 'mint-ui'
import shopsApi from '@/api/shops'

export default {
  name: 'page-apple-form',
  data () {
    return {
      locked: false,
      showSubSucces: false,
      showcommunity:false,
      ckeckVal:false,
      showTip: { 
        mobile: false,
        wechat: false,
        qq: false,
        email: false,
        community: false,
      },
      megTip: { 
        mobile: '',
        wechat: '',
        qq: '',
        email: '',
        community: '',
      },
      formData: {
        mobile: '',
        wechat: '',
        qq: '',
        email: '',
        community:''
      },
      communities:[]
    }
  },
  created () {
    shopsApi.getShopsCommunity(res=>{
      this.communities = res.data
    })
  },
  computed: {
    msgs (){
      return {
        mobile: {
          required: this.$t('public0.public287')+this.$t('business.MOBILE'),
          err: this.$t('public0.public128'),
          }, // 请输入手机号码,格式错误
        wechat: {
          required: this.$t('public0.public287')+this.$t('business.WECHAT'),
          }, // 请输入微信号码,格式错误
        qq: {
          required: this.$t('public0.public287')+this.$t('business.QQ'),
          }, // 请输入qq号码,格式错误
        email: {
          required: this.$t('login_register.email'),
          err: this.$t('exchange.exchange_Email_format_error'),
          }, // 请输入邮箱,格式错误
        community: {required: this.$t('business.CHOOSE_YOUR_COMMUNITY')}, // 请选择您在的社区
      }
    },
    reg() {
      return {
        mobile: /^\d{11}$/,
        wechat: /^\w+$/,
        qq: /^\w+$/,
        email: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
      }
    },
    getAgreementUrl () {
      if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
        return 'https://cdcc.kf5.com/hc/kb/article/1225857/'
      } else {
        return 'https://cdcc.kf5.com/hc/kb/article/1225857/'
      }
    }
  },
  mounted(){
  },
  methods: {
    valVerify(name, type) {
        if (type == "blur") { //失去焦点时判断
          if(!this.formData[name]){
            this.megTip[name] = this.msgs[name].required
            this.showTip[name] = true
            return
          }
          if(this.formData[name]){
            if(!this.reg[name].test(this.formData[name])){
              this.megTip[name] = this.msgs[name].err
              this.showTip[name] = true
              return
            }
          }
        }else if(type == "input") { //获取焦点时事件
          this.showTip[name] = false
          return
        }
    },
    OKBtn(){
      this.showSubSucces = false
    },
    applyBtn(){
      const name = this.formData
      for (var item in name) {
        console.log(name[item], item)
        if(!this.formData[item]){
          this.megTip[item] = this.msgs[item].required
          this.showTip[item] = true
          return
        }
        if((item != 'community')&&this.formData[item]){
          if(!this.reg[item].test(this.formData[item])){
            this.megTip[item] = this.msgs[item].err
            this.showTip[item] = true
            return
          }
        } 
      }
      if(!this.ckeckVal){
        Tip({type: 'danger', message: this.$t('public0.public122')})
        return
      }
      if (this.locked) {
        return
      }
      this.locked = true
      shopsApi.postShopsApply(this.formData, res=>{
        this.locked = false
        Tip({type: 'success', message: this.$t('business.APPLY_SUCCESSFUL')})
        this.$router.replace({name:'page-apply'})
      },msg=>{
        this.locked = false
        MessageBox.confirm(this.$t(`error_code.${msg}`),this.$t(`business.APPLY_FAILED`),{
          confirmButtonText:this.$t(`ok`),
          cancelButtonText:this.$t(`otc_legal.otc_legal_cancel`)
        }).then(action => {
          if(msg==='MOBILE_AUTH_FIRST'){
            this.$router.push({name:'page-saft'})
          } else if(msg==='KYC_AUTH_FIRST'){
            this.$router.push({name:'page-realname'})
          } else if(msg==='NO_PAY_TYPE'){
            this.$router.push({name:'page-payway'})
          } 
        })
      })
    }
    
  }
}
</script>

<style lang="less" scoped>
.popul70{
  width: 80%;
  border-radius: .1rem;
  overflow: hidden;
}
.digTap{
  width:100%;
  .top{
    border-bottom: 1px solid #eee;
    .tl{
      padding: .5rem .3rem 0;
      text-align: center;
    }
    .meg{
      padding: .4rem .3rem;
      font-size: .3rem;
      color: #333;
    }
  }
  .bot{
    text-align: center;
    .btnok{
      height: initial;
      line-height: initial;
      display: inline-block;
      padding: .1rem;
      color: #0d66ef;
      font-size: .32rem;
      margin: .1rem 0;
    }
  }
}
 .header-right{
   float: right;
   font-size: .26rem;
 }
.page{
  background: #fff;
  color:#000;
}
.page-main{
  padding: .5rem 0;
  .inner{
    padding: 0 0.6rem 0.46rem;
    font-size: 0.3rem;
    label{
      display: inline-block;
      width:1.8rem;
      vertical-align: top;
      line-height: 0.6rem;
    }
    label.otcLab{
      width: 5rem;
      line-height: .4rem;
      margin-left: 5px;
      font-size: 0.28rem;
      color:#333;
      a{
        color:#0072fd;
      }
    }
    input[type='checkbox']{
      vertical-align: top;
      margin-top: .05rem;
    }
    .inpwp{
      position: relative;
      font-size: 0.3rem;
      display: inline-block;
      width:4.4rem;
      vertical-align: top;
      input{
        display: inline-block;
        width:100%;
        padding: .1rem .25rem;
        border: 1px solid #999;
        border-radius: .06rem;
        height: 0.7rem;
        line-height: 0.7rem;
        font-size: 0.26rem;
        background: #fff;
        &.error {
          border-color: red;
        }
      }
      input:focus{
        color: #000;
        border: 1px solid #0d66ef;
      }
      .infor{
        position: absolute;
        color: #f00;
        margin-top: .05rem;
        font-size: .2rem;
        width: 4.5rem;
        line-height: .3rem;
        img{
          vertical-align: middle;
        }
      }
    }
    .sel{
      position: relative;
      .sel-btnicon{
        display: block;
        width: 0.7rem;
        background: #0d66ef url("../../assets/img/i-seled.png") no-repeat center center;
        background-size: 40%;
        position: absolute;
        padding:0;
        border: 0;
        margin:0;
        top: 0;
        right: 0;
        bottom: 0;
        border-radius: 0 .08rem .08rem 0;
      }
      .sel-btnicon:focus{
        background-color: #0d66ef;
        border: 0;
      }
      input:focus + .sel-btnicon{
        background-color: #0d66ef;
        border: 0;
      }
      .mues{
        position: absolute;
        width: 100%;
        padding:0.1rem 0 0;
        right: 0;
        background-color: #fff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        font-size: 0.28rem;
        z-index: 1;
        border-radius: 0.05rem;
        li{
          line-height: 0.7rem;
          margin: 0 .2rem;
          border-bottom: 1px solid #ccc;
          color: #666;
          cursor: pointer;
        }
        li:last-of-type{
          border-bottom: 0;
        }
      }
    }
    .sel.on{
      .mues{
        display: block;
      }
      input{
        color: #000;
        border: 1px solid #0d66ef;
      }
      .sel-btnicon{
        background-color: #0d66ef;
        border: 0;
      }
    }
  }
}
body .mint-msgbox-message {
    text-align: center;
    line-height: 0.48rem;
}
</style>
