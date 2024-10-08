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
		await onChangeCurrency(currency)
		loading.clearLoading()
		emits('signed', {
			isSuccess: true,
			tokenName: currency,
		})
		checkAuthCoinTypeList()
	} catch (error) {
		console.log(error)
		emits('signed')
	}
}

const { getPlatformTokenList } = useToken()
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
	margin-top: 40px;

	img {
		width: 60px;
		height: 60px;
		margin-right: 18px;
	}

	.text {
		font-size: 28px;
		color: var(--vt-header-black);
		font-weight: 600;
	}

	div {
		height: 100px;
		display: flex;
		align-items: center;

		padding: 8px 18px 7px 18px;
		margin-top:11px ;
		border-radius: 8px;
		border-top: 1.5px solid #FFF;
		background: linear-gradient(270deg, rgba(153, 153, 153, 0.30) 0%, rgba(255, 255, 255, 0.30) 100%);
		box-shadow: 0px 2px 4.4px 0px rgba(0, 0, 0, 0.15);
		
	}

	button {
		margin-left: auto;
		height: 54px;

		border-radius: 41px;
		border-top: 0.5px solid #FFF;
		background: linear-gradient(180deg, #F4F8F9 0%, #CCC 100%);
		color:var(--vt-header-black);



		font-size: 24px;
		font-weight: 400;
		min-width: 160px;
	}
}
</style>
