<template>
  <div class="price-adjust">
    <div><i class="deduct" v-tap="{methods:down}"></i></div>
    <div><numberbox v-model="inputValue"></numberbox></div>
    <div><i class="add" v-tap="{methods:up}"></i></div>
  </div>
</template>

<script>
import numberbox from '@/components/numberInput'
import numUtils from '@/assets/js/numberUtils'
export default {
  name: 'cp-adjust',
  props: ['value'],
  components: {
    numberbox
  },
  data () {
    return {
      inputValue: '',
      fixed: 8
    }
  },
  watch: {
    inputValue () {
      this.updateFixed()
      this.$emit('input', this.inputValue)
    },
    value () {
      this.inputValue = this.value
      this.updateFixed()
    }
  },
  created () {
    this.inputValue = this.value
    this.updateFixed()
  },
  methods: {
    updateFixed () {
      let arr = (this.inputValue || '').split('.')
      this.fixed = arr[1] ? arr[1].length : 0
    },
    up () {
      let val = this.toFixed(numUtils.max([numUtils.add(this.inputValue, 1 / Math.pow(10, this.fixed)), 0]))
      this.inputValue = val
    },
    down () {
      let val = this.toFixed(numUtils.max([numUtils.minus(this.inputValue, 1 / Math.pow(10, this.fixed)), 0]))
      this.inputValue = val
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixed : fixed, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.price-adjust {
  margin-top: 0.4rem;
  display: flex;
  height: 0.88rem;
  >div{display:flex;}
  > div:nth-of-type(1) {
    width: 0.8rem;
    min-width: 0;
  }
  > div:nth-of-type(2) {
    flex: 1;
    min-width: 0;
  }
  > div:nth-of-type(3) {
    width: 0.8rem;
    min-width: 0;
  }
  .deduct, .add {
    display:flex;
    flex:1;
    background: url('../assets/img/deduct-icon.png') #55637c no-repeat center;
    background-size: contain;
    &.active {
      background-color: #3a3f5e;
    }
  }
  .add {
    background-image: url('../assets/img/add-icon.png');
  }
  input {
    width: 100%;
    display:flex;
    text-align: center;
    font-size: 0.3rem;
    color: #fff;
    background-color: #161f2f;
    border: none;
    border-top: .01rem solid #55637c;
    border-bottom: .01rem solid #55637c;
  }
}
</style>
