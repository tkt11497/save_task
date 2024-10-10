// i18n
import { createI18n } from 'vue-i18n'
import LANS from '@/i18n/lang.js'
//
// import en from './modules/en'
// import japan from './modules/japan.js'
// import viet from './modules/viet.js'
// import indy from './modules/indy.js'
// import arabic from './modules/arabic.js'
// import indonesian from './modules/indonesian.js'
// import korean from './modules/korean.js'
// import melayu from './modules/melayu.js'
// import deutsch from './modules/deutsch.js'
// import tai from './modules/tai.js'
// import portugues from './modules/portugues.js'
// import french from './modules/french.js'
// import russian from './modules/russian.js'
// import spain from './modules/spain.js'
// import zhcn from './modules/zh_CN.js'
// import zh from './modules/zh.js'
// import italian from './modules/italian.js'
//
//
// const messages = {
// 	'English': {
// 		...en,
// 	},
// 	'日本语': {
// 		...japan,
// 	},
// 	// Tiếng Việt 越南语
// 	'Tiếng Việt': {
// 		...viet,
// 	},
// 	// हिन्दी 阿拉伯语
// 	'العربية': {
// 		...arabic,
// 	},
// 	// हिंदी 印地语
// 	'हिंदी': {
// 		...indy,
// 	},
// 	// Indonesian 印度尼西亚
// 	'Indonesian': {
// 		...indonesian,
// 	},
// 	// 한국어 韩国语
// 	'한국인': {
// 		...korean,
// 	},
// 	// Melayu 马来语
// 	'Melayu': {
// 		...melayu,
// 	},
// 	// Deutsch 德语
// 	'Deutsch': {
// 		...deutsch,
// 	},
// 	// ภาษาไทย 泰语
// 	'ภาษาไทย': {
// 		...tai,
// 	},
// 	// Português 葡萄牙语
// 	'Protuguês': {
// 		...portugues,
// 	},
// 	// Français 法语
// 	'Français': {
// 		...french,
// 	},
// 	// Русский язык 俄语
// 	'Русский': {
// 		...russian,
// 	},
// 	// Español 西班牙语
// 	'Español': {
// 		...spain,
// 	},
// 	'简体中文': {
// 		...zhcn,
// 	},
// 	'繁体中文': {
// 		...zh,
// 	},
// 	// Italian 意大利语
// 	'Italian': {
// 		...italian,
// 	},
// }

const i18n = createI18n({
	warnHtmlMessage: false,
	legacy: false,
	locale: getDefaultLanguage().language, // 首先从缓存里拿，没有的话就用浏览器语言，
	fallbackLocale: 'en', // 设置备用语言
	// messages,
	missingWarn: false, // 这四个是key未找到或者翻译出问题warn配置
	silentTranslationWarn: true, // 只是为了dev时控制台清静些，prod默认移除的
	silentFallbackWarn: true,
	fallbackWarn: false,
})

export function getDefaultLanguage() {
	let language,
		localUser = localStorage.getItem('user')
	try {
		if (localUser) {
			localUser = JSON.parse(localUser)
			language = localUser.language
		}

		// 判断 是否支持
		const file = LANS.find((d) => d.code === language)
		language = file ? file.code : 'en'
	} catch (e) {
		console.log(e)
	}
	return language
}

/**
 *
 * @param lang
 * @param isInit 是否i18n初始化前
 * @returns {Promise<void>}
 */
export async function changLang(lang, isInit = false) {
	// 兼容已有缓存，初始化更换缓存
	if (isInit) {
		let localUser = localStorage.getItem('user')
		try {
			if (!localUser) {
				localUser = {}
			} else {
				localUser = JSON.parse(localUser)
			}
			localUser.language = lang
			localStorage.setItem('user', JSON.stringify(localUser))
		} catch (e) {
			console.log(e)
		}
	}

	await loadLanguageAsync(lang)
}

export function loadLanguageAsync(lang) {
	let file = LANS.find((d) => d.code === lang)
	return import(/* webpackChunkName: "lang-request" */ `./modules/${file.file}`).then((messages) => {
		// 动态加载对应的语言包
		console.log(messages.default)
		i18n.global.setLocaleMessage(lang, messages.default)
		console.log(i18n.global.locale)
		setI18nLanguage(lang)
	})
}

export function setI18nLanguage(locale) {
	if (i18n.mode === 'legacy') {
		i18n.global.locale = locale
	} else {
		i18n.global.locale.value = locale
	}
}

changLang(getDefaultLanguage(), true)

export default i18n
