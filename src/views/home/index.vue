<template>
	<div class="home_container">
		<!-- header -->
		<!-- 钱包地址 -->
		<div class="header">
			<img src="./assets/calendar.png" alt="calendar" class="logo" />

			<div class="title">Saving</div>
			<div class="input" @click="currencyPopup = true">
				{{ address.slice(-10) }}
			</div>
		</div>

		<!-- 当前钱包 -->
		<div class="top_detail" :style="backgroundImage">
			<img src="./assets/bank.png" alt="bank" class="bank" />

			<div class="top">
				<img :src="$imgpath + currentCurrency.iconUrl" :alt="currentCurrency.tokenName" />
				<div class="title">{{ currentCurrency.tokenName || '' }}</div>
			</div>
			<div class="content">
				<div class="title2">{{ currentCurrency.tokenName || '' }} {{ t('余额') }}</div>
				<div class="number">
					<span class="amount ellipsis-col">{{ tokenBalance }}</span>
					<span class="unit">&nbsp;{{ currentCurrency.tokenName || '' }}</span>
				</div>
				<!--				<div class="precentage">-->
				<!--					<img src="../../assets/images/user/up2.png" alt="" />-->
				<!--					{{ '0.00%' }}-->
				<!--				</div>-->
			</div>
			<div class="bottom">
				<div class="trend">
					<img src="@/assets/images/home/trends2.png" alt="trends" />
				</div>
				<div>
					<span class="trends">{{ plusDecimal(accountFundTransaction.todayBalance || 0) }}</span>
					<span class="trends">{{ accountFundTransaction.tokenName }}</span>
					<span class="trends day">{{ t('今日盈利') }}</span>
				</div>
			</div>
			<div class="total">
				<div>{{ t('总收入') }}</div>
				<div class="number">{{ plusDecimal(accountFundTransaction.balance || 0) }} {{ accountFundTransaction.tokenName }}</div>
			</div>
		</div>
		<!-- 智能合约 -->
		<SmartContract />
		<div class="list">
			<div class="top">
				<div class="title">{{ t('投资组合') }}</div>
				<div class="all" @click="goMarket">{{ t('查看全部') }}</div>
			</div>
			<div class="list_info">
				<div class="item" v-for="(item, index) in listComputed" :key="item.id">
					<div class="item_img">
						<img :src="$imgpath + item.mainTokenIconUrl" alt="" />
					</div>
					<div class="coin">
						<div class="name">{{ item.symbol }}</div>
						<div>{{ item.mainTokenName }}</div>
					</div>
					<div class="echarts">
						<!-- <img src="../../assets/images/home/echarts.png" alt="echarts"> -->
						<EchartsLine :line-id="item.symbol || `line-${index}`" :row-data="item" />
					</div>
					<MarketLatestData :row-data="item" />
					<!-- <div class="num">
                        <div class="price">{{ item.contractPricePoints }}</div>
                        <div class="trend" :class="{ 'red': item.randomRange < 0 }">{{ item.randomRange > 0 ? '+' : '-'
                            }}{{ item.randomRange }}%
                        </div>
                    </div> -->
				</div>
			</div>
		</div>
		<div class="info">
			<van-swipe class="my-swipe" :width="126" :show-indicators="false" :loop="false">
				<van-swipe-item v-for="(item, index) in infoList" :key="index">
					<div class="info_box">
						<div class="icon">
							<img :src="item.icon" alt="" />
						</div>
						<div class="content">{{ t(item.content) }}</div>
					</div>
				</van-swipe-item>
			</van-swipe>
		</div>
		<div class="rate">
			<div class="rate_title">
				<div class="img">
					<img src="../../assets/images/home/rate.png" alt="rate" />
				</div>
				<span>{{ t('回报率') }}</span>
			</div>
			<div class="rate_content" v-for="(item, index) in clientList" :key="index">
				<div class="left">
					<div class="img">
						<img src="../../assets/images/home/circle.png" alt="" />
					</div>
					<span>{{ item.minAmount }}-{{ item.maxAmount }}</span>
				</div>
				<div class="right">
					<div class="dot">
						<!-- <img src="../../assets/images/home/circle.png" alt="circle"> -->
					</div>
					<span>{{ timesForValueDecimal(item.minInterest, 100) }}%-{{ timesForValueDecimal(item.maxInterest, 100) }}%</span>
				</div>
			</div>
		</div>

		<AnnouncementPop v-if="address" ref="announcementPopRef" />

		<van-popup v-model:show="currencyPopup" position="bottom" class="currency-popup">
			<div class="currency-currency">
				<div class="line"></div>

				<div class="currency-currency-title">
					<h5>{{ t('更改连接网络') }}</h5>
					<p>{{ t('更改您的货币类型以访问') }}</p>
				</div>

				<div class="currency-currency-label">{{ t('当前选择') }}</div>

				<div class="currency-currency-selected" v-if="currentCurrency.tokenName">
					<img class="icon" :src="$imgpath + currentCurrency.iconUrl" :alt="currentCurrency.tokenName" />

					<span class="text">{{ currentCurrency.tokenName }}</span>

					<button>
						{{ t('已连接') }}
					</button>
				</div>
			</div>
			<div class="currency-currency-label title2">{{ t('选择新类型') }}</div>
			<CurrencyList hide-selected check-auth-status @signed="changeWallet" />
		</van-popup>
	</div>
</template>

<script setup name="Home">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { navStore, userStore, useWeb3Store } from '@/store'
import { storeToRefs } from 'pinia'
import SmartContract from './smartContract.vue'
import AnnouncementPop from './announcementPop.vue'
import EchartsLine from '@/views/market/echartsLine.vue'
import CurrencyList from '@/views/noWallet/components/CurrencyList.vue'
import MarketLatestData from '@/views/market/marketLatestData.vue'
import { useI18n } from 'vue-i18n'
import { getImageUrl, plusDecimal, timesForValueDecimal } from '@/utils'
import useLoading from '@/hooks/useLoading.js'
import { useToken } from '@/hooks/useToken'
// 引入静态资源
import info1 from '@/assets/images/home/info1.png'
import info2 from '@/assets/images/home/info2.png'
import info3 from '@/assets/images/home/info3.png'
import { fetchTradingPairListApi } from '@/apis/optionAndContract.js'
import { fetchUserStaticIncomeApi } from '@/apis/user.js'
import { fetchStaticIncomeApi } from '@/apis/common.js'
import { useLoopFetchApi } from '@/hooks/useLoopApi.js'

const web3Store = useWeb3Store()
const { currentCurrency, address } = storeToRefs(web3Store)

const { getChainBalanceByTokenName } = useToken()
const currencyPopup = ref(false)

// 初始化仓库
const { t } = useI18n()
const usersStore = userStore()
const navStore2 = navStore()
const loading = useLoading()

// 变量区
const router = useRouter()
const route = useRoute()

// 回报列表
const clientList = ref([])
const getIncomeConfigList = async () => {
	try {
		loading.loading()
		const response = await fetchStaticIncomeApi()
		loading.clearLoading()
		clientList.value = response.data || []
	} catch (e) {
		console.log(e)
	}
}

const backgroundImage = computed(() => {
	if (!currentCurrency.value.tokenName) return
	let currency = currentCurrency.value.tokenName.toLowerCase()
	currency = ['aave', 'bnb', 'dai', 'renbtc', 'steth', 'stkaave', 'uni', 'usdc', 'usdt', 'xaut'].includes(currency) ? currency : 'usdc'
	// console.log('ddd', currency)
	return {
		'background-image': `url(${getImageUrl(`home/card_${currency}.png`)})`,
		'background-size': '100% 100%',
		'background-repeat': 'no-repeat',
		// 'background-position': "0 0",
	}
})

// 投资组合
const coinList = ref([])
// 获取投资组合
const getCoinList = async () => {
	try {
		loading.loading()
		const response = await fetchTradingPairListApi()
		loading.clearLoading()
		coinList.value = response.data || []
	} catch (e) {
		console.log(e)
	}
}
const listComputed = computed(() => {
	return coinList.value.filter((item) => item.isTop === 1)
})

const tokenBalance = ref('0')
const changeWallet = async ({ isSuccess, tokenName }) => {
	currencyPopup.value = false
	if (!isSuccess) {
		// 当前首页连接的币种，临时被设置为未授权，
		if (currentCurrency.value.tokenName === tokenName) {
			router.replace('/noWallet')
		}
		return
	}

	// 切换成功，重新获取链上余额
	try {
		loading.loading()
		await getChainBalance(currentCurrency.value.tokenName)
	} finally {
		loading.clearLoading()
	}
}
// scroll
const infoList = ref([
	{
		icon: info1,
		content: '可靠的安全保障',
	},
	{
		icon: info2,
		content: '稳定可靠的投资回报',
	},
	{
		icon: info3,
		content: '方便易操作',
	},
])

const accountFundTransaction = ref({
	balance: 0,
	todayBalance: 0,
	tokenName: 'ETH',
})
const getUserIncome = async (isLoading = true) => {
	try {
		isLoading && loading.loading()
		const res = await fetchUserStaticIncomeApi()
		isLoading && loading.clearLoading()
		accountFundTransaction.value = res.data
	} catch (e) {
		console.log(e)
	}
}

const goMarket = () => {
	router.replace('/market')
	navStore2.SET_NAV_DATA(1)
}

// 公告通知
const announcementPopRef = ref(null)

// 获取当前币种链上余额
const getChainBalance = async () => {
	try {
		const balance = await getChainBalanceByTokenName(currentCurrency.value.tokenName)
		tokenBalance.value = balance
		return balance
	} catch (e) {
		console.log(e)
	}
}

// 定时获取链上余额、查询用户固定质押
const { runLoopTimer } = useLoopFetchApi({
	fetchApi: () => {
		return Promise.all([getChainBalance(), getUserIncome(false)])
	},
	loopCall: ([balance]) => {
		console.log('balanceInterval定时器获取余额', currentCurrency.value.tokenName, balance)
	},
	needImmediatelyExecute: true,
})

onMounted(() => {
	getIncomeConfigList()
	getCoinList()

	// 定时轮询
	runLoopTimer()
})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.home_container {
	overflow: hidden;
	padding-top: 40px;
	background: #fafafa;

	.header {
		width: 100%;
		padding: 0 48px;
		height: 98px;
		line-height: 98px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 9;
		margin-bottom: 36px;

		.logo {
			width: 44px;
			height: 48px;
			border-radius: 50%;

			img {
				width: 100%;
				height: 100%;
			}
		}

		.title {
			font-size: 42px;
			font-weight: 700;
			margin-left: -220px;
			line-height: 48px;
			margin-top: -2px;
			color: #000;
		}

		.input {
			width: 196px;
			height: 64px;
			line-height: 64px;
			background: #fff;
			border-radius: 64px;
			box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.13);
			padding: 0 24px;
			font-size: 26px;
			color: #000;
			font-weight: 500;
			text-align: center;
		}
	}

	.top_detail {
		height: 378px;
		// background: url('./assets/card.png') no-repeat;
		// background-size: 100% 100%;
		//pointer-events: none;
		margin: 0 48px 85px;
		padding: 24px 40px 0;
		position: relative;
		color: #fff;

		.top {
			height: 40px;
			display: flex;
			align-items: center;
			font-size: 28px;
			margin-bottom: 28px;

			img {
				width: 32px;
				height: 32px;
				margin-right: 8px;
			}

			.title {
				font-weight: 400;
				font-size: 28px;
				color: #fff;
			}
		}

		.bank {
			position: absolute;
			width: 64px;
			height: 64px;
			right: 32px;
			top: 32px;
		}

		.content {
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.title2 {
				color: #fff;
				font-size: 26px;
				font-weight: 500;
			}

			.number {
				font-size: 62px;
				font-weight: 600;
				color: #fefefe;
				height: 86px;

				.amount {
					height: 100%;
					display: inline-block;
					max-width: 80%;
				}
				.unit {
					font-size: 30px;
					color: #fff;
					font-weight: 700;
					position: relative;
					top: -13px;
				}
			}

			.precentage {
				display: flex;
				align-items: center;
				width: 150px;
				height: 70px;
				line-height: 70px;
				text-align: center;
				background: #99bbfb;
				font-size: 28px;
				font-weight: 700;
				color: #fff;
				border-radius: 36px;
				padding-left: 4px;
				padding-right: 4px;

				img {
					width: 40px;
					height: 40px;
				}
			}
		}

		.bottom {
			height: 48px;
			display: flex;
			font-size: 24px;
			align-items: center;

			.trend {
				width: 35px;
				height: 35px;

				img {
					width: 100%;
					height: 100%;
				}
			}

			.trends {
				color: #fff;
				font-size: 24px;
				margin-left: 16px;
				font-weight: 700;
			}

			.day {
				color: #fff;
				font-size: 24px;
				font-weight: normal;
				margin-left: 10px;
			}
		}

		.total {
			background: linear-gradient(360deg, rgba(252, 252, 252, 0.5) 80.98%, rgba(255, 255, 255, 0.5) 100%);
			backdrop-filter: blur(24px);
			width: calc(100% + 80px);
			margin-left: -40px;
			height: 130px;
			transform: translateY(10px);
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 24px;
			color: #676767;
			font-weight: 700;
			padding: 0 46px;

			.number {
				color: #333;
				font-size: 28px;
				font-weight: 600;
			}
		}
	}

	.list {
		padding: 0px 42px;

		.top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 48px;
			margin-bottom: 10px;
			padding-left: 24px;
			padding-right: 24px;

			.title {
				font-size: 36px;
				font-weight: 700;
				color: #121212;
			}

			.all {
				font-size: 28px;
				color: #7ba9ff;
				font-weight: 500;
				line-height: 40px;
			}
		}

		.list_info {
			border-radius: 32px;
			background: #fff;
			padding: 0 24px;
			overflow: hidden;

			.item {
				display: flex;
				border-bottom: 1px solid rgba($color: #b9c1d9, $alpha: 0.2);
				font-size: 25px;
				padding-bottom: 20px;
				margin-top: 30px;

				.item_img {
					flex: 0 0 96px;
					width: 96px;
					height: 96px;
					border-radius: 50%;
					margin-right: 32px;
					overflow: hidden;

					img {
						width: 100%;
						height: 100%;
					}
				}

				.coin {
					flex: 0 0 140px;
					color: #b8b8b8;
					font-size: 24px;
					margin-right: 20px;

					.name {
						font-size: 28px;
						font-weight: 700;
						color: #121212;
						margin-top: 8px;
					}
				}

				.echarts {
					width: 160px;
				}

				.num {
					flex: 1 1 auto;
					margin-left: 40px;
					max-width: 140px;
					text-align: right;

					div {
						width: 100%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.price {
						font-size: 32px;
						color: #121212;
						font-weight: 700;
					}

					.trend {
						color: #7ba9ff;
						font-size: 24px;
						font-weight: 400;
					}

					.red {
						color: #ff6464;
					}
				}
			}
		}
	}

	.info {
		padding: 44px 42px 36px;
		display: flex;
		justify-content: space-between;

		:deep(.van-swipe-item) {
			padding-right: 20px;
			box-sizing: border-box;
		}
		.info_box {
			//width: 220px !important;
			//height: 224px;
			//background: #fff;
			//border-radius: 24px;
			//padding-top: 32px;
			//padding-bottom: 32px;
			//margin-right: 20px;
			//display: flex;
			//flex-direction: column;

			background: #fff;
			border-radius: 28px;
			padding: 15px;
			height: 100%;

			.icon {
				line-height: 1;

				img {
					width: 50px;
					height: 50px;
				}
			}

			.content {
				margin-top: 22px;
				font-weight: 700;
				font-size: 28px;
				color: #000;
			}
		}
	}

	.rate {
		background: #fff;
		margin: 0 42px 48px;
		padding: 32px 22px;
		border-radius: 32px;

		.rate_title {
			display: flex;
			height: 52px;
			align-items: center;
			margin-bottom: 30px;

			.img {
				display: flex;
				align-items: center;

				img {
					width: 70px;
					height: 50px;
				}
			}

			span {
				font-size: 26px;
				color: #000;
				font-weight: 700;
			}
		}

		.rate_content {
			display: flex;
			justify-content: space-between;
			margin: 0px;
			height: 90px;
			padding-left: 20px;
			line-height: 30px;
			background: transparent;
			border-top: 1px dashed rgba(185, 193, 217, 0.2);
			border-bottom: 1px dashed rgba(185, 193, 217, 0.2);

			.left,
			.right {
				.img {
					width: 14px;
					height: 14px;

					img {
						width: 100%;
						height: 100%;
						vertical-align: sub;
					}
				}

				span {
					font-size: 26px;
					font-weight: 500;
					color: #000;
					margin-left: 28px;
				}
			}

			.right {
				display: flex;
				align-items: center;

				.dot {
					width: 14px;
					height: 12px;
					background-color: #a9aaac;
					border-radius: 50%;
				}

				span {
					margin-left: 20px;
				}
			}
		}
	}
}

.currency-popup {
	max-height: 80%;
	padding: 24px 46px;
	border-top-left-radius: 32px;
	border-top-right-radius: 32px;

	.title2 {
		font-size: 28px;
		font-weight: 500;
		text-align: left;
		color: #000;
		margin-top: 36px;
	}
}

.currency-currency {
	font-size: 28px;

	.line {
		background: rgba(0, 0, 0, 0.1);
		height: 8px;
		width: 212px;
		border-radius: 8px;
		margin: 0 auto;
	}

	.currency-currency-title {
		text-align: center;

		h5 {
			margin-top: 30px;
			font-size: 32px;
			font-weight: 600;
			line-height: 50px;
			color: #000;
		}

		p {
			line-height: 44px;
			color: #8d8d8d;
			font-size: 24px;
		}
	}

	.currency-currency-label {
		line-height: 44px;
		margin-top: 72px;
		font-size: 25px;
		font-weight: 500;
		color: #000;
	}

	.currency-currency-selected {
		height: 120px;
		display: flex;
		align-items: center;
		border-top: 1px solid rgba(185, 193, 217, 0.2);

		.icon {
			flex: 0 0 60px;
			width: 60px;
			border-radius: 50%;
			margin-right: 18px;
		}

		.text {
			font-size: 28px;
			color: #000;
			font-weight: 400;
		}

		button {
			background: #80a9f5;
			margin-left: auto;
			height: 54px;
			color: #fff;
			font-weight: 500;
			font-size: 24px;
			padding: 0 32px;
			border-radius: 54px;
			border: none;
			outline: none;
		}
	}
}
</style>
