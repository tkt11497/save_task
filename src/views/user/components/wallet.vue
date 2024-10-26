<template>
	<div class="wallet_container custom-page full-page">
		<div>
			<van-nav-bar :fixed="true" :title="t('钱包')" @click-left="onClickLeft">
				<template #left>
					<img src="@/assets/images/market/back.svg" class="back-css" alt="" />
				</template>
			</van-nav-bar>
		</div>
		<div class="container">
			<div class="list_info">
				<div class="item" v-for="item in coinList" @click="openDepositandwithdrawal(item)" :key="item.id">
					<div class="left">
						<div class="item_img">
							<img :src="$imgpath + item.iconUrl" alt="" />
						</div>
						<div class="title break-word">
							<div >{{ item.tokenName }}</div>
							<div style="color: #676767;font-weight: 500;">{{ item.tokenAbbr }}</div>
						</div>
					</div>
					<div class="right">
						<span class="num">{{ toFixedDecimal(item.platformAccount?.balance || 0, 8) }}</span>
						<span class="usd">${{ toFixedDecimal(item.platformAccount?.exchangeUSDCBalance || 0, 2) }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import arrow from '@/assets/images/market/back.svg'
import { userStore } from '@/store'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/useLoading.js'
import { toFixedDecimal } from '@/utils/index.js'
import { getAllCoinTypeApi, getAllPlatformTokenBalanceApi } from '@/apis/wallet.js'
// 初始化仓库
const store = userStore()
const { t } = useI18n()
const loading = useLoading()

// 变量区
const router = useRouter()
const route = useRoute()
const state = ref('')
// 钱包列表
const coinList = ref([])

// 代码区
const onClickLeft = () => {
	history.back()
	store.SET_PATH_DATA('yes')
}
const getPlatformCoinTypeList = async () => {
	try {
		loading.loading()
		const response = await getAllCoinTypeApi({
			isLogin: false,
		})
		loading.clearLoading()
		coinList.value = response.data
	} catch (err) {
		console.log(err)
	}
}
const platformAccount = ref([])
const getPlatformCoinBalanceList = async () => {
	try {
		loading.loading()
		const res = await getAllPlatformTokenBalanceApi()
		loading.clearLoading()
		let arr = res.data
		coinList.value.forEach((item) => {
			const balanceCoinType = arr.find((item2) => {
				return item2.tokenName && item.tokenName.toLowerCase() === item2.tokenName.toLowerCase()
			})
			item.platformAccount = balanceCoinType || {}
		})
		platformAccount.value = arr
	} catch (err) {
		console.log(err)
	}
}
const openDepositandwithdrawal = (item) => {
	router.replace({
		query: { id: item.tokenId },
		path: '/depositandwithdrawal',
	})
}

onMounted(() => {
	store.SET_PATH_DATA('no')
	getPlatformCoinTypeList().then(() => {
		return getPlatformCoinBalanceList()
	})
})

// 将组件中的数据进行暴露出去
defineExpose({})
defineOptions({
	name: 'Wallet',
})
</script>

<style lang="scss" scoped>
.wallet_container {
	position: relative;
	//padding: 80px 30px 0px;
	padding-left: 18px;
	padding-right: 18px;
	background-image: url("@/assets/images/background/sbg_2.png");
	background-position:  top;
	background-size: 100% 100%;
	min-height: 100vh;
	.back-css {
				width: 47px;
				height: 47px;
				}

	.container {
		.list_info {
			//overflow-x: hidden;
			/*x轴禁止滚动*/
			//overflow-y: scroll;
			/*y轴滚动*/
			//height: calc(100vh - 80px);

			.item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 28px;
				padding: 22px 18px 20px 18px;
				margin: 12px 0;

				border-radius: 18px;
				border: 1px solid #CAB37D;
				background: linear-gradient(99deg, #90C9C6 14.79%, #2194AA 76.69%);
				box-shadow: 3px 6px 4px 0px rgba(0, 0, 0, 0.25);
				.left {
					display: flex;
					align-items: center;
					min-width: 250px;
				}

				.item_img {
					width: 76px;
					height: 76px;

					img {
						width: 100%;
						height: 100%;
					}
				}

				.title {
					display: flex;
					flex-direction: column;
					justify-content: center;
					color: #000;
					font-weight: 700;
					margin-left: 20px;
				}

				.right {
					//flex-direction: column;
					//align-items: flex-end;
					color: #000;
					font-size: 26px;
					font-weight: 600;
					margin-left: 40px;
					//flex: 1;
					min-width: 200px;
					overflow: hidden;

					text-align: right;

					.usd {
						color: #04F;
						font-weight: 600;
					}

					span {
						display: block;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
			}
		}
	}
}
</style>
