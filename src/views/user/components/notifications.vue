<template>
	<div class="notifications_container custom-page full-page">
		<div>
			<van-nav-bar :fixed="true" :title="t('通知')" @click-left="onClickLeft">
				<template #left>
					<van-icon :name="arrow" size="18" />
				</template>
			</van-nav-bar>
		</div>
		<div v-if="noticeData.length == 0" class="container">
			<div class="notice">
				<img src="../../../assets/images/user/notice.png" alt="notice" />
			</div>
			<div class="title">{{ t('哎呀！') }}</div>
			<div class="info">{{ t('您尚无任何新闻。') }}</div>
			<div class="info">{{ t('列表为空') }}</div>
		</div>
		<div v-else class="datahave">
			<div class="each-block" v-for="(list, ind1) in noticeData" :key="ind1">
				<div class="each-container">
					<div class="title1-row">
						<p class="day-text">{{ list.noticeTitle }}</p>
					</div>
					<div class="content-row1">
						<div class="contentcss" v-html="list.noticeContent"></div>
					</div>
					<div class="content-row">
						<p class="date-left">{{ list.currencyMoney }}</p>
						<div class="date-right">
							<p class="circlecss"></p>
							<span class="time">{{ list.createTime }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup name="Notifications">
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import arrow from '@/assets/images/user/arrow.png'
import { userStore } from '@/store'
import { fetchNoticeList } from '@/apiService'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/useLoading.js'
import { showToast } from 'vant'

// 初始化仓库
const store = userStore()
const { t } = useI18n()

// 变量区
const router = useRouter()
const route = useRoute()
const loading = useLoading()
const state = ref('')
const noticeData = ref([])

// 代码区
const onClickLeft = () => {
	history.back()
	store.SET_PATH_DATA('yes')
}
const getNoticeList = async () => {
	try {
		loading.loading()
		const response = await fetchNoticeList()
		loading.clearLoading()
		noticeData.value = response.data
		console.log('Notice List ', inviteCode.value)
	} catch (err) {
		console.log(err)
	}
}

onMounted(() => {
	getNoticeList()
})

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
