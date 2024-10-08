import { onUnmounted, ref } from 'vue'

/**
 * 接口轮询
 * @param fetchApi 轮询方法
 * @param loopCall 轮询成功回调
 * @param interval 轮询间隔，默认 5000
 * @param needImmediatelyExecute 是否立即执行。默认否
 * @param errorLoop 轮询出错后，是否继续轮询，默认是
 * @returns {{runLoopTimer: runLoopTimer, clearLoopTimer: clearLoopTimer, loopTimer: [null] extends [Ref] ? IfAny<null, Ref<null>, null> : Ref<UnwrapRef<null>, UnwrapRef<null> | null>}}
 */
export const useLoopFetchApi = ({ fetchApi, loopCall, interval = 5000, needImmediatelyExecute = false, needErrorLoop = true }) => {
	const loopTimer = ref(null)

	const baseFetch = () => {
		return new Promise((resolve, reject) => {
			fetchApi()
				.then((value) => {
					console.log('useLoopFetchApi', value)
					loopCall && loopCall(value)
					resolve()
				})
				.catch((e) => {
					reject(e)
				})
		})
	}
	const runLoopTimer = () => {
		clearLoopTimer()
		console.log('=======useLoopApi=======runLoopTimer')
		loopTimer.value = setTimeout(() => {
			baseFetch()
				.then(() => {
					runLoopTimer()
				})
				.catch((error) => {
					console.log('=======useLoopApi=======runLoopTimer Error', error)
					if (needErrorLoop) {
						runLoopTimer()
					} else {
						clearLoopTimer()
					}
				})
		}, interval)
	}

	const clearLoopTimer = () => {
		loopTimer.value && clearTimeout(loopTimer.value)
		console.log('=======useLoopApi=======clearLoopTimer')
	}

	onUnmounted(() => {
		clearLoopTimer()
	})

	if (needImmediatelyExecute) {
		baseFetch()
	}

	return {
		loopTimer,
		runLoopTimer,
		clearLoopTimer,
	}
}
