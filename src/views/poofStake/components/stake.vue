<template>
	<div class="stake_container custom-page">
		<div>
			<van-nav-bar :fixed="true" :title="t('什么是权益证明？')" class="nav-title" @click-left="onClickLeft">
				<template #left>
					<van-icon :name="arrow" size="22" />
				</template>
			</van-nav-bar>
		</div>
		<div class="font">
			<template v-for="(item, index) in tm('权益证明内容')">
				<div class="title">{{ item.title }}</div>
				<div class="text" :class="{ 'normal': index === tm('权益证明内容').length - 1 }">{{ item.text }}</div>
			</template>
			<!-- Introduction -->
			<!--      <div class="title"></div>-->
			<!--      <div class="text">-->
			<!--        </div>-->
			<!--      &lt;!&ndash; Ethereum 2.0 and Proof of Stake (POS) &ndash;&gt;-->
			<!--      <div class="title"></div>-->
			<!--      <div class="text">-->
			<!--        </div>-->

			<!--      &lt;!&ndash; The Staking Process &ndash;&gt;-->
			<!--      <div class="title"></div>-->
			<!--      <div class="text">-->
			<!--        </div>-->
			<!--      &lt;!&ndash; Staking Rewards and Risks &ndash;&gt;-->
			<!--      <div class="title"></div>-->
			<!--      <div class="text">-->

			<!--      </div>-->
			<!--      &lt;!&ndash; Joint Staking and Individual Staking &ndash;&gt;-->
			<!--      <div class="title"></div>-->
			<!--      <div class="text">-->
			<!--        </div>-->
			<!--      &lt;!&ndash; Your Rights and Choices &ndash;&gt;-->
			<!--      <div class="title"></div>-->
			<!--      <div class="text">-->

			<!--      </div>-->
			<!--      &lt;!&ndash; Changes to This Privacy Policy &ndash;&gt;-->
			<!--      <div class="title"> </div>-->
			<!--      <div class="text normal">-->
			<!--      </div>-->
		</div>
	</div>
</template>

<script setup name="Stake">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { userStore } from '@/store'
import arrow from '@/assets/images/user/arrow.png'
import { useI18n } from 'vue-i18n'

// 初始化仓库
const store = userStore()
// 变量区
const router = useRouter()
const route = useRoute()
const state = ref('')
const { t, tm } = useI18n()

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
	.font {
		padding: 0 56px 0px;
		font-size: 25px;
		color: #000000;
		font-weight: 500;
		line-height: 48px;

		.title {
			font-size: 30px;
			// font-weight: 700;
			margin-top: 55px;
		}

		.text {
			margin-bottom: 20px;
		}

		.normal {
			color: rgb(124, 123, 123);
			font-size: 23px;
		}
	}
}
</style>
