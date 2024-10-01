import { ref } from 'vue'
import { countryAllApi } from '@/apiService'
import { showToast } from 'vant'

export function useCountry() {
	const countryList = ref([
		{
			name: 'United States',
			id: 0,
			areaCode: '86',
		},
		{
			name: 'United States',
			id: 0,
			areaCode: '86',
		},
	])

	countryAllApi().then((res) => {
		countryList.value = res.data
	})

	return {
		countryList,
	}
}
