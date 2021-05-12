<template>
  <div class="chart-panel">
    <div class="chart" ref="chartdiv">
      <Spiner v-if="loading()" :class="'spinner-chart'" />
    </div>
  </div>
</template>

<script>
import Spiner from "./Spiner";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { mapGetters } from "vuex";
am4core.useTheme(am4themes_animated);

export default {
  data() {
    return {
      stateCurrencyVal: null,
    };
  },
  components: { Spiner },
  methods: {
    loading() {
      return this.getChartData ? false : true;
    },
    createChart(data) {
      let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);
      let localData = [];
      let chartDataArr = data.data.Data.Data;

      chartDataArr.forEach((element) => {
        localData.push({
          date: new Date(element.time * 1000),
          value: element.close,
        });
      });

      this.$watch(
        "currency",
        (val) => {
          let key = data.config.params.fsym;
          if (this.stateCurrencyVal != val[key].P) {
            this.stateCurrencyVal = val[key].P;
            chart.addData({
              date: new Date(val[key].TS * 1000),
              value: val[key].P,
            });
          }
        },
        { deep: true }
      );

      chart.paddingRight = 50;
      chart.data = localData;

      let title = chart.titles.create();
      title.text = `${data.config.params.tsym} | ${data.config.params.fsym} `;
      title.fontSize = 24;
      title.marginBottom = 30;
      title.marginTop = 30;
      title.userClassName = "chart-title";

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.userClassName = "dateAxis-title";

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;
      valueAxis.userClassName = "valueAxis-title";

      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";

      series.tooltipText = "{valueY.value}";
      chart.cursor = new am4charts.XYCursor();

      chart.events.on("datavalidated", function () {
        valueAxis.zoom({ start: 1 / 25, end: 1.2 }, true, false);
      });

      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;

      // chart.responsive.enabled = true;

      this.chart = chart;
    },
    ...mapGetters("chart", ["GET_CHART_DATA"]),
    ...mapGetters("webSocket", ["GET_CURRENCIES"]),
  },
  computed: {
    currency() {
      return this.GET_CURRENCIES();
    },
    getChartData() {
      return this.GET_CHART_DATA();
    },
  },
  updated() {
    this.createChart(this.getChartData);
  },

  beforeUpdate() {
    if (this.chart) {
      this.chart.dispose();
    }
  },
};
</script>

<style>
.chart-panel {
  width: 100vw;
}
.chart {
  width: 100%;
  height: 100%;
}

@media (max-width: 576px) {
  .chart-panel {
    height: 470px;
    position: relative;
    top: -375px;
  }
  .chart-title,
  .valueAxis-title,
  .dateAxis-title {
    font-size: 0.7em;
    line-height: 1.5em;
  }
}
</style>
