<template>
	<div>
		<van-popup
			v-if="showPopType !== 'select'"
			class="wallet-pop wallet-pop2"
			v-model:show="showTop"
			position="bottom"
			:style="{ height: '100%' }"
			@opened="opened"
			@closed="closed"
		>
			<div class="head head2">
				<div class="logo">
					<img src="@/assets/images/home/logo-7d41d0b53.png" alt="" />
					<span>Cryptoland</span>
				</div>
				<p class="p1">Choose Currency Link Wallet</p>
				<p class="p2">Empower your financial choices with the flexibility to choose and link your preferred currency seamlessly</p>
			</div>

			<div class="connected lists">
				<van-divider />
				<div class="item" v-for="item in currencyList" :key="item.id" @click="checkItem(item)">
					<van-cell>
						<template #icon>
							<img class="icon" :src="$imgpath + item.picUrl" />
						</template>
						<template #title>
							<span>{{ item.currency }}</span>
						</template>
						<template #value>
							<van-button plain type="primary" @click="authWeb3(item)">Connect</van-button>
						</template>
					</van-cell>
					<van-divider />
				</div>
			</div>
		</van-popup>
		<van-popup
			v-if="showPopType === 'select'"
			class="wallet-pop"
			v-model:show="showTop"
			position="bottom"
			:style="{ height: '80%' }"
			@opened="opened"
			@closed="closed"
		>
			<i class="line"></i>
			<div class="head">
				<p class="p1">Change connection network</p>
				<p class="p2">Change your currency type to access</p>
			</div>
			<div class="connected">
				<h2>Current selection</h2>
				<van-cell v-if="checkedCurrency && checkedCurrency.currency">
					<template #icon>
						<img class="icon" :src="$imgpath + checkedCurrency.picUrl" />
					</template>
					<template #title>
						<span>{{ checkedCurrency.currency }}</span>
					</template>
					<template #value>
						<van-button plain type="primary">Connected</van-button>
					</template>
				</van-cell>
				<van-divider />
			</div>
			<div class="connected lists">
				<h2>Select new type</h2>
				<div class="item" v-for="item in currencyList" :key="item.id" @click="checkItem(item)">
					<van-cell>
						<template #icon>
							<img class="icon" :src="$imgpath + item.picUrl" />
						</template>
						<template #title>
							<span>{{ item.currency }}</span>
						</template>
						<template #value>
							<van-button plain type="primary" @click="authWeb3(item)">Connect</van-button>
						</template>
					</van-cell>
					<van-divider />
				</div>
			</div>
		</van-popup>
	</div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { getCurrencyAllApi } from '@/apiService'
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet'

const { connectMetaMask } = useWeb3Wallet()

const emit = defineEmits(['close'])

const showPopType = ref('select2')
const showTop = ref(true)
const checkedCurrency = ref({})

const opened = () => {}
const closed = () => {
	emit('close')
}

const checkItem = (item) => {
	authWeb3(item)
	checkedCurrency.value = item
}
const authWeb3 = (item) => {
	connectMetaMask(item, (status) => {
		if (status === 'success') {
			showPopType.value = 'select2'
			showTop.value = false
			emit('close')
		}
	})
}

const currencyList = ref([
	// {
	// 	currency: 'USDT',
	// 	id: 2,
	// },
])

const getCurrencyAllList = async () => {
	try {
		// const params = {
		//     orderStatus:1
		// }

		const res = await getCurrencyAllApi({})
		currencyList.value = res.data.filter((item) => item.address)
	} catch (error) {
		console.log(error)
	}
}

watch(
	() => showTop.value,
	(val) => {
		if (val) {
			getCurrencyAllList()
		}
	},
	{
		immediate: true,
	}
)

defineExpose({
	showTop,
	showPopType,
})
</script>
<style lang="scss" scoped>
:deep(.wallet-pop) {
	.line {
		display: block;
		background: #d9d9d9;
		width: 200px;
		height: 6px;
		border-radius: 32px;
		margin: 12px auto 24px;
	}

	.head {
		margin-bottom: 54px;

		.p1 {
			color: #000;
			font-size: 32px;
			font-weight: 600;
			line-height: 40px;
			letter-spacing: -0.01em;
			text-align: center;
			margin-bottom: 16px;
		}

		.p2 {
			font-size: 24px;
			font-weight: 500;
			line-height: 30px;
			letter-spacing: 0.01em;
			text-align: center;
			color: #8d8d8d;
		}

		.logo {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 40px;
			font-weight: 600;
			color: #000;
			margin-bottom: 66px;
			margin-top: 32px;

			img {
				width: 48px;
				height: 48px;
				margin-right: 24px;
			}
		}
	}

	.head2 {
		margin-bottom: 40px;

		.p2 {
			width: calc(100% - 132px);
			margin: 0 auto;
		}
	}

	.connected {
		padding-left: 24px;
		padding-right: 34px;
		margin-bottom: 50px;

		> h2 {
			font-size: 24px;
			font-weight: 500;
			line-height: 30px;
			text-align: left;
			color: #000;
			margin-bottom: 42px;
			margin-left: 14px;
		}

		.van-cell {
			padding-left: 7px;
			padding-right: 3px;
			display: flex;
			align-items: center;

			&::after {
				display: none;
			}

			.icon {
				width: 30px;
				height: 30px;
				margin-right: 11px;
			}

			.van-cell__title {
				display: flex;
				align-items: center;
				font-family: Inter;
				font-size: 13px;
				font-weight: 700;
				line-height: 15.73px;
				text-align: left;
				color: #000;
			}

			.van-cell__value {
				.van-button {
					width: 98px;
					height: 27px;
					border-radius: 27px;
					background: #80a9f5;
					font-size: 13px;
					font-weight: 500;
					line-height: 15.73px;
					text-align: left;
					color: #f3f3f3;
				}
			}
		}

		.van-divider {
			border-color: #e2e2e2;
			margin-top: 18px;
			margin-bottom: 0;
		}

		.item {
			margin-bottom: 20px;
		}
	}

	.lists {
		.van-cell {
			.van-cell__value {
				.van-button {
					border: 1px solid #cacaca;
					background-color: #fff;
					color: #161616;
					width: 83px;
				}
			}
		}
	}
}

:deep(.wallet-pop2) {
	.connected {
		.van-divider {
			border-color: #888;
			margin-top: 18px;
			margin-bottom: 18px;
		}
	}
}
</style>
