<template>
	<div class="currency-list">
		<div v-for="currency in showCurrency" :key="currency.id">
			<img :src="$imgpath + currency.picUrl" :alt="currency.currencyCode" />

			<span class="text">{{ currency.currency }}</span>

			<button @click="onChange(currency)">
				{{ t('连接') }}
			</button>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import useLoading from '@/hooks/useLoading.js'
import { useWeb3Store } from '@/store/index.js'
import currencyIcon from '@/utils/icon.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const loading = useLoading()

const props = defineProps({
	hideSelected: Boolean,
})

const emits = defineEmits(['signed'])

const web3Store = useWeb3Store(),
	{ onChangeCurrency } = web3Store,
	{ currencyList, currentCurrency } = storeToRefs(web3Store)

const showCurrency = computed(() => {
	if (props.hideSelected) {
		console.log('showCurrency', currentCurrency.value)
		return currencyList.value.filter((currency) => currency.id !== currentCurrency.value.id).filter((item) => item.address)
	} else {
		return currencyList.value.filter((item) => item.address)
	}
})

const onChange = async (currency) => {
	console.log('onChange', currency)
	loading.loading()
	try {
		await onChangeCurrency(currency)
		emits('signed', currency)
	} catch (error) {
		console.log(error)
	} finally {
		loading.clearLoading()
	}
}

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
		border: 1px solid rgba(185, 193, 217, 0.5);
		outline: none;
		padding: 0 32px;
		background: none;
		border-radius: 54px;
		color: #161616;
		font-size: 24px;
		font-weight: 400;
	}
}
</style>
