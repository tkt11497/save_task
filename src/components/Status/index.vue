<template>
	<div :class="['vt-status', status]">
		<img class="status-icon" :src="statusData.icon" alt="status" />
		<span class="status-text">{{ statusData.labelText ? statusData.labelText : t(`审核状态.${statusData.label}`) }}</span>
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { getImageUrl } from '@/utils/index.js'
import { computed, toRefs } from 'vue'

const STATUS = {
	success: {
		label: '成功',
		icon: getImageUrl('status/status-success.png'),
	},
	fail: {
		label: '失败',
		icon: getImageUrl('status/status-fail.png'),
	},
	process: {
		label: '审核中',
		icon: getImageUrl('status/status-progress.png'),
	},
	not: {
		label: '待审核',
		icon: getImageUrl('status/status-not.png'),
	},
}

const { t } = useI18n()

const props = defineProps({
	status: {
		type: String,
		default: 'success',
	},
	statusText: {
		type: String,
		default: '',
	},
})
const { status, statusText } = toRefs(props)

const statusData = computed(() => {
	const data = STATUS[status.value]
		? {
				...STATUS[status.value],
		  }
		: {}
	if (statusText.value) {
		data.labelText = statusText.value
	}
	return data
})

defineOptions({
	name: 'Status',
})
</script>

<style scoped lang="scss">
.vt-status {
	display: flex;
	align-items: center;
	padding: 8px 12px;
	border-radius: 8px;

	.status-icon {
		width: 32px;
		margin-right: 10px;
	}
	.status-text {
		font-size: 24px;
	}

	&.success {
		color: #165e3d;
		background-color: #edffea;
	}

	&.fail {
		color: #b83131;
		background-color: #ffeaea;
	}

	&.process {
		color: #b5850b;
		background-color: #fff6e9;
	}

	&.not {
		color: #3d42ad;
		background-color: #eaecff;
	}
}
</style>
