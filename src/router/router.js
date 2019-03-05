import App from '../App'
import { RouteView,  PageView, BaseView} from '../components/layouts'

export default [{
    path: '/',
    name: 'index',
    component: BaseView,
    redirect: '/login',
    children: [
        {
            path: '/test',
            name: 'test',
            redirect: '/test/page1',
            component: RouteView,
            meta: { title: '仪表盘', icon: 'dashboard', permission: [ 'dashboard' ] },
            children: [
                {
                    path: 'page1',
                    name: 'page1',
                    component: r => require.ensure([], () => r(require('../page/dashboard/question/page1')), 'questionpage1'),
                    // component: () => import('../page/dashboard/question/page1'),
                    meta: { title: '分析页', permission: [ 'dashboard' ] }
                },
                {
                    path: '/test/page2',
                    name: 'page2',
                    component: r => require.ensure([], () => r(require('../page/dashboard/question/page2')), 'questionpage2'),
                    // component: () => import('../page/dashboard/question/page2'),
                    meta: { title: '分析页', permission: [ 'dashboard' ] }
                },
            ],
        },
        //shouye
        {
            path: '/index',
            name: 'adminindex',
            component: r => require.ensure([], () => r(require('../page/dashboard/index')), 'adminindex'),
            // component: () => import('../page/dashboard/index'),
            meta: { title: '基于个人用户的数据统计', permission: [ 'dashboard' ] }
        },
        {
            path: '/question',
            name: 'question',
            redirect: '/question/list',
            component: RouteView,
            meta: { title: '问卷列表', icon: 'dashboard', permission: [ 'dashboard' ] },
            children: [
                {
                    path: 'list',
                    name: 'questionlist',
                    component: r => require.ensure([], () => r(require('../page/dashboard/question/questionList')), 'questionList'),
                    // component: () => import('../page/dashboard/question/questionList'),
                    meta: { title: '问卷列表', permission: [ 'dashboard' ] }
                },
                {
                    path: 'edit',
                    name: 'questionadd',
                    component: r => require.ensure([], () => r(require('../page/dashboard/question/questionEdit')), 'questionEdit'),
                    // component: () => import('../page/dashboard/question/questionEdit'),
                    meta: { title: '问卷编辑页', permission: [ 'dashboard' ] }
                },
                {
                    path: 'edit/:paperId',
                    name: 'questionedit',
                    component: r => require.ensure([], () => r(require('../page/dashboard/question/questionEdit')), 'questionEdit'),
                    // component: () => import('../page/dashboard/question/questionEdit'),
                    meta: { title: '问卷编辑页', permission: [ 'dashboard' ] }
                },
            ]
        }


        // // test   测试页面
        // {
        //     path: '/test/page1',
        //     component: r => require.ensure([], () => r(require('../page/test/page1')), 'page1')
        // },
        // {
        //     path: '/test/page2',
        //     component: r => require.ensure([], () => r(require('../page/test/page2')), 'page2')
        // },
        // {
        //     path: '/test/antd',
        //     component: r => require.ensure([], () => r(require('../page/test/antd')), 'antd')
        // },




    ]},
  {
    path: '/mobile/:uri',
    name: 'mobileUri',
    component: r => require.ensure([], () => r(require('@/page/client/uri')), 'mobileUri'),
    meta: {title: '手机答题页'}
  },
  {
    path: '/pc/:uri',
    name: 'pcUri',
    component: r => require.ensure([], () => r(require('@/page/client/pcuri')), 'pcUri'),
    meta: {title: 'pc答题页'}
  },

  // 后台
  {
    path: '/dashboard',
    name: 'dashboard',
    redirect: '/dashboard/index',
    component: BaseView,
    meta: {title: '后台', icon: 'user', permission: ['dashboard']},
    children: [
      {
        path: 'user/submitlist',
        name: 'usersubmitlist',
        component: r => require.ensure([], () => r(require('../page/dashboard/user/submitlist')), 'user/submitlist'),
        meta: { title: '用户回答列表', permission: [ 'dashboard' ] }
      },
    ]
  },


  //  客户端 用户中心
  {
    path: '/my',
    name: 'my',
    redirect: '/my/index',
    component: RouteView,
    meta: { title: '用户中心', icon: 'my', permission: [ 'user' ] },
    children: [
      {
        path: 'mobile/:uri',
        name: 'mymobileuri',
        component: r => require.ensure([], () => r(require('../page/client/my/uriInfo')), 'mymobileuri'),
        meta: { title: '回答情况详情', permission: [ 'user' ] }
      },
      {
        path: 'pc/:uri',
        name: 'mypcuri',
        component: r => require.ensure([], () => r(require('../page/client/my/uriInfo')), 'mymobileuri'),
        meta: { title: '回答情况详情', permission: [ 'user' ] }
      },
    ]
  },

  {
      path: '/login',
      name: 'Login',
        component: r => require.ensure([], () => r(require('@/page/Login')), 'Login'),
      // component: () => import('@/page/Login'),
      meta: {title: '登录页'}
    },

    //未匹配到的路由
    {
        path: '*',
        // redirect: '/404',
        component: r => require.ensure([], () => r(require('@/page/exception/404')), '404'),
        // component: () => import('@/page/exception/404')
    }
]
