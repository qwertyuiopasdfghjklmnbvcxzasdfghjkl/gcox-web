<template>
  <div class="nikename-form">
    <p>
      <input name="nickname" type="text" v-model="nicknameValue" v-validate="'required'"/>
    </p>
    <p>（{{$t('account.user_center_set_username')}}）<!--昵称只能设置一次--></p>
    <p>
      <button @click="canlFun">{{$t('otc_legal.otc_legal_cancel')}}<!--取消--></button>
      <button @click="submit">{{$t('otc_legal.otc_legal_save')}}<!--保存--></button>
    </p>
  </div>
</template>

<script>
import userApi from '@/api/individual'
export default {
  name: 'page-help',
  props: {
    nikename: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      nicknameValue: this.nikename
    }
  },
  computed: {
    msgs () {
      return {
        nickname: {required: this.$t('public0.public73')}, // 请输入昵称
      }
    }
  },
  methods: {
    canlFun () {
      this.$emit('on-close-all')
    },
    submit () {
      this.$validator.validateAll().then((res) => {
        if (!res) {
          let items = this.errors.items
          if (items && items.length && items[0]) {
            let name = items[0].field
            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
            Tip({type:'danger', message: msg})
          }
          return
        }
        userApi.editNickname({
          nickname: this.nicknameValue
        }, (msg) => {
          this.$emit('okCallback', this.nicknameValue)
          Tip({type:'success', message:this.$t(`error_code.${msg}`)})
          this.canlFun()
        }, (msg) => {
          Tip({type:'danger', message:this.$t(`error_code.${msg}`)})
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.nikename-form {
  p {
    height: .8rem;
    font-size: 0;
    line-height: 0;
  }
  p:first-of-type {
    input {
      width: 100%;
      height: .8rem;
      font-size: .32rem;
      color: #181b2a;
      background-color: transparent;
      border-width: 0;
      border-bottom: 1px solid #8089a3;
    }

  }
  p:nth-of-type(2) {
    line-height: .8rem;
    font-size: .24rem;
    color: #8089a3;
  }
  p:last-of-type {
    padding-top: .2rem;
    text-align: center;
    button {
      min-width: 1.6rem;
      height: .6rem;
      padding-left: .2rem;
      padding-right: .2rem;
      color: #e6edf4;
      background-color: #ffde00;
      border-width: 0;
      &:first-of-type {
        margin-right: .6rem;
        color: #ffde00;
        background-color: transparent;
        border: 1px solid #ffde00;
      }
    }
  }
}
</style>
