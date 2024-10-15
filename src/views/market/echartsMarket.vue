<template>
	<div class="line-box">
		<div class="echarts-box" id="echarts-market"></div>
	</div>
</template>
<script setup>
import { onMounted, onUnmounted, ref, shallowRef, toRefs } from 'vue'
import * as echarts from 'echarts/core'
import { DataZoomComponent, GridComponent, MarkLineComponent, TooltipComponent } from 'echarts/components'
import { BarChart, CandlestickChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { formatDate } from '@/utils'

echarts.use([TooltipComponent, GridComponent, MarkLineComponent, DataZoomComponent, BarChart, CandlestickChart, CanvasRenderer])

const props = defineProps({
	klineData: {
		type: Array,
		default: [],
	},
	symbolInfo: {
		type: Object,
		default: {},
	},
})

const { klineData, symbolInfo } = toRefs(props)

let option = ref({
	animation: false,
	tooltip: {
		triggerOn: 'none',
		transitionDuration: 0,
		confine: true,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#333',
		backgroundColor: 'rgba(255,255,255,0.9)',
		textStyle: {
			fontSize: 12,
			color: '#333',
		},
		position: function (pos, params, el, elRect, size) {
			const obj = {
				top: 60,
			}
			obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
			return obj
		},
	},
	axisPointer: {
		link: [
			{
				xAxisIndex: [0, 1],
			},
		],
	},
	xAxis: [
		{
			type: 'category',
			data: [],
			boundaryGap: false,
			axisLine: { lineStyle: { color: '#777' } },
			axisLabel: {
				formatter: function (value) {
					return formatDate(value * 1, 'DD/MM HH:mm')
				},
			},
			min: 'dataMin',
			max: 'dataMax',
			axisPointer: {
				show: true,
			},
		},
		{
			type: 'category',
			gridIndex: 1,
			data: [],
			boundaryGap: false,
			splitLine: { show: false },
			axisLabel: { show: false },
			axisTick: { show: false },
			axisLine: { lineStyle: { color: '#777' } },
			min: 'dataMin',
			max: 'dataMax',
			axisPointer: {
				type: 'shadow',
				label: { show: false },
				triggerTooltip: true,
				handle: {
					show: false,
					margin: 20,
					color: '#B80C00',
				},
			},
		},
	],
	yAxis: [
		{
			scale: true,
			// splitNumber: 2,
			axisLine: { lineStyle: { color: '#777' } },
			splitLine: { show: true },
			axisTick: { show: false },
			axisLabel: {
				inside: false,
				formatter: '{value}\n',
				show: false,
			},
		},
		{
			scale: true,
			gridIndex: 1,
			// splitNumber: 2,
			axisLabel: { show: false },
			axisLine: { show: false },
			axisTick: { show: false },
			splitLine: { show: false },
		},
	],
	grid: [
		{
			left: 20,
			right: 20,
			top: 20,
			height: 220,
		},
		{
			left: 20,
			right: 20,
			height: 40,
			top: 260,
		},
	],
	dataZoom: [
		{
			type: 'inside',
			start: 60,
			end: 100,
		},
	],
	series: [
		{
			name: 'Volume',
			type: 'bar',
			xAxisIndex: 1,
			yAxisIndex: 1,
			itemStyle: {
				// color: '#7fbe9e',
				color: '#089981',
			},
			emphasis: {
				itemStyle: {
					color: '#140',
				},
			},
			data: [],
		},
		{
			type: 'candlestick',
			data: [],
			itemStyle: {
				// color: '#ef232a',
				color: '#089981',
				// color0: '#14b143',
				color0: '#f23645',
				borderColor: '#089981',
				borderColor0: '#f23645',
			},
			emphasis: {
				itemStyle: {
					color: 'black',
					color0: '#444',
					borderColor: 'black',
					borderColor0: '#444',
				},
			},
			markLine: {
				precision: 8,
				symbol: ['none', 'none'],
				lineStyle: {
					color: '#c23531',
				},
				label: {
					color: 'rgba(250,46,66,0.8)',
					formatter: '{c}',
					position: 'insideEndTop',
				},
				animationDuration: 0,
				data: [
					{
						yAxis: '',
					},
				],
			},
		},
	],
})
// 格式化k线数据
const dataFormat = (records) => {
	let dataArr, volumeArr, dateArr
	dataArr = records.map((item) => {
		return [item.open, item.closePlain || item.close, item.low, item.high, item.volume]
	})
	volumeArr = records.map((item) => {
		return item.volume
	})
	dateArr = records.map((item) => {
		return item.unixTime * 1000
	})
	return {
		dataArr: dataArr,
		volumeArr: volumeArr,
		dateArr: dateArr,
	}
}

// 初始化echatrs
let myChart = shallowRef(null)
const initChart = async () => {
	myChart.value = echarts.init(document.getElementById('echarts-market'))
	myChart.value.setOption(option.value)
}
// 动态更新echatrs
const updateChart = async (records) => {
	if (records && records.length === 0) return

	let dataObj = dataFormat(records)
	if (dataObj?.dataArr.length > 0) {
		let option2 = {
			xAxis: [
				{
					data: dataObj.dateArr,
				},
				{
					data: dataObj.dateArr,
				},
			],
			series: [
				{
					data: dataObj.volumeArr,
				},
				{
					data: dataObj.dataArr,
					markLine: {
						data: [
							{
								yAxis: dataObj.dataArr[dataObj.dataArr.length - 1][1],
							},
						],
					},
				},
			],
		}
		myChart.value.setOption(option2)
	}
}

onMounted(() => {
	initChart()
})

onUnmounted(() => {
	myChart.value.dispose()
})

defineExpose({
	initChart,
	updateChart,
})
</script>
<style lang="scss" scoped>
.line-box {
	width: 95vw;
	height: 600px;
	border-radius: 20px;
	background: linear-gradient(180deg, #105C69 0%, #002C34 100%);
}

.echarts-box {
	width: 95vw;
	height: 600px;
}
</style>
