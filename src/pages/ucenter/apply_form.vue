<template>
  <div class="page">
    <cp-top-back :showRight="false">
      <h1>{{$t('seller_apply.seller_agency_apply')}}<!--商家申请--></h1>
    </cp-top-back>

    <div class="page-main content">
      <div class="inner">
        <label for="">{{$t('seller_apply.mobile')}}：</label>
        <div class="inpwp">
          <input 
            @blur="valVerify('mobile','blur')" 
            @input="valVerify('mobile','input')" 
            name="mobile" 
            v-model="formData.mobile" 
            :placeholder="$t('seller_apply.entry_mobile')"><!--手机号-->
          <p v-show="showTip.mobile" class="infor"><img width="14" src="../../assets/img/i-tiperr.png" alt=""> {{megTip.mobile}}</p>
        </div>
      </div>
      <div class="inner">
        <label for="">{{$t('seller_apply.wechat')}}：</label>
        <div class="inpwp">
          <input
            @blur="valVerify('wechat','blur')" 
            @input="valVerify('wechat','input')" 
            name="wechat" 
            v-model="formData.wechat" 
            :placeholder="$t('seller_apply.entry_wechat')"><!--手机号-->
          <p v-show="showTip.wechat" class="infor"><img width="14" src="../../assets/img/i-tiperr.png" alt="">  {{megTip.wechat}}</p>
        </div>
      </div>
      <div class="inner">
        <label for="">{{$t('seller_apply.qq')}}：</label>
        <div class="inpwp">
          <input
            @blur="valVerify('qq','blur')" 
            @input="valVerify('qq','input')" 
            name="qq" 
            v-model="formData.qq" 
            :placeholder="$t('seller_apply.entry_qq')"><!--手机号-->
          <p v-show="showTip.qq" class="infor"><img width="14" src="../../assets/img/i-tiperr.png" alt="">  {{megTip.qq}}</p>
        </div>
      </div>
      <div class="inner">
        <label for="">{{$t('seller_apply.email')}}：</label>
        <div class="inpwp">
          <input
            @blur="valVerify('email','blur')" 
            @input="valVerify('email','input')" 
            name="email" v-model="formData.email" 
            :placeholder="$t('seller_apply.entry_email')"><!--手机号-->
          <p v-show="showTip.email" class="infor"><img width="14" src="../../assets/img/i-tiperr.png" alt="">  {{megTip.email}}</p>
        </div>
      </div>
      <div class="inner">
        <label for="">{{$t('seller_apply.commity')}}：</label>
        <div class="inpwp sel">
          <input
            readonly="readonly" 
            name="commity" 
            v-model="formData.commity" 
            :placeholder="$t('seller_apply.entry_commity')" 
            @click="showCommity=!showCommity"><!--手机号-->
          <input readonly="readonly" @click="showCommity=!showCommity" class="sel-btnicon">
          <ul class="mues" v-show="showCommity">
            <li @click="formData.commity=item.commityName;showCommity=false;showTip.commity=false" v-for="item in commityData">
              {{item.commityName}}
            </li>
          </ul>
          <p v-show="showTip.commity" class="infor"><img width="14" src="../../assets/img/i-tiperr.png" alt="">  {{$t('seller_apply.entry_commity')}}</p>
        </div>
      </div>
      <div class="inner">
        <input type="checkbox" v-model="ckeckVal">
        <label class="otcLab">{{$t('seller_apply.otcGree')}}
          <router-link :to="{name:'page-apply-legal'}" >{{$t('seller_apply.otcServer')}}</router-link><!--商家申请介绍-->
        </label>
      </div>
      <div class="inner btn">
        <mt-button 
          type="primary" 
          size="large"
          @click="applyBtn()"
          >{{$t('seller_apply.btnApply')}}</mt-button>
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
export default {
  name: 'page-apple-form',
  data () {
    return {
      showSubSucces: false,
      showCommity:false,
      ckeckVal:false,
      showTip: { 
        mobile: false,
        wechat: false,
        qq: false,
        email: false,
        commity: false,
      },
      megTip: { 
        mobile: '',
        wechat: '',
        qq: '',
        email: '',
        commity: '',
      },
      formData: {
        mobile: '',
        wechat: '',
        qq: '',
        email: '',
        commity: '',
      },
      commityData: {
        0:{commityName:'清分社区',commityID:'qf',},
        1:{commityName:'水池社区',commityID:'sc',}
      },
    }
  },
  created () {
  },
  computed: {
    msgs (){
      return {
        mobile: {
          required: this.$t('seller_apply.entry_mobile'),
          err: this.$t('seller_apply.entry_mobile_err'),
          }, // 请输入手机号码,格式错误
        wechat: {
          required: this.$t('seller_apply.entry_wechat'),
          err: this.$t('seller_apply.entry_mobile_err'),
          }, // 请输入微信号码,格式错误
        qq: {
          required: this.$t('seller_apply.entry_qq'),
          err: this.$t('seller_apply.entry_mobile_err'),
          }, // 请输入qq号码,格式错误
        email: {
          required: this.$t('seller_apply.entry_email'),
          err: this.$t('seller_apply.entry_mobile_err'),
          }, // 请输入邮箱,格式错误
        commity: {required: this.$t('seller_apply.entry_commity')}, // 请选择您在的社区
      }
    },
    reg() {
      return {
        mobile: /^\d{11}$/,
        wechat: /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/,
        qq: /^[1-9]\d{4,9}$/,
        email: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
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
        }
        if((item != 'commity')&&this.formData[item]){
          if(!this.reg[item].test(this.formData[item])){
            this.megTip[item] = this.msgs[item].err
            this.showTip[item] = true
          }
        } 
      }
      if(!this.ckeckVal){
        Tip({type: 'danger', message: this.$t('seller_apply.agree_terms')})
        return
      }
      this.showSubSucces = true
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
        color:#333;
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
