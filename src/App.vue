<template>
  <header class="header">
    <div class="header_logo"></div>
  </header>
  <div class="body-content">
    <div class="control-panel">
      <h1 class="control-panel__title">Панель котировок</h1>
      <div class="control-panel__body">
        <ul class="control-panel__body-main-list">
          <li class="control-panel__body-list control-panel__body-list-header">
            <ul>
              <li>Валютные пар</li>
              <li>Изменение</li>
              <li>Цена</li>
            </ul>
          </li>
          <li
            class="control-panel__body-list control-panel__body-list-item"
            :class="{ active: dataVal === key }"
            v-for="(element, key) in stateCy"
            :key="key"
          >
            <ul :data-val="key" @click="createChart">
              <li>USD | {{ key }}</li>
              <li>
                <img
                  :src="element.arrowUp ? arrowUp : arrowDown"
                  :alt="element.arrowUp ? 'arrowUp' : 'arrowDown'"
                />
                {{ element.percent }} %
              </li>
              <li>
                <Spiner v-if="!currency[key].P" />
                {{ currency[key].P }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <TheChart />
  </div>
</template>

<script>
import TheChart from "./components/TheChart";
import Spiner from "./components/Spiner";
import { mapMutations, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      dataVal: "BTC",
      arrowUp: require("./assets/arrowUp.svg"),
      arrowDown: require("./assets/arrowDown.svg"),
      stateCy: {
        BTC: {
          arrowUp: true,
          val: 0,
          percent: 0,
        },
        BCH: {
          arrowUp: true,
          val: 0,
          percent: 0,
        },
        ETH: {
          arrowUp: true,
          val: 0,
          percent: 0,
        },
        // XRP: {
        //   arrowUp: true,
        //   val: 0,
        //   percent: 0,
        // },
        LTC: {
          arrowUp: true,
          val: 0,
          percent: 0,
        },
      },
    };
  },
  components: { TheChart, Spiner },
  methods: {
    // ф-ция отправляет AJAX запрос на сервер, после ответа сервера генерируется график
    createChart(e) {
      const load = (val) => {
        let url = `https://min-api.cryptocompare.com/data/v2/histominute`;
        this.LOAD_CHART_DATA({
          url,
          params: {
            fsym: val,
            tsym: "USD",
            limit: 180,
          },
        });
      };

      if (e != undefined) {
        this.dataVal = e.target.parentNode.dataset.val;
        load(this.dataVal);
      } else {
        load(this.dataVal);
      }
    },
    ...mapActions("chart", ["LOAD_CHART_DATA"]),
    ...mapMutations("webSocket", ["SET_CURRENCIES"]),
    ...mapActions("webSocket", ["START_CONNECTION"]),
    ...mapGetters("webSocket", ["GET_CURRENCIES", "GET_CONNECTION_STATUS"]),

    // ф-ция делает запрос и получает данные через Веб сокеты,
    sendData() {
      const sendMessage = (message) => {
        this.connection.send(message);
      };
      this.connection.onopen = () => {
        const сyPairRequest = (cy1 = "BTC", cy2 = "USD") =>
          JSON.stringify({
            action: "SubAdd",
            subs: [`0~Coinbase~${cy1}~${cy2}`],
          });
        Object.keys(this.stateCy).forEach((key) => {
          sendMessage(сyPairRequest(key));
        });
      };
      // полученые данные записываются в глобальный и локальный стейт
      this.connection.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.TYPE == "0") {
          switch (message.FSYM) {
            case "BTC":
              this.currencyСhanges("BTC", this.currency.BTC.P);
              this.SET_CURRENCIES({ key: "BTC", val: message });
              break;
            case "BCH":
              this.currencyСhanges("BCH", this.currency.BCH.P);
              this.SET_CURRENCIES({ key: "BCH", val: message });
              break;
            case "ETH":
              this.currencyСhanges("ETH", this.currency.ETH.P);
              this.SET_CURRENCIES({ key: "ETH", val: message });
              break;
            // case "XRP":
            //   this.currencyСhanges("XRP", this.currency.XRP.P);
            //   this.SET_CURRENCIES({ key: "XRP", val: message });
            //   break;
            case "LTC":
              this.currencyСhanges("LTC", this.currency.LTC.P);
              this.SET_CURRENCIES({ key: "LTC", val: message });
              break;
          }
        }
      };
    },
    //ф-ция сохраняет локальное значение валюты и подсчитывает процент изменения
    currencyСhanges(key, newVal) {
      let state = this.stateCy[key].val;
      let num;

      //Возвращает число в более читаемом виде
      const parseValue = (number) => {
        number = number.toPrecision(2);
        number = parseFloat(number);
        number = number.toExponential();
        return number;
      };

      if (state < newVal) {
        num = ((newVal - state) / state) * 100;
        this.stateCy[key].percent = parseValue(num);
        this.stateCy[key].arrowUp = true;
      } else if (state > newVal) {
        num = ((state - newVal) / state) * 100;
        this.stateCy[key].percent = parseValue(num);
        this.stateCy[key].arrowUp = false;
      }
      this.stateCy[key].val = newVal;
    },
  },
  computed: {
    connection() {
      return this.GET_CONNECTION_STATUS();
    },
    currency() {
      return this.GET_CURRENCIES();
    },
  },
  created() {
    this.START_CONNECTION();
    this.sendData();
    this.createChart();
  },
};
</script>

<style>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #191a20;
  border-bottom: #000 solid 10px;
}
.header_logo {
  background: url("./assets/logo.png") center center no-repeat;
  height: 19px;
  width: 109px;
  margin: 19px 0 22px;
}
.body-content {
  width: 100%;
  display: flex;
  position: absolute;
  top: 60px;
  bottom: 0;
  left: 0;
  right: 0;
}
.control-panel {
  min-width: 519px;
  border-right: #000 solid 10px;
  height: 100%;
  background: #191a20;
}
.control-panel__title {
  padding: 22px 35px;
  font-size: 1.2em;
  line-height: 1.5em;
  background: #191a20;
  text-transform: uppercase;
  border-bottom: #000 solid 3px;
}
.control-panel__body {
  padding: 20px 0;
}
.control-panel__body-list {
  padding: 8px 40px 8px 35px;
}
.control-panel__body-list ul {
  display: flex;
  align-items: center;
}
.control-panel__body-list ul li {
  width: 45%;
}
.control-panel__body-list ul li:nth-child(2) {
  width: 30%;
}
.control-panel__body-list ul li:last-child {
  width: 25%;
  /* text-align: right; */
  display: flex;
  justify-content: flex-end;
}
.control-panel__body-list.active {
  background: linear-gradient(90deg, rgba(31, 70, 106, 0.88) 0%, #191a20 138.3%),
    #191a20;
}
.control-panel__body-list-header {
  font-weight: 400;
  font-size: 0.8em;
  line-height: 1.5em;
  color: #757679;
  margin-bottom: 7px;
}
.control-panel__body-list-item {
  cursor: pointer;
  text-transform: uppercase;
}
.control-panel__body-list-item:hover {
  background: linear-gradient(90deg, rgba(31, 70, 106, 0.88) 0%, #191a20 138.3%),
    #191a20;
}
.control-panel__body-list-item ul li:nth-child(2) {
  text-transform: lowercase;
}

@media (max-width: 576px) {
  .header {
    border-bottom: 3px solid #000;
  }
  .body-content {
    flex-wrap: wrap;
    position: static;
  }
  .control-panel {
    min-width: 100%;
    border-right: none;
    background: none;
  }
  .control-panel__title {
    padding: 2px 15px;
  }
  .control-panel__body-main-list {
    background: #191a20;
    position: relative;
    top: 450px;
    padding-bottom: 120px;
  }
  .control-panel__body-list {
    padding: 5px 15px;
  }
  .control-panel__body-list-header {
    margin-bottom: 0;
  }
}
</style>
