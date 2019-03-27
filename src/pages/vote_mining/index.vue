<template>
  <div class="page">
      <cp-top-back :back="false" :showLogo="true"></cp-top-back>
      <section class=" trans-records-scroll">
        <div class="img-banner">
          <img src="../../assets/img/cdcc/banner_index.jpg"/>
        </div>
        <div class="content">
          <div class="join-form">
            <h3>{{$t('business.MINING_TITLE')}}</h3>
            <div class="form-item flex">
              <label for=""><em>*</em>{{$t('business.CHOOSE_COMMUNITY')}}：</label>
              <div class="inp">
                <input type="text" name="community" readonly="" v-model="formData.communityId" :placeholder="$t('business.CHOOSE_YOUR_COMMUNITY')" @click="showCommunities=!showCommunities">
                <ul class="mues" v-show="showCommunities">
                  <li v-for="item in voteInfo.communities" @click="formData.communityId=item.communityName;showCommunities=false">{{item.communityName}}</li>
                </ul>
              </div>
            </div>
            <div class="form-item flex">
              <label for="">{{$t('business.INVITE_MOBILE')}}：</label>
              <div class="inp">
                <input type="number" name="mobile" v-model="formData.invitePhone" :readonly="voteInfo.invitePhone?true:false" :placeholder="$t('business.INVITE_MOBILE_PLACEHOLDER')">
              </div>
            </div>
            <div class="form-item">
              <label for=""><em>*</em>{{$t('business.TICKET_PERIOD')}}：</label>
              <ul class="period">
                <li v-for="period in voteInfo.periods" :class="{active:period.votePeriodId===formData.periodId}" @click="formData.periodId=period.votePeriodId">
                  <i></i> <span>{{period.name+$t('business.TICKET_PERIOD_1')}}</span> <span></span> <span>{{$t('business.TICKET_PERIOD_1_INCOME')+' '+period.rate}}%</span>
                </li>
              </ul>
            </div>
            <div class="form-item flex">
              <label for=""><em>*</em>{{$t('business.VOTE_NUM')}}：</label>
              <div class="inp">
                <input type="number" name="amount"  v-model="formData.amount" :placeholder="votesPlaceholder">
              </div>
            </div>
            <div class="mag50">
              <button type="button" disabled="" class="btn-enjoy" @click="enjoyVote">{{$t('business.ENJOY')}}</button>
            </div>
            <div class="botm">
  				    {{$t('business.NOT_VOTE')}}
              <router-link class="blue pointer" :to="{name:'vote_mining_profile'}">{{$t('business.VIEW_EARNINGS')}}</router-link>
            </div>
          </div>
          <div class="rules">
            <h1>{{$t('business.ACTIVITY_RULES')}}</h1>
            <article>
              <p>1. {{$t('business.ACTIVITY_RULE_1')}}</p>
              <p>2. {{$t('business.ACTIVITY_RULE_2')}}<br />{{$t('business.ACTIVITY_RULE_2_a')}}<br />{{$t('business.ACTIVITY_RULE_2_b')}}</p>
              <p>{{$t('business.ACTIVITY_RULE_2_b_n')}}</p>
              <p>3. {{$t('business.ACTIVITY_RULE_3')}}<br />{{$t('business.ACTIVITY_REMARK_1')}}<br />{{$t('business.ACTIVITY_REMARK_2')}}</p>
            </article>
          </div>
        </div>
      </section>
      <mt-popup class="place_order_popup" v-model="placeOrderVisible" position="bottom">
        <vertify ref="confirm" :params="params" @removeDialog="removeDialog" :mobileState="mobileState" @okCallback="okCallback"></vertify>
      </mt-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import voteMiningApi from '@/api/voteMining'
import Tip from '@/assets/js/tip'
import userUtils from '@/api/wallet'
import userApi from '@/api/individual'
import utils from '@/assets/js/utils'
import vertify from '@/pages/wallet/vertify'
import { MessageBox } from 'mint-ui'

export default {
  components: {
    vertify
  },
  name: 'vote_mining_index',
  data(){
    return {
      googleState: 0,
      mobileState: 0,
      placeOrderVisible: false,
      formData:{
        symbol:'',
        communityId:'',
        invitePhone:'',
        periodId:'',
        amount:'',
        secondaryValidateDTO:{
          type:1,
          password:'',
          smsCode:'',
          rsaPublicKey:'',
          googleCode:''
        }
      },
      showCommunities:false,
      voteInfo:{
        communities:[],
        periods:[],
        invitePhone:'',
        phone:'',
        symbols:''
      },
      assets:[]
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getLang','getUserInfo']),
    votesPlaceholder(){
      return this.voteInfo.symbols+ ' ' + this.$t('account.estimated_value_available')+' '+this.balance
    },
    balance(){
      let balance = 0
      for(let item of this.assets){
          if(item.type===2 && item.symbol===this.voteInfo.symbols){
              balance = item.availableBalance
              break
          }
      }
      return Number(balance)
    },
    params () {
      return {
        phoneNumber: this.getUserInfo.mobile,
        countryCode: this.getUserInfo.countryCode || '+86'
      }
    },
  },
  created () {
    this.getVoteInfo()
    if(this.getApiToken){
      this.getList()
      this.getUserState()
    }
    
  },
  watch:{
    'formData.invitePhone'(_n, _o){
        this.formData.invitePhone = _n.trim()
    },
    placeOrderVisible(_n, _o){
      if(_n){
        this.$refs.confirm.comData.password = ''
        this.$refs.confirm.comData.smsCode = ''
        this.$refs.confirm.formData.verifyCode = ''
      }
    }
  },
  methods:{
    okCallback(code){
      if (typeof code === 'string') {
        // 谷歌验证提现
        this.formData.secondaryValidateDTO.googleCode = code
        this.formData.secondaryValidateDTO.type = 0
      } else {
        // 手机短信验证提现
        for (let i in code) {
          this.formData.secondaryValidateDTO[i] = code[i]
        }
      }
      this.postVote()
    },
    removeDialog () {
      this.placeOrderVisible = false
    },
    enjoyVote(){
        if(!this.getApiToken){
            Tip({type: 'danger', message: this.$t('business.LOGIN_VOTE')})
            return
        }
        if(!this.formData.communityId){
            Tip({type: 'danger', message: this.$t('business.CHOOSE_YOUR_COMMUNITY')})
            return
        }
        if(this.formData.invitePhone){
            if(!/^\d{11}$/.test(this.formData.invitePhone)){
                Tip({type: 'danger', message: this.$t('public0.public128')})
                return
            }
        }
        if(Number(this.formData.amount)<10000){
            Tip({type: 'danger', message: this.$t('public0.public290')})
            return
        }
        if(Number(this.formData.amount)>this.balance){
            Tip({type: 'danger', message: this.$t('public0.public292')})
            return
        }
        if(!(Number(this.formData.amount)%1000===0)){
            Tip({type: 'danger', message: this.$t('public0.public291')})
            return
        }
        //请先进行谷歌或短信验证
        if (this.googleState !== 1 && this.mobileState !== 1) {
          MessageBox.confirm(this.$t('error_code.GOOGLE_CELLPHONE_AUTH_FIRST'), this.$t('otc_ad.otc_ad_confirm'), {
            confirmButtonText:this.$t('otc_legal.otc_legal_confirm'),
            cancelButtonText:this.$t('otc_legal.otc_legal_cancel')
          }).then(action=>{
            this.$router.push({name: 'page-saft'})
          })
          return
        }
        // 请先进行短信验证
        if (!this.getUserInfo.email && this.mobileState !== 1) {
          MessageBox.confirm(this.$t('error_code.CELLPHONE_AUTH_FIRST'), this.$t('otc_ad.otc_ad_confirm'), {
            confirmButtonText:this.$t('otc_legal.otc_legal_confirm'),
            cancelButtonText:this.$t('otc_legal.otc_legal_cancel')
          }).then(action=>{
            this.$router.push({name: 'page-saft'})
          })
          return
        }
        console.log('this.params==',this.params)
        // 二次验证
        this.placeOrderVisible = true
    },
    postVote(){
        let _data = JSON.parse(JSON.stringify(this.formData))
        for(let item of this.voteInfo.communities){
          if(_data.communityId===item.communityName){
            _data.communityId = item.communityId
            break
          }
        }
        voteMiningApi.postVote(_data, res=>{
          this.$router.push({name:'vote_mining_profile'})
        }, msg=>{
            Tip({type: 'danger', message: this.$t('error_code.'+msg)})
        })
    },
    merchant_name(level){
      return this.$t(`business.MERCHANT_LEVEL_${level}`)
    },
    getVoteInfo(){
      voteMiningApi.getVoteInfo(res=>{
        this.voteInfo = res
        this.formData.invitePhone = res.invitePhone?res.invitePhone:''
        this.formData.symbol = res.symbols
        this.formData.periodId = res.periods[0].votePeriodId
      })
    },
    getList () {
      userUtils.myAssets({}, (data) => {
        this.assets = data
      })
    },
    getUserState(){
        // 获取当前用户状态信息
        userApi.getUserState((data) => {
          this.googleState = data.googleState
          this.mobileState = data.mobileAuthState
        }, (msg) => {
          console.error(msg)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.place_order_popup{width: 100%;background: #1b1e2e;}
.trans-records-scroll {
    height: calc(100vh - 6rem);
    background-color: #161f2f;
    overflow-y: auto;
    overflow-x: hidden;
}
.img-banner{
  min-height: 2rem;
  position: relative;
  .btnwp{
    position: absolute;
    width: 100%;
    left: 0;
    bottom: .3rem;
    text-align: center;
    button{
      height: 0.6rem;
      margin: 0 .2rem;
      border: 1px solid #0072fd;
      border-radius: 0.05rem;
      background: rgba(0,114,253,.8);
      color: #fff;
      padding: 0 .3rem;
    }
  }
}
.img-banner img{
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.content{
  background: #310274 url("../../assets/img/cdcc/mining-bg.jpg") no-repeat center top;
  padding-top: .6rem;
  .join-form{
    background: #fff;
    margin: 0 .3rem;
    color: #333;
    padding: 0 .3rem .3rem;
    border-radius: .1rem;
    h3{
      display: inline-block; 
      text-align: center;
      font-size: .3rem;
      padding: .18rem .6rem;
      border-radius: .5rem .5rem;
      margin: -.5rem 50% 0 50%;
      transform: translate(-50%,0);
      white-space: nowrap;
      background: #fff;
      color: #0072fd;
      font-weight: bold;
      box-shadow: 0 .021rem 0.1rem rgba(0, 0, 0, .3)
    }
    .form-item{
      margin-top: .2rem;
      font-size: 0.24rem;
      line-height: .55rem;
      border-bottom: .01rem solid #ccc;
      label{
        position: relative;
        em{
          color: #f00;
          font-style: normal;
        }
      }
      .inp{
        margin-left: .2rem;
        -ms-flex: 1;
        flex: 1;
        position: relative;
        input{
          border: 0;
          width: 100%;
          text-align: right;
          font-size: 0.22rem;
          background: #fff;
        }
        .mues{
          position: absolute;
          right: 0;
          background-color: #fff;
          padding: 0.2rem .2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,.3);
          font-size: 0.24rem;
          z-index: 1;
          border-radius: 0.05rem;
          li{
            line-height: 0.6rem;
            border-bottom: 1px solid #ccc;
            color: #666;
            cursor: pointer;
          }
          li:last-child{
            border-bottom: 0;
          }
        }
      }
      .period{
        width: 100%;
        font-size: .24rem;
        list-style: none;
        li{
          margin-left: 0.4rem;
          position: relative;
          line-height: 0.5rem;
          border-bottom: 1px solid #ccc;
          color: #666;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-pack: justify;
          justify-content: space-between;
          cursor: pointer;
          span:nth-of-type(2){
            flex: 1;
            background: url("../../assets/img/cdcc/dot_bg_gray.png") repeat-x 0 center; 
            background-size: 3%;
            margin-left: .1rem;
            margin-right: .1rem;
          }
          i{
            position: absolute;
            left: -.4rem;
            top: .16rem;
            width: .2rem;
            height: .2rem;
            border: .02rem solid #ccc;
            border-radius: 50%;
          }
        }
        li.active{
          color: #0072fd;
          i{
            border-color: #0072fd;
            background-color: #0072fd;
          }
          i:before{
            position: absolute;
            content: "";
            width: .12rem;
            height: .06rem;
            left: .03rem;
            top: .03rem;
            border-bottom: .02rem solid #fff;
            border-left: .02rem solid #fff;
            transform: rotate(-45deg);
          }
          span:nth-of-type(2){background-image: url('../../assets/img/cdcc/dot_bg_blue.png');}
        }
      }
    }
    .form-item:first-of-type{
      margin-top: .5rem;
    }
    .form-item:nth-of-type(3){
      border: 0;
    }
    .form-item.flex{
      display: flex;
    }
    .mag50{
      margin-top: .5rem;
    }
    .mag30{
      margin-top: .3rem;
    }
    .btn-enjoy{
      height: .75rem;
      border: none;
      width: 100%;
      color: #fff;
      font-size: .3rem;
      border-radius: .4rem;
      background-color: #0072fd;
      cursor: pointer;
      &[disabled] {background-color: #999;}
    }
    .botm{
      font-size: .23rem;
      color: #666;
      text-align: center;
      margin-top: .4rem;
      .pointer{
        cursor: pointer;
      }
      .blue {
        color: #0072fd;
      }
    }
  }
  .rules{
    padding: 0 .3rem;
    color: #bafeff;
    h1{
      margin: 0.7rem 0 .4rem;
      font-size: 0.3rem;
    }
    article{
      font-size: 0.24rem;
    }
    p{
      line-height: .56rem;
      padding-bottom: .26rem;
    }
  }
}
</style>

