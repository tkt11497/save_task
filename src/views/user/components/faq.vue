<template>
	<div class="faq_container custom-page">
		<div>
			<van-nav-bar :fixed="true" :title="t('常见问题解答')" @click-left="onClickLeft">
				<template #left>
					<van-icon :name="arrow" size="23" />
				</template>
			</van-nav-bar>
		</div>
		<!-- <div class="info">
      <div class="info_box" v-for="(item, index) in infoList" :key="index">
        <div class="icon">
          <img :src="item.icon" alt="info1">
        </div>
        <div class="content">{{ item.content }} </div>
      </div>
    </div> -->

		<div class="info">
			<van-swipe class="my-swipe" :width="126" :height="130" :show-indicators="false" :loop="false">
				<van-swipe-item v-for="(item, index) in infoList" :key="index">
					<div class="info_box break-word">
						<div class="icon">
							<img :src="item.icon" alt="info1" />
						</div>
						<div class="content">{{ item.content }}</div>
					</div>
				</van-swipe-item>
			</van-swipe>
		</div>

		<!-- Frequently Asked Questions -->
		<div class="qa-wrap">
			<div class="title">{{ t('常见问题') }}</div>

			<van-pull-refresh v-model="refreshing" @refresh="onRefresh" :loosing-text="t('释放即可刷新')">
				<van-list
					v-model:loading="listLoading"
					v-model:error="listError"
					:error-text="t('请求失败，点击重新加载')"
					:finished="finished"
					:finished-text="isEmptyList ? '' : t('没有更多了')"
					@load="onLoad"
				>
					<template #loading>
						<van-loading class="custom-page-loading" type="spinner" />
					</template>

					<div class="list">
						<div v-for="(item, index) in faqList" :key="index">
							<div class="contant">
								<div class="title-row">
									<span class="title">{{ item.question }}</span>
									<div class="img" @click="accordionFunc(item)">
										<img v-if="selectFAQ.answer === item.answer" src="../../../assets/images/market/decrease.svg" alt="minus" />
										<img v-else src="../../../assets/images/market/increase.svg" alt="plus" />
									</div>
								</div>
								<P v-if="selectFAQ.answer === item.answer" class="content-row">
									{{ item.answer }}
								</P>
							</div>
						</div>
					</div>
				</van-list>
			</van-pull-refresh>
		</div>
	</div>
</template>

<script setup name="Faq">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userStore } from '@/store'
import { useI18n } from 'vue-i18n'
import arrow from '@/assets/images/market/back.svg'
import info1 from '@/assets/images/home/info1.svg'
import info2 from '@/assets/images/home/info2.svg'
import info3 from '@/assets/images/home/info3.svg'
import useLoading from '@/hooks/useLoading.js'
import usePage from '@/hooks/usePage.js'
import { fetchFqaListApi } from '@/apis/common.js'
// 初始化仓库
const store = userStore()
const { t } = useI18n()
// 变量区
const router = useRouter()
const route = useRoute()
const loading = useLoading()

const state = ref('')
const selectFAQ = ref({})
// scroll
const infoList = ref([
	{
		icon: info1,
		content: t('可靠的安全保障'),
	},
	{
		icon: info2,
		content: t('稳定可靠的投资回报'),
	},
	{
		icon: info3,
		content: t('方便易操作'),
	},
])

// 代码区
const isEmptyObject = (obj) => {
	return Object.keys(obj).length === 0 && obj.constructor === Object
}
const isObjectDifferent = (obj1, obj2) => {
	return JSON.stringify(obj1) !== JSON.stringify(obj2)
}
const accordionFunc = (val) => {
	console.log('sdkfjhs ', selectFAQ.value)
	if (isEmptyObject(selectFAQ.value)) {
		selectFAQ.value = val
	} else if (isObjectDifferent(selectFAQ.value, val)) {
		selectFAQ.value = val
	} else {
		selectFAQ.value = {}
	}
}
const onClickLeft = () => {
	history.back()
	store.SET_PATH_DATA('yes')
}

const { onRefresh, onLoad, listLoading, listError, refreshing, finished, isEmptyList, dataList: faqList } = usePage(fetchFqaListApi)

onMounted(() => {})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.faq_container {
	padding-left: 30px;
	padding-right: 30px;

	.info {
		padding: 44px 22px 36px;
		display: flex;
		justify-content: space-between;

		:deep(.van-swipe-item) {
			padding-right: 20px;
			box-sizing: border-box;
		}
		.info_box {
			width: 220px !important;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			border-radius:  8px;
			border-top: 1.5px solid #FFF;
			background: linear-gradient(270deg, rgba(153, 153, 153, 0.30) 0%, rgba(255, 255, 255, 0.30) 100%);
			box-shadow: 0px 2px 4.4px 0px rgba(0, 0, 0, 0.15);
			padding: 15px;
			height: 99%;

			.icon {
				line-height: 1;
				img {
					width: 50px;
					height: 50px;
				}
			}

			.content {
				margin-top: 22px;
				font-weight: 500;
				font-size: 28px;
				line-height: 35px;
				text-align: center;
				color: var(--vt-header-black);
			}
		}
	}

	.qa-wrap {
		& > .title {
			font-size: 32px;
			font-weight: 600;
			color: var(--vt-header-black);
			margin-bottom: 40px;
			line-height: normal;
		}

		.list {
			padding: 30px 0;
			width: 100%;
			// margin-bottom: 100px;

			.contant {
				width: 100%;
				border-top: 2px solid #FFF;
				background: linear-gradient(90deg, rgba(255, 255, 255, 0.30) 0%, rgba(153, 153, 153, 0.30) 100%);
				box-shadow: 0px 2px 4.4px 0px rgba(0, 0, 0, 0.15);
				//margin-left: 50%;
				//transform: translateX(-50%);
				border-radius: 28px;
				margin-bottom: 60px;
				padding: 0 30px 0 20px;

				.title-row {
					display: flex;
					justify-content: space-between;
					min-height: 110px;
					align-items: center;
				}

				.content-row {
					color: var(--vt-sub-black);
					font-size: 22.9px;
					font-style: normal;
					font-weight: 500;
					line-height: normal;
					padding: 24px 0;
				}

				.title {
					font-size: 28px;
					color: var(--vt-header-black);
					line-height: normal;
					font-weight: 600;
				}

				.img {
					width: 48px;
					height: 48px;
					margin-right: 30px;
					display: flex;
					align-items: center;

					img {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}

	.accordion-css {
		.el-collapse-item {
			margin-bottom: 16px;
		}

		.el-collapse {
			border-top: 0px solid;
			border-bottom: 0px solid;
		}

		.el-collapse-item {
			border-bottom: 0px solid;
		}

		.el-collapse-item__header {
			border-bottom: 0px solid #fff;
		}
	}
}
</style>
