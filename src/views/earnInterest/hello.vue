<template>
	<van-dropdown-menu :overlay="false">
		<van-dropdown-item v-model="selectedDay" :options="formattedDaysList" :formatter="formatter" />
	</van-dropdown-menu>
</template>

<script>
export default {
	data() {
		return {
			selectedDay: null,
			daysList: [
				{ days: 1, minRate: 1, maxRate: 5 },
				{ days: 2, minRate: 6, maxRate: 10 },
				{ days: 3, minRate: 11, maxRate: 15 },
				// Add more items as needed
			],
		}
	},
	computed: {
		formattedDaysList() {
			return this.daysList.map((item, index) => ({
				text: `${item.days} ${this.$t('天')} ${item.minRate}-${item.maxRate}%`,
				value: index,
			}))
		},
	},
	methods: {
		formatter(option) {
			const item = this.daysList[option.value]
			return {
				leftText: `${item.days} ${this.$t('天')}`,
				rightText: `${item.minRate}-${item.maxRate}%`,
			}
		},
	},
}
</script>

<style>
/* Ensure to style the dropdown items correctly */
.van-dropdown-item .van-dropdown-item__text {
	display: flex;
	justify-content: space-between;
}

.van-dropdown-item .van-dropdown-item__text .left {
	text-align: left;
}

.van-dropdown-item .van-dropdown-item__text .right {
	text-align: right;
}
</style>
