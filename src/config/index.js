const ENV_PRO = window.location.host

let base_url = '',
	image_url = '',
	ws_url = ''

base_url = import.meta.env.VITE_API_URL
image_url = import.meta.env.VITE_API_IMAGE_URL
if (import.meta.env.DEV) {
	ws_url = 'ws://' + import.meta.env.VITE_SOCKET_URL
} else {
	// ws_url = `wss://${ENV_PRO}${import.meta.env.VITE_SOCKET_URL}`
	ws_url = 'ws://' + import.meta.env.VITE_SOCKET_URL
}

export const BASE_URL = base_url
export const WS_URL = ws_url
export const IMAGE_URL = image_url
