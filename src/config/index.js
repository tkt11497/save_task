const ENV_PRO = window.location.host

let base_url = ''
let ws_url = ''

if (import.meta.env.DEV) {
	base_url = import.meta.env.VITE_API_URL
	ws_url = 'wss://' + import.meta.env.VITE_SOCKET_URL + '/api'
} else {
	base_url = import.meta.env.VITE_API_URL + '/api'
	ws_url = `wss://${ENV_PRO}/api`
}
export const BASE_URL = base_url
export const WS_URL = ws_url
