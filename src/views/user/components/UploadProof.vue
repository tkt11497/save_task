<template>
	<div class="uploadProof_container">
		<div>
			<van-nav-bar :fixed="false" :title="t('上传证明')" @click-left="onClickLeft">
				<template #left>
					<van-icon :name="arrow" size="18" />
				</template>
			</van-nav-bar>
		</div>
		<div class="van-upload">
			<van-uploader :after-read="afterRead">
				<div class="uploader-box">
					<div class="photo-img">
						<van-icon name="photo-o" size="40" v-if="!proofUrl" />
						<img :src="proofUrl" />
					</div>
					<div class="title">
						{{ t('选择图片') }} <span>{{ t('预览') }}</span>
					</div>
					<div class="text">{{ t('支持的格式') }}: JPG, JPEG2000, PNG</div>
				</div>
			</van-uploader>
		</div>
		<div class="title-box">{{ t('金额') }}:</div>

		<div class="input-box">
			<van-field clearable type="number" v-model.number="amount" :placeholder="t('输入存款金额...')">
				<template #right-icon>
					{{ currency }}
				</template>
			</van-field>
		</div>
		<div class="title-box">{{ t('交易哈希') }}:</div>
		<div class="input-box">
			<van-field clearable type="text" v-model="hashCode" maxlength="6" :placeholder="t('最后6位数字...')"> </van-field>
		</div>
		<div class="content">
			{{ t('请上传您的加密货币支付截图，并在提交后等待验证。') }}
		</div>
		<div class="Borrow">
			<van-button type="primary" @click="addRecharge">{{ t('继续') }}</van-button>
		</div>
	</div>
</template>

<script setup name="Faq">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userStore } from '@/store'
import arrow from '@/assets/images/market/back.svg'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/useLoading.js'
import { uploadFileApi } from '@/apis/common.js'
import { walletRechargeApi } from '@/apis/wallet.js'
// 初始化仓库
const store = userStore()
const { t } = useI18n()
const loading = useLoading()
// 变量区
const router = useRouter()
const route = useRoute()

const amount = ref()
const hashCode = ref()
const proofUrl = ref('')

const currency = ref('')
const protocolId = ref('')

currency.value = store.rechargeData.currency
protocolId.value = store.rechargeData.protocolId

// 代码区
const onClickLeft = () => {
	history.back()
	store.SET_PATH_DATA('yes')
}
const afterRead = (file) => {
	uploadImgPhoto(file)
}
const uploadImgPhoto = async (file) => {
	try {
		let formData = new FormData()
		formData.append('file', file.file)
		loading.loading()
		const response = await uploadFileApi(formData) // Fetch data from API
		loading.clearLoading()
		if (response) {
			proofUrl.value = response.data
		} else {
			showToast({
				message: t('上传失败'),
				icon: 'info',
			})
		}
	} catch (err) {
		console.log(err)
	}
}
const addRecharge = async () => {
	if (!proofUrl.value) {
		showToast({
			message: t('请上传充值图片'),
			icon: 'info',
		})
		return
	}
	if (!amount.value) {
		showToast({
			message: t('请输入充值金额'),
			icon: 'info',
		})
		return
	}
	if (!parseFloat(amount.value)) {
		showToast({
			message: t('请输入有效的充值金额'),
			icon: 'info',
		})
		return
	}
	if (!hashCode.value) {
		showToast({
			message: t('请输入哈希值的最后6位数字'),
			icon: 'info',
		})
		return
	}
	try {
		let dataInfo = {
			rechargeAmount: parseFloat(amount.value),
			rechargeToken: currency.value,
			rechargeTxHash: hashCode.value,
			targetAddress: store.rechargeData.targetAddress,
			rechargePicUrl: proofUrl.value,
		}

		loading.loading()
		await walletRechargeApi(dataInfo) // Fetch data from API
		loading.clearLoading()

		showToast({
			message: t('申请成功'),
			icon: 'info',
			onClose: () => {
				router.go(-1)
			},
		})
	} catch (err) {
		// Handle errors
		console.log(err)
	}
}

onMounted(() => {})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.uploadProof_container {
	font-size: 30px;
	background: #fff;
	height: 100vh;
	position: relative;
	padding-bottom: 100px;

	:deep .van-uploader__input-wrapper {
		width: 100%;
	}

	.title-box {
		color: #b8b8b8;
		font-size: 28px;
		margin: 0 60px;
		margin-top: 40px;
	}

	.van-upload {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 40px;

		.uploader-box {
			text-align: center;
			border: 2px dashed #82a9f9;
			height: 170px;
			width: 300px;
			border-radius: 20px;

			.photo-img {
				margin-top: 20px;

				img {
					width: 50px;
				}
			}

			.title {
				font-weight: 600;
				margin-top: 20px;

				span {
					color: #4d4fff;
					font-weight: 600;
				}
			}

			.text {
				font-size: 12px;
			}
		}
	}

	.content {
		margin: 0 60px;
		margin-top: 40px;
		font-size: 28px;
	}

	.input-box {
		background: #f9fafb;
		border-radius: 20px;
		position: relative;
		margin: 20px 60px 0 60px;

		.menu-box {
			position: absolute;
			width: 100%;
			height: 100%;
			opacity: 1;
			top: 0;
			left: 0;
			z-index: 2;

			:deep .van-dropdown-menu__bar {
				opacity: 0;
			}
		}

		:deep .van-field {
			background: #f9fafb;

			.van-field__right-icon {
				color: #000;
			}

			.van-field__left-icon {
				margin-right: 10px;
			}
		}

		.usdc-icon {
			width: 45px;
			height: 45px;
		}
	}

	.Borrow {
		margin: 0 40px;
		margin-top: 40px;

		:deep .van-button--normal {
			width: 100%;
			border-radius: 30px;
			height: 60px;
			background: #82a8f9;
		}
	}
}
</style>
