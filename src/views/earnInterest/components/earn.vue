<template>
	<div class="stake_container custom-page">
		<div>
			<van-nav-bar :fixed="true" :title="$t('赚取利息')" @click-left="onClickLeft">
				<template #left>
					<img src="@/assets/images/market/back.svg" class="back-css" alt="" />
				</template>
			</van-nav-bar>
		</div>
		<div class="font">
			<!-- Earn interest -->
			<div class="text">
				{{
					$t(
						'自动交易是一种使用计算机程序和算法自动执行交易策略的方法。 该方法使用历史数据、技术指标、统计模型和其他分析工具来识别交易确定性信号并自动选择执行。 自动交易量化可以帮助交易者消除情绪影响，减少错误交易，提高交易效率和一致性。'
					)
				}}
			</div>
		</div>
	</div>
</template>

<script setup name="Policy">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userStore } from '@/store'
import arrow from '@/assets/images/user/arrow.png'

// 初始化仓库
const store = userStore()
// 变量区
const router = useRouter()
const route = useRoute()
const state = ref('')

// 代码区
const onClickLeft = () => {
	history.back()
	store.SET_PATH_DATA('yes')
}

onMounted(() => {})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.stake_container {
	.back-css {
				width: 48px;
				height: 48px;
			}
	.font {
		padding: 20px 48px 0px;
		font-size: 24px;
		color: #121212;
		font-weight: 400;
		line-height: 48px;

		.title {
			font-size: 30px;
			// font-weight: 700;
			margin-top: 30px;
		}

		.text {
			margin-bottom: 20px;
		}
	}
}
</style>
