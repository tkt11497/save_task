import { WS_URL } from '@/config'

export default class Socket {
	constructor(url) {
		// websocket实例
		this.websocket = null
		// 通讯地址
		this.ws_url = WS_URL + url
		// 开启
		this.socket_open = false
		// 心跳time对象
		this.heartbeat_timer = null
		// 心跳time对象 频率
		this.heartbeat_interval = 5000
		// 是否重连
		this.is_reconnect = true
		// 重连次数
		this.reconnect_count = 3
		// 已发起重连次数
		this.reconnect_current = 1
		// 重连time对象
		this.reconnect_timer = null
		// 重连time对象 频率
		this.reconnect_interval = 3000
	}
	/**
	 *
	 * @returns 初始化连接
	 */
	init() {
		if (!('WebSocket' in window)) {
			console.log('浏览器不支持WebSocket')
			return null
		}

		if (this.websocket) {
			return this.websocket
		}

		this.websocket = new WebSocket(this.ws_url)

		// 连接成功
		this.websocket.open = () => {
			console.log('连接成功--- open')
			this.socket_open = true
			this.is_reconnect = true
			this.reconnect_current = 1

			this.heartbeat()
		}

		this.websocket.onmessage = (e) => {
			this.receive(e)
		}

		// 关闭连接
		this.websocket.onclose = (e) => {
			console.log('连接已断开--- onclose', e.code)
			clearInterval(this.heartbeat_interval)
			this.socket_open = false
			// 需要重连
			if (this.is_reconnect) {
				this.reconnect_timer = setTimeout(() => {
					if (this.reconnect_current > this.reconnect_count) {
						clearTimeout(this.reconnect_timer)
						return
					}

					this.reconnect_current++
					this.reconnect()
				}, this.reconnect_interval)
			}
		}

		// 连接发生错误
		this.websocket.onerror = () => {
			console.log('websocket连接发生错误--- onerror')
		}
	}
	/**
	 * 发送消息
	 * @param {*} data
	 * @param {*} callback
	 */
	send(data, callback = null) {
		// 开启状态直接发送
		if (this.websocket.readyState === this.websocket.OPEN) {
			this.websocket.send(JSON.stringify(data))

			if (callback) {
				callback()
			}
			// 正在开启状态，则等待1s后重新调用
		} else if (this.websocket.readyState === this.websocket.CONNECTING) {
			setTimeout(() => {
				this.send(data, callback)
			}, 1000)
			// 未开启，则等待1s后重新调用
		} else {
			this.init()
			setTimeout(() => {
				this.send(data, callback)
			}, 1000)
		}
	}
	/**
	 * 接受消息
	 * @param {*} message
	 * @returns
	 */
	receive(message) {
		const params = message.data
		console.log('收到服务端内容----receive', params, typeof params)
		if (params === undefined) {
			console.log('收到服务端内容为空', params)
			return false
		}
	}
	/**
	 * 心跳
	 */
	heartbeat() {
		console.log('心跳--- heartbeat')
		if (this.heartbeat_timer) {
			clearInterval(this.heartbeat_timer)
		}

		this.heartbeat_timer = setInterval(() => {
			const token = ''
			const data = {
				data: '',
				token,
			}
			this.send(data)
		}, this.heartbeat_interval)
	}
	/**
	 * 主动关闭连接
	 */
	close() {
		console.log('主动断开连接--- close')
		clearInterval(this.heartbeat_timer)
		this.is_reconnect = false
		this.websocket.close()
	}
	/**
	 * 主动重连
	 */
	reconnect() {
		console.log('发起重新连接--- reconnect', this.reconnect_current)
		if (this.websocket && this.socket_open) {
			this.websocket.close()
		}
		this.init()
	}
}
