<template>
  <div class="news mt70">
    <div class="w1200">
      <p class="news-header efont">{{$t('about.news')}}<!-- 资讯 --></p>
      <div class="ui-flex">
         <div class="ui-flex-1  ui-flex ui-flex-center item">
          <div class="ui-flex-column">
           <div class="item-title ellipsis"> 关于GCOX你需要了解的5件事 </div>
           <div class="item-detail ellipsis-4"> “解密”GCOX，你需要知道的5大看点。 </div>
           <div class="item-bottom ui-flex">
            <div class="ui-flex-1"> 2019-6-21 </div>
            <div>{{$t('exchange.advanced_more')}} &gt;&gt; <!-- 更多 --></div>
           </div>
          </div>
         </div>
         <div class="ui-flex-1  ui-flex ui-flex-center item">
          <div class="ui-flex-column">
           <div class="item-title ellipsis"> 关于GCOX你需要了解的5件事 </div>
           <div class="item-detail ellipsis-4"> “解密”GCOX，你需要知道的5大看点。 </div>
           <div class="item-bottom ui-flex">
            <div class="ui-flex-1"> 2019-6-21 </div>
            <div>{{$t('exchange.advanced_more')}} &gt;&gt; <!-- 更多 --></div>
           </div>
          </div>
         </div>
         <div class="ui-flex-1  ui-flex ui-flex-center item">
          <div class="ui-flex-column">
           <div class="item-title ellipsis"> 关于GCOX你需要了解的5件事 </div>
           <div class="item-detail ellipsis-4"> “解密”GCOX，你需要知道的5大看点。 </div>
           <div class="item-bottom ui-flex">
            <div class="ui-flex-1"> 2019-6-21 </div>
            <div>{{$t('exchange.advanced_more')}} &gt;&gt; <!-- 更多 --></div>
           </div>
          </div>
         </div>
        </div>
      </div>
  </div>
</template>
<style lang="less" scoped>
.news{
  padding: 20px 0 70px;
  color: #151720;
  background-color: #eaeaec;
  .news-header {
    line-height: 40px;
    text-align: center;
    margin-bottom: 20px;
    position: relative;
    font-size: 20px;
  }
  .item > div {
      padding: 30px 18px 0;
      width: 332px;
      height: 200px;
      box-sizing: border-box;
      background: url('../../assets/img/news_bg.png') no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
      transition: all .2s ease;
      transform: translateZ(0);
      &:hover{transform:translate3d(0,-10px,0)}
      .item-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 14px;
      }
      .item-detail {
          color: #979799;
          font-size: 12px;
          line-height: 20px;
          height: 80px;
          overflow: hidden;
      }
      .item-bottom {
          margin-top: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #979799;
      }
  }
}
</style>
