import { ref } from 'vue'
import { fetchCountryListApi } from '@/apis/common.js'

export function useCountry() {
	const countryList = ref([])

	fetchCountryListApi().then((res) => {
		if (res.data) {
			countryList.value = res.data
		}
	})

	return {
		countryList,
	}
}
