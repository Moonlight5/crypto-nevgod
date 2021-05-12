import { createStore } from 'vuex'
import chartModule from './modules/chartModule'
import webSocketModule from './modules/webSocketModule'


export default createStore({
  modules: {
    chart: chartModule,
    webSocket: webSocketModule
  }
})
