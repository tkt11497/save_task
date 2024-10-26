<template>
	<div class="user_container">
		<!-- header -->
		<div class="header">
			<div class="logo">
				<img src="/logo.png" alt="logo" />
			</div>
			<div class="title">{{ $htmlTitle }}</div>
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
				<div class="number">${{ plusDecimal(userStaticIncome.totalBalance || 0, 0, 2) }}</div>

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
					<span class="trends">${{ plusDecimal(userStaticIncome.totalDayIncome || 0, 0, 2) }}</span>
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
				:to="item.path">
					<template #right-icon>
						<img src="@/assets/images/user/right_icon.png" alt="right-icon"/>
					</template>
				</van-cell>

			<span class="title mt-30">{{ t('隐私与安全') }}</span>
			<van-cell :title="t('隐私与安全')" center :label="t('专注于您的安全和隐私')" :icon="getImageUrl('user/policy.svg')" is-link to="/policy" >
				<template #right-icon>
						<img src="@/assets/images/user/right_icon.png" alt="right-icon"/>
					</template>
			</van-cell>

			<span class="title mt-30">{{ t('设置') }}</span>
			<van-cell :title="t('更改语言')" center :icon="getImageUrl('user/language-vector-icon.svg')" is-link to="/lang" >
				<template #right-icon>
						<img src="@/assets/images/user/right_icon.png" alt="right-icon"/>
					</template>
			</van-cell>
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
	background-size: 100% 100%;
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
			font-weight: 700;
			color: #E9E9E9;
			margin-left: -260px;
			line-height: 98px;
			margin-top: -15px;
		}

		.input {
			width: 196px;
			height: 64px;
			line-height: 64px;
			border: 1px solid #FFF;
			background: linear-gradient(180deg, #5CE7FF 0%, #27727F 77.5%, #50CDCD 100%);
			box-shadow: 4.9px -4.9px 4.9px 0px rgba(165, 165, 165, 0.10) inset;
			backdrop-filter: blur(6.199999809265137px);
			cursor: pointer;
			border-radius: 15px;
			padding: 0 22px;
			font-size: 24px;
			color: #E9E9E9;
			font-weight: 700;
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
				color: #FBFBFB;
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
				color: #FBFBFB;
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
				color: #FBFBFB;
				font-size: 25px;
				margin-left: 5px;
				font-weight: 700;
			}

			.day {
				color:#FBFBFB;
				font-size: 18px;
				font-weight: 700;
				margin-left: 10px;
			}
		}

		.precentage {
			width: 150px;
			height: 70px;
			line-height: 70px;
			text-align: center;

			border-radius: 50px;
			background: rgba(255, 255, 255, 0.30);
			box-shadow: -1px -1px 0px 0px rgba(0, 0, 0, 0.25) inset, 1px 1px 0px 0px rgba(255, 255, 255, 0.25) inset;

			color: #fff;
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

			border: 1px solid #CAB37D;
			background: linear-gradient(99deg, #90C9C6 14.79%, #2194AA 76.69%);
			box-shadow: 3px 6px 4px 0px rgba(0, 0, 0, 0.25);
			//height: 90px;
			margin-top: 30px;
			padding: 0 20px;
			border-radius: 0.33333rem;
			color: #E9E9E9;
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
			font-weight: 500;
			display: block;
			padding-bottom: 16px;
			margin-bottom: 32px;
			margin-top: 20px;
			margin-left: 38px;
			//height: 28px;
			line-height: 28px;
			color: #00DCFF;

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
			border-radius: 14px;
			border: 1px solid #CAB37D;
			background: linear-gradient(99deg, #90C9C6 14.79%, #2194AA 76.69%);
			box-shadow: 3px 6px 4px 0px rgba(0, 0, 0, 0.25);

			margin:0px 10px 6px 10px;
			height: 45px;
			width: 94%;
			padding: 0 19px 0 16px;
			display: flex;
			align-items: center;
			&::after{
				border-bottom: 0;
			}

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
				color: #313131;
				font-weight: 500;
			}

			.van-cell__label {
				font-size: 9px;
				margin-top: 0px;
				margin-bottom: 9px;
				line-height: 0.5;
				color:#313131 ;
			}

			.van-cell__right-icon {
				font-size: 13px;
				color:#fff;
				font-weight: 600;
			}
		}

		.mt-30 {
			margin-top: 60px;
		}
	}
}

.van-divider--vertical {
	height: 48px;
	border-color:#226764 ;
}
</style>
