<template>
	<div class="support_container custom-page">
		<div>
			<van-nav-bar :fixed="true" :title="t('支持')" @click-left="onClickLeft">
				<template #left>
					<van-icon :name="arrow" size="18" />
				</template>
			</van-nav-bar>
		</div>
		<!-- <div class="header">
      <div class="top">
        <div class="left">
          <img src="../../../assets/images/user/left.png" alt="left">
        </div>
        <div class="right" @click="handleClick">
          <img src="../../../assets/images/user/right.png" alt="right">
        </div>
      </div>
      <div class="title">
        {{ t('请留言，我会稍后回复！') }} <br />
        <span>{{ t('在线') }}</span>
      </div>
    </div>
    <div class="content">
      <div class="info_data">
        <div class="img">
          <img src="../../../assets/images/user/actor.png" alt="actor">
        </div>
        <div class="info_box">
          <div class="title">savinf.clue</div>
          <div class="contant">{{ t('你好！需要帮助吗？请在这里联系我们，我们会尽快回复您！') }}</div>
        </div>
      </div>

    </div>
    <div class="send">
      <van-cell-group inset>
        <van-field v-model="value" placeholder="Replay here..." />
      </van-cell-group>
      <div class="link_icon">
        <img :src="link" alt="link">
      </div>
      <div class="send_icon">
        <img :src="send" alt="send">
      </div>
    </div> -->
		<iframe class="kefu-box" :src="supportLink" frameborder="0"></iframe>
	</div>
</template>

<script setup name="Support">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userStore } from '@/store'
import { useI18n } from 'vue-i18n'
import arrow from '@/assets/images/user/arrow.png'
import { fetchPolicyLinkApi } from '@/apis/user.js'

// 初始化仓库
const store = userStore()
const { t } = useI18n()
// 变量区
const router = useRouter()
const route = useRoute()
const value = ref('')

// 代码区
// 点击关闭
const onClickLeft = () => {
	history.back()
	store.SET_PATH_DATA('yes')
}

const supportLink = ref('')
const getLink = async () => {
	try {
		const res = await fetchPolicyLinkApi()
		supportLink.value = res.data
	} catch (e) {
		router.replace('/user')
		console.log('获取支持链接错误', e)
	}
}

getLink()
onMounted(() => {
	store.SET_PATH_DATA('no')
})
onUnmounted(() => {
	store.SET_PATH_DATA('yes')
})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.support_container {
	width: 100%;
	height: 100%;

	.header {
		width: 100%;
		height: 226px;
		background: url('../../../assets/images/user/back.png') no-repeat;
		background-size: 100% 100%;
		padding: 20px;

		.top {
			display: flex;
			justify-content: space-between;

			.left {
				width: 62px;
				height: 62px;

				img {
					width: 100%;
					height: 100%;
				}
			}

			.right {
				width: 62px;
				height: 62px;

				img {
					width: 100%;
					height: 100%;
				}
			}
		}

		.title {
			font-size: 30px;
			font-weight: 700;
			color: #000;
			margin-top: 20px;

			span {
				color: #dcdcdc;
			}
		}
	}

	.content {
		position: absolute;
		top: 195px;
		left: 50%;
		transform: translateX(-50%);
		width: 95%;
		border-radius: 10px;
		height: 1050px;
		background: url('../../../assets/images/user/bg.png') no-repeat;
		background-size: 100% 100%;

		.info_data {
			.img {
				width: 20px;
				height: 32px;
				position: absolute;
				left: 30px;
				top: 60px;

				img {
					width: 100%;
					height: 100%;
				}
			}

			.info_box {
				margin-top: 30px;

				.title {
					font-size: 25px;
					color: #999;
					margin-left: 70px;
				}

				.contant {
					width: 80%;
					padding: 20px;
					font-size: 30px;
					background: #f1f1f1;
					margin-left: 70px;
					border-radius: 20px;
				}
			}
		}
	}

	.send {
		position: absolute;
		bottom: 0px;
		width: 100%;

		.link_icon,
		.send_icon {
			width: 51px;
			height: 51px;
			position: absolute;

			img {
				width: 70%;
				height: 70%;
			}
		}

		.link_icon {
			right: 120px;
			top: 0px;

			img {
				width: 80%;
				height: 80%;
			}
		}

		.send_icon {
			right: 40px;
			top: 0px;
		}
	}

	.van-cell {
		padding: 8px;
	}

	.van-cell-group--inset {
		margin: 0px;
		border-radius: 0px;
	}

	.kefu-box {
		width: 100%;
		height: 100%;
	}
}
</style>
