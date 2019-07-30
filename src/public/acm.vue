<template>
  <div class="acm">
    <div class="w1200">
      <template v-if="getLang!=='en'">
      <div class="acm-header">ACCLAIM币 （ACM）是GCOX的基准货币可用来购买明星代币或运用在任何GCOX明星平台上 </div>
      <div class="acm-chart cn">
        <div class="acm-top-text">
          <div class="mb30">
           <p>亲爱的ACM持有者：</p>
          </div> 
          <div class="mb40">
           <p>ACM是在GCOX交易所上线及交易的所有名人币的平台币，ACM是所有同GCOX合作的名</p> 
           <p>人和国家品牌之间的桥梁与纽带。ACM未来还可以用来参加GCOX平台推出的独家功能和明</p> 
           <p>星/名人活动。</p>
          </div> 
          <div class="mb40">
           <p><span>查看您的ACM钱包及ACM账户余额，请移步 </span> <a href="https://acm.gcox.com/login" target="_blank" class="f-c-main">acm.gcox.com</a> <span>或点击</span> <a href="https://acm.gcox.com/login" target="_blank" class="f-c-orange">这里</a>。 </p>
          </div> 
          <div class="mb20">
           <p>在GCOX交易所上线之际，我们隆重推出ACM空投锁仓计划，参与即可获得奖励！查看更多细节，请点击 <router-link :to="{name:'detail', params:{id:'187601218401468416', type:'notice'}}" class="f-c-orange pointer" tag="span">这里</router-link>。</p>
          </div> 
          <div class="fs20 mb20">
           <a href="https://acm.gcox.com/login" target="_blank" class="default bold">立即加入ACM空投锁仓计划</a>
          </div> 
          <div class="join">
           <a href="https://acm.gcox.com/login" target="_blank">
             <img src="../assets/img/acm_register_icon_cn.png"/>
           </a>
          </div> 
          <div class="mt310 join">
           <p>查看更多GCOX集团信息及项目，请访问</p> 
           <a href="https://gcoxgroup.com/" target="_blank" class="f-c-main">gcoxgroup.com</a> 
           <p class="mt20">
            <a href="https://gcoxgroup.com/" target="_blank">
              <img src="../assets/img/more-cn.png"/>
            </a>
          </p>
          </div>
        </div>
      </div>
      </template>
      <template v-else>
        <div class="acm-header">The Acclaim Token (ACM) is the base currency of GCOX ACM can be used to buy Celebrity Tokens or to access the various Celeb Features available on GCOX</div>
      <div class="acm-chart en">
        <div class="acm-top-text">
          <div class="mb30">
           <p>Dear ACM token holders：</p>
          </div> 
          <div class="mb40">
           <p>The Acclaim Token(ACM)is the base token for all Celebrity Tokens and is traded</p> 
           <p>on the GCOX Exchange. ACM servers as a means of exchange for the different</p> 
           <p>tokens of our GCOX celebrities and global brand partners. ACM may also be used</p>
           <p>to gain access to exclusive features and celebrity programmes availble on GCOX</p>
           <p>platforms</p>
          </div> 
          <div class="mb40">
           <p><span>To access your ACM e-wallet and check your ACM balance,</span></p>
           <p>please head to <a href="https://acm.gcox.com/login" target="_blank" class="f-c-main">acm.gcox.com</a> <span>or</span> <a href="https://acm.gcox.com/login" target="_blank" class="f-c-orange">click here.</a>。 </p>
          </div> 
          <div class="mb20">
            <p>In celebration of the launch of our GCOX Exchange, we are pleased to share</p>
           <p>with you how you may receive <router-link :to="{name:'detail', params:{id:'187601218401468416', type:'notice'}}" class="f-c-orange pointer" tag="span">ATTRACTIVE BONUS TOKENS </router-link>。via our ACM</p>
           <p>Community Elite Programme!</p>
          </div> 
          <div class="mb20">
            <p>To find more details, please <router-link :to="{name:'detail', params:{id:'187601218401468416', type:'notice'}}" class="f-c-orange pointer" tag="span">click here.</router-link></p>
          </div>
          <div class="fs20 mb20">
           <a href="https://acm.gcox.com/login" target="_blank" class="default bold">JOIN OUR ACM COMMUNITY ELITE PROGRAMME NOW!</a>
          </div> 
          <div class="join">
           <a href="https://acm.gcox.com/login" target="_blank">
              <img src="../assets/img/acm_register_icon_en.png" />
           </a>
          </div> 
          <div class="mt310 join">
           <p>To find out more about our GCOX Group</p> 
           <p>and the exciting projects we are involved in,</p> 
           <p>please visit <a href="https://gcoxgroup.com/" target="_blank" class="f-c-main">gcoxgroup.com</a> </p>
           <p class="mt20">
            <a href="https://gcoxgroup.com/" target="_blank">
              <img src="../assets/img/more-en.png" />
            </a>
          </p>
          </div>
        </div>
      </div>
      </template>
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
      &.en {padding-top:70%;}
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

