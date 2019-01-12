<template>
  <div class="page">
      <cp-top-back :back="false" :showLogo="true"></cp-top-back>
      <section class=" trans-records-scroll" id="scroll">
        <div class="img-banner">
          <img src="../../assets/img/cdcc/tpwq.jpg"/>
          <div class="btnwp">
            <button @click="transferShow=true">{{$t('vote_mining.funds_transfer')}}</button>
            <router-link :to="{name:'vote_mining_index'}" tag="button">{{$t('business.MINING_TITLE')}}</router-link>
          </div>
        </div>
        <div class="content">
          <section class="vote_tab">
            <ul>
              <li :class="{active:tab==='vote'}" @click="tabGoFun('vote')">{{$t('vote_mining.vote_profit')}}<!-- 投票收益 --></li>
              <li :class="{active:tab==='mining'}" @click="tabGoFun('mining')">{{$t('vote_mining.mining_profit')}}<!-- 挖矿收益 --></li>
              <li :class="{active:tab==='community'}" @click="tabGoFun('community')" v-if="community.display">{{$t('vote_mining.community_profit')}}<!-- 社区收益 --></li>
            </ul>
          </section>
                
          <mt-tab-container v-model="tab" :swipeable="true">
            <!--投票收益-->
            <mt-tab-container-item id="vote">
              <section class="vote_content">
                <div class="statistics">
                  <div class="header">
                    <span>{{$t('vote_mining.mining_account')}}<!-- 挖矿账户 --></span>
                    <span>{{$t('vote_mining.total_profit')}}<!-- 累计收益 --></span>
                    <span>{{$t('vote_mining.estimate_profit')}}<!-- 预估收益 --></span>
                  </div>
                  <div>
                    <span>{{(Number(vote.statistics.amount)+'').toMoney()}} CDCC</span>
                    <span>{{(Number(vote.statistics.totalProfit)+'').toMoney()}} CDCC</span>
                    <span>{{(Number(vote.statistics.estimateProfit)+'').toMoney()}} CDCC</span>
                  </div>
                  
                </div>
                <div class="records">
                  <div class="item" v-for="item in vote.data" :key="item.voteId">
                    <div>
                      <span>{{$t('vote_mining.vote_period')}}：<!-- 投票期 --></span>
                      <span>{{item.voteTime}} {{$t('business.TICKET_PERIOD_1')}}</span>
                    </div>
                    <div>
                      <span>{{$t('vote_mining.vote_number')}}：</span><!-- 投入票数(CDCC) -->
                      <span>{{(Number(item.amount)+'').toMoney()}} (CDCC)</span>
                    </div>
                    <div>
                      <span>{{$t('vote_mining.estimate_profit')}}：</span><!-- 预估收益(CDCC) -->
                      <span>{{(Number(item.estimateAmount)+'').toMoney()}} (CDCC)</span>
                    </div>
                    <div>
                      <span>{{$t('vote_mining.settlement_date')}}：</span><!-- 结算日 -->
                      <span>{{new Date(item.completeTime).format('yyyy-MM-dd')}}</span>
                    </div>
                  </div>
                </div>
              </section>
            </mt-tab-container-item>

            <!--挖矿收益-->
            <mt-tab-container-item id="mining">
              <section class="mining_content">
                <div class="statistics">
                  <div class="header">
                    <span>{{$t('vote_mining.daily_profit')}}<!-- 每日收益 --></span>
                    <span>{{$t('vote_mining.total_profit')}}<!-- 累计收益 --></span>
                    <span>{{$t('vote_mining.estimate_profit')}}<!-- 预估收益 --></span>
                  </div>
                  <div>
                    <span>{{(Number(mining.statistics.dailyProfit)+'').toMoney()}} CDCC</span>
                    <span>{{(Number(mining.statistics.totalProfit)+'').toMoney()}} CDCC</span>
                    <span>{{(Number(mining.statistics.estimateProfit)+'').toMoney()}} CDCC</span>
                  </div>
                  
                </div>
                <div class="records">
                  <div class="item" v-for="(item,index) in mining.data" :key="index">
                    <div>
                      <span>{{$t('vote_mining.vote_period')}}：<!-- 投票期 --></span>
                      <span>{{item.voteTime}} {{$t('business.TICKET_PERIOD_1')}}</span>
                    </div>
                    <div>
                      <span>{{$t('vote_mining.vote_pens')}}：<!-- 投票笔数 --></span>
                      <span>{{item.voteCount}}</span>
                    </div>
                    <div>
                      <span>{{$t('vote_mining.mining_profit')}}：<!-- 挖矿收益(CDCC) --></span>
                      <span>{{(Number(item.minerProfit)+'').toMoney()}} (CDCC)</span>
                    </div>
                  </div>
                </div>
                <div style="margin: 0.3rem;">
                  <button type="button" class="mint-button mint-button--primary mint-button--large" @click="miningPoolShow=true">{{$t('vote_mining.mine_pool')}}<!-- 我的矿池 --></button>
                </div>
              </section>
            </mt-tab-container-item>

            <!--333-->
            <mt-tab-container-item id="community" v-if="community.display">
              <section class="community_content">
                <div class="statistics">
                  <div class="header">
                    <span>{{$t('vote_mining.daily_profit')}}<!-- 每日收益 --></span>
                    <span>{{$t('vote_mining.total_profit')}}<!-- 累计收益 --></span>
                    <span>{{$t('vote_mining.estimate_profit')}}<!-- 预估收益 --></span>
                  </div>
                  <div>
                    <span>{{(Number(community.statistics.dailyProfit)+'').toMoney()}} CDCC</span>
                    <span>{{(Number(community.statistics.totalProfit)+'').toMoney()}} CDCC</span>
                    <span>{{(Number(community.statistics.estimateProfit)+'').toMoney()}} CDCC</span>
                  </div>
                  
                </div>
                <div class="sepline"></div>
                <div class="statistics">
                  <div class="header">
                    <span>{{$t('vote_mining.community_members')}}<!-- 社区成员数量 --></span>
                    <span>{{$t('vote_mining.my_community_profit')}}<!-- 我的社区收益总额 --></span>
                    <span>{{$t('vote_mining.community_member_profit')}}<!-- 社区成员收益总额 --></span>
                  </div>
                  <div>
                    <span>{{community.statistics.membersNumber}}</span>
                    <span>{{(Number(community.statistics.myProfit)+'').toMoney()}} CDCC</span>
                    <span>{{(Number(community.statistics.memberProfit)+'').toMoney()}} CDCC</span>
                  </div>
                  
                </div>
              </section>
            </mt-tab-container-item>

          </mt-tab-container>
        </div>
      </section>
      <mt-popup v-model="miningPoolShow" position="right">
        <div class="mining-pool">
          <cp-top-back :showMenu="false" :back="false">
            <span class="btn-back" @click="miningPoolShow=false"></span>
            <p class="top-title">{{$t('vote_mining.mine_pool')}}</p>
          </cp-top-back>
          <div class="mining-pool-list" id="miningPoolScroll">
            <p>{{$t('vote_mining.pool_numbers')}}： {{pollRecord.userCount}}</p>
            <div class="list">
              <div class="item header">
                <span>{{$t('vote_mining.nick_name')}}<!-- 昵称 --></span>
                <span>{{$t('otc_exchange.otc_exchange_phone')}}<!-- 手机号 --></span>
                <span>{{$t('vote_mining.vote_time')}}<!-- 投票时间 --></span>
              </div>
              <div class="item" v-for="(item,index) in pollRecord.list" :key="index">
                <span>{{item.nickname}}</span>
                <span>{{item.mobile}}</span>
                <span>{{item.createdAt}}</span>
              </div>
            </div>
          </div>
        </div>
      </mt-popup>
      <mt-popup v-model="transferShow" position="bottom">
        <Transfer @closeDialog="closeTransferDialog" ref="transferDialog"></Transfer>
      </mt-popup>
  </div>
</template>

<script>
import voteMiningApi from '@/api/voteMining'
import Transfer from '@/pages/vote_mining/transfer'

export default {
  components:{
    Transfer,
  },
  name: 'vote_mining_profile',
  data () {
      return {
        tab:'vote',
        miningPoolShow:false,
        transferShow:false,
        vote:{
          loadLock:false,
          statistics:{},
          data:[],
          page:1,
          size:10,
          total:0
        },
        pollRecord:{
          loadLock:false,
          userCount:0,
          total:0,
          page:1,
          size:10,
          list:[]
        },
        mining:{
          statistics:{},
          data:[]
        },
        community:{
          display:false,
          statistics:{}
        }
      }
  },
  created () {
    this.getVoteStatistics()
    this.getVoteRecord()
    this.getMiningStatistics()
    this.getMiningRecord()
    this.getCommunityStatistics()
    this.getMiningPool()
  },
  mounted(){
    this.loadMoreInit()
  },
  watch:{
    miningPoolShow(_n, _o){
      if(_n){
        setTimeout(()=>{
          this.loadPollMoreInit()
        },100)
      } else {
        $('#miningPoolScroll').off('scroll')
      }
    },
    transferShow(_n, _o){
      if(_n){
        this.$refs.transferDialog.formData.amount = ''
        this.$refs.transferDialog.getList()
      }
    }
  },
  methods: {
    closeTransferDialog(){
      this.transferShow = false
    },

    tabGoFun (index) {
      this.tab = index
    },
    getVoteStatistics(){
        voteMiningApi.getVoteStatistics(data=>{
            this.vote.statistics = data
        })
    },
    getVoteRecord(){
        if(this.vote.loadLock){
          return
        }
        this.vote.loadLock = true
        voteMiningApi.getVoteRecord({page:this.vote.page, size:this.vote.size},data=>{
          this.vote.loadLock = false
            this.vote.total = data.total
            this.vote.data = this.vote.data.concat(data.list)
        })
    },
    getMiningStatistics(){
        voteMiningApi.getMiningStatistics(data=>{
            this.mining.statistics = data
        })
    },
    getMiningRecord(){
        voteMiningApi.getMiningRecord(data=>{
            this.mining.data = data
        })
    },
    getCommunityStatistics(){
        voteMiningApi.getCommunityStatistics(data=>{
            this.community = data
        })
    },
    getMiningPool () {
      if(this.pollRecord.loadLock){
        return
      }
      this.pollRecord.loadLock = true
      voteMiningApi.getMiningPool({page:this.pollRecord.page, size:this.pollRecord.size}, data=>{
        this.pollRecord.loadLock = false
        this.pollRecord.userCount = data.userCount
        this.pollRecord.total = data.total
        this.pollRecord.list = this.pollRecord.list.concat(data.list)
      })
    },
    loadMoreInit(){ //加载更多投票记录
      var self = this
      $('#scroll').scroll(function() {
          //当时滚动条离底部60px时开始加载下一页的内容
          if(self.tab==='vote' && ($(this)[0].scrollTop + $(this).height() + window.innerHeight/1.5) >= $(this)[0].scrollHeight) {
            if (self.vote.page<Math.ceil(self.vote.total/self.vote.size) && !self.vote.loadLock) {
              self.vote.page += 1
              self.getVoteRecord()
            }
          }
      });
    },
    loadPollMoreInit(){
      var self = this //加载更多矿池记录
      $('#miningPoolScroll').scroll(function() {
          //当时滚动条离底部60px时开始加载下一页的内容
          if(($(this)[0].scrollTop + $(this).height() + window.innerHeight/1.5) >= $(this)[0].scrollHeight) {
            if (self.pollRecord.page<Math.ceil(self.pollRecord.total/self.pollRecord.size) && !self.pollRecord.loadLock) {
              self.pollRecord.page += 1
              self.getMiningPool()
            }
          }
      });
    }
  },  
}
</script>

<style lang="less" scoped>
.mining-pool {
  width: 100vw;
}
.mining-pool-list {
  position: absolute;
  top: 0.8rem;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.3rem;
  color: #333;
  overflow-y: auto;
  p {font-size: 0.32rem;}
  .list {padding-bottom: 0.5rem; margin-top: 0.3rem;}
  .list .item{display: flex; justify-content: space-between; line-height: 1rem; border-bottom: 1px solid #ccc; font-size: 0.24rem; color: #666; margin-left: 0.3rem; margin-right: 0.3rem;}
  .list .item.header {margin-left: 0; margin-right: 0; box-shadow: 0 0 5px rgba(0,0,0,.2); padding: 0 0.3rem; border-bottom: none; color: #333; font-size: 0.28rem;}
  .list .item span {flex: 1;}
}
.sepline {border-top: 1px solid #ccc; }
.trans-records-scroll {
    height: calc(100vh - 6rem);
    background-color: #fff;
    overflow-y: auto;
    overflow-x: hidden;
}
.img-banner{
  min-height: 2rem;
  position: relative;
  .btnwp{
    position: absolute;
    width: 100%;
    left: 0;
    bottom: .3rem;
    text-align: center;
    button{
      height: 0.6rem;
      margin: 0 .2rem;
      border: 1px solid #0072fd;
      border-radius: 0.05rem;
      background: rgba(0,114,253,.8);
      color: #fff;
      padding: 0 .3rem;
    }
  }
}
.img-banner img{
  display: block;
}
.mint-tab-container-item {min-height: 50vh;}
.content{
  margin: .3rem;
  color: #333;
  box-shadow: 0 1px 5px rgba(0,0,0,.3);
  border-radius: 4px;
  .vote_tab{
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    overflow: hidden;
    ul{
      width: 100%;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ccc;
      height: .75rem;
    }
    li{
      flex: 1;
      font-size: .24rem;
      height: .75rem;
      line-height: .75rem;
      text-align: center;
      border-right: 1px solid #ddd;
      &:last-of-type {
        border-right:none;
      }
    }
    li.active{
      color: #fff;
      background: #0072fd;
       border-right: none;
    }
  }
}
.statistics{
  line-height: 0.6rem;
  font-size: 0.2rem;
  padding: 0 0.3rem;
  > div {
    display: flex;
    &.header {color: #666; border-bottom: 1px solid #eee;}
    span {
      flex: 1; 
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.records{
  padding-bottom: .3rem;
  border-top: 1px solid #ddd;
  .item {
    border-bottom: 1px solid #eee;
    font-size: .24rem;
    color: #666;
    line-height: .6rem;
    padding-left: .3rem;
    padding-right: .3rem;
    > div {display: flex;}
    span {
      flex: 1;
      &:first-of-type {color: #666;}
    }
  }
  .item.header {
    margin-left: 0;
    margin-right: 0;
    box-shadow: 0 0 5px rgba(0,0,0,.2);
    padding: 0 .2rem;
    border-bottom: none;
    color: #333;
    font-size: .2rem;
  }
  .item:last-child {
    border: 0;
  }
}

.btn-back{position: absolute;top: .2rem;left: .3rem;width: .4rem;height: .4rem;background: url(../../assets/img/icon-return@3x.png) no-repeat center center / contain;}
.top-title {text-align: center; line-height: 0.8rem; font-size: 0.32rem;}
</style>

