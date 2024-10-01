// i18n
import { createI18n } from 'vue-i18n'
import en from './modules/en'
import japan from './modules/Japan.js'
import viet from './modules/viet.js'
import indy from './modules/indy.js'
import arabic from './modules/arabic.js'
import indonesian from './modules/indonesian.js'
import korean from './modules/Korean.js'
import melayu from './modules/melayu.js'
import deutsch from './modules/deutsch.js'
import tai from './modules/tai.js'
import portugues from './modules/portugues.js'
import french from './modules/french.js'
import russian from './modules/russian.js'
import spain from './modules/spain.js'
import zhcn from './modules/zh_CN.js'
import zh from './modules/zh.js'
import italian from './modules/italian.js'

const messages = {
	'English': {
		...en,
	},
	'日本语': {
		...japan,
	},
	// Tiếng Việt 越南语
	'Tiếng Việt': {
		...viet,
	},
	// हिन्दी 阿拉伯语
	'العربية': {
		...arabic,
	},
	// हिन्दी 印地语
	'印地语': {
		...indy,
	},
	// Indonesian 印度尼西亚
	'Indonesian': {
		...indonesian,
	},
	// 한국어 韩国语
	'한국인': {
		...korean,
	},
	// Melayu 马来语
	'Melayu': {
		...melayu,
	},
	// Deutsch 德语
	'Deutsch': {
		...deutsch,
	},
	// ภาษาไทย 泰语
	'ภาษาไทย': {
		...tai,
	},
	// Português 葡萄牙语
	'Protuguês': {
		...portugues,
	},
	// Français 法语
	'Français': {
		...french,
	},
	// Русский язык 俄语
	'Русский': {
		...russian,
	},
	// Español 西班牙语
	'Español': {
		...spain,
	},
	'简体中文': {
		...zhcn,
	},
	'繁体中文': {
		...zh,
	},
	// Italian 意大利语
	'Italian': {
		...italian,
	},
}

const i18n = createI18n({
	warnHtmlMessage: false,
	legacy: false,
	locale: getDefaultLanguage().language, // 首先从缓存里拿，没有的话就用浏览器语言，
	fallbackLocale: 'English', // 设置备用语言
	messages,
	missingWarn: false, // 这四个是key未找到或者翻译出问题warn配置
	silentTranslationWarn: true, // 只是为了dev时控制台清静些，prod默认移除的
	silentFallbackWarn: true,
	fallbackWarn: false,
})

export function getDefaultLanguage() {
	let language = 'English',
		languageCode = 'en',
		localUser = localStorage.getItem('user')
	try {
		if (localUser) {
			localUser = JSON.parse(localUser)
			language = localUser.language
			languageCode = localUser.languageCode
		}
	} catch (e) {
		console.log(e)
	}
	return {
		language,
		languageCode,
	}
}

export default i18n
