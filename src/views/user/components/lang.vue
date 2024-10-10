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
					:title="item.title"
					clickable
					@click="checked = item.title"
					:class="{ 'isChecked': item.value === checked }"
				>
					<template #right-icon>
						<van-radio :name="item.title">
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
				<div>{{ t('确认') }}</div>
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
import active from '@/assets/images/user/active.svg'
import inactive from '@/assets/images/user/inactive.svg'

const { locale, t } = useI18n()

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
	{
		title: 'English',
		language: 'English',
		value: 'en_US',
		fileName: 'en_US',
	},
	{
		title: '简体中文',
		language: '简体中文',
		value: 'zh_CN',
		fileName: 'zh_CN',
	},
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
	// getLanguageAll()
})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.lang_container {
	// 单选框
	.van-cell-group--inset {
		margin: 0;
		border-radius: 14px 14px 14px 14px;
		border-top: 1.5px solid #FFF;
		background: var(--fsdfsfds, linear-gradient(270deg, rgba(153, 153, 153, 0.30) 0%, rgba(255, 255, 255, 0.30) 100%));
	}
	.van-cell {
		padding: 15px 20px;
		background: transparent;
		.img-icon{
			width: 20px;
		}

		// &:active {
		// 	background-color: #fff;
		// }
		// &.isChecked {
		// 	color: #82a8f9;
		// }
	}



	$buttonHeight: 100px;
	.confirm-wrap {
		height: $buttonHeight + 50px;
	}
	.confirm {
		position: fixed;
		bottom: var(--vt-nav-bar-height);
		width: 100%;
		height: $buttonHeight + 50px;
		overflow: hidden;
		background-color: transparent;

		div {
			position: fixed;
			//bottom: -40px;
			left: 50%;
			transform: translateX(-50%);
			background-image: url("@/assets/images/market/p_button.png");
			background-position:  center;
			background-size: 110% 130%;
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
