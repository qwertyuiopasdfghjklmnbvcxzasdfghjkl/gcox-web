<template>
  <div class="exchange">
    aaa
  </div>
</template>

<script>
import numUtils from '@/assets/js/numberUtils'
import loading from '@/components/loading'
import { mapGetters, mapActions } from 'vuex'

export default {
  name:'quickTrade',
  components: {
    loading
  },
  data () {
    return {
     
    }
  },
  computed: {
    ...mapGetters(['getLang']),

  },
  created () {

  },
  mounted(){

  },
  beforeDestroy () {

  },
  methods: {
    ...mapActions(['addEvents', 'removeEvents']),

  }
}
</script>

<style lang="less" scoped>
.block {
    background: #19181c;
    margin-bottom: 4px;
    padding: 0 10px;
    .no-margin {
        margin: 0;
    }
}
</style>

