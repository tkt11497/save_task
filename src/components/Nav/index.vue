<template>
	<div class="nav_container" v-show="flag != 'no'">
		<van-tabbar v-model="active" @change="onChange">
			<van-tabbar-item v-for="(item, index) in icon" :key="item.path" :to="item.path">
				<template #icon="props">
					<img :src="props.active ? item.active : item.inactive" />
				</template>
			</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script setup name="Nav">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { navStore, userStore, useWeb3Store } from '@/store'
import { storeToRefs } from 'pinia'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'

import one from '@/assets/images/nav/receipt.png'
import two from '@/assets/images/nav/status-up.png'
import three from '@/assets/images/nav/timer.png'
import four from '@/assets/images/nav/cpu.png'
import five from '@/assets/images/nav/profile.png'
import oneed from '@/assets/images/nav/receipt2.png'
import twoed from '@/assets/images/nav/status-up2.png'
import threeed from '@/assets/images/nav/timer2.png'
import foured from '@/assets/images/nav/cpu2.png'
import fiveed from '@/assets/images/nav/profile2.png'

// 初始化仓库
const store = navStore()
const { nav } = storeToRefs(store)

const uStore = userStore()
const { flag } = storeToRefs(uStore)

const web3Store = useWeb3Store()
const { address } = storeToRefs(web3Store)

const { t } = useI18n()

// 变量区
const router = useRouter()
const route = useRoute()
const active = ref(0)
const icon = ref([
	{
		inactive: one,
		active: oneed,
		path: '/home',
	},
	{
		inactive: two,
		active: twoed,
		path: '/market',
	},
	{
		inactive: three,
		active: threeed,
		path: '/earnInterest',
	},
	{
		inactive: four,
		active: foured,
		path: '/poofStake',
	},
	{
		inactive: five,
		active: fiveed,
		path: '/user',
	},
])

// 代码区

// 切换导航
const onChange = (event) => {
	// console.log('Nav onChange', event)
	active.value = event
	store.SET_NAV_DATA(event)
}

watch(
	() => nav.value,
	(val) => {
		active.value = val
	},
	{
		immediate: true,
	}
)

const toastTimer = ref(null)
watch(
	() => route.name,
	(val) => {
		routerChange()
	}
)

const routerChange = () => {
	const val = route.name
	console.info('tabbar---', val)
	console.log('address', address.value)

	if (!address.value && val !== 'noWallet') {
		clearTimeout(toastTimer.value)
		toastTimer.value = setTimeout(() => {
			showToast({ message: t('请正确连接你的钱包'), icon: 'info' })
		}, 1000)
	}

	if (['home', 'homeIndex', 'Market', 'EarnInterest', 'PoofStake', 'User'].includes(val)) {
		uStore.SET_PATH_DATA('yes')
	}
	if (val === 'home' || val === 'homeIndex') {
		active.value = 0
	}
}

onMounted(async () => {
	// active.value = store.nav

	// todo 首次进入，route.name不准确
	// routerChange()

	if (flag.value === 'yes') {
		await web3Store.initUserAccountAndWallet()
	}
})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
:deep(.van-tabbar) {
	// border-radius: 20px 20px 0 0;
	background: linear-gradient(109deg, rgba(255, 255, 255, 0.8) 1.57%, rgba(255, 255, 255, 0.8) 100%);
	box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.12);
	backdrop-filter: blur(30px);
	border-color: transparent;
	height: 67px;
	//padding-bottom: 10px;
	//padding-top: 16px;
	//padding-bottom: 4px;

	.van-tabbar-item {
		padding: 8px 0;

		.van-tabbar-item__icon {
			width: 24px;
			height: 24px;
			margin-bottom: 0;

			img {
				width: 100%;
				height: 100%;
			}
		}
	}
}
</style>
