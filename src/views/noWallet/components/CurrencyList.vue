<template>
	<div class="currency-list">
		<div v-for="currency in showCurrency" :key="currency.id">
			<img :src="$imgpath + currency.iconUrl" :alt="currency.tokenName" />

			<span class="text">{{ currency.tokenName }}</span>

			<van-button v-if="checkAuthStatus && currency.isAuthrize" type="primary" plain round @click="onChange(currency)">{{ t('切换') }}</van-button>
			<van-button v-else round @click="onChange(currency)">
				{{ t('连接') }}
			</van-button>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, ref, toRefs } from 'vue'
import { storeToRefs } from 'pinia'
import useLoading from '@/hooks/useLoading.js'
import { useWeb3Store } from '@/store/index.js'
import { useI18n } from 'vue-i18n'
import { getAllCoinTypeApi } from '@/apis/wallet.js'
import { useRoute, useRouter } from 'vue-router'
import { useToken } from '@/hooks/useToken.js'

const { t } = useI18n()
const loading = useLoading()
const route = useRoute()
const router = useRouter()

const props = defineProps({
	hideSelected: Boolean,
	checkAuthStatus: Boolean,
})
const { checkAuthStatus } = toRefs(props)

const emits = defineEmits(['signed'])

// 平台币种列表
const currencyList = ref([])
const getCurrencyList = async () => {
	try {
		const allChainResponse = await getAllCoinTypeApi()

		currencyList.value = allChainResponse.data || []
		console.log('useWeb3Store', '获取币种列表', currencyList.value)
	} catch (e) {
		console.log('useWeb3Store', '获取币种列表失败', e)
	}
}

const web3Store = useWeb3Store(),
	{ onChangeCurrency } = web3Store,
	{ currentCurrency } = storeToRefs(web3Store)

const showCurrency = computed(() => {
	if (props.hideSelected) {
		return currencyList.value.filter((currency) => currency.id !== currentCurrency.value.id && currency.contractAddress)
	} else {
		// return currencyList.value.filter((item) => item.address)
		return currencyList.value.filter((d) => d.tokenName.toLowerCase() !== 'eth' && d.contractAddress)
	}
})

const onChange = async (currency) => {
	console.log('token-onChange', currency)
	try {
		loading.loading()
		const isAuthToken = await onChangeCurrency(currency)
		loading.clearLoading()
		emits('signed', {
			isSuccess: true,
			tokenName: currency,
		})
		if (isAuthToken) {
			const changePlatformTokenType = await getPlatformTokenByCoinType(currency)
			changePlatformTokenType.isAuthrize = 1
			if (route.name !== 'home') {
				router.push('/home')
			}
		}
	} catch (error) {
		loading.clearLoading()
		console.log(error)
		emits('signed')
	}
}

const { getPlatformTokenList, getPlatformTokenByCoinType } = useToken()
const checkAuthCoinTypeList = async () => {
	const list = await getPlatformTokenList()
	if (list && list.length) {
		currencyList.value.forEach((c) => {
			const data = list.find((d) => {
				return c.tokenName === d.tokenName && d.isAuthrize === 1
			})
			if (data) {
				c.isAuthrize = true
			}
		})
	}
}
onMounted(async () => {
	await getCurrencyList()
	if (props.checkAuthStatus) {
		await checkAuthCoinTypeList()
	}
})
defineOptions({ name: 'CurrencyList' })
</script>

<style scoped lang="scss">
.currency-list {
	font-size: 28px;
	font-weight: 500;

	img {
		width: 60px;
		height: 60px;
		margin-right: 18px;
	}

	.text {
		font-size: 28px;
		color: #000;
		font-weight: 400;
	}

	div {
		height: 120px;
		display: flex;
		align-items: center;
		border-top: 1px solid rgba(185, 193, 217, 0.2);
	}

	button {
		margin-left: auto;
		height: 54px;
		//	border: 1px solid rgba(185, 193, 217, 0.5);
		//	outline: none;
		//	padding: 0 32px;
		//	background: none;
		//	border-radius: 54px;
		//	color: #161616;
		font-size: 24px;
		font-weight: 400;
		min-width: 160px;
	}
}
</style>
