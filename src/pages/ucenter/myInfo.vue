<template>
  <div class="page">
    <cp-top-back>
      <h1 class="header">{{$t('public.navigation_account')}}<!--个人中心--></h1>
    </cp-top-back>

    <div class="two">
      <section class="item-section">
        <p><span>{{$t('account.user_center_account')}}<!--账号--></span><span>{{getUserInfo.username}}</span></p>
      </section>
      <section class="item-section">
        <p><span>{{$t('public0.public190')}}<!--昵称--></span><span>{{updateNickname}}</span><span class="nikename" v-if="!isAlreadyModifyNickname" v-tap="{methods:nikenamefun,par:'isShowRegDialog'}">（{{$t('public0.public40')}}）<!--修改昵称--></span></p>
      </section>
      <section class="item-section">
        <p>
          <span>{{$t('account.user_center_avatar')}}<!--头像--><i>（{{$t('account.user_center_set_photo')}}）<!--头像仅限修改一次--></i></span>
          <span class="usericon"><img :src="avatarUrl"/></span>
        </p>
        <form v-if="!isExistUserAvatar" ref="form">
          <input class="file" type="file" name="source" title=" " accept="image/*" capture="camera" @change="uploadImage"/>
        </form>
      </section>
      <section class="item-section">
        <p v-if="showVerifyState(0)" v-tap="{methods:$root.routeTo, to:'page-realname'}"><span>{{$t('account.user_Real_name_verification')}}</span><span>{{$t('account.user_center_unverified')}}<!--未认证--></span></p>
        <p v-if="showVerifyState(1)"><span>{{$t('account.user_Real_name_verification')}}</span><span>{{$t('public0.public37')}}<!--待审核--></span></p>
        <p v-if="showVerifyState(4)"><span>{{$t('account.user_Real_name_verification')}}</span><span>{{$t('public0.public151')}}<!--审核中--></span></p>
        <p v-if="showVerifyState(2)"><span>{{$t('account.user_Real_name_verification')}}</span><span>{{$t('public0.public38')}}<!--已认证--></span></p>
        <p v-if="showVerifyState(3)"><span>{{$t('account.user_Real_name_verification')}}</span><span>{{$t('public0.public39')}}<!--未通过--></span></p>
      </section>
      <section class="item-section">
        <p @click="loginOut"><span>{{$t('public.navigation_logout')}}<!--退出--></span></p>
      </section>
    </div>

    <my-dialog :is-show="isShowRegDialog" @on-close="closeDialog('isShowRegDialog')">
      <nike-name-form :nikename="userState.nickname" @on-close-all="closeDialog('isShowRegDialog')" @okCallback="okCallback"></nike-name-form>
    </my-dialog>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { MessageBox } from 'mint-ui'
import Tip from '@/assets/js/tip'
import config from '@/assets/js/config'
import utils from '@/assets/js/utils'
import userUtils from '@/api/individual'
import nikeNameForm from '@/components/nikeNameForm' // 修改昵称
import myDialog from '@/components/common/dialog' // 遮罩组件
import avatar from '@/assets/img/touxiang.png'
export default {
  name: 'page-myInfo',
  components: {
    myDialog,
    nikeNameForm
  },
  data () {
    return {
      avatarUrl: avatar,
      isShowRegDialog: false,
      uicon: require("../../assets/img/i_o.png"),
      userState: { // 用户状态信息
        coinState: 0,
        googleState: 0,
        nickname: null,
        verifyState: 0,
        verifyTimes: 0
      },
      isUseBarkPay: false,
    }
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getLang']),
    isExistUserAvatar () {
      return this.avatarUrl !== avatar
    },
    updateNickname () {
      return this.userState.nickname
    },
    isAlreadyModifyNickname () {
      return this.userState.nickname !== null
    },
  },
  created () {
    this.fnUserState()
    this.fnDownloadHeader()
  },
  methods: {
    ...mapActions(['setApiToken', 'setLang', 'addOtcSocketEvent', 'removeOtcSocketEvent']),
    fnDownloadHeader () {
      // 下载当前用户头像
      userUtils.downloadHeader((url) => {
        this.avatarUrl = url
      })
    },
    uploadImage (e) {
      // 上传头像
      var target = e.target
      if (config.imageType.test(target.files.item(0).name) === false) {
        return Tip({type: 'danger', message: this.$t('public0.public43')}) // 请上传JPG、PNG、JPEG、BMP格式的图片
      }
      let isTrue = utils.limitUploadImage(target, (msg) => {
        Tip({type: 'danger', message: this.$t(msg)})
      }, 1)
      if (!isTrue) {
        target.value = ''
        return
      }
      this.avatarUrl = window.URL.createObjectURL(target.files.item(0))
      var formData = new FormData(this.$refs.form)
      userUtils.uploadHeader(formData, (msg) => {
        Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
      }, (msg) => {
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
      })
    },
    okCallback (aNickName) {
      this.userState.nickname = aNickName
    },
    nikenamefun (args) {
      this[args.par] = true
    },
    closeDialog (attr) {
      this[attr] = false
    },
    loginOut () {
      // 确认退出当前帐号吗？
      MessageBox({
        title: this.$t('public0.public242'),
        message: this.$t('account.user_center_logout_confirm'),
        confirmButtonText: this.$t('otc_legal.otc_legal_confirm'),
        showCancelButton: true,
        cancelButtonText: this.$t('otc_legal.otc_legal_cancel')
      }).then(action => {
        if (action === 'confirm') {
          this.setApiToken(null)
          this.$router.push({name: 'login'})
        }
      })
    },
    fnUserState () {
      // 获取当前用户状态信息
      userUtils.getUserState((data) => {
        this.userState = {
          coinState: data.coinState,
          googleState: data.googleState,
          nickname: data.nickname,
          verifyState: data.verifyState,
          verifyTimes: data.verifyTimes
        }
        this.isUseBarkPay = data.coinState === 1
      }, (msg) => {
        console.error(msg)
      })
    },
    showVerifyState (targetVerifyState) {// 实名验证状态
      if (this.userState.verifyTimes <= 3) {
        if (this.userState.verifyTimes === 3) {
          if (this.userState.verifyState === 0) {
            return targetVerifyState === 3
          } else {
            return targetVerifyState === this.userState.verifyState
          }
        } else {
          return targetVerifyState === this.userState.verifyState
        }
      } else {
        return targetVerifyState === 3
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .two{
    margin-top: .2rem;
    &>.inner{
      padding: .2rem .3rem;
    }
  }
  .item-section{
    background-color: #292929;
    padding:0 .3rem;
    font-size: .3rem;
    p{
      color: #cbd4ec;
      line-height: 1rem;
      border-bottom: 1px solid #0d0d0d;
      span{
        i.circular{
          color: red;
          margin-left:.1rem;
        }
        &:nth-of-type(1){
          i{
            font-size: .2rem;
            color: #8089a3;
            font-style: normal;
          }
        }
        &:nth-of-type(2){
          float: right;
          font-size: .26rem;
          color: #8089a3;
        }
      }
    }
  }
  .item-section:nth-of-type(2){
    p{
      span.nikename{
        font-size: .24rem;
        color: #409cf2;
      }
    }
  }
  .item-section:nth-of-type(3){
     position: relative;
     form{
       position: absolute;
       top: 0;
       left: 0;
       width: 100%;
       height: 1rem;
       input{
         width: 100%;
         height: 100%;
         opacity: 0;
       }
     }
  }
  .item-section:nth-of-type(4){
    p{
      border-bottom-width: 0;
    }
  }
  .item-section:last-of-type{
    margin-top: .2rem;
    p{
      border-bottom-width: 0;
    }
  }
  .one{
    background-color: #292929;
    display: flex;
    padding: .3rem .65rem;
    li:first-child{
      i{
        margin-top: .1rem;
      }
      font-size: .38rem;
      width: 1.2rem;
    }
    li:last-child{
      font-size: .24rem;
      p:first-child{
        span:first-child{
          font-size: .4rem;
        }
        span:last-child{
          margin-left: .36rem;
          font-size: .24rem;
          padding: .05rem;
          background-color: #409cf2;
          border-radius: .03rem;
          position: relative;
          top: -.06rem;
        }
      }
      p:last-child{
        line-height: .4rem;
        color:#8089a3;
      }
    }

  }
  .usericon{
    img{
      width: 100%;
      height: 100%;
    }
    i{
      color: white;
      position: relative;
      top: -0.2rem;
    }
    position: relative;
    top: .2rem;
    text-align: center;
    width: .64rem;
    height: .64rem;
    display: inline-block;
    overflow: hidden;
    border-radius: 50%;
    border: 0;
  }
  .header{
    font-size: .32rem;
    color: #cbd4ec;
  }
</style>
