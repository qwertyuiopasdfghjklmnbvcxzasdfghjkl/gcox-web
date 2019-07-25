<template>
  <div class="acm">
    <div class="w1200">
      <div class="acm-header">{{$t('acm.text_1')}} <!-- ACCLAIM币 （ACM）是GCOX的基准货币可用来购买明星代币或运用在任何GCOX明星平台上 --> </div>
      <div class="acm-chart" :class="{cn:getLang!=='en'}">
        <div class="acm-top-text">
          <div class="mb30">
           <p>{{$t('acm.text_2')}}<!-- 亲爱的ACM持有者 -->：</p>
          </div> 
          <div class="mb40">
           <p>{{$t('acm.text_3')}}<!-- ACM是在GCOX交易所上线及交易的所有名人币的平台币，ACM是所有同GCOX合作的名 --></p> 
           <p>{{$t('acm.text_4')}}<!-- 人和国家品牌之间的桥梁与纽带。ACM未来还可以用来参加GCOX平台推出的独家功能和明 --></p> 
           <p>{{$t('acm.text_5')}}<!-- 星/名人活动。 --></p>
          </div> 
          <div class="mb40">
           <p><span>{{$t('acm.text_6')}}<!-- 查看您的ACM钱包及ACM账户余额，请移步 --> </span> <a href="https://acm.gcox.com/login" target="_blank" class="f-c-main">acm.gcox.com</a> <span>{{$t('acm.text_7')}}<!-- 或点击 --></span> <a href="https://acm.gcox.com/login" target="_blank" class="f-c-orange">{{$t('acm.text_8')}}<!-- 这里 --></a>。 </p>
          </div> 
          <div class="mb20">
           <p>{{$t('acm.text_9')}}<!-- 在GCOX交易所上线之际，我们隆重推出ACM空投锁仓计划，参与即可获得奖励！查看更多细节，请点击 --> <router-link :to="{name:'detail', params:{id:'123123', type:'notice'}}" class="f-c-orange pointer" tag="span">{{$t('acm.text_8')}}<!-- 这里 --></router-link>。</p>
          </div> 
          <div class="fs20 mb20">
           <a href="https://acm.gcox.com/login" target="_blank" class="default bold">{{$t('acm.text_10')}}<!-- 立即加入ACM空投锁仓计划 --></a>
          </div> 
          <div class="join">
           <a href="https://acm.gcox.com/login" target="_blank">
              <img src="../assets/img/acm_register_icon_en.png" v-if="getLang==='en'" />
             <img src="../assets/img/acm_register_icon_cn.png" v-else/>
           </a>
          </div> 
          <div class="mt310 join">
           <p>{{$t('acm.text_11')}}<!-- 查看更多GCOX集团信息及项目，请访问 --></p> 
           <a href="https://gcoxgroup.com/" target="_blank" class="f-c-main">gcoxgroup.com</a> 
           <p class="mt20">
            <a href="https://gcoxgroup.com/" target="_blank">
              <img src="../assets/img/more-en.png" v-if="getLang==='en'" />
              <img src="../assets/img/more-cn.png" v-else />
            </a>
          </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters} from 'vuex'
export default {
  computed:{
    ...mapGetters(['getLang'])
  }
}
</script>
<style lang="less" scoped>
.default {color: #f1f1f2;}
.bold {font-weight: 600;}
.acm {
  padding-top: 60px;
  background: #040607;
  color: #f1f1f2;
  font-size: 15px;
  .acm-header {
      width: 600px;
      margin: auto;
      font-size: 22px;
      color: #fff;
      letter-spacing: 0;
      text-align: center;
      line-height: 38px;
  }
  .acm-chart {
      padding-top:58%;
      position:relative;
      text-align: center;
      margin-top: 30px;
      position: relative;
      background:url('../assets/img/ACM-Elite-Community-Prog-4-EN.jpg') no-repeat center bottom;
      background-size: 100% auto;
      .acm-top-text {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
      }
  }
  .join img {
      width: 120px;
      margin-top: 0;
      cursor: pointer;
  }
  .mt310 {
      position: absolute;
      bottom: 30px;
      left: 50%;
      -ms-transform: translate(-50%);
      transform: translate(-50%);
  }
}
</style>

