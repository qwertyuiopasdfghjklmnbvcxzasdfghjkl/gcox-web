import Index from '../public/cms/news/index'
import news from '../public/cms/news/newList'
import notice from '../public/cms/news/noticeList'
import detail from '../public/cms/news/detail'

import foot from '../public/cms/footer/index'
import about from '../public/cms/footer/about'
import deal from '../public/cms/footer/deal'
import help from '../public/cms/footer/help'
import clause from '../public/cms/footer/clause'

const cms = [
  {
    path: '/cms',
    name: 'cms',
    component: Index,
    children: [
      {
        path: '',
        redirect: 'new'
      },
      {
        path: 'new',
        name: 'new',
        component: news
      },
      {
        path: 'notice',
        name: 'notice',
        component: notice
      },
      {
        path: 'detail/:id',
        name: 'detail',
        component: detail
      }
    ]
  },
  {
    path: '/linkFoot',
    name: 'linkFoot',
    component: foot,
    children: [
      {
        path: '',
        redirect: 'about'
      },
      {
        path: 'about',
        name: 'about',
        component: about
      },
      {
        path: 'deal',
        name: 'deal',
        component: deal
      },
      {
        path: 'help',
        name: 'help',
        component: help
      },
      {
        path: 'clause',
        name: 'clause',
        component: clause
      },
      {
        path: 'detail/:id',
        name: 'detail',
        component: detail
      }
    ]
  }
]
export default cms
