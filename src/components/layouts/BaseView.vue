<template>
    <a-layout id="components-layout-demo-fixed-sider">
        <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
            <div class="logo">
                <img src="~@/assets/logo.svg" class="logo" alt="logo">
            </div>
            <a-menu theme="dark" mode="inline" :defaultSelectedKeys="['1']">
                <a-menu-item key="1">
                    <router-link :to="{path: '/index'}">
                    <a-icon type="user" />
                    <span class="nav-text">首页</span>
                    </router-link>
                </a-menu-item>
                <a-menu-item key="9">
                    <router-link :to="{path: '/dashboard/user/submitlist'}">
                        <a-icon type="user" />
                        <span class="nav-text">用户提交试卷</span>
                    </router-link>
                </a-menu-item>
                <a-menu-item key="2">
                    <router-link :to="{path: '/question/list'}">
                    <a-icon type="video-camera" />
                    <span class="nav-text">调查</span>
                    </router-link>
                </a-menu-item>
                <a-menu-item key="3">
                    <a-icon type="upload" />
                    <span class="nav-text">考试</span>
                </a-menu-item>
                <a-menu-item key="4">
                    <a-icon type="bar-chart" />
                    <span class="nav-text">投票</span>
                </a-menu-item>
                <a-menu-item key="5">
                    <a-icon type="cloud-o" />
                    <span class="nav-text">表单</span>
                </a-menu-item>
                <a-menu-item key="6">
                    <a-icon type="appstore-o" />
                    <span class="nav-text">360评估</span>
                </a-menu-item>
                <a-menu-item key="7">
                    <a-icon type="team" />
                    <span class="nav-text">评测</span>
                </a-menu-item>
                <a-menu-item key="8">
                    <a-icon type="team" />
                    <span class="nav-text">统计数据</span>
                </a-menu-item>

                <a-menu-item key="10">
                    <a-icon type="shop" />
                    <span class="nav-text">设置</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout :style="{ marginLeft: '200px' }">
            <a-layout-header :style="{ background: '#fff', padding: 0 }" >
                <div class="head-user-info-layer">
                    <a-avatar :src="userInfo.headimg" />
                    <span class="nickname">{{userInfo.userName}}</span>
                </div>
            </a-layout-header>
            <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
                <div :style="{ padding: '24px', background: '#fff'}">
                    <transition name="page-transition-s">
                        <keep-alive v-if="keepAlive">
                            <router-view />
                        </keep-alive>
                        <router-view v-else />
                    </transition>
                </div>
            </a-layout-content>
            <a-layout-footer :style="{ textAlign: 'center' }">
                Ant Design ©2019 Created
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>
<style>
    #components-layout-demo-fixed-sider .logo {
        height: 32px;
        margin: 16px;
    }
    .head-user-info-layer{
        float: right;
        padding: 0 12px;
    }
    .head-user-info-layer .nickname{
        padding: 0 5px;
    }

</style>

<script>
  import {  mapState, mapMutations } from 'vuex'
  import { CookieUtil } from '@/utils/common'
  import {userlocalLoginApi} from  '@/api/user'
  import {USERLOCALLOGIN} from '@/store/mutation-types'

    export default {
      name: 'BaseView',
      mounted(){
          if(!this.token && !this.isLogin) {

            // 获取本地token
            let cookieToken = CookieUtil.get('TOKEN');
            if (cookieToken) {
              userlocalLoginApi({
                token: cookieToken,
              }).then((res) => {
                if (res.data.errcode > 0) {
                  this.$router.push({path: '/login'});
                  return;
                }
                this.USERLOCALLOGIN(res.data.data);
              });
            }
          }
      },
      methods:{




        ...mapMutations([
          USERLOCALLOGIN
        ])
      },
        computed: {
            keepAlive () {
                return this.$route.meta.keepAlive
            },
          ...mapState([
            'userInfo', 'token', 'isLogin'
          ]),
        },
    }
</script>