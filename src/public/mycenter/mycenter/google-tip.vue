<template>
  <div class="cont">
    <p class="tip-title"><i></i>{{$t('usercontent.user20')}}</p>
    <div class="btn">
      <button @click="toGoogle()">
        <p>{{$t('usercontent.user21')}}</p>
        <span></span>
      </button>
    </div>
    <div class="force">
      {{$t('usercontent.user22')}}
      <p @click="nextSet()">{{$t('usercontent.user23')}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'google-tip',
    methods: {
      toGoogle () {
        this.$emit('okCallback')
        this.$emit('removeDialog')
      },
      nextSet () {
        this.$emit('removeDialog')
      },
    }
  }
</script>

<style scoped lang="less">
  .cont {
    width: 570px;
    display: flex;
    flex-flow: column;
    background: #ffffff;
    border-radius: 3px;
    padding: 50px 30px;
    text-align: center;

    .tip-title {
      display: inline-block;
      font-size: 16px;
      color: #00a0e9;
      padding: 10px 0;
      i {
        width: 20px; 
        height: 14px;
        display: inline-block;
        vertical-align: middle;
        background-size: auto 14px;
        background-repeat: no-repeat;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAQlBMVEUAAADyMUvxMEvyMUvyMEryMEryMUryMEvxMUvzMUzzMU31NE73Nk3xMEr////0XnL82N3yRl37yM/6wcn2hJPyRV3VCfr6AAAADXRSTlMA/fPs2djHvoFUPzEhI1mGfQAAAJlJREFUKM99k1kOwzAIRLHjLcE4a+9/1aqLoKSC+UPPIJYxsLDVFGOqDeGuORMrzwr1QkqlC1smumlamAX6U/jSznkq91O5yPPjkCLl3Sex1jFWiV49ZwtmACQLEkKzYYNqwwrJhgmiDaML3bJuQ2qUcJ5BjYJkCtX69m17SJT14q8xLr14KL+Zu5zMPbZnE99gvjV9U7vf4QkKEh77JMzQegAAAABJRU5ErkJggg==);
      }
    }

    .btn {
      margin: 20px 0;

      button {
        position: relative;
        box-sizing: border-box;
        height: 40px;
        line-height: 40px;
        background-color: #d8d8da;
        border: 1px solid #d8d8da;
        border-radius: 4px;
        padding: 0 40px;
        min-width: 150px;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAqCAMAAAD/A0kuAAAAllBMVEUAAAAbHiYWFyAVFyAWGiIVFyAYGCUVFyAVFyAVFyAaGiMZHDIWFyAVFyEVFyEWFyEVFyAyMjIWGCAVFyAVFyAWGCEjIyMVFyAWGCAWFyAWGCAWGCEeHi4VGCEVFyAVGCEVGCEZGSEVFyAWGCAXGSEXFyIWGCIXGSAXGCEWGCAWGSIXGSIWGiMYGCIWHSQXFycVGCAVFyA5BjA1AAAAMXRSTlMAGfXFLvgU8Na0Jgre2c2jjwXs576JDuO4pnZnEKqYkmsehX57YllOSKBRQjkzIyFfyC/S7gAAAd1JREFUOMuFlYdygzAMhhUIgYS9AoGQvdqMVu//crUJdjyAfnfcYfNb/JJlAJXZOVqZvmc2UT2BUSaViQLBaT8oXR4MVLCiWb92l2APdgU67goHmC81twEO4rwUbYEjJAvJQ4Cj+KKTFf5DGX/qIBq8/EweuVbDI69vooV4qTkYbDsPwhzbgwsqbLpKCO/8Akaq7uW7IhV+qLm4QYUcKGLvXLl4q5Wv7UkUmHJxjSrUx1kYp8BZoArtqKg/8g5VQnX3iuHAmLH8ODto+S4ssynl8jlk3keJO9VucLtu14hym0x4KHEgU7l9Z8e3FMSaDesBMMUzMNapZKMR3xROacplG/Thtk6kBKPP0msMFONKraBjN3RUiKWruYNJ11hIbi7JE1z/QoZz7Di1zzpMeDNFl0i+qGHasKG0YQE78iwn2gVBDbcg2JJhhm88oJyUyFDs2sjr55asd1m3R0DZW53n4+2nzfDoLeGW/LpAxQfRhdJKaZDNM3qG6sQwnBs8hVq0zGxU2bgkc3JdU1Yq/j2tUMM77+P1fSUcKs4c/8GMgbN0cBRP+kq/EhzBmILEwh+Jy7XcSTnodwYa8dHAHqw87v9XbSxUCYf/V4vcl8xGsltdX4WZY9t+Fp405R9FkcklGW24AwAAAABJRU5ErkJggg==);
        background-repeat: no-repeat;
        background-position: 10px;
        background-size: auto 22px;
        color: #181d31;
        font-size: 14px;

        span {
          position: absolute;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABECAMAAAALOLO9AAAAzFBMVEUAAAD/kwD/lAD/lgD/rgD/ugD/kwD/lAD/kwD/kwD/lAD/kwD/lQD/lAD/kwD/lAD/kwD/lQD/lQD/lQD/lQD/lAD/lgD/mgD/mwD/lAD/kwD/kwD/lAD/kwD/lAD/lAD/lAD/lAD/kwD/lQD/mAD/nAD/mQD/lQD/mwD/lwD/kwD/////qjf/uVz/mxP/sUj/lgn//fr/pi7/oyf/t1X/nRn/9ej/9OX/7dX/58j/0ZP/zYr/yoT/xHX/vmb/rDv/mQ7/4bn/37T/1p+TmUw7AAAAKnRSTlMA+vQsBwP9N+zVybCWj+bgv2BZUUpFPxsW8NrQuqafiIF3b2clEg8MISBi4O8VAAABvklEQVRYw63Y11bCQBSF4Y2CioKo2Csithkg9CZNff93kiyQExicGdnsm9wk30q5+VewqR3vqPW3lUxvz5yTmGK2k4pPnSznqKOZc0o6KUx3tsU91+/7OeecNGbbvWKYJObOHvPdMd824yDiHCrPDUsWBgVPp6j1wMLgLePFlLRu2RhcXPswH1rrpo3BRdKtVNoTpm5lcHnjZPraeTfA877rBVcnSlU5GLzYnXpLT9Z1Mng9UqtWDoJgpOptHe4rCFezMYjfrmJ64eW1ko5uZGMQP/jjM+viIlOyMkiscAYrmKKdQeLOYIYmU604GCTul5mGyXSUiwFSS0xgMj0PBulFpmgyDR8GDwtM3WTKXgxyUaZpMF3lx+AxwlQMpu/LIB9xqiHTiDA1bwZPcmonvHL8OVe+lewfwVEpl8fTw3TKl/EPDriXjbGMBAfFSHCQjAQHz7iDA77OHsdIcNCMBAfPoJBhGNl7hmYkOHgGl0mOkeDgGAkOjpHg4BgJDoJxBAfWcQ4IxhocWM+54xgJDp6R4OAZpGnGDA4Qy5GMGRyglqcYMzj4Pxw8I8EBetkYx0hwcIwEB8dIcGAj2/0BfbF3CnJe9C4AAAAASUVORK5CYII=);
          background-repeat: no-repeat;
          background-size: 100%;
          display: block;
          height: 34px;
          width: 34px;
          top: -1px;
          right: -1px;
        }
      }
    }

    .force {
      margin-top: 20px;
      text-align: right;
      font-size: 12px;
      line-height: 22px;
      color: #646464;

      p {
        display: inline-block;
        font-size: 14px;
        line-height: 22px;
        color: #00a0e9;
        border: none;
        border-bottom: 2px solid #00a0e9;
        padding: 0 5px;
        cursor: pointer;
        text-align: center;
      }
    }
  }
</style>
