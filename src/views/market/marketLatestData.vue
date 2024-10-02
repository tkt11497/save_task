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
			productName: '',
			randomRange: '',
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
	const symbol = rowData.value.productName.replace('/', '-')
	// 5m 30m 1h 1d 1w
	const type = '5m'
	const url = `/ws/kline/${symbol}/${type}`
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
	if (rowData.value.productName) {
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
		font-size: 32px;
		font-weight: 700;
		color: #121212;
	}

	.trend {
		color: #82a9f9;
		font-size: 28px;
		//font-weight: 400;
	}

	.red {
		color: #ff6464;
	}
}
</style>
