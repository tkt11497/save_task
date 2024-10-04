import { reactive, ref } from 'vue'

export default function (pageApi) {
	const pageData = reactive({
		pageSize: 20,
		pageNum: 0,
		total: 0,
	})
	const listError = ref(false)
	const listLoading = ref(false)
	const finished = ref(false)
	const refreshing = ref(false)
	const isEmptyList = ref(false)

	const dataList = ref([])
	const onLoad = async () => {
		try {
			isEmptyList.value = false

			if (refreshing.value) {
				refreshing.value = false
			}

			if (!pageData.pageNum) {
				dataList.value = []
				pageData.total = 0
				finished.value = false
			}

			const response = await fetchPageData({
				pageSize: pageData.pageSize,
				pageNum: pageData.pageNum + 1,
			})

			listError.value = false
			pageData.pageNum += 1
			pageData.total = response.count

			finished.value = dataList.value.length >= pageData.total
			if (!pageData.total) {
				isEmptyList.value = true
			}
		} catch (e) {
			listError.value = true
		} finally {
			listLoading.value = false
		}
	}

	const onRefresh = async () => {
		// 清空列表数据
		finished.value = false
		listLoading.value = true

		// 重新加载数据
		pageData.pageNum = 0
		await onLoad()
	}

	const fetchPageData = async () => {
		try {
			const res = await pageApi(pageData)
			dataList.value = dataList.value.concat(res.pageInfo || res.data || [])
			return res
		} catch (err) {
			console.log(err)
		}
	}

	return {
		listLoading,
		listError,
		finished,
		refreshing,
		isEmptyList,

		pageData,
		dataList,

		onRefresh,
		onLoad,
	}
}
