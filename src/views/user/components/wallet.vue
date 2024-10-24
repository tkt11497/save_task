<template>
	<div class="wallet_container custom-page full-page">
		<div>
			<van-nav-bar :fixed="true" :title="t('钱包')" @click-left="onClickLeft">
				<template #left>
					<van-icon :name="arrow" size="18" />
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
							<div style="font-weight: 700">{{ item.tokenName }}</div>
							<div style="color: #b1b1b1">{{ item.tokenAbbr }}</div>
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
import arrow from '@/assets/images/user/arrow.png'
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
	padding-left: 48px;
	padding-right: 48px;
	background: #fff;

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
				border-bottom: 1px solid #f1f3f7;
				font-size: 28px;
				padding-bottom: 32px;
				margin: 32px 0;

				.left {
					display: flex;
					align-items: center;
					min-width: 250px;
				}

				.item_img {
					width: 96px;
					height: 96px;

					img {
						width: 100%;
						height: 100%;
					}
				}

				.title {
					display: flex;
					flex-direction: column;
					justify-content: center;
					margin-left: 20px;
				}

				.right {
					//flex-direction: column;
					//align-items: flex-end;
					color: #000;
					font-size: 26px;
					font-weight: 700;
					margin-left: 40px;
					//flex: 1;
					min-width: 200px;
					overflow: hidden;

					text-align: right;

					.usd {
						color: #82a9f9;
						font-weight: 500;
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
