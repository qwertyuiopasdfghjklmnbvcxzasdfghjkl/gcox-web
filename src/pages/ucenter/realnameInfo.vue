<template>
  <div class="page" >
    <cp-top-back :back="true">
    </cp-top-back>

    <div class="box ">
      <form ref="form" onsubmit="return false">
        <div class="inner">
          <h1>{{$t('public0.public75')}}<!--中国大陆地区--></h1>
          <div class="item">
             <p class="line">
               <input :placeholder="$t('public0.public77')" type="text" name="firstName" v-validate="'required'" maxlength="128" autocomplete="off">
             </p>
          </div>
          <div class="item">
            <p class="line">
              <input :placeholder="$t('public0.public79')" type="text" name="idNumber" v-validate="'required'" maxlength="18" autocomplete="off">
            </p>
          </div>
          <div class="item">
            <p class="msg">（{{$t('account.user_prompt9')}}）<!--请确保您使用本人的真实身份进行认证，我们会保护您的个人信息安全。--></p>
          </div>

          <div class="item one">
            <h1>{{$t('public0.public80')}}<!--本人身份证正面照--></h1>
            <div class="form-row">
              <div class="row-file">
                <div class="row-file-img">
                  <img :src="image.front" alt=""/>
                </div>
                <div class="row-file-input">
                  <input type="hidden" data-vv-name="front" aria-required="true" aria-invalid="false" value="" style="display:none;">
                  <input type="file" title=" " style="display:none;"><input type="file" data-key="2" title=" " @change="uploadImage($event, 'front')">
                </div>
              </div>
              <div class="row-description"><p>{{$t('public0.public81')}}<!--请确保照片内容完整并清晰可见，仅支持JPG、PNG、JPEG、BMP图片格式。--></p></div>
            </div>
          </div>

          <div class="item one">
            <h1>{{$t('public0.public83')}}<!--本人身份证背面照--></h1>
            <div class="form-row">
              <div class="row-file">
                <div class="row-file-img">
                  <img :src="image.back" alt=""/>
                </div>
                <div class="row-file-input">
                  <input type="hidden" data-vv-name="front" aria-required="true" aria-invalid="false" value="" style="display:none;">
                  <input type="file" title=" " style="display:none;"><input type="file" data-key="2" title=" " @change="uploadImage($event, 'back')">
                </div>
              </div>
              <div class="row-description"><p>{{$t('public0.public84')}}<!--请确保照片内容完整并清晰可见，身份证必须在有效期内，仅支持JPG、PNG、JPEG、BMP图片格式。--></p></div></div>
          </div>

          <div class="item one">
            <h1>{{$t('public0.public85')}}<!--本人手持身份证照--></h1>
            <div class="form-row">
              <div class="row-file">
                <div class="row-file-img">
                  <img :src="image.hand" alt=""/>
                </div>
                <div class="row-file-input">
                  <input type="hidden" data-vv-name="front" aria-required="true" aria-invalid="false" value="1321321" style="display:none;">
                  <input type="file" title=" " style="display:none;"><input type="file" data-key="2" title=" " @change="uploadImage($event, 'hand')">
                </div>
              </div>
              <div class="row-description"><p>{{$t('public0.public86').format(brand)}}<!--请您上传一张手持身份证及写有“{0}”和当天日期的卡片的照片。请确保头像、身份证信息、卡片上“{0}”和当天日期内容清晰可见。--></p></div>
            </div>
          </div>

          <button class="c-button c-button-normal c-button-blue" :class="{disabled:locked}" v-tap="{methods:identity1}">{{$t('account.user_complete')}}<!--完成--></button>

        </div>
      </form>
    </div>
    <uploading v-if="isUploading"/>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui'
import Tip from '@/assets/js/tip'
import config from '@/assets/js/config'
import utils from '@/assets/js/utils'
import myApi from '@/api/individual'
import diagramFront from '@/assets/img/i_one.png'
import diagramBack from '@/assets/img/i_two.png'
import diagramHand from '@/assets/img/i_three.png'
import uploading from '@/components/uploading'
export default {
  name: 'page-realnameInfo',
  components: {
    uploading
  },
  data () {
    return {
      brand: config.brand[0].toUpperCase() + config.brand.substring(1, config.brand.length),
      value: {
        firstName: null,
        idNumber: null,
        front: null,
        back: null,
        hand: null
      },
      image: {
        front: diagramFront,
        back: diagramBack,
        hand: diagramHand
      },
      isShowUpload: {
        front: true,
        back: true,
        hand: true
      },
      locked: false,
      isUploading: false,
      isSubmit: false
    }
  },
  computed: {
    msgs () {
      return {
        firstName: {required: this.$t('public0.public88')}, // 请输入姓名
        idNumber: {required: this.$t('public0.public89')}, // 请输入身份证号码
        front: {required: this.$t('public0.public90')}, // 未选择文件
        back: {required: this.$t('public0.public90')}, // 未选择文件
        hand: {required: this.$t('public0.public90')} // 未选择文件
      }
    }
  },
  beforeCreate () {
    myApi.getUserState((data) => {
      data.verifyState === 0 ? void 0 : this.$router.replace({name: 'page-ucenter'})
    }, (msg) => {
      console.error(msg)
      this.$router.replace({name: 'page-ucenter'})
    })
  },
  methods: {
    uploadImage (event, propertyName) {
      let isTrue = false
      if (config.imageType.test(event.target.value)) {
        isTrue = utils.limitUploadImage(event.target, (msg) => {
          Tip({type: 'danger', message: this.$t(msg)})
          // Vue.$koallTipBox({icon: 'notification', message: '图片不能超过2M'}) // 图片不能超过2M
        }, 2)
      } else {
        isTrue = false
        Tip({type: 'danger', message: this.$t('public0.public43')}) // 请上传JPG、PNG、JPEG、BMP格式的图片
      }
      if (isTrue) {
        this.value[propertyName] = this.image[propertyName] = window.URL.createObjectURL(event.target.files[0])
        event.target.name = propertyName
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
    },
    identity1 () {
      this.$validator.validateAll().then((res) => {
        if (!res) {
          let items = this.errors.items
          if (items && items.length && items[0]) {
            let name = items[0].field
            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
            Tip({type: 'danger', message: msg})
          }
          return
        }
        if (this.locked) {
          return
        }
        this.locked = true
        this.isUploading = true
        var formData = new FormData(this.$refs.form)
        formData.append('countryClass', '1')
        myApi.submitIdentityInfo(formData, (msg) => {
          this.isUploading = false
          this.isSubmit = true
          MessageBox({
            title: this.$t('public0.public242'),
            message: this.$t('public0.public160'), // 您已经提交了实名认证材料（每人仅有三次KYC机会），请耐心等待审核结果。审核结果将第一时间在站内消息中进行通知。
            confirmButtonText: this.$t('otc_legal.otc_legal_confirm'),
            closeOnClickModal: false
          }).then(action => {
            if (action === 'confirm') {
              this.$router.push({name: 'page-wallet'})
            }
          })
        }, (msg) => {
          this.locked = false
          this.isUploading = false
          Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .page-top {
    background-color: #292929;
  }
  .c-button-normal{
    display: inline-block;
    padding: 0 .12rem;
    width: 100%;
  }
  .c-button{
    margin-top: .8rem;
    font-size: .26rem;
    appearance: none;
    border-radius:.01rem;
    border: 0;
    box-sizing: border-box;
    color: inherit;
    display: block;
    height: .64rem;
    outline: 0;
    overflow: hidden;
    position: relative;
    text-align: center;
  }
  .c-button-blue{
    color: #fff;
    background-color: #ffde00;
  }
  .c-button-blue.disabled{
    background-color: #999;
  }
  .form-row {
    display: flex;
    position: relative;
    margin-top: .3rem;
    .row-file {
      width: 1.4rem;
      height: 1.4rem;
      &-img {
        width: 100%;
        height: 100%;
        line-height: 0;
        img {
          width: 100%;
          height: 100%;
        }
      }
      &-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 1.4rem;
        height: 1.4rem;
        input {
          width: 100%;
          height: 100%;
          opacity: 0;
        }
      }
    }
    .row-description {
      flex: 1 1 0;
      padding-left: .4rem;
    }
  }

  .page{
    bottom:initial;
    height: 100vh;
    overflow-y: auto;
    position: relative;
  }
  .box{
    height:calc(~"100vh - 0.8rem");
    overflow-y:auto;
    .inner{
      >h1{
        font-size: .36rem;
      }
      padding: .3rem;
      font-size: .3rem;
    }
  }

.item{
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
  .item:nth-of-type(1){
    margin-top: .7rem;
  }
</style>
