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
					:title="item.title"
					clickable
					@click="checked = item.title"
					:class="{ 'isChecked': item.value === checked }"
				>
					<template #right-icon>
						<van-radio :name="item.title" />
					</template>
				</van-cell>
			</van-cell-group>
		</van-radio-group>
		<!-- Confirm -->
		<div class="confirm-wrap">
			<div class="confirm" @click="selectLangFunc">
				<div>{{ t('确认') }}</div>
			</div>
		</div>
	</div>
</template>

<script setup name="Lang">
import { ref, onMounted } from 'vue'
import { fetchLanguageAll } from '@/apiService'
import { useRouter, useRoute } from 'vue-router'
import { userStore } from '@/store'
import { useI18n } from 'vue-i18n'
const { locale, t } = useI18n()

import arrow from '@/assets/images/user/arrow.png'
import useLoading from '@/hooks/useLoading.js'
import { showToast } from 'vant'

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
// const checkList = ref([])
const checkList = ref([
	// {
	//   title: 'English',
	//   value: 1
	// },
	// {
	//   title: '日本語',
	//   value: 2
	// },
	// {
	//   title: 'Tiếng Việt',
	//   value: 3
	// },
	// {
	//   title: 'Indonesian',
	//   value: 5
	// },
	// {
	//   title: 'Melayu',
	//   value: 7
	// },
	// {
	//   title: 'Deutsch',
	//   value: 8
	// },
	// {
	//   title: 'ภาษาไทย',
	//   value: 9
	// },
	// {
	//   title: 'Português',
	//   value: 10
	// },
	// {
	//   title: 'Français',
	//   value: 5
	// },
	// {
	//   title: 'PyCCKИЙ Я3ЫK',
	//   value: 6
	// },
	// {
	//   title: 'Español',
	//   value: 7
	// },
	// {
	//   title: '简体中文',
	//   value: 8
	// },
	// {
	//   title: '繁體中文',
	//   value: 9
	// },
	// {
	//   title: 'ltalian',
	//   value: 10
	// },
])

// 代码区
const onClickLeft = () => {
	history.back()
	store.SET_PATH_DATA('yes')
}
const selectLangFunc = () => {
	const changeLang = checkList.value.find((d) => d.title === checked.value)
	console.log('selectLangFunc', changeLang)
	store.SET_LAN(changeLang.language)
	store.SET_LAN_CODE(changeLang.fileName)
	locale.value = changeLang.language
	history.back()
	store.SET_PATH_DATA('yes')
}

const error = ref('')
const getLanguageAll = async () => {
	try {
		loading.loading()
		const response = await fetchLanguageAll()
		loading.clearLoading()
		let temp = response.rows
		checkList.value = temp.map((item, index) => ({
			...item,
			title: item.language,
			fileName: item.fileName,
		}))
	} catch (err) {
		console.log(err)
	}
}
onMounted(() => {
	getLanguageAll()
})

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

	$buttonHeight: 100px;
	.confirm-wrap {
		height: $buttonHeight + 50px;
	}
	.confirm {
		position: fixed;
		bottom: 0px;
		width: 100%;
		height: $buttonHeight + 50px;
		overflow: hidden;
		background-color: #fff;

		div {
			position: fixed;
			bottom: -40px;
			left: 50%;
			transform: translateX(-50%);
			background: #82a8f9;
			width: 90%;
			height: $buttonHeight;
			line-height: $buttonHeight;
			border-radius: 80px;
			margin-bottom: 60px;
			text-align: center;
			color: #fff;
			font-size: 32px;
			font-weight: 590;
		}
	}
}
</style>
