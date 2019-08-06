import Home from '@/exchanges/home'
import Helpcenter from '@/exchanges/helpcenter'
import quickTrade from '@/exchanges/quickTrade'

const routes = [
  {
    path: '/exchange/:symbol',
    name: 'exchange_index',
    component: Home
  },
  {
    path: '/exchange',
    name: 'exchange_index2',
    component: Home
  },
  {
    path: '/exchange/helpcenter',
    name: 'exchange_helpcenter',
    component: Helpcenter
  },
  {
    path: '/1-click-trade',
    name: 'quickTrade',
    component: quickTrade
  },
]

export default routes
