<template>
  <div class="mycenter">
    <div class="cont">
      <p class="title">{{$t('usercontent.user01')}}</p>
      <div class="box">
        <p>{{$t('usercontent.user02')}}：{{getUserInfo.username}}</p>
      </div>
    </div>
    <div class="cont mt15">
      <p class="title">{{$t('usercontent.user03')}}</p>
      <div class="box">
        <p class="c-c">{{$t('usercontent.user04')}}</p>
        <ul class="ul">
          <li>
            <i class="icon-name"></i>
            <span>{{$t('usercontent.user05')}}</span>
            <span>{{$t('usercontent.user06')}}</span>
            <button @click="banding()">{{getUserInfo.googleAuthEnable === 0 ? $t('usercontent.user07'):
              $t('usercontent.user34')}}
            </button>
          </li>
          <li>
            <i class="icon-lock"></i>
            <span>{{$t('usercontent.user08')}}</span>
            <span>{{$t('usercontent.user09')}}</span>
            <button @click="rePassword()">{{$t('usercontent.user10')}}</button>
          </li>
          <li>
            <i class="icon-card"></i>
            <span>{{$t('usercontent.user11')}}</span>
            <span>{{$t('usercontent.user12')}}</span>
            <button @click="rePayPassword()">{{$t('usercontent.user10')}}</button>
          </li>
        </ul>
      </div>
    </div>
    <div class="cont mt15">
      <p class="title">{{$t('usercontent.user13')}}</p>
      <table class="table">
        <tr>
          <td width="20%" height="34px"></td>
          <td width="20%">{{$t('usercontent.user14')}}</td>
          <td width="20%">{{$t('usercontent.user15')}}</td>
          <td width="20%">{{$t('usercontent.user16')}}</td>
          <td width="20%">API</td>
        </tr>
        <tr>
          <td height="34px">
            <p :class="{active: getUserInfo.kycState !== 2}">{{$t('usercontent.user17')}}
              <span v-if="getUserInfo.kycState !== 2">{{$t('usercontent.user18')}}</span>
            </p>
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td height="34px">
            <p :class="{active: getUserInfo.kycState === 2}">{{$t('usercontent.user19')}}
              <span v-if="getUserInfo.kycState === 2">{{$t('usercontent.user18')}}</span>
            </p>
          </td>
          <td>√</td>
          <td>√</td>
          <td>√</td>
          <td>√</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapGetters} from 'vuex'
  import userUtils from '@/api/individual'
  import utils from '@/assets/js/utils'
  import loading from '@/components/loading'
  import page from '@/components/page'
  import avatar from '@/assets/images/touxiang.png'
  import Buttonbox from '../../components/formel/buttonbox'
  import gooleTip from './mycenter/google-tip'
  import googleVerify from './mycenter/google-verify'

  export default {
    components: {
      loading,
    },
    data () {
      return {
        vsloaded: false, // 认证信息加载完毕状态
        avatarUrl: avatar,
      }
    },
    computed: {
      ...mapGetters(['getUserInfo', 'getLang']),
    },
    watch: {},
    created () {
      this.examine()
    },
    methods: {
      examine () {
        if (this.getUserInfo.googleAuthEnable === 0) {
          utils.setDialog(gooleTip, {
            okCallback: () => {
              setTimeout(() => {
                this.googleVerify(1)
              }, 50)
            }
          })
        }
      },
      googleVerify (i) {
        utils.setDialog(googleVerify, {
          state: i,
          okCallback: (res) => {
            let data = {
              googleCode: res
            }
            if (i === 1) {
              console.log(data)
              userUtils.bindGoogleAuth(data, msg => {
                Vue.$koallTipBox({icon: 'success', message: this.$t('error_code.' + msg), delay: 3000})
              }, msg => {
                Vue.$koallTipBox({icon: 'notification', message: this.$t('error_code.' + msg), delay: 3000})
              })
            } else {
              userUtils.unbindGoogleAuth(data, res => {
                Vue.$koallTipBox({icon: 'success', message: this.$t('error_code.' + res), delay: 3000})
              }, msg => {
                Vue.$koallTipBox({icon: 'notification', message: this.$t('error_code.' + msg), delay: 3000})
              })
            }
          }
        })
      },
      banding () {
        if (this.getUserInfo.googleAuthEnable === 0) {
          this.googleVerify(1)
        } else {
          this.googleVerify(2)
        }
      },
      rePassword () {
        this.$router.push({
          name: 'mycenter_menu',
          params: {
            menu: 'resetpassword'
          }
        })
      },
      rePayPassword () {
        if (this.getUserInfo.googleAuthEnable === 0) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t('usercontent.user35'), delay: 3000})
          return
        } else if (this.getUserInfo.kycState !== 2) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t('usercontent.user36'), delay: 3000})
          return
        } else {
          this.$router.push({
            name: 'mycenter_menu',
            params: {
              menu: 'assetpassword'
            }
          })
        }
      },
    }
  }
</script>

<style scoped lang="less">
  .c-c {
    color: #979799;
  }

  .mycenter {
    .cont {
      color: #ffffff;
      background: rgba(27, 26, 31, 0.8);
      padding: 20px;

      .title {
        line-height: 30px;
      }

      .table {
        margin-top: 10px;

        td {
          border: 1px solid #312e45;
          font-size: 12px;

          .active {
            color: #00a0e9;
          }
        }
      }

      .box {
        margin: 13px 0;

        ul {
          li {
            display: flex;
            height: 40px;
            justify-content: flex-start;
            align-items: center;
            padding: 6px 0;
            font-size: 12px;

            i {
              margin-right: 20px;
            }

            span:nth-of-type(1) {
              width: 260px;
              flex-shrink: 0;
            }

            span:nth-of-type(2) {
              width: 560px;
              flex-shrink: 0;
            }

            i {
              display: block;
              width: 30px;
              height: 30px;
              background-size: 26px;
            }

            button {
              width: 50px;
              height: 30px;
              line-height: 30px;
              padding: 0 10px;
              cursor: pointer;
              font-size: 12px;
              color: #f1f1f2;
              background-color: #2e2c3c;
              border: 1px solid #312e45;
              text-align: center;
              box-sizing: initial;
            }
          }
        }
      }
    }

    i {
      &.icon-name {
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAllBMVEUAAADy8vP////////y8vPy8vP////y8vPy8vPy8vLy8vPz8/Tx8fPy8vPz8/P09PT////x8fT39/f29vby8vPx8fLy8vPx8fLy8vPy8vPy8vLy8vTz8/Pz8/Ty8vLy8vPy8vXy8vb39/jy8vPz8/Pz8/P////y8vPy8vPx8fPz8/Pz8/Py8vP09PT19fXx8fPz8/Px8fLSYGkvAAAAMXRSTlMA9hALnIAF+e2zrlzNY1QWA3AeG/vz597V0smIayrbqko5IsFnUAm8opR7PnVEMJKQzaWNOgAAAoFJREFUSMfNlte2qjAQQBNAugLSxYa9e+b/f+4aRYQwwdzzdPajyV6M04D8TXxF0X+h7a4DO6PwgM6tYqnKm/rIMqBFtHdUOXVqAkJ8ktBHcxCQDP1+9TaBHrJz72Mp9GJsxO4AvnLUBeVZgAR7BZURF2OtozFLoiG5AmmmnRrxec61n0WKy9GVk7n6Tm6EUa5RO9X7gl7v3nOloXbQ6ud2TxphfaImmGw26zUV5/MCGEXjwdwcjRryDJWpJyzTijQwv/xrizvZNWV8RN26qQ1udrgiorxzeu3tvyEuO4KuHrTkbX+H2/zCaDXQAZcn1XEGHLbEsJnVOe10/rh2ywQEKK8WQWKq2s87ALU3y+VQ61b79QAFuixe7hw0r+rxkwFtZkLZfAqu4ZCa0sRkHVtU7ECDIWlQGlzYeMIgZ90dGhY73dhpvii7iVfQ7qX2yGc//7DIVAtSO4NnDGoz8Bibi9R5j0WeP59W+ITMKFVZvyCTUTQzVQ+qT4+EKDT3X7HfuDY/VNeW8OFO3ozh9EhS3ejcxTqXaoTt5JB5DrsUWg+2TMYWxr4zaQyqseuXRwyuO4egveqy+pqDvg3clMW+qOYyaI/f5bNfY3hjfcYxgDOrxLmWPYotZ3JqpHt/D7blSmGZnvhklUTa1CkS2LCOq3kUom+1R7EZsfXs2TGA4W5bfy72kEWFL/fV2GeJMUSLys8E9vpc7f7mqz/hvqrOBghItcHp7nJvFI4NSDMgHY6yro19Nu7l3FwlCMpayg0Jiq5JxKwSEdNILlc417RPTUakFz0wRWo8UMk3lIJiqnH0iAxe4PJqdgmJNKGjTcwqWvcwXJH/RhnPZmOF/EX+AdHEWOvkEgUQAAAAAElFTkSuQmCC) no-repeat 0;
      }

      &.icon-lock {
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAh1BMVEUAAADy8vPy8vPy8vPy8vPy8vL09Pj////x8fP////y8vPy8vL29vby8vPy8vPy8vPz8/Tx8fPx8fLx8fLy8vPx8fTz8/Pz8/Pz8/Py8vT09PTz8/Py8vPy8vP09PT09PT09Pfy8vPy8vPy8vPy8vLy8vTx8fP09PT09PT4+Pj39/f////x8fKu+SJQAAAALHRSTlMAgJK418clDN4C6Ywd+LGaT/Tw75dwaWRAOi0r5XZYRBW/va2fnIRIMCEeBkHGQmUAAAF6SURBVEjHzdVnc8IwDAbgBGc4k5AFCXtD0f//fW1Wk4rc2fKVg/cb0j1ny2CjvSR2lJp8NuNmGtlEap0C+E1wsiirTgFlKr16acBTjFLO3mIYSXyTGteF0bgyg5uDve73gwlMsZ1DG57vqs+7nHeVucg63aa9R1d6eN3GHQHeQpN8WMzb4laAz+33+reaNtWz1HEFO/SrmUkd2QqqMFwO6/JKgKFOisuTpi6FJ7jsvQ2v0cwk/FUft66GtS3/qToEjBa3BRRhlM/EC5aAMAlbjFkPJOONvSDSmWNrx/I4tvHAQAgeO6PgDGGdgvWXY+N4NBSxuawaS1MFX9oL6FzomPU9RsWB3/f8gIhD9GoTMOrrRLxGbycBo3+6KREbTt9zDCKGqO9tgIrde9e6u2QMvGg6BVe6GFbVsBRvVXMxFHFZNUoKxgceUTC+WEwRQ3i9hjCGP+YB3FDwBmGLgi0NhclbpuH4iaxNfO1ZH+TsobE4RaYLkxXaP+Ub1PwXBYTI9/EAAAAASUVORK5CYII=) no-repeat 0;
      }

      &.icon-card {
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAY1BMVEUAAAD////x8fLx8fLx8fL39/fx8fPy8vP4+Pjy8vLz8/Py8vPy8vTx8fPy8vXy8vPy8vPy8vPy8vPy8vPy8vTz8/Tz8/Pz8/Px8fPx8fLy8vLy8vLx8fb09PTz8/P29vbx8fKAlMufAAAAIHRSTlMABfDgyR6DtiLcktRipE38sfqrwId4akDPyp6NODAqG6YIUbcAAACaSURBVEjH7dW7EoIwEIXhBYyYCxhAwLvn/Z/SIhlD5bCMhQP7Vaf5q2RmSYj/57wu5rLVSBNZB54TJT246hSfwdWmuAGXTvFxg3HGR2IhlbOlv30AWynxxmO7D1rAx3kBTJz597iioAZcnAZQcdpVxl4FDujjvAL3OPUPn+oFNk8fBbD8QA9gah6UGGY70NRout1c5e1JQqzaGwZWoH37Ij0eAAAAAElFTkSuQmCC) no-repeat 0;
      }
    }
  }
</style>

