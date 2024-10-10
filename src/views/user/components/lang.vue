<template>
	<div class="lang_container custom-page full-page">
		<div>
			<van-nav-bar :fixed="true" :title="t('语言')" @click-left="onClickLeft">
				<template #left>
					<van-icon :name="arrow" size="18" />
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
						<van-radio :name="item.code" />
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
import arrow from '@/assets/images/user/arrow.png'
import useLoading from '@/hooks/useLoading.js'
import { changLang } from '@/i18n/index.js'
import LANS from '@/i18n/lang.js'

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
	// 单选框
	.van-cell-group--inset {
		margin: 0;
	}
	.van-cell {
		padding: 15px 20px;

		&:active {
			background-color: #fff;
		}
		&.isChecked {
			color: #82a8f9;
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
		background-color: #fff;
		padding: 30px 30px 50px;
	}
}
</style>
