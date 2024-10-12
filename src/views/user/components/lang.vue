<template>
	<div class="lang_container custom-page full-page">
		<div>
			<van-nav-bar :fixed="true" :title="t('语言')" @click-left="onClickLeft">
				<template #left>
					<van-icon :name="arrow" size="23" />
				</template>
			</van-nav-bar>
		</div>
		<!-- Select Radio -->
		<van-radio-group v-model="checked">
			<van-cell-group inset>
				<van-cell
					v-for="(item, index) in checkList"
					:key="index"
					:title="item.name"
					clickable
					@click="checked = item.code"
					:class="{ 'isChecked': item.code === checked }"
				>
					<template #right-icon>
						<van-radio :name="item.code" >
							<template #icon="props">
								<img class="img-icon" :src="props.checked ? active : inactive" />
							</template>
						</van-radio>

					</template>
				</van-cell>
			</van-cell-group>
		</van-radio-group>
		<!-- Confirm -->
		<div class="confirm-wrap">
			<div class="confirm" @click="selectLangFunc">
				<van-button type="primary" round block>{{ t('确认') }}</van-button>
			</div>
		</div>
	</div>
</template>

<script setup name="Lang">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userStore } from '@/store'
import { useI18n } from 'vue-i18n'
import arrow from '@/assets/images/market/back.svg'
import useLoading from '@/hooks/useLoading.js'
import { changLang } from '@/i18n/index.js'
import LANS from '@/i18n/lang.js'
import active from '@/assets/images/user/active.svg'
import inactive from '@/assets/images/user/inactive.svg'
const { t } = useI18n()

// 初始化仓库
const store = userStore()
// 变量区
const router = useRouter()
const route = useRoute()

const loading = useLoading()

// 单选框选中参数
const checked = ref('')
checked.value = store.language

// 单选框数据
const checkList = ref([...LANS])

// 代码区
const onClickLeft = () => {
	history.back()
	store.SET_PATH_DATA('yes')
}
const selectLangFunc = async () => {
	const changeLang = checkList.value.find((d) => d.code === checked.value)
	await changLang(changeLang.code)
	store.SET_LAN(changeLang.code)
	onClickLeft()
}

onMounted(() => {})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.lang_container {
	background-image: url("@/assets/images/background/sbg_2.png");
	background-position:  top;
	background-size: 100% 100%;
	min-height: 100vh;
	// 单选框
	.van-cell-group--inset {
		margin: 30px 0px 0 0px;
		background: transparent;
		// border-radius: 14px 14px 14px 14px;
		// background: linear-gradient(270deg, rgba(153, 153, 153, 0.30) 0%, rgba(255, 255, 255, 0.30) 100%);
		// box-shadow: 0px 2px 4.4px 2px rgba(0, 0, 0, 0.15);
	}
	.van-cell {
		padding: 15px 20px;
		background: transparent;
		color: #CBCBCB;

		&::after {
				content: "";
				position: absolute;
				bottom:0;
				left:50%;
				transform: translateX(-50%);
				height: 20px;
				width: 96%;
				border-bottom: 0px;
				background-image: url('@/assets/images/background/border.png');
				background-repeat: no-repeat;
				background-size: 100% 6px;
				background-position: center bottom;
			}
		// &:active {
		// 	background-color: #fff;
		// }
		&.isChecked {
			color: #04F;
		}
	}

	:deep(.van-radio__icon--checked) {
		.van-icon {
			background-color: #fff;
			position: relative;
			border-color: #82a8f9;
			border-width: 2px;

			&:before {
				content: '';
				width: 10px;
				height: 10px;
				border-radius: 50%;
				background-color: #82a8f9;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}
	}

	//$buttonHeight: 100px;
	.confirm-wrap {
		height: 180px;
	}
	.confirm {
		position: fixed;
		bottom: var(--vt-nav-bar-height);
		width: 100%;
		overflow: hidden;
		background-color: transparent;
		padding: 30px 30px 50px;
		.van-button{
			border-radius: 12px;
			border: 1px solid  #FFF;
			background: linear-gradient(180deg, #5CE7FF 0%, #27727F 77.5%, #50CDCD 100%);
		}
	}
}
</style>
