import { ref } from 'vue'
import { fetchCountryListApi } from '@/apis/common.js'

export function useCountry() {
	const countryList = ref([
		// {
		// 	name: 'United States',
		// 	id: 0,
		// 	phoneCode: '1',
		// 	countryCode: '5',
		// },
		// {
		// 	name: 'Chinese',
		// 	id: 1,
		// 	phoneCode: '86',
		// 	countryCode: '9',
		// },
	])

	// todo 接口挂的
	fetchCountryListApi().then((res) => {
		if (res.data) {
			countryList.value = res.data
		}
	})

	return {
		countryList,
	}
}
