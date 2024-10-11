<template>
	<div class="num">
		<div class="close">${{ symbolInfo.closePlain || symbolInfo.close }}</div>
		<div class="trend" :class="{ red: symbolInfo.dailyChange * 1 < 0 }">
			{{ symbolInfo.dailyChange * 1 > 0 ? '+' : '' }}{{ symbolInfo.dailyChange }}%
		</div>
	</div>
</template>
<script setup>
import { onMounted, onUnmounted, ref, toRefs } from 'vue'
import Socket from '@/utils/socket.js'

const props = defineProps({
	rowData: {
		type: Object,
		default: () => ({
			symbol: '',
		}),
	},
})

const { rowData } = toRefs(props)

const symbolInfo = ref({
	close: '0',
	dailyChange: '0',
})

const klineListSocket = ref(null)
const getSocket = () => {
	closeSoecket()

	// symbol
	const symbol = rowData.value.symbol.replace('/', '-')
	// 5min 30min 60min 1day 1week
	const type = '5min'
	const url = `/kline/${symbol}/${type}`
	klineListSocket.value = new Socket(url)
	klineListSocket.value.init()
	klineListSocket.value.websocket.onmessage = (e) => {
		// console.log('getSocket----', e.data)

		if (typeof e.data === 'string') {
			let message = JSON.parse(e.data)
			symbolInfo.value = message
		}
	}
}
// 清除socket
const closeSoecket = () => {
	if (rowData.value.symbol) {
		klineListSocket.value && klineListSocket.value.close()
	}
}

onMounted(() => {
	getSocket()
})
onUnmounted(() => {
	closeSoecket()
})
</script>
<style lang="scss" scoped>
.num {
	display: flex;
	flex-direction: column;
	align-items: end;
	font-size: 24px;

	.close {
		font-size: 26px;
		font-weight: 700;
		color: #292929;
	}

	.trend {
		background: linear-gradient(99deg, #D7FFC5 14.79%, #72FF62 62.76%, #5CFF4E 76.69%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		font-size: 25px;
		font-weight: 700;
	}

	.red {
		color: #f64f4f;
	}
}
</style>
