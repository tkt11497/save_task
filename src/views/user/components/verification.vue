<template>
	<div class="faq_container custom-page full-page">
		<div class="wrapper" :class="{ 'wrapper1': stepPage !== 'home' }">
			<van-nav-bar :fixed="true" :title="t('验证')" @click-left="onClickLeft">
				<template #left>
					<van-icon :name="arrow" size="18" />
				</template>
			</van-nav-bar>
			<div class="content" v-if="stepPage === 'home'">
				<h2 class="tips">{{ t('进行用户身份验证，享受专属增值服务！') }}</h2>
				<van-form @submit="continueHandle" @failed="onFormFailed" :show-error-message="false" validate-first>
					<van-cell-group inset>
						<van-field
							v-model="form.firstName"
							label=""
							:placeholder="t('名字')"
							name="firstName"
							maxlength="20"
							:rules="[{ required: true, message: t('不能为空', { name: t('名字') }) }]"
						/>
						<van-field
							v-model="form.lastName"
							label=""
							:placeholder="t('姓氏')"
							maxlength="20"
							name="lastName"
							:rules="[{ required: true, message: t('不能为空', { name: t('姓氏') }) }]"
						/>
						<van-field
							v-model="form.sex"
							label=""
							:placeholder="t('男/女')"
							v-show="false"
							name="sex"
							:rules="[{ required: true, message: t('不能为空', { name: t('男/女') }) }]"
						/>
						<van-cell value="" is-link>
							<van-dropdown-menu ref="menuRef" :overlay="false" :class="{ empty: !form.sex }">
								<van-dropdown-item :title="genderText" ref="itemRef">
									<div class="item" @click="genderHandle(item)" v-for="item in genderOptions" :key="item.key">
										{{ item.name }}
									</div>
								</van-dropdown-item>
							</van-dropdown-menu>
						</van-cell>
						<van-field
							v-model="form.birthday"
							label=""
							readonly
							name="birthday"
							:rules="[{ required: true, message: t('不能为空', { name: t('出生日期') }) }]"
						>
							<template #input>
								<el-date-picker
									class="date-picker-input"
									v-model="form.birthday"
									type="date"
									:placeholder="t('出生日期')"
									default-value=""
									:disabled-date="disabledDate"
									:clearable="false"
									value-format="YYYY-MM-DD"
								/>
							</template>
						</van-field>

						<van-field
							v-model="form.country"
							label=""
							:placeholder="t('国家')"
							v-show="false"
							name="country"
							:rules="[{ required: true, message: t('不能为空', { name: t('国家') }) }]"
						/>
						<van-cell value="" is-link>
							<van-dropdown-menu ref="menuRef3" :overlay="false" :class="{ empty: !form.country }">
								<van-dropdown-item :title="form.country || countryText" ref="itemRef3">
									<div class="item" @click="countryHandle(item)" v-for="item in countryList" :key="item.id">
										{{ item.countryName }}
									</div>
								</van-dropdown-item>
							</van-dropdown-menu>
						</van-cell>
						<van-field
							v-model="form.address"
							label=""
							:placeholder="t('地址')"
							name="address"
							:rules="[{ required: true, message: t('不能为空', { name: t('地址') }) }]"
						/>
						<van-field
							class="phone-block"
							v-model="form.phone"
							type="tel"
							label=""
							:placeholder="t('电话号码')"
							maxlength="20"
							name="phone"
							:rules="[{ required: true, message: t('不能为空', { name: t('电话号码') }) }]"
						>
							<template #label>
								<div class="dial-block" @click.stop="showPhoneList">
									<span class="num">{{ form.areaCode ? `+${form.areaCode}` : '' }}</span>
									<van-icon name="arrow-down" />
									<van-divider vertical />
									<van-dropdown-menu ref="menuRef4" :overlay="false" :class="{ empty: !form.phone }">
										<van-dropdown-item ref="itemRef4">
											<div class="item" @click="phoneHandle(item)" v-for="item in countryList" :key="item.id">
												{{ item.countryName }} +{{ item.phoneCode }}
											</div>
										</van-dropdown-item>
									</van-dropdown-menu>
								</div>
							</template>
						</van-field>

						<van-field
							v-model="form.certificateType"
							label=""
							:placeholder="t('文档')"
							v-show="false"
							name="certificateType"
							:rules="[{ required: true, message: t('不能为空', { name: t('文档') }) }]"
						/>
						<van-cell value="" is-link>
							<van-dropdown-menu ref="menuRef5" :overlay="false" :class="{ empty: !form.certificateType }">
								<van-dropdown-item :title="certificateText" ref="itemRef5">
									<div class="item" @click="certificateHandle(item)" v-for="item in certificateTypeOptions" :key="item.id">
										{{ item.name }}
									</div>
								</van-dropdown-item>
							</van-dropdown-menu>
						</van-cell>
					</van-cell-group>

					<van-button plain type="primary" native-type="submit">{{ t('继续') }}</van-button>
				</van-form>
			</div>
			<div class="idcard-page" v-if="stepPage === 'idcard'">
				<div class="block1">
					<p class="p1">{{ t('身份证正面') }}</p>
					<p class="p2">{{ t('将身份证正面放入框中') }}</p>
					<div class="upload-block">
						<van-uploader :after-read="afterRead1" :before-read="beforeRead" :accept="ImgAccept">
							<div class="uploader-box">
								<div class="photo-img">
									<img v-if="!form.certificate" src="@/assets/images/user/upload.png" alt="" />
									<!-- <van-icon name="photo-o" size="50" color="#89A8E8" v-if="!certificate" /> -->
									<img v-else :src="$imgpath + form.certificate" />
								</div>
								<div class="des">
									<div class="title">
										{{ t('选择图片') }} <span>{{ t('预览') }}</span>
									</div>
									<div class="text">{{ t('支持的格式') }}: JPG, JPEG2000, PNG</div>
								</div>
							</div>
						</van-uploader>
					</div>
				</div>
				<div class="block1">
					<p class="p1">{{ t('身份证背面') }}</p>
					<p class="p2">{{ t('将身份证背面放入框中') }}</p>
					<div class="upload-block">
						<van-uploader :after-read="afterRead2" :before-read="beforeRead" :accept="ImgAccept">
							<div class="uploader-box">
								<div class="photo-img">
									<img v-if="!form.certificateBack" src="@/assets/images/user/upload.png" alt="" />
									<!-- <van-icon name="photo-o" size="50" color="#89A8E8" v-if="!form.certificateBack" /> -->
									<img v-else :src="$imgpath + form.certificateBack" />
								</div>
								<div class="des">
									<div class="title">
										{{ t('选择图片') }} <span>{{ t('预览') }}</span>
									</div>
									<div class="text">{{ t('支持的格式') }}: JPG, JPEG2000, PNG</div>
								</div>
							</div>
						</van-uploader>
					</div>
				</div>
				<van-action-bar>
					<van-button plain type="primary" @click="validateIdCartForm">{{ t('继续') }}</van-button>
				</van-action-bar>
			</div>
			<div class="idcard-page" v-if="stepPage === 'passport'">
				<div class="block1">
					<p class="p1">{{ t('护照') }}</p>
					<p class="p2">{{ t('将护照放入框中') }}</p>
					<div class="upload-block">
						<van-uploader :after-read="afterRead3" :before-read="beforeRead" :accept="ImgAccept">
							<div class="uploader-box">
								<div class="photo-img">
									<img v-if="!form.certificate" src="@/assets/images/user/upload.png" alt="" />
									<!-- <van-icon name="photo-o" size="50" color="#89A8E8" v-if="!form.idBackImg" /> -->
									<img v-else :src="$imgpath + form.certificate" />
								</div>
								<div class="des">
									<div class="title">
										{{ t('选择图片') }} <span>{{ t('预览') }}</span>
									</div>
									<div class="text">{{ t('支持的格式') }}: JPG, JPEG2000, PNG</div>
								</div>
							</div>
						</van-uploader>
					</div>
				</div>
				<van-action-bar>
					<van-button plain type="primary" @click="validatePassportForm()">{{ t('继续') }}</van-button>
				</van-action-bar>
			</div>
			<div class="takephoto-page" v-if="stepPage === 'takephoto'">
				<div class="block1">
					<p class="p1">{{ t('拍照') }}</p>
					<p class="p2">{{ t('请拍摄您的') }} {{ form.certificateType == 'PASSPORT' ? t('护照') : t('身份证') }}{{ t('在您的手上') }}</p>
					<div class="upload-block">
						<div class="photo-img">
							<img v-if="!form.holdingCertificate" src="@/assets/images/user/idcard.svg" alt="" />
							<!-- <van-icon name="photo-o" size="50" color="#89A8E8" v-if="!form.holdingCertificate" /> -->
							<img v-else :src="$imgpath + form.holdingCertificate" />
						</div>
						<div class="title">
							{{ t('请拍摄您的') }} <span>{{ form.certificateType == 'PASSPORT' ? t('护照') : t('身份证') }}</span> {{ t('在您的手上') }}
						</div>
						<van-uploader :after-read="afterRead4" :before-read="beforeRead" :accept="ImgAccept">
							<div class="btns">
								<van-button plain type="primary">{{ t('浏览') }}</van-button>
								<van-button plain type="primary">{{ t('启动相机') }}</van-button>
							</div>
						</van-uploader>
					</div>
				</div>
				<div class="block1">
					<p class="p1">{{ t('KYC指南') }}</p>
					<p class="p2">{{ t('请按照这些说明操作') }}</p>
					<div class="example">
						<img src="@/assets/images/user/example.png" alt="" />
					</div>
				</div>
				<van-action-bar>
					<van-button plain type="primary" @click="validateTakephotoForm()">{{ t('继续') }}</van-button>
				</van-action-bar>
			</div>

			<div class="success-page" v-if="stepPage === 'success'">
				<div class="block1">
					<img src="@/assets/images/user/check_circle.png" alt="" />
					<p class="p1">{{ t('提交成功！') }}</p>
					<p class="p2">
						{{ t('请耐心等待KYC验证的审核，我们将尽快完成审核。') }}
					</p>
					<van-button plain type="primary" @click="continueHandle()">{{ t('关闭') }}</van-button>
				</div>
			</div>
		</div>

		<!--		<van-calendar v-model:show="showCalendar" :max-date="maxDate" :min-date="minDate" :show-confirm="false" @confirm="confirmCalendar" />-->
	</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userStore } from '@/store'
import { showToast } from 'vant'
import { useCountry } from '@/hooks/useCountry.js'
import { useI18n } from 'vue-i18n'

import arrow from '@/assets/images/user/arrow.png'
import useLoading from '@/hooks/useLoading.js'
import { createUserKycApi } from '@/apis/user.js'
import { uploadFileApi } from '@/apis/common.js'
// 初始化仓库
const store = userStore()
const { t } = useI18n()
// 变量区
const router = useRouter()
const route = useRoute()
const loading = useLoading()
const { countryList } = useCountry()

const form = ref({
	firstName: '',
	lastName: '',
	sex: '',
	country: '',
	countryId: '',
	countryCode: '',
	birthday: '',
	address: '',
	phone: '',
	areaCode: '',
	certificateType: '',
	certificate: '',
	certificateBack: '',
	holdingCertificate: '',
})

const genderOptions = [
	{
		name: t('男'),
		key: '0',
	},
	{
		name: t('女'),
		key: '1',
	},
]
const menuRef = ref(null)
const genderText = ref(t('男/女'))
const genderHandle = (item) => {
	//   itemRef.value.toggle();
	// 或者
	form.value.sex = item.key
	genderText.value = item.name
	menuRef.value.close()
}
// 日期
const minDate = ref(new Date(1900, 0, 1))
const maxDate = ref(new Date())
const disabledDate = (time) => {
	return time.getTime() > maxDate.value || time.getTime() < minDate.value
}

// 国家
const certificateTypeOptions = [
	{
		name: t('身份证'),
		id: 'ID_CARD',
	},
	{
		name: t('护照'),
		id: 'PASSPORT',
	},
]
const menuRef3 = ref(null)
const countryText = ref(t('国家'))
const countryHandle = (item) => {
	//   itemRef.value.toggle();
	// 或者
	form.value.country = item.countryName
	form.value.countryCode = item.isoCode
	form.value.areaCode = item.phoneCode
	form.value.countryId = item.id
	menuRef3.value.close()
}
// 手机号
const menuRef4 = ref(null)
const itemRef4 = ref(null)
const phoneHandle = (item) => {
	form.value.country = item.countryName
	form.value.countryCode = item.isoCode
	form.value.areaCode = item.phoneCode
	form.value.countryId = item.id
}
const showPhoneList = () => {
	itemRef4.value.toggle()
}
// 证件照
const itemRef5 = ref(null)
const certificateText = ref(t('文档'))
const certificateHandle = (item) => {
	itemRef5.value.toggle()
	// 或者
	form.value.certificateType = item.id
	certificateText.value = item.name
	// itemRef5.value.close()
}
// 操作步骤
const stepPage = ref('home')
// home idcard passport takephoto success
const continueHandle = () => {
	switch (stepPage.value) {
		case 'home':
			stepPage.value = form.value.certificateType === 'ID_CARD' ? 'idcard' : 'passport'
			break
		case 'idcard':
			stepPage.value = 'takephoto'
			break
		case 'passport':
			stepPage.value = 'takephoto'
			break
		case 'takephoto':
			userKycRecordApply()

			break
		case 'success':
			stepPage.value = 'home'
			onClickLeft()
			break
		default:
			break
	}
}

// 基础信息表单验证
function onFormFailed(errorInfo) {
	showToast({
		message: errorInfo.errors[0].message,
		icon: 'info',
	})
}
// 身份证照片验证
function validateIdCartForm() {
	if (!form.value.certificate) {
		showToast({
			message: t('不能为空', { name: t('身份证正面') }),
			icon: 'info',
		})
	} else if (!form.value.certificateBack) {
		showToast({
			message: t('不能为空', { name: t('身份证背面') }),
			icon: 'info',
		})
	} else {
		continueHandle()
	}
}
// 护照照片验证
function validatePassportForm() {
	if (!form.value.certificate) {
		showToast({
			message: t('不能为空', { name: t('护照') }),
			icon: 'info',
		})
	} else {
		continueHandle()
	}
}
// 手持证件验证
function validateTakephotoForm() {
	if (!form.value.holdingCertificate) {
		showToast({
			message: t('不能为空', { name: t('拍照') }),
			icon: 'info',
		})
	} else {
		continueHandle()
	}
}

const ImgType = ['image/jpeg', 'image/png']
const ImgAccept = '.png,.jpg,.jpeg'
function beforeRead(file) {
	if (ImgType.indexOf(file.type) === -1) {
		showToast({
			message: t('请上传jpg、png、jpeg格式图片'),
			icon: 'info',
		})
		return false
	}
	return true
}
// idcard 上传
const afterRead1 = (file) => {
	uploadImgPhoto(file, 'certificate')
}
const afterRead2 = (file) => {
	uploadImgPhoto(file, 'certificateBack')
}
// passport上传
const afterRead3 = (file) => {
	uploadImgPhoto(file, 'certificate')
}
// takephoto上传
const afterRead4 = (file) => {
	uploadImgPhoto(file, 'holdingCertificate')
}
const uploadImgPhoto = async (file, key) => {
	let formdata = new FormData()
	formdata.append('file', file.file)
	try {
		loading.loading()
		const res = await uploadFileApi(formdata)
		loading.clearLoading()
		form.value[key] = res.data
	} catch (err) {
		console.log(err)
	}
}

// 提交
const userKycRecordApply = async () => {
	try {
		const formData = form.value
		const data = {
			address: formData.address,
			areaCode: formData.areaCode, // 电话号码区号
			brithday: formData.birthday,
			cardType: formData.certificateType === 'ID_CARD' ? 0 : 1,
			cardUrl1: formData.certificate,
			cardUrl2: formData.certificateBack,
			countryCode: formData.countryCode,
			firstName: formData.firstName,
			handCardUrl: formData.holdingCertificate,
			lastName: formData.lastName,
			phone: formData.phone,
			sex: formData.sex,
		}

		loading.loading()
		await createUserKycApi(data)
		loading.clearLoading()
		stepPage.value = 'success'
	} catch (error) {
		console.log(error)
	}
}

// 返回
const onClickLeft = () => {
	switch (stepPage.value) {
		case 'home':
			history.back()
			store.SET_PATH_DATA('yes')
			break
		case 'idcard':
			stepPage.value = 'home'
			break
		case 'passport':
			stepPage.value = 'home'
			break
		case 'takephoto':
			stepPage.value = form.value.certificateType === 'ID_CARD' ? 'idcard' : 'passport'
			break
		case 'success':
			stepPage.value = 'takephoto'
			break
		default:
			history.back()
			store.SET_PATH_DATA('yes')
			break
	}
}

onMounted(() => {})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.faq_container {
	//height: 100%;
	box-sizing: border-box;

	.wrapper {
		//height: 100%;
		padding: 20px 48px 0;
	}

	.wrapper1 {
		background: #fff;
	}
	:deep(.van-nav-bar__title) {
		font-size: 20px;
	}
	.content {
		background: #fff;
		//border-radius: 32px;
		//padding: 40px;
		//overflow: hidden;

		.tips {
			font-size: 32px;
			font-weight: 400;
			line-height: 30px;
			color: #999;
			margin-bottom: 46px;
		}

		:deep(.van-cell-group) {
			background: transparent;
			margin: 0;

			.van-cell {
				height: 55px;
				border-radius: 13px;
				background: #f8f9fb;
				margin-bottom: 15px;
				padding-left: 22px;
				padding-right: 22px;
				font-size: 14px;
				font-weight: 500;
				line-height: 16.94px;
				text-align: left;
				color: #000;

				.van-cell__value {
					display: flex;
					align-items: center;
				}

				.van-field__body {
					width: 100%;
				}

				.van-cell__right-icon {
					margin-top: 5px;
				}

				.van-dropdown-menu {
					width: 100%;

					.van-dropdown-menu__bar {
						background: transparent;
						box-shadow: none;

						.van-dropdown-menu__item {
							justify-content: flex-start;

							.van-dropdown-menu__title {
								color: #000;
								font-size: 14px;

								&::after {
									display: none;
								}
							}
						}
					}

					.van-dropdown-item {
						.van-dropdown-item__content {
							width: calc(100% - 48px);
							left: 24px;
							border-radius: 16px;
							box-shadow: 0.06rem 0.12rem 0.2rem #0000001a;

							.item {
								height: 50px;
								line-height: 50px;
								text-align: center;
								//padding-left: 20px;
								color: #000000d9;
								font-size: 16px;
								border-bottom: 0.01rem solid rgba(0, 0, 0, 0.07);
							}
						}
					}
				}

				.empty {
					.van-dropdown-menu__title {
						color: #cbcbcb !important;
					}
				}
			}

			.phone-block {
				.van-cell__title,
				.van-field__label {
					display: flex;
					align-items: center;
				}
				.dial-block {
					//height: 100%;
					display: flex;
					align-items: center;

					.num {
						min-width: 40px;
						margin-right: 19px;
						text-align: center;
					}

					.van-divider {
						height: 27px;
						border-color: #2b2b2b;
					}
				}

				.van-dropdown-menu {
					height: 0;
				}
			}
		}

		:deep(.el-date-editor) {
			width: 100%;
			.el-input__wrapper {
				padding: 0;
				box-shadow: none;
				background-color: transparent;
			}
			.el-input__prefix {
				display: none;
			}
		}

		.van-button {
			background: #82a9f9;
			border-radius: 25px;
			width: 100%;
			height: 53px;
			font-size: 16px;
			font-weight: 700;
			line-height: 16.94px;
			text-align: center;
			color: #fff;
			margin-top: 46px;
		}
	}

	.idcard-page {
		.block1 {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			height: 100%;
			justify-content: center;
			margin-bottom: 60px;

			.p1 {
				color: #21272f;
				font-size: 32px;
				font-weight: 600;
				margin-bottom: 16px;
			}

			.p2 {
				color: #3f3d3d;
				font-size: 24px;
				font-weight: 500;
			}
		}

		.van-cell {
			background-color: transparent;
			padding: 0;
		}
		:deep(.upload-block) {
			margin-top: 40px;
			border-radius: 20px;
			border: 2px dashed #646464;
			background: #d9e5fb;
			padding: 30px 30px 30px;
			width: 100%;
			display: flex;

			.uploader-box {
				display: flex;
				align-items: center;

				.photo-img {
					display: flex;
					align-items: center;
					margin-right: 14px;

					img {
						width: 100px;
						height: 100px;
					}
				}

				.title {
					font-weight: 600;
					color: #515151;
					font-size: 28px;

					span {
						color: #89a8e8;
						text-decoration: underline;
					}
				}

				.text {
					font-size: 20px;
					color: #515151;
					font-weight: 500;
				}
			}
		}

		.van-button {
			background: #82a9f9;
			border-radius: 25px;
			width: 100%;
			height: 53px;
			font-size: 14px;
			font-weight: 700;
			line-height: 16.94px;
			text-align: center;
			color: #fff;
			margin-top: 46px;
		}
	}

	.takephoto-page {
		.block1 {
			margin-bottom: 60px;

			.p1 {
				color: #21272f;
				font-size: 32px;
				font-weight: 600;
				margin-bottom: 16px;
			}

			.p2 {
				color: #797979;
				font-size: 24px;
				font-weight: 500;
			}

			.upload-block {
				padding: 48px 32px;
				margin-top: 56px;
				border-radius: 20px;
				border: 2px dashed #363636;
				background: #d9e5fb;
				display: flex;
				flex-direction: column;
				align-items: center;

				.photo-img {
					img {
						width: 128px;
					}
				}

				.title {
					margin-top: 40px;
					margin-bottom: 48px;
					font-weight: 600;
					color: #515151;
					font-size: 26px;

					span {
						color: #89a8e8;
					}
				}

				.btns {
					width: 100%;
					display: flex;
				}

				.van-button {
					background: #82a9f9;
					border-radius: 25px;
					height: 54px;
					font-size: 14px;
					flex: 1;
					font-weight: 700;
					line-height: 16.94px;
					text-align: center;
					color: #fff;
					margin-top: 24px;

					&:first-child {
						margin-right: 17px;
						background: transparent;
						color: #82a9f9;
					}
				}
			}

			.example {
				// border-radius: 30px;
				// border: 1px solid #000;
				// background: #fff;
				margin-top: 56px;

				img {
					width: 100%;
					max-height: 280px;
				}
			}
		}

		:deep(.van-uploader) {
			width: 100%;

			.van-uploader__input-wrapper {
				width: 100%;
			}
		}
		.upload-block .btns {
			width: 100%;
		}
		.van-button {
			background: #82a9f9;
			border-radius: 25px;
			width: 100%;
			height: 54px;
			font-size: 14px;
			font-weight: 700;
			line-height: 16.94px;
			text-align: center;
			color: #fff;
			margin-top: 46px;
		}
	}

	.success-page {
		padding: 0 48px 0;
		height: 100%;
		margin-top: 50%;

		img {
			width: 100px;
			margin-bottom: 40px;
		}

		.block1 {
			display: flex;
			flex-direction: column;
			align-items: center;
			height: 100%;
			justify-content: center;
		}

		.p1 {
			color: #000000;
			font-size: 40px;
			font-weight: bold;
			margin-bottom: 40px;
		}

		.p2 {
			color: #7a7979;
			font-size: 24px;
			font-weight: 600;
		}

		.van-button {
			background: #82a9f9;
			border-radius: 25px;
			width: 100%;
			height: 54px;
			font-size: 14px;
			font-weight: 700;
			line-height: 16.94px;
			text-align: center;
			color: #fff;
			margin-top: 40px;
		}
	}
}

.van-action-bar {
	padding: 0 25px;
	bottom: 44px;
}
</style>
