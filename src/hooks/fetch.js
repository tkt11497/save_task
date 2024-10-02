import { ref, unref } from 'vue'

import apiClient from '@/apiService.js'

export function useRequest({ url, params, method, initialValues, manual, formatResult, onSuccess, onErr }) {
	// 响应数据
	const response = ref(initialValues),
		// 加载状态
		loading = ref(false)

	/**
	 * @function run
	 * @description 手动触发请求函数
	 * @param [runParams] {any} 请求时携带的参数
	 * @return Promise<void>
	 * */
	const run = async (runParams) => {
		if (!loading.value) {
			loading.value = true

			// 判断实际请求的参数
			const actualParams = runParams ?? unref(params)
			try {
				const res = await apiClient({
					url,
					params: actualParams,
					method,
				})

				response.value = formatResult ? formatResult(res.data.data) : res.data.data
				onSuccess?.(response.value, actualParams)
			} catch (e) {
				onErr?.(e)
			} finally {
				loading.value = false
			}
		}
	}

	if (!manual) run()

	return {
		loading,
		response,
		run,
		onRefresh: async () => await run(),
	}
}
