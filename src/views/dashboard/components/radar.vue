<template>
  <div ref="myDiv"
       class="radar-echart" />
</template>

<script>
import * as echarts from 'echarts/core';
import { TooltipComponent } from 'echarts/components';
import { RadarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([RadarChart, CanvasRenderer, TooltipComponent]);
export default {
  mounted () {
    const myChart = echarts.init(this.$refs.myDiv)
    myChart.setOption({
      tooltip: {},
      radar: {
        // shape: 'circle',
        axisName: {
          color: '#fff',
          backgroundColor: '#999',
          borderRadius: 3,
          padding: [3, 5]
        },
        // 每个区域的最高值
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极性', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [{
        name: '预算 vs 开销（Budget vs spending）',
        type: 'radar',
        // areaStyle: {normal: {}},
        data: [
          {
            value: [10, 1, 100, 5, 100, 0],
            name: '张三'
          },
          {
            value: [50, 50, 50, 50, 50, 10],
            name: '李四'
          }
        ]
      }]
    })
  }
}
</script>

<style>
.radar-echart {
  width: 600px;
  height: 400px;
}
</style>