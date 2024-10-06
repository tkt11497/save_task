<template>
	<div class="notifications_container custom-page full-page">
		<div>
			<van-nav-bar :fixed="true" :title="t('通知')" @click-left="onClickLeft">
				<template #left>
					<van-icon :name="arrow" size="18" />
				</template>
			</van-nav-bar>
		</div>
		<div class="content">
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

					<div v-if="!noticeList.length" class="container">
						<div class="notice">
							<img src="../../../assets/images/user/notice.png" alt="notice" />
						</div>
						<div class="title">{{ t('哎呀！') }}</div>
						<div class="info">{{ t('您尚无任何新闻。') }}</div>
						<div class="info">{{ t('列表为空') }}</div>
					</div>
					<div v-else class="datahave">
						<div class="each-block" v-for="(list, ind1) in noticeList" :key="ind1">
							<div class="each-container">
								<div class="title1-row">
									<p class="day-text">{{ list.title || t('公告') }}</p>
								</div>
								<div class="content-row1">
									<div class="contentcss" v-html="list.content"></div>
								</div>
								<div class="content-row">
									<p class="date-left">{{ list.currencyMoney }}</p>
									<div class="date-right">
										<p class="circlecss"></p>
										<span class="time">{{ formatDate(list.createTime) }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</van-list>
			</van-pull-refresh>
		</div>
	</div>
</template>

<script setup name="Notifications">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import arrow from '@/assets/images/user/arrow.png'
import { userStore } from '@/store'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/useLoading.js'
import { fetchNoticeListApi } from '@/apis/common.js'
import usePage from '@/hooks/usePage.js'
import { formatDate } from '@/utils/index.js'

// 初始化仓库
const store = userStore()
const { t } = useI18n()

// 变量区
const router = useRouter()
const route = useRoute()
const loading = useLoading()
const state = ref('')

// 代码区
const onClickLeft = () => {
	history.back()
	store.SET_PATH_DATA('yes')
}

const { onRefresh, onLoad, listLoading, listError, refreshing, finished, isEmptyList, dataList: noticeList } = usePage(fetchNoticeListApi)

onMounted(() => {})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.notifications_container {
	.container {
		//width: 100%;
		//display: flex;
		//flex-direction: column;
		//align-items: center;
		text-align: center;
		padding-top: 50%;
		.notice {
			width: 106px;
			height: 106px;
			display: inline-block;

			img {
				width: 100%;
				height: 100%;
			}
		}

		.title {
			font-size: 42px;
			color: #000;
			font-weight: 700;
			margin: 30px 0px;
		}

		.info {
			font-size: 25px;
			color: #a4a4a4;
		}
	}
}

.datahave {
	margin: 32px 60px;

	.each-block {
		background: #fff;
		padding: 10px 0 24px;
		margin-bottom: 44px;
		border-bottom: 1px solid #b7b7b7;

		.each-container {
			position: relative;
			/* Needed to position the pseudo-element */
			//padding-left: 16px;
			/* Optional: Adjust this to provide space for the pseudo-element */
		}

		.each-container {
		}

		.title-row,
		.title1-row,
		.content-row,
		.content-row1 {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.day-text {
				font-size: 26px;
				font-style: normal;
				font-weight: 700;
				line-height: 44px;
				position: relative;
				padding-left: 26px;
				&::before {
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					width: 8px;
					height: 40px;
					background-color: #82a9f9;
				}
			}
		}

		.title1-row {
			justify-content: unset;
			margin-bottom: 24px;
		}

		.content-row1 {
			margin-bottom: 24px;
			.contentcss {
				color: #2f2f2f;
				font-size: 26px;
				font-style: normal;
				font-weight: 600;
				line-height: 44px;
				min-height: 106px;
			}
		}
		.content-row {
			.date-left {
				color: #b7b7b7;
				font-size: 23.2px;
				font-style: normal;
				//font-weight: 600;
				line-height: 44px; /* 189.655% */
			}

			.date-right {
				display: flex;
				align-items: center;

				.circlecss {
				}

				.time {
					color: #b7b7b7;
					font-size: 22.4px;
					font-style: normal;
					//font-weight: 600;
					line-height: 44px; /* 196.429% */

					position: relative;
					padding-left: 17px;
					margin-left: 10px;
					&::before {
						content: '';
						position: absolute;
						top: 50%;
						left: 0;
						transform: translateY(-50%);
						width: 10px;
						height: 10px;
						background-color: #ffad30;
						border-radius: 100%;
					}
				}
			}
		}
	}
}
</style>
