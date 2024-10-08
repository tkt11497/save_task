<template>
	<div class="choose">
		<div class="title">
			<img src="@/assets/images/home/logo-7d41d0b53.png" alt="" width="24" height="24" />
			<span>Cryptoland</span>
		</div>

		<div class="subhead">
			{{ t('选择货币链接钱包') }}
		</div>

		<div class="description">
			{{ t('灵活地选择并无缝链接您的首选货币，增强您的财务选择') }}
		</div>

		<CurrencyList />
	</div>
</template>

<script setup>
import { onMounted } from 'vue'
import { userStore } from '@/store'
import CurrencyList from './components/CurrencyList.vue'
import { useI18n } from 'vue-i18n'

const usersStore = userStore()

const { t } = useI18n()

onMounted(() => {
	usersStore.SET_PATH_DATA('no')
})

defineOptions({ name: 'noWallet' })
</script>

<style scoped lang="scss">
.choose {
	padding: 48px;
	background: #fff;
	overflow-y: auto;
	
	background-image: url("../../assets/images/background/sbg_2.png");
	background-position:  top;
	background-size: 140% 110%;
	height: 100vh;
	backdrop-filter: blur(25.368999481201172px);

	.title {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 44px;
		gap: 20px;
		font-weight: bold;
		margin-bottom: 48px;
		color: var(--vt-header-black);
	}

	.subhead,
	.description {
		text-align: center;
	}

	.subhead {
		font-weight: 600;
		color: var(--vt-header-black);
		font-size: 32px;
		margin-bottom: 16px;
	}

	.description {
		font-size: 24px;
		color: var(--vt-sub-black);
		margin-bottom: 16px;
	}
}
</style>
