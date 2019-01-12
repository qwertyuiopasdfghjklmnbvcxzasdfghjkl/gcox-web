<template>
  <div class="page">
    <cp-top-back :back="true">
    </cp-top-back>

    <div class="box">
      <div class="inner">
        <h1>{{$t('otc_legal.otc_legal_WeChat_receivables')}}<!--微信收款--></h1>

        <form ref="wechatForm">
          <div class="item-section">
            <p class="line">
              <input name="wechat_name" :placeholder="$t('otc_legal.otc_legal_Payee_Name')" :value="wechatData.wechat_name" readonly>
            </p>
          </div>
          <div class="item-section">
            <p class="line">
              <input name="wechat_number" :placeholder="$t('otc_legal.otc_legal_Wechat_number')" v-model="wechatData.wechat_number" maxlength="32" autocomplete="off">
            </p>
          </div>
          <div class="item-section">
            <span>{{$t('otc_legal.otc_legal_WeChat_code')}}<!--微信收款码--></span>
              <div>
                <div class="form-upload">
                  <img class="form-upload-img" v-if="wechatData.wechat_QRcode" :src="wechatData.wechat_QRcode"/>
                  <span class="form-upload-span" v-if="!wechatData.wechat_QRcode">{{$t('otc_legal.otc_legal_Upload_payment')}}<!--点击上传收款码--></span>
                  <input type="hidden" v-model="wechatData.wechat_QRcode" data-vv-name="wechat_QRcode"/>
                  <input class="form-upload-file" type="file" title=" " data-key="1" v-show="isShowUpload.wechat_QRcode" @change="uploadImage($event, 3)"/>
                  <input class="form-upload-file" type="file" name="source" title=" " data-key="2" v-show="!isShowUpload.wechat_QRcode" @change="uploadImage($event, 3)"/>
                </div>
                <!--<span class="code">{{$t('otc_legal.otc_legal_WeChat_code')}}&lt;!&ndash;微信收款码&ndash;&gt;</span>-->
                <p>{{$t('otc_legal.otc_legal_Upload_payment')}}<!--点击上传收款码--></p>
                <p>（{{$t('account.user_center_QRcode_warn')}}）<!--请务必上传真实的二维码--></p>
              </div>
          </div>
        </form>

        <footer>
          <p></p>
          <button class="c-button c-button-normal c-button-blue" @click="saveSettings(3)">{{$t('otc_legal.otc_legal_save')}}<!--保存--></button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import Tip from '@/assets/js/tip'
import config from '@/assets/js/config'
import utils from '@/assets/js/utils'
import otcApi from '@/api/otc'
export default {
  name: 'page-WeChat',
  data () {
    return {
      wechatData: {
        wechat_name: '',
        wechat_number: '',
        wechat_QRcode: ''
      },
      isShowUpload: {
        wechat_QRcode: true,
        alipay_QRcode: true
      },
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      otcApi.getPaySettings((res) => {
        console.log(res)
        // 微信
        this.wechatData = {
          wechat_name: res.real_name,
          wechat_number: res.data.wechat_number,
          wechat_QRcode: res.data.wechat_image_path
        }
      }, (res) => {
        if (res.msg === 'NO_PAY_TYPE') {
          // 微信
          this.wechatData.wechat_name = res.real_name
        } else {
          console.error(res.msg)
        }
      })
    },
    saveSettings (type) { // 提交保存
      if (this.wechatData.wechat_QRcode) {
        let formData = new FormData(this.$refs.wechatForm)
        otcApi.savePaySettings(type, formData, (msg) => {
          Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
          this.$router.push({name: 'page-payway'})
        }, (msg) => {
          Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
        })
      } else {
        Tip({type: 'danger', message: this.$t('public0.public90')})
      }
    },
    uploadImage (event, type) { // 上传图片
      let objectName = null
      let propertyName = null
      if (type === 3) {
        objectName = 'wechatData'
        propertyName = 'wechat_QRcode'
      } else {
        return
      }

      let isTrue = false
      if (config.imageType.test(event.target.value)) {
        isTrue = utils.limitUploadImage(event.target, (msg) => {
           Tip({type: 'danger', message: this.$t(msg)}) // 图片不能超过1M
        }, 1)
      } else {
        isTrue = false
        Tip({type: 'danger', message: this.$t('public0.public43')}) // 请上传JPG、PNG、JPEG、BMP格式的图片
      }

      if (isTrue) {
        this[objectName][propertyName] = window.URL.createObjectURL(event.target.files[0])
        event.target.name = 'source'
        if (parseInt(event.target.getAttribute('data-key')) === 1) {
          event.target.nextElementSibling.name = ''
          event.target.nextElementSibling.value = null
          this.isShowUpload[propertyName] = false
        } else {
          event.target.previousElementSibling.name = ''
          event.target.previousElementSibling.value = null
          this.isShowUpload[propertyName] = true
        }
      } else {
        event.target.value = null
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .form-upload{display: flex;align-items: center;justify-content: center;position: relative;width: 3.5rem;height: 3.5rem;border: 1px solid #8089a3;left: 24%;}
  .form-upload.error{border-color: #e53f3f;}
  .form-upload-span{color: #becbe8;text-align: center;}
  .form-upload-img{width: 100%;height: 100%;}
  .form-upload-file{position: absolute;top: 0;left: 0;width: 100%!important;height: 100%!important;opacity: 0;cursor: pointer;}
  .form-upload + .form-error{align-self: flex-end;}

  .item-section:nth-of-type(3){
    margin-top: .7rem;
    >span{
      font-size: .3rem;
    }
    >div{
      text-align: center;
      .code{
        color: #1b1e2e;
        padding-top: 1.5rem;
        margin-top: .6rem;
        display: inline-block;
        background:#8089a3;
        width: 3.5rem;
        height: 3.3rem;
      }
      p{
        font-size: .3rem;
        line-height: .7rem;
      }
    }
  }
  footer{
    p{
      line-height: .6rem;
      color: #8089a3;
      font-size: .23rem;
    }
    margin-top: .7rem;
  }
  .c-button-normal{
    display: inline-block;
    padding: 0 .12rem;
    width: 100%;
  }
  .c-button{
    font-size: .26rem;
    appearance: none;
    border-radius:.05rem;
    border: 0;
    box-sizing: border-box;
    color: inherit;
    display: block;
    height: .75rem;
    line-height: .75rem;
    outline: 0;
    overflow: hidden;
    position: relative;
    text-align: center;
  }
  .c-button-blue{
    color: #fff;
    background-color: #0072fd;
  }
.form-row{
  display: flex;
  margin-top: .3rem;
  .row-description{
     p{
       padding-left: .2rem;
     }
  }
  .row-file
  {
    .for-label{
    }
  }
}
  .form-row .row-file img{width: 2.24rem;height: 100%;
  }
  .form-row .row-file-input{position: absolute;top: 0;left: 0;width: 140px;height: 140px;
  }
  .form-row .row-file-input input{width: 100%;height: 100%;opacity: 0;cursor: pointer;
  }
  .form-row .row-file-prompt{height: 30px;line-height: 30px;color: #becbe8;white-space: nowrap;
  }
  .form-row .row-file-prompt.error{color: #e53f3f;
  }

  .page{
    bottom:initial;
    height: 100vh;
    overflow-y: auto;
    position: relative;
  }
  .box{
    .inner{
      >h1{
        font-size: .36rem;
      }
      padding: .3rem;
      font-size: .3rem;
    }
  }

.item-section{
  font-size: .24rem;
   h1{
     margin-top: .5rem;
     font-size: .3rem;
     color: #cbd4ec;
   }
   color: #8089a3;
    input{
      background: transparent;
      border: 0;
      font-size: .3rem;
      color: white;
      height: .8rem;
      width: 100%;
    }
  input::placeholder{
    color:#8089a3;
  }
  p.line{
    margin-top: .5rem;
    border-bottom: .01rem solid #8089a3;
}
  .msg{
    font-size: .24rem;
    color: #8089a3;
    margin-top: .2rem;
  }
}
  .item-section:nth-of-type(1){
    margin-top: .7rem;
  }
</style>
