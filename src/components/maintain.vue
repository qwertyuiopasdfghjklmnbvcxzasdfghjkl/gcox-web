<template>
	<div class="main">
	  <p class="text-center f-c-white fs36 mt60"><strong>Site Maintenance</strong></p>
	  <p class="text-center f-c-white fs36 mt10"><strong>系统维护</strong></p>
	  <p class="text-center f-c-white fs16 mt60">{{datetime}}&nbsp;&nbsp;(GMT+ 8)</p>
	</div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
	name:'maintain',
	computed:{
		...mapGetters(['getSysParams']),
		datetime(){
			return this.getSysParams.maintain && this.getSysParams.maintain.value2 || ''
		}
	}
}
</script>

<style lang="less" scoped>
.main {position: absolute; left: 0; right: 0;top: 40%; -webkit-transform:translateY(-50%); transform:translateY(-50%);}
</style>