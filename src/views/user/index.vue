<template>
	<div class="user_container">
		<!-- header -->
		<div class="header">
			<div class="logo">
				<img src="../../assets/images/user/wallet-logo.svg" alt="logo" />
			</div>
			<div class="title">Saving</div>
			<div class="input">
				{{ address.slice(-10) }}
			</div>
		</div>
		<!-- Account -->
		<div class="top_detail">
			<div class="top">
				<div class="title">{{ t('账户') }}</div>
				<!-- Icon -->
				<div class="icon" @click="router.push('/score')">
					<!-- <img src="../../assets/images/user/wicon.png" alt="wicon" /> -->
					<img src="../../assets/images/user/score.svg" alt="wicon" />
				</div>
			</div>
			<!-- Number -->
			<div class="contant">
				<div class="number">${{ plusDecimal(platformAccount.totalBalance || 0) }}</div>

				<!-- Precentage -->
				<div class="precentage">
					<img src="../../assets/images/user/up.png" alt="up" />
					{{ '0.00%' }}
				</div>
			</div>
			<!-- Introduce -->
			<div class="bottom">
				<div class="trend">
					<img src="../../assets/images/home/trends.png" alt="trends" />
				</div>
				<div>
					<span class="trends">${{ plusDecimal(userInfo.todayProfit || '0') }}</span>
					<span class="trends">{{ userInfo.profitCurrency }}</span>
					<span class="trends">{{ t('今日盈利') }}</span>
				</div>
			</div>

			<!-- Center Card -->
			<div class="range">
				<div class="range_box" @click="handleRouter('/wallet')">
					<div class="img">
						<img src="../../assets/images/user/wallet-icon.svg" alt="wallet" />
					</div>
					<div>{{ t('钱包') }}</div>
				</div>
				<van-divider vertical />
				<div class="range_box" @click="handleRouter('/loan')">
					<div class="img">
						<img src="../../assets/images/user/loan-icon.svg" alt="loan" />
					</div>
					<div>{{ t('借款') }}</div>
				</div>
				<van-divider vertical />
				<div class="range_box" @click="handleRouter('/records')">
					<div class="img">
						<img src="../../assets/images/user/record-icon.svg" alt="record" />
					</div>
					<div>{{ t('记录') }}</div>
				</div>
			</div>
		</div>
		<!-- Privacy & Security -->
		<!-- General -->
		<div class="general">
			<span class="title">{{ t('常规') }}</span>
			<van-cell
				@click="handleClick(item)"
				v-for="(item, index) in generalList"
				:key="index"
				:title="item.title"
				:icon="item.icon"
				is-link
				:to="item.path"
			/>

			<span class="title mt-30">{{ t('隐私与安全') }}</span>
			<van-cell @click="handleClick()" :title="t('隐私与安全')" center :label="t('专注于您的安全和隐私')" :icon="policy" is-link to="/policy" />
			<span class="title mt-30">{{ t('设置') }}</span>
			<van-cell @click="handleClick()" :title="t('更改语言')" center :icon="language" is-link to="/lang" />
		</div>
		<router-link></router-link>
	</div>
</template>

<script setup name="Home">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userStore, useWeb3Store } from '@/store'
import { addInvitesetData, fetchArticleDetail, fetchCountryAll, fetchInvitationCode, fetchUserInfo, fetchUserTotalBalanceApi } from '@/apiService'
import { useI18n } from 'vue-i18n'
import Web3 from 'web3'
import { showToast } from 'vant'
import { storeToRefs } from 'pinia'
import { plusDecimal } from '@/utils'
// 引入静态资源
import BTC from '@/assets/images/home/BTC.png'
import info1 from '@/assets/images/home/info1.png'
import info2 from '@/assets/images/home/info2.png'
import info3 from '@/assets/images/home/info3.png'
import notifications from '@/assets/images/user/notification-icon.svg'
import invite from '@/assets/images/user/gift-icon.svg'
import support from '@/assets/images/user/support-icon.svg'
import faq from '@/assets/images/user/book-square.svg'
import policy from '@/assets/images/user/policy.png'
import language from '@/assets/images/user/language-vector-icon.svg'
import useLoading from '@/hooks/useLoading.js'
// 初始化仓库
const usersStore = userStore()
const { t } = useI18n()
const { currentCurrency, address } = storeToRefs(useWeb3Store())

const loading = useLoading()
const inviteCode = ref([])
// 变量区
const router = useRouter()
const route = useRoute()
// 搜索参数
const value = ref('')
// 比率
const list = ref([
	{
		title: 'BTC/USD',
		text: 'Bitcoin',
		img: BTC,
	},
	{
		title: 'ETH/USD',
		text: 'Bitcoin',
		img: BTC,
	},
	{
		title: 'ATOM/USD',
		text: 'Bitcoin',
		img: BTC,
	},
	{
		title: 'LTC/USD',
		text: 'Bitcoin',
		img: BTC,
	},
	{
		title: 'BTC/USD',
		text: 'Bitcoin',
		img: BTC,
	},
	{
		title: 'ETH/USD',
		text: 'Bitcoin',
		img: BTC,
	},
	{
		title: 'ATOM/USD',
		text: 'Bitcoin',
		img: BTC,
	},
	{
		title: '123',
		text: '123',
		img: BTC,
	},
])
// scroll
const infoList = ref([
	{
		icon: info1,
		content: 'Rellable Security Guarantee',
	},
	{
		icon: info2,
		content: 'Stable andReliable Investment',
	},
	{
		icon: info3,
		content: 'Convenient  and Easy Operation',
	},
])
// General
const generalList = ref([
	{
		icon: notifications,
		title: t('通知'),
		path: '/notifications',
	},
	{
		icon: invite,
		title: t('邀请朋友'),
		path: '/invite',
	},
	{
		icon: support,
		title: t('支持'),
		path: '/support',
	},
	{
		icon: faq,
		title: t('常见问题解答'),
		path: '/faq',
	},
])

// 代码区
// 列表子级页面
const handleClick = (item) => {
	console.log('thank you so much ', item)
	usersStore.SET_PATH_DATA('no')
}

// 路由跳转
const handleRouter = (path) => {
	usersStore.SET_PATH_DATA('no')
	router.push(`${path}`)
}

const userInfo = ref({})
const getUserInfo = async () => {
	try {
		loading.loading()
		const response = await fetchUserInfo()
		loading.clearLoading()
		let temp = response.data || {}
		usersStore.SET_USERID_DATA(temp.id)
		usersStore.SET_USER_INFO(temp)
		userInfo.value = temp
	} catch (err) {
		console.log(err)
	}
}

// 获取平台账户
const platformAccount = ref({
	currency: '',
	totalBalance: 0,
})
const getPlatformAccount = async (isFirst) => {
	try {
		isFirst && loading.loading()
		const res = await fetchUserTotalBalanceApi(currentCurrency.value.tokenName)
		platformAccount.value = res.data
		isFirst && loading.clearLoading()
	} catch (err) {
		console.log(err)
	}
}

const getArticleDetail = async () => {
	try {
		const type = 'privacy' // Example
		const languageId = 1
		loading.loading()
		const response = await fetchArticleDetail(type, languageId)
		loading.clearLoading()
	} catch (err) {
		console.log(err)
	}
}
const getCountryAll = async () => {
	try {
		loading.loading()
		const response = await fetchCountryAll()
		loading.clearLoading()
	} catch (err) {
		console.log(err)
	}
}

const getInvitationCode = async () => {
	try {
		loading.loading()
		const response = await fetchInvitationCode()
		loading.clearLoading()
		inviteCode.value = response.data
	} catch (err) {
		console.log(err)
	}
}

const insertInviteset = async (data) => {
	let temp = {
		currency: 'string',
		id: 0,
		params: {},
		remark: 'string',
		sendNum: 0,
		successInviteNum: 0,
		userCategory: 'string',
	}
	try {
		loading.loading()
		const response = await addInvitesetData(temp)
		loading.clearLoading()
	} catch (err) {
		console.log(err)
	}
}
// 钱包连接
const web3account = ref(null)
const walletAddress = ref('')
const web3accountBalance = ref(null)
const walletConnect = () => {
	if (typeof window.ethereum !== 'undefined') {
		web3account.value = new Web3(window.ethereum)
		if (web3account.value) {
			walletAddress.value = web3account.value.currentProvider.selectedAddress

			if (walletAddress.value) {
				web3account.value.eth.getBalance(walletAddress.value).then((balance) => {
					const etherBalance = web3account.value.utils.fromWei(balance, 'ether')
					web3accountBalance.value = etherBalance
				})
			} else {
				showToast('未选择合适的钱包地址')
				router.push('/')
			}
		}
	}
}

const balanceTimer = ref(null)
const balanceInterval = () => {
	if (balanceTimer.value) clearInterval(balanceTimer.value)
	balanceTimer.value = setInterval(() => {
		getPlatformAccount()
	}, 5000)
}

onMounted(() => {
	getUserInfo()

	getArticleDetail()

	getInvitationCode()
	insertInviteset()

	getCountryAll()

	getPlatformAccount(true)
	balanceInterval()
	// walletConnect()
})

onUnmounted(() => {
	if (balanceTimer.value) clearInterval(balanceTimer.value)
})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.user_container {
	.header {
		padding: 48px 48px 0;
		line-height: 98px;
		display: flex;
		justify-content: space-between;
		z-index: 9;

		.logo {
			width: 50px;
			height: 50px;
			margin-top: -10px;

			img {
				width: 100%;
				height: 100%;
			}
		}

		.title {
			font-size: 36px;
			font-weight: 700;
			margin-left: -260px;
			line-height: 98px;
			margin-top: -15px;
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

		.van-cell-group--inset {
			margin: 0px;
			border-radius: 20px;
			// border: 1px solid #eee;
			box-shadow: 0px 1px 2px 0px rgba(101, 101, 101, 0.11);

			.van-cell {
				height: 32px;
				line-height: 32px;
				padding-top: 0;
				padding-bottom: 0;
			}
		}
	}

	.top_detail {
		position: relative;
		//height: 404px;
		background: url('../../assets/images/user/header.png') no-repeat;
		background-size: 100% 100%;
		margin: 20px 48px 0;
		padding: 48px 48px 100px;

		.top {
			height: 50px;

			display: flex;
			align-items: center;
			justify-content: space-between;

			.title {
				width: 100%;
				font-size: 27px;
				color: #fff;
			}
		}

		.icon {
			img {
				width: 64px;
			}
		}

		//.icon {
		//  width: 50px;
		//
		//  img {
		//    width: 100%;
		//  }
		//}

		.contant {
			margin: 30px 0;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.number {
				font-size: 48px;
				color: #fff;
				font-weight: 700;
				width: 60%;
				word-break: break-all;
				line-height: 1;
			}
		}

		.bottom {
			display: flex;
			line-height: 1;

			.trend {
				width: 35px;
				height: 35px;

				img {
					width: 100%;
					height: 100%;
					vertical-align: middle;
				}
			}

			.trends {
				color: #fff;
				font-size: 25px;
				margin-left: 5px;
				font-weight: 600;
			}

			.day {
				color: #fff;
				font-size: 18px;
				font-weight: normal;
				margin-left: 10px;
			}
		}

		.precentage {
			width: 150px;
			height: 70px;
			line-height: 70px;
			text-align: center;
			background: #99bbfb;
			color: #fff;
			border-radius: 40px;
			font-size: 28px;
			font-style: normal;

			img {
				width: 17px;
				height: 15px;
				vertical-align: 2px;
			}
		}

		.range {
			// position: absolute;
			// top: 310px;
			// display: flex;
			// justify-content: space-around;
			// align-items: center;
			// width: 75%;
			// background: #fff;
			// padding: 0 50px;
			// height: 160px;
			// border-radius: 32px;
			// margin-left: 90px;
			// color: #000;
			// font-size: 24px;

			position: absolute;
			left: 48px;
			right: 48px;
			display: flex;
			justify-content: space-around;
			align-items: center;
			background: #fff;
			//height: 90px;
			margin-top: 30px;
			padding: 0 20px;
			border-radius: 24px;
			color: #000;
			height: 140px;
			font-size: 24px;

			.range_box {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.img {
					width: 44px;
					height: 44px;

					img {
						width: 100%;
						height: 100%;
						vertical-align: middle;
					}
				}
			}
		}
	}

	.general {
		margin-top: 100px;

		.title {
			position: relative;
			font-size: 28px;
			// font-style: normal;
			font-weight: 600;
			display: block;
			padding-bottom: 16px;
			margin-bottom: 32px;
			margin-top: 20px;
			margin-left: 48px;
			//height: 28px;
			line-height: 28px;
			color: rgb(167, 164, 164);

			// &::after {
			// 	position: absolute;
			// 	content: '';
			// 	width: 4px;
			// 	height: 28px;
			// 	left: 0;
			// 	top: 0;
			// 	background: #7BA9FF;
			// }
		}

		:deep(.van-cell) {
			border-radius: 0;
			margin-bottom: 5px;
			height: 62px;
			padding: 0 24px 0 24px;
			display: flex;
			align-items: center;

			.van-cell__left-icon {
				margin-top: 2px;
				width: 20px;
				height: 20px;
				margin-right: 6px;

				.van-icon__image {
					width: 100%;
					height: 100%;
				}
			}

			.van-cell__title {
				font-size: 14px;
			}

			.van-cell__label {
				font-size: 12px;
				margin-top: 4px;
				line-height: 1;
			}

			.van-cell__right-icon {
				font-size: 14px;
			}
		}

		.mt-30 {
			margin-top: 60px;
		}
	}
}

.van-divider--vertical {
	height: 28px;
	border-color: rgba(0, 0, 0, 0.15);
}
</style>
