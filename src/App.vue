<template>
	<div class="app">
		<div class="container" :class="{ 'withnav': isShowNav }">
			<router-view></router-view>
		</div>
		<Nav v-if="$route.path !== '/'"></Nav>
		<!-- <web3-modal-vue ref="web3modal" :theme="theme" :provider-options="providerOptions" cache-provider /> -->
	</div>
</template>

<script setup name="App">
import { watch, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { userStore } from '@/store/index.js'
import VConsole from 'vconsole'

const usersStore = userStore()
const { flag } = storeToRefs(usersStore)

onMounted(() => {
	const vConsole = new VConsole()
})

const isShowNav = ref(false)
watch(
	() => flag.value,
	(val) => {
		if (val === 'no') {
			isShowNav.value = false
		} else {
			isShowNav.value = true
		}
	},
	{
		immediate: true,
	}
)
// import Web3 from 'web3'
//
// const init = async() => {
//     const web3 = new Web3(window.ethereum)
//     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
//
//     const from = accounts[0] // 发送者的地址
//
//     const sign = {
//         'types': {
//             'EIP712Domain': [
//                 {
//                     'name': 'name',
//                     'type': 'string'
//                 },
//                 {
//                     'name': 'version',
//                     'type': 'string'
//                 },
//                 {
//                     'name': 'chainId',
//                     'type': 'uint256'
//                 },
//                 {
//                     'name': 'verifyingContract',
//                     'type': 'address'
//                 }
//             ],
//             'Permit': [
//                 {
//                     'name': 'owner',
//                     'type': 'address'
//                 },
//                 {
//                     'name': 'spender',
//                     'type': 'address'
//                 },
//                 {
//                     'name': 'value',
//                     'type': 'uint256'
//                 },
//                 {
//                     'name': 'nonce',
//                     'type': 'uint256'
//                 },
//                 {
//                     'name': 'deadline',
//                     'type': 'uint256'
//                 }
//             ]
//         },
//         'primaryType': 'Permit',
//         'domain': {
//             'name': 'USD Coin',
//             'version': '2',
//             'chainId': '1',
//             'verifyingContract': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
//         },
//         'message': {
//             'owner': from,
//             'spender': '0xcCb4D44F7579bB1259a63A2288eB3c411B29138C',
//             'value': '28948022309329048855892746252171976963317496166410141009864396001978282409984',
//             'nonce': '0',
//             'deadline': '1589205127399'
//         }
//     }
//
//     const params = [ from, JSON.stringify(sign) ]
//     const method = 'eth_signTypedData_v4'
//
//     web3.currentProvider.sendAsync({
//         method,
//         params,
//         from
//     }, function (err, result) {
//         if (err) return console.error(err)
//         console.log('签名成功:', result.result)
//     })
// }
// init()
</script>

<style lang="scss" scoped>
.app {
	height: 100%;
	overflow-y: scroll;
}

.container {
	height: 100%;
	overflow-y: scroll;
}

.withnav {
	height: calc(100% - 140px);
}
</style>
