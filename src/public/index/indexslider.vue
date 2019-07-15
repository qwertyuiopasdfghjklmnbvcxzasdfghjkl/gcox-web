<template>
  <div class="index-slider">
    <swiper v-if="banners.length" :options="swiperOption">
      <swiper-slide v-for="(item,index) in banners" :key="index">
        <a :href="item.url">
            <img :src="item.imgUrl" />
        </a>
      </swiper-slide>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import userApi from '@/api/individual'
  import config from '@/assets/js/config'
  export default {
    data () {
      return {
        datas: [],
        origin: config.origin,
        swiperOption: {
          centeredSlides:true,
          loop: true,
          slidesPerView: 5,
          autoplay: {
            delay: 5000, // 自动切换的时间间隔，单位ms
            stopOnLastSlide: false,
            disableOnInteraction: false,
          },
          speed: 300,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        }
      }
    },
    computed: {
      ...mapGetters(['getLang']),
      banners () {
        let datas = []
        this.datas.forEach((item) => {
          if (this.getLang === 'zh-CN') {
            datas.push({
              imgUrl: `${this.origin}${item.activityImgUrl}`,
              url: `${item.jumpAddress}`
            })
          } else if (this.getLang === 'cht') {
            datas.push({
              imgUrl: `${this.origin}${item.activityImgUrlCht}`,
              url: `${item.jumpAddressCht}`
            })
          } else {
            datas.push({
              imgUrl: `${this.origin}${item.activityImgUrlEn}`,
              url: `${item.jumpAddressEn}`
            })
          }
        })
        datas.sort((item1, item2) => {
          let n1 = Number(item1.adPosition)
          let n2 = Number(item2.adPosition)
          if (n1 === n2) {
            return 0
          }
          return n1 < n2 ? -1 : 1
        })
        return datas
      }
    },
    created () {
      userApi.getBannersList((res) => {
        this.datas = res
      })
    }
  }
</script>

<style lang="less" scoped>
.index-slider {
  height: 720px;
  background-size: 100% auto;
  background-position: 50%;
  background-repeat: no-repeat;
  margin-bottom: 30px;
  background-image: url('../../assets/img/newBannerBg.png');
  background-color: #040607;
  position: relative;
}
.swiper-container {
  position: relative;
  top: 215px;
  width: calc(100% - 200px);
  height: 300px;
  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .swiper-slide a {display: inline-block;}
  .swiper-slide img {
      width: 180px;
      height: 180px;
      border-radius: 100%;
      transition: all ease-out 300ms;
  }
  .swiper-slide.swiper-slide-active img {
    width: 290px;
    height: 290px;
  }
  .swiper-button-prev, .swiper-container-rtl .swiper-button-next {
    width: 47px;
    height: 47px;
    background:url('../../assets/img/swiper-arrow-left.png') center;
  }
  .swiper-button-next, .swiper-container-rtl .swiper-button-prev {
    width: 47px;
    height: 47px;
    background:url('../../assets/img/swiper-arrow-right.png') center;
  }
}
</style>
