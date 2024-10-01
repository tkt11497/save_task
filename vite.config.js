import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import postCssPxToRem from 'postcss-pxtorem'
import nodePolyfills from 'vite-plugin-node-stdlib-browser'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		nodePolyfills(),
		vue(),
		Components({
			dts: false,
			// 原因：Toast Confirm 这类组件的样式还是需要单独引入，样式全局引入了，关闭自动引入
			resolvers: [VantResolver({ importStyle: false })],
		}),
	],
	define: {
		// 'process.env':{},
		// "global": "globalThis",
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	server: {
		port: 8080, //端口号
		host: true, //ip地址 或 '0.0.0.0' 或 "loaclhost"
		open: true, //启动后是否自动打开浏览器
		proxy: {
			// '/api': {
			//     target: 'https://cs.service5.online',
			//     changeOrigin: true
			// },
			'/api': {
				target: 'http://18.141.68.65:8081/steal-api',
				changeOrigin: true,
				// rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
	css: {
		postcss: {
			plugins: [
				postCssPxToRem({
					unitToConvert: 'px', // 要转化的单位
					viewportWidth: 750, // UI设计稿的宽度
					rootValue: 75,
					propList: ['*'],
					// 过滤掉vant
					selectorBlackList: ['.van'],
					exclude: '/node_modules',
				}),
			],
		},
	},
})
