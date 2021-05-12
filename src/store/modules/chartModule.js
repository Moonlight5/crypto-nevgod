import axios from "axios";

export default {
    namespaced: true,
    state() {
        return {
            chartData: null,
        }
    },
    mutations: {
        SET_CHART_DATA(state, payload) {
            state.chartData = payload
        }

    },
    actions: {
        LOAD_CHART_DATA({ commit }, { url, params }) {
            axios
                .get(url, { params })
                .then(res => {
                    commit('SET_CHART_DATA', res)
                    return res
                })
                .catch((err) => {
                    console.error(err)
                    return err
                })
        },
    },
    getters: {
        GET_CHART_DATA(state) {
            return state.chartData
        }
    }
}