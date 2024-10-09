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
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { navStore, userStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import one from '@/assets/images/nav/receipt.svg'
import two from '@/assets/images/nav/status-up.svg'
import three from '@/assets/images/nav/timer.svg'
import four from '@/assets/images/nav/cpu.svg'
import five from '@/assets/images/nav/profile.svg'
import oneed from '@/assets/images/nav/receipt2.svg'
import twoed from '@/assets/images/nav/status-up2.svg'
import threeed from '@/assets/images/nav/timer2.svg'
import foured from '@/assets/images/nav/cpu2.svg'
import fiveed from '@/assets/images/nav/profile2.svg'

// 初始化仓库
const store = navStore()
const { nav } = storeToRefs(store)

const uStore = userStore()
const { flag } = storeToRefs(uStore)

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

watch(
	() => route.name,
	(val) => {
		console.info('tabBar---', val)

		if (['home', 'homeIndex', 'Market', 'EarnInterest', 'PoofStake', 'User'].includes(val)) {
			uStore.SET_PATH_DATA('yes')
		}
		if (val === 'home' || val === 'homeIndex') {
			active.value = 0
		}
	},
	{
		immediate: true,
	}
)

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
:deep(.van-tabbar) {
	border-radius: 16px 16px 0px 0px;
	border-top: 1.5px solid #FFF;
	background: linear-gradient(90deg, rgba(99, 99, 99, 0.30) 0%, rgba(211, 211, 211, 0.30) 50.5%, rgba(99, 99, 99, 0.30) 100%);
	box-shadow: 0px 2px 4.4px 0px rgba(0, 0, 0, 0.15);

	// backdrop-filter: blur(30px);
	// border-color: transparent;
	height: var(--vt-nav-bar-height);
	//padding-bottom: 10px;
	//padding-top: 16px;
	//padding-bottom: 4px;
	.van-tabbar-item {
		padding: 8px 0;
		background: transparent;

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
