import { useWeb3Store } from '@/store/index.js'
import { storeToRefs } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/noWallet',
			name: 'noWallet',
			component: () => import('@/views/noWallet/index.vue'),
		},
		{
			path: '/',
			name: 'homeIndex',
			component: () => import('@/views/home/index.vue'),
		},
		{
			path: '/home',
			name: 'home',
			component: () => import('@/views/home/index.vue'),
		},
		{
			path: '/market',
			name: 'Market',
			component: () => import('../views/market/index.vue'),
		},
		{
			path: '/earnInterest',
			name: 'EarnInterest',
			component: () => import('@/views/earnInterest/index.vue'),
		},
		// earnInterest子级页面
		{
			path: '/earn',
			name: 'Earn',
			component: () => import('@/views/earnInterest/components/earn.vue'),
		},
		{
			path: '/poofStake',
			name: 'PoofStake',
			component: () => import('../views/poofStake/index.vue'),
		},
		// poofStake子级页面
		{
			path: '/stake',
			name: 'Stake',
			component: () => import('../views/poofStake/components/stake.vue'),
		},
		{
			path: '/user',
			name: 'User',
			component: () => import('../views/user/index.vue'),
		},
		// 我的8个页面路由
		{
			path: '/notifications',
			name: 'Notifications',
			component: () => import('@/views/user/components/notifications.vue'),
		},
		{
			path: '/invite',
			name: 'Invite',
			component: () => import('../views/user/components/invite.vue'),
		},
		{
			path: '/support',
			name: 'Support',
			component: () => import('@/views/user/components/support.vue'),
		},
		{
			path: '/faq',
			name: 'Faq',
			component: () => import('../views/user/components/faq.vue'),
		},
		{
			path: '/policy',
			name: 'Policy',
			component: () => import('../views/user/components/policy.vue'),
		},
		{
			path: '/lang',
			name: 'Lang',
			component: () => import('../views/user/components/lang.vue'),
		},
		{
			path: '/wallet',
			name: 'Wallet',
			component: () => import('../views/user/components/wallet.vue'),
		},
		{
			path: '/loan',
			name: 'Loan',
			component: () => import('../views/user/loan/loan.vue'),
		},
		{
			path: '/loan-detail',
			name: 'LoanDetail',
			component: () => import('../views/user/loan/detail.vue'),
		},
		{
			path: '/loan-records',
			name: 'LoanRecords',
			component: () => import('@/views/user/loan/records.vue'),
		},
		{
			path: '/records',
			name: 'Records',
			component: () => import('../views/user/components/records.vue'),
		},
		{
			path: '/depositandwithdrawal',
			name: 'Depositandwithdrawal',
			component: () => import('../views/user/components/depositandwithdrawal.vue'),
		},
		{
			path: '/uploadProof',
			name: 'UploadProof',
			component: () => import('../views/user/components/UploadProof.vue'),
		},
		{
			path: '/verification',
			name: 'Verification',
			component: () => import('@/views/user/components/verification.vue'),
		},
		{
			path: '/smartcontract',
			name: 'smartContract',
			component: () => import('@/views/smartContract/index.vue'),
		},
		{
			path: '/score',
			name: 'Score',
			component: () => import('@/views/user/components/creditScore.vue'),
		},
		{
			path: "/:w+",
			name: "*",
			redirect: "/",
		},
	],
})

router.beforeEach((to, from, next) => {
	next()
})

export default router
