

export default {
    namespaced: true,
    state() {
        return {
            connection: null,
            currencies: {
                BTC: {},
                BCH: {},
                ETH: {},
                // XRP: {},
                LTC: {},
            },
        }
    },

    mutations: {
        SET_CONNECTION_STATUS(state, payload) {
            state.connection = payload
        },
        SET_CURRENCIES(state, payload) {
            state.currencies[payload.key] = payload.val
        }
    },

    actions: {
        START_CONNECTION({ commit }) {
            const connect = new WebSocket(
                `wss://streamer.cryptocompare.com/v2?api_key=${process.env.VUE_APP_CRYPTO_COMPARE_API_KEY}`
            );
            commit('SET_CONNECTION_STATUS', connect)
        },
    },

    getters: {
        GET_CURRENCIES(state) {
            return state.currencies
        },
        GET_CONNECTION_STATUS(state) {
            return state.connection
        }
    }
}