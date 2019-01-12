<template>
  <div class="page">
    <cp-top-back  :back="true">
    </cp-top-back>

    <div class="box">
      <div class="inner">
        <h1>{{$t('otc_legal.otc_legal_Bank_Transfer')}}<!--银行转账--></h1>
        <form class="bankform" ref="bankForm" >
          <div class="item-section">
            <p class="line">
              <input name="card_name" :placeholder="$t('otc_legal.otc_legal_Name')" readonly v-model="bankData.card_name">
            </p>
          </div>
          <div class="item-section">
            <p class="line">
              <input name="card_bank" :placeholder="$t('otc_legal.otc_legal_Bank')" v-model="bankData.card_bank"  maxlength="32" autocomplete="off">
            </p>
          </div>
          <div class="item-section">
            <p class="line">
              <input name="card_number" :placeholder="$t('otc_legal.otc_legal_Bank_number')" v-model="bankData.card_number" maxlength="32" autocomplete="off">
            </p>
          </div>
        </form>

        <footer>
          <p></p>
          <button class="c-button c-button-normal c-button-blue" @click="saveSettings(1)">{{$t('otc_legal.otc_legal_save')}}</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import Tip from '@/assets/js/tip'
import otcApi from '@/api/otc'
export default {
  name: 'page-bankset',
  data () {
    return {
      bankData: { // 银行卡信息
        card_name: '',
        card_bank: '',
        card_number: ''
      }
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      otcApi.getPaySettings((res) => {
        console.log(res)
        // 银行卡
        this.bankData = {
          card_name: res.real_name,
          card_bank: res.data.card_bank,
          card_number: res.data.card_number
        }
      }, (res) => {
        if (res.msg === 'NO_PAY_TYPE') {
          // 银行卡
          this.bankData.card_name = res.real_name
        } else {
          console.error(res.msg)
        }
      })
    },
    saveSettings (type) {
      if (!this.$root.trim(this.bankData.card_bank, 1)) {
        Tip({type: 'danger', message: this.$t('otc_legal.otc_legal_input_bank')}) // 请输入开户行
        $('.bankform input[name=card_bank]').focus()
        return
      } else if (!this.$root.trim(this.bankData.card_number, 1)) {
        Tip({type: 'danger', message: this.$t('otc_legal.otc_legal_input_bank_number')}) // 请输入银行卡号
        $('.bankform input[name=card_number]').focus()
        return
      } else if (!this.$root.bankCardValid(this.bankData.card_number)) {
        Tip({type: 'danger', message: this.$t('public0.public135')}) // 请输入有效的银行卡号
        $('.bankform input[name=card_number]').focus()
        return
      } else {
        let formData = new FormData(this.$refs.bankForm)
        otcApi.savePaySettings(type, formData, (msg) => {
          Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
          this.$router.push({name: 'page-payway'})
        }, (msg) => {
          Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  footer{
    p{
      line-height: .6rem;
      color: #8089a3;
      font-size: .23rem;
    }
    margin-top: 1rem;
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
