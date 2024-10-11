<template>
	<div class="user_container">
		<!-- header -->
		<div class="header">
			<div class="logo">
				<img src="@/assets/images/user/wallet-logo.svg" alt="logo" />
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
					<img src="@/assets/images/user/score.png" alt="wicon" />
				</div>
			</div>
			<!-- Number -->
			<div class="contant">
				<div class="number">${{ plusDecimal(userStaticIncome.totalBalance || 0) }}</div>

				<!-- Precentage -->
				<div class="precentage">
					<img src="@/assets/images/user/up.png" alt="up" />
					{{ '0.00%' }}
				</div>
			</div>
			<!-- Introduce -->
			<div class="bottom">
				<div class="trend">
					<img src="@/assets/images/home/trends2.svg" alt="trends" />
				</div>
				<div>
					<span class="trends">${{ plusDecimal(userStaticIncome.totalDayIncome || '0') }}</span>
					<!--					<span class="trends">{{ userStaticIncome.tokenName }}</span>-->
					<span class="trends">{{ t('今日盈利') }}</span>
				</div>
			</div>

			<!-- Center Card -->
			<div class="range">
				<div class="range_box" @click="handleRouter('/wallet')">
					<div class="img">
						<img src="@/assets/images/user/wallet-icon.svg" alt="wallet" />
					</div>
					<div>{{ t('钱包') }}</div>
				</div>
				<van-divider vertical />
				<div class="range_box" @click="handleRouter('/loan')">
					<div class="img">
						<img src="@/assets/images/user/loan-icon.svg" alt="loan" />
					</div>
					<div>{{ t('借款') }}</div>
				</div>
				<van-divider vertical />
				<div class="range_box" @click="handleRouter('/records')">
					<div class="img">
						<img src="@/assets/images/user/record-icon.svg" alt="record" />
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
			<van-cell :title="t('隐私与安全')" center :label="t('专注于您的安全和隐私')" :icon="getImageUrl('user/policy.svg')" is-link to="/policy" />

			<span class="title mt-30">{{ t('设置') }}</span>
			<van-cell :title="t('更改语言')" center :icon="getImageUrl('user/language-vector-icon.svg')" is-link to="/lang" />
		</div>
		<router-link></router-link>
	</div>
</template>

<script setup name="User">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userStore, useWeb3Store } from '@/store'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { getImageUrl, plusDecimal } from '@/utils'
import useLoading from '@/hooks/useLoading.js'
import { fetchUserStakeIncomeApi } from '@/apis/wallet.js'
import { useLoopFetchApi } from '@/hooks/useLoopApi.js'
// 初始化仓库
const usersStore = userStore()
const { t } = useI18n()
const { currentCurrency, address } = storeToRefs(useWeb3Store())

const loading = useLoading()
// 变量区
const router = useRouter()
const route = useRoute()
// 搜索参数
const value = ref('')

// General
const generalList = ref([
	{
		icon: getImageUrl('user/notification-icon.svg'),
		title: t('通知'),
		path: '/notifications',
	},
	{
		icon: getImageUrl('user/gift-icon.svg'),
		title: t('邀请朋友'),
		path: '/invite',
	},
	{
		icon: getImageUrl('user/support-icon.svg'),
		title: t('支持'),
		path: '/support',
	},
	{
		icon: getImageUrl('user/book-square.svg'),
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

// 获取平台账户
const userStaticIncome = ref({
	totalBalance: 0,
	totalDayIncome: 0,
	tokenName: '',
})
const getUserStaticIncome = async (isFirst) => {
	try {
		isFirst && loading.loading()
		const res = await fetchUserStakeIncomeApi()
		userStaticIncome.value = res.data
		isFirst && loading.clearLoading()
	} catch (err) {
		console.log(err)
	}
}

const { runLoopTimer } = useLoopFetchApi({
	fetchApi: getUserStaticIncome,
})

onMounted(() => {
	getUserStaticIncome(true)
	runLoopTimer()
})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.user_container {
	background-image: url("../../assets/images/background/sbg_2.png");
	background-position:  top;
	background-size: 140% 110%;
	.header {
		padding: 48px 48px 0;
		line-height: 98px;
		display: flex;
		justify-content: space-between;
		z-index: 9;

		.logo {
			width: 50px;
			height: 50px;
			margin-top: -5px;

			img {
				width: 100%;
				height: 100%;
			}
		}

		.title {
			font-size: 36px;
			font-weight: 600;
			color: var(--vt-header-black);
			margin-left: -260px;
			line-height: 98px;
			margin-top: -15px;
		}

		.input {
			width: 196px;
			height: 64px;
			line-height: 64px;
			background: #fff;
			border: 1px solid #FF8008;
			cursor: pointer;

			border-radius: 64px;
			box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.13);
			padding: 0 24px;
			font-size: 26px;
			color: var(--vt-sub-black);
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
		background: url('../../assets/images/home/card_all.png') no-repeat;
		background-size: 100% 100%;
		margin: 20px 48px 0;
		padding: 48px 34px 100px;

		.top {
			height: 50px;

			display: flex;
			align-items: center;
			justify-content: space-between;

			.title {
				width: 100%;
				font-size: 27px;
				color: var(--vt-header-black);
				font-weight: 500;
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
				font-size: 40px;
				font-weight: 600;
				color: var(--vt-header-black);
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
				color: var(--vt-sub-black);
				font-size: 25px;
				margin-left: 5px;
				font-weight: 500;
			}

			.day {
				color: var(--vt-sub-black);
				font-size: 18px;
				font-weight: 500;
				margin-left: 10px;
			}
		}

		.precentage {
			width: 150px;
			height: 70px;
			line-height: 70px;
			text-align: center;

			border-top: 1px solid #FFF;
			background: rgba(222, 222, 222, 0.20);
			box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25) inset;

			color: #fff;
			border-radius: 15px;
			font-size: 28px;
			font-style: normal;

			img {
				width: 17px;
				height: 15px;
				vertical-align: 2px;
			}
		}

		.range {
			position: absolute;
			left: 48px;
			right: 48px;
			display: flex;
			justify-content: space-around;
			align-items: center;

			border-top: 1.5px solid #FFF;
			background: linear-gradient(270deg, rgba(153, 153, 153, 0.7) 0%, rgba(255, 255, 255, 0.7) 100%);
			backdrop-filter: blur(25.368999481201172px);
			box-shadow: 0px 2px 4.4px 0px rgba(0, 0, 0, 0.15);
			//height: 90px;
			margin-top: 30px;
			padding: 0 20px;
			border-radius: 0.33333rem;
			color: #000;
			font-weight: 500;
			height: 140px;
			font-size: 24px;

			.range_box {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.img {
					width: 74px;
					height: 74px;
					border-radius: 50px;
					display: flex;
					justify-content: center;
					align-items: center;
					background: rgba(217, 217, 217, 0.25);
					box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.25) inset, 0px 1px 0px 0px rgba(252, 252, 252, 0.25) inset;


					img {
						width: 62%;
						height: 62%;
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
			margin-left: 38px;
			//height: 28px;
			line-height: 28px;
			color: var(--vt-header-black);

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
			border-radius:  8px;
			border-top: 1.5px solid #FFF;
			background: linear-gradient(270deg, rgba(153, 153, 153, 0.50) 0%, rgba(255, 255, 255, 0.50) 100%);
			box-shadow: 0px 2px 4.4px 0px rgba(0, 0, 0, 0.15);

			margin:0px 10px 6px 10px;
			height: 45px;
			width: 94%;
			padding: 0 19px 0 16px;
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
				font-size: 13px;
				color: var(--vt-sub-black);
				font-weight: 600;
			}

			.van-cell__label {
				font-size: 9px;
				margin-top: 0px;
				margin-bottom: 9px;
				line-height: 0.5;
			}

			.van-cell__right-icon {
				font-size: 13px;
				color: var(--vt-sub-black);
				font-weight: 600;
			}
		}

		.mt-30 {
			margin-top: 60px;
		}
	}
}

.van-divider--vertical {
	height: 28px;
	border-color:#A57C15 ;
}
</style>
