<template>
  <div class="cont">
    <h4>{{$t('usercontent.user96')}}{{symbol}}{{$t('usercontent.user97')}}</h4>
    <div class="inp">
      <label>
        <p>{{$t('usercontent.user88')}}</p>
        <input v-model="address" @blur="blur('address','addressError')"/>
        <p v-if="addressError" class="error">{{$t('usercontent.user33')}}</p>
      </label>
      <label>
        <p>{{$t('usercontent.user89')}}</p>
        <input v-model="memo" @blur="blur('memo','memoError')" maxlength="50"/>
        <p v-if="memoError" class="error">{{$t('usercontent.user98')}}</p>
      </label>
      <label>
        <p>{{$t('usercontent.user61')}}</p>
        <input v-model="googleCode" @blur="blur('googleCode','googleCodeError')"/>
        <p v-if="googleCodeError" class="error">{{$t('usercontent.user99')}}</p>
      </label>
    </div>
    <div class="btn">
      <button @click="close()">{{$t('usercontent.user31')}}</button>
      <button @click="add()" class="active">{{$t('usercontent.user32')}}</button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import wallrtApi from '../../api/wallet'

  export default {
    name: 'addSymbol',
    props: ['symbol'],
    data () {
      return {
        address: null,
        memo: null,
        googleCode: null,
        addressError: false,
        memoError: false,
        googleCodeError: false,
      }
    },
    methods: {
      blur (e, er) {
        this[er] = !this[e]
      },
      close () {
        this.$emit('removeDialog')
      },
      add () {
        let data = {
          symbol: this.symbol,
          address: this.address,
          memo: this.memo,
          googleCode: this.googleCode
        }
        wallrtApi.addAddress(data, res => {
          this.$emit('okCallback')
          this.close()
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${res.msg}`)})
        }, msg => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .cont {
    width: 600px;
    color: #606266;
    font-size: 14px;
    padding: 30px;
    background: #fff;
    position: relative;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .3);

    .inp {
      padding-top: 30px;
      margin: 0 auto;

      label {
        position: relative;
        height: 94px;
        padding-top: 30px;
        display: block;

        p {
          position: absolute;
          top: 0;
          left: 0;
        }

        input {
          border-bottom: 2px solid rgba(21, 23, 32, .08);
          height: 34px;
          line-height: 30px;
          width: 100%;
        }

        .error {
          position: absolute;
          top: 72px;
          left: 0;
          color: #f1304a;
        }
      }
    }

    .btn {
      display: flex;
      justify-content: flex-end;

      button {
        border-bottom: 2px solid #151720;
        color: #151720;
        line-height: 28px;
        cursor: pointer;
        background: none;

        &.active {
          border-bottom: 2px solid #00a0e9;
          line-height: 28px;
          color: #00a0e9;
          margin-left: 40px;
          cursor: pointer;
        }
      }
    }
  }
</style>
