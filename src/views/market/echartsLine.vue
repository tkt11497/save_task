<template>
	<div class="line-box">
		<div class="echarts-box" :id="props.lineId"></div>
	</div>
</template>
<script setup>
import { onMounted, ref, shallowRef, toRefs, watch } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { DatasetComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { formatDate } from '@/utils'
import { fetchKlineListApi } from '@/apis/optionAndContract.js'

echarts.use([LineChart, GridComponent, DatasetComponent, CanvasRenderer])

const props = defineProps({
	lineId: {
		type: String,
		default: '',
	},
	rowData: {
		type: Object,
		default: () => ({
			symbol: '',
		}),
	},
})

const { rowData } = toRefs(props)

const colorMap = {
	btc: {
		color1: '#F89A29',
		color2: '#F89A29',
	},
	eth: {
		color1: '#DCAF77',
		color2: '#FAF5EE',
	},
	xrp: {
		color1: '#212936',
		color2: '#212936',
	},
	ltc: {
		color1: '#7BA9FF',
		color2: '#7BA9FF',
	},
	bnb: {
		color1: '#F8D20F',
		color2: '#F8D20F',
	},
	dash: {
		color1: '#0E98D0',
		color2: '#0E98D0',
	},
	bch: {
		color1: '#A1BF6E',
		color2: '#A1BF6E',
	},
	usdt: {
		color1: '#7BA9FF',
		color2: '#7BA9FF',
	},
}
let data = []
let now = new Date(1997, 9, 3)
let oneDay = 24 * 3600 * 1000
let value = Math.random() * 1000
// for (var i = 0; i < 1000; i++) {
// 	data.push(randomData())
// }

const option = ref({
	xAxis: {
		show: false,
		type: 'category',
		data: [],
		splitLine: {
			show: false,
		},
	},
	yAxis: {
		show: false,
		type: 'value',
		scale: true,
		boundaryGap: ['20%', '80%'],
		splitLine: {
			show: false,
		},
	},
	series: [
		{
			name: 'Kline Data',
			type: 'line',
			smooth: true,
			lineStyle: {
				color: '#E7C7A0',
				opacity: 0.8,
			},
			areaStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{
							offset: 0,
							color: '#E7C7A0', // 0% 处的颜色
						},
						{
							offset: 1,
							color: '#fff', // 100% 处的颜色
						},
					],
					global: false,
				},
				// opacity: 0.2,
			},
			showSymbol: false,
			data: [],
		},
	],
	animation: true,
})

let myChart = shallowRef(null)
const klineHistoryList = ref([])
const getKlineList = async () => {
	try {
		const params = {
			pageNum: 1,
			pageSize: 100,
			symbol: rowData.value.symbol,
			type: '5min',
		}
		const response = await fetchKlineListApi(params) // Fetch data from API
		klineHistoryList.value = response.data || []

		const data2 = dataFormat(klineHistoryList.value)
		myChart.value = echarts.init(document.getElementById(props.lineId))
		option.value.xAxis.data = data2.dateArr
		option.value.series[0].data = data2.dataArr
		myChart.value.setOption(option.value)
	} catch (err) {
		// Handle errors
	} finally {
	}
}

// 格式化k线数据
const dataFormat = (records) => {
	let dataArr = []
	let dateArr = []
	dataArr = records.map((item) => {
		return item.close
	})
	dateArr = records.map((item) => {
		return formatDate(item.unixTime * 1000, 'DD/MM HH:mm')
	})
	return {
		dataArr,
		dateArr,
	}
}

watch(
	() => rowData.value.symbol,
	(val) => {
		if (val) {
			try {
				let code = val.split('/')[0].toLowerCase() || 'btc'
				option.value.series[0].lineStyle.color = colorMap[code].color1
				option.value.series[0].areaStyle.color.colorStops[0].color = colorMap[code].color2
				// option.value.series[0].areaStyle.color.colorStops[1].color = colorMap[code].color1
			} catch (error) {
				console.log(error)
			}
			getKlineList()
		}
	},
	{
		immediate: true,
	}
)

onMounted(() => {
	// myChart.value = echarts.init(document.getElementById(props.lineId))
	// myChart.value.setOption(option)
})
</script>
<style lang="scss" scoped>
.line-box {
	width: 100%;
	height: 80px;
}

.echarts-box {
	width: 100%;
	height: 80px;
}
</style>
