import { storeToRefs } from 'pinia'
import { onBeforeUnmount } from 'vue'
import { showLoadingToast, closeToast } from 'vant'
import { loadingStore as useLoadingStore } from '@/store'

export default function () {
	const loadingStore = useLoadingStore()

	// 记录请求或loading次数
	const { loadingCount } = storeToRefs(loadingStore)

	// 加载loading
	const loading = () => {
		loadingStore.addCount()

		showLoadingToast({
			className: 'custom-page-loading',
			duration: 0,
			loadingType: 'spinner',
			position: 'bottom', // 位置
			wordBreak: 'break-word', // 文字换行方式
			// icon: '',
			overlay: false, // 遮罩
			forbidClick: false, // 禁止背景点击
		})
	}

	// 清楚loading
	const clearLoading = () => {
		loadingStore.subtractCount()
		if (loadingCount.value <= 0) {
			closeToast()
		}
	}

	onBeforeUnmount(() => {
		loadingStore.clearCount()
		closeToast()
	})

	return {
		loading,
		clearLoading,
	}
}
