<template>
  <div class="page">
    <cp-top-back :back="true">
    </cp-top-back>

    <div class="page-main content">
      <div class="box">
        <div class="inner">
          <div class="item-div">
            <div class="left">
              <h1><!--实名认证-->{{$t('account.user_Real_name_verification')}}</h1>
            </div>
          </div>
          <div class="item-div" v-tap="{methods:$root.routeTo, to:'page-realnameInfo'}" >
            <div class="left">{{$t('public0.public75')}}<!--中国大陆地区--></div>
            <div class="right"><i class="i_right"></i></div>
          </div>
          <div class="item-div" v-tap="{methods:$root.routeTo, to:'page-otherRealnameInfo'}">
            <div class="left">{{$t('public0.public76')}}<!--其他地区--></div>
            <div class="right"><i class="i_right"></i></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import individual from '@/api/individual'
export default {
  name: 'page-realname',
  beforeCreate () {
    individual.getUserState((data) => {
      data.verifyState === 0 ? void 0 : this.$router.replace({name: 'page-ucenter'})
    }, (msg) => {
      console.error(msg)
      this.$router.replace({name: 'page-ucenter'})
    })
  }
}
</script>

<style lang="less" scoped>
  .page-top {
    background-color: #292929;
  }
  @font_color_transparent:#cbd4ec;
  @fs_24:.24rem;
  @f_c_2:#8089a3;

  .box{
    .inner{
      padding: .3rem;
      font-size: .3rem;
    }
  }

  .item-div{
    height: 1.3rem;
    align-items: center;
    display: flex;
    justify-content: space-between;
    h1{
      font-size: .36rem;
    }
    .right{
      i{
        width: .12rem;
        height: .26rem;
        display: inline-block;
        background:url("../../assets/img/i_right_nav.png") no-repeat center;
        background-size: 100% 100%;
      }
    }
  }
  .padding-top-bottom-10{
    padding: .1rem 0;
  }
</style>
