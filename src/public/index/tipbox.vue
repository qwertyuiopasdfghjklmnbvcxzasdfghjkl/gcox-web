<template>
  <div class="tip-box w1200 mt70">
    <p class="fs20 text-center efont">{{$t('about.ourPromise')}}<!-- 我们对你的承诺 --></p>
    <div class="tips ui-flex mt70">
      <div class="ui-flex-1 ui-flex ui-flex-center">
        <div>
          <img src="../../assets/img/icon-knowledge.png">
          <p class="item-title efont">{{$t('about.knowledge')}}<!-- 专业知识 --></p>
          <p class="fs14">{{$t('about.desc_knowledge')}}<!-- 团队由30名经验丰富的专家引领，他们是各个商业和金融科技行业中经验丰富的顾问，创始人和经营管理者 --></p>
        </div>
      </div>
      <div class="ui-flex-1 ui-flex ui-flex-center">
        <div>
          <img src="../../assets/img/icon-safty.png">
          <p class="item-title efont">{{$t('about.safty')}}<!-- 高度安全性 --></p>
          <p class="fs14">{{$t('about.desc_safty')}}<!-- 专业的风险管理和保护系统 --></p>
        </div>
      </div>
      <div class="ui-flex-1 ui-flex ui-flex-center">
        <div>
          <img src="../../assets/img/icon-technology.png">
          <p class="item-title efont">{{$t('about.technology')}}<!-- 先进的技术 --></p>
          <p class="fs14">{{$t('about.desc_technology')}}<!-- 自主研发的区块链和高效率的交易引擎 --></p>
        </div>
      </div>
      <div class="ui-flex-1 ui-flex ui-flex-center">
        <div>
          <img src="../../assets/img/icon-tokens.png">
          <p class="item-title efont">{{$t('about.tokens')}}<!-- 多元化的币种 --></p>
          <p class="fs14">{{$t('about.desc_tokens')}}<!-- 提供主流加密货币交易对，包括BTC，ETH和ACM --></p>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.tip-box .tips{
  padding: 30px 0;
  justify-content: center;
  > div > div {
    width: 247px;
    text-align: center;
    img {
        width: 83px;
        height: 57px;
    }
    .item-title {
        margin-top: 10px;
        margin-bottom: 12px;
        font-size: 18px;
    }
  }
}
</style>
