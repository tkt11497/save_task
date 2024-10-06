import { userStore } from '@/store'
import Decimal from 'decimal.js'

/**
 * 静态图片获取
 */
export function getImageUrl(path) {
	return new URL(`../assets/images/${path}`, import.meta.url).href
}

/**
 * 是否登录状态
 */
export const isLogin = () => {
	const userStoreObj = userStore()

	return userStoreObj.userId
}

// 时间戳处理
export const formatDate = (date, formatStr = 'YYYY-MM-DD HH:mm:ss') => {
	let format = formatStr
	if (!date) {
		return ''
	}
	let dateObj = date
	if (typeof date === 'string') {
		dateObj = new Date(date.replace(/-/g, '/'))
	} else if (typeof date === 'number') {
		dateObj = new Date(date)
	} else if (date && date instanceof Date) dateObj = date
	else return date

	const o = {
		'M+': dateObj.getMonth() + 1,
		'D+': dateObj.getDate(),
		'h+': dateObj.getHours() % 12 === 0 ? 12 : dateObj.getHours() % 12,
		'H+': dateObj.getHours(),
		'm+': dateObj.getMinutes(),
		's+': dateObj.getSeconds(),
		'q+': Math.floor((dateObj.getMonth() + 3) / 3),
		S: dateObj.getMilliseconds(),
	}
	const week = {
		0: '\u65e5',
		1: '\u4e00',
		2: '\u4e8c',
		3: '\u4e09',
		4: '\u56db',
		5: '\u4e94',
		6: '\u516d',
	}
	if (/(Y+)/.test(format)) {
		format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	if (/(E+)/.test(format)) {
		format = format.replace(RegExp.$1, (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[`${dateObj.getDay()}`])
	}
	for (const k in o) {
		if (new RegExp('(' + k + ')').test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
		}
	}
	return format
}

/**
 * 加 并 补齐小数位
 * @param {*} num1
 * @param {*} num2
 * @param {*} fixed
 * @returns
 */
export function plusDecimal(num1 = 0, num2 = 0, fixed = 8) {
	return new Decimal(num1 * 1).plus(new Decimal(num2 * 1)).toFixed(fixed)
}

/**
 * 减 并 补齐小数位
 * @param {*} num1
 * @param {*} num2
 * @param {*} fixed
 * @returns
 */
export function minusDecimal(num1 = 0, num2 = 0, fixed = 8) {
	return new Decimal(num1 * 1).minus(new Decimal(num2 * 1)).toFixed(fixed)
}

/**
 * 乘 并 补齐小数位
 * @param {*} num1
 * @param {*} num2
 * @param {*} fixed
 * @returns
 */
export function timesDecimal(num1 = 0, num2 = 0, fixed = 8) {
	return new Decimal(num1 * 1).times(new Decimal(num2 * 1)).toFixed(fixed)
}

/**
 * 除 并 补齐小数位
 * @param {*} num1
 * @param {*} num2
 * @param {*} fixed
 * @returns
 */
export function dividedByDecimal(num1 = 0, num2 = 0, fixed = 8) {
	return new Decimal(num1).dividedBy(new Decimal(num2)).toFixed(fixed)
}

/**
 * 加
 * @param num1
 * @param num2
 * @returns {string}
 */
export function plusForValueDecimal(num1 = 0, num2 = 0) {
	return new Decimal(num1).plus(new Decimal(num2)).valueOf()
}

/**
 * 减
 * @param num1
 * @param num2
 * @returns {string}
 */
export function minusForValueDecimal(num1 = 0, num2 = 0) {
	return new Decimal(num1).minus(new Decimal(num2)).valueOf()
}

/**
 * 乘
 * @param num1
 * @param num2
 * @returns {string}
 */
export function timesForValueDecimal(num1 = 0, num2 = 0) {
	return new Decimal(num1).times(new Decimal(num2)).valueOf()
}

/**
 * 除
 * @param num1
 * @param num2
 * @returns {*}
 */
export function dividedForValueDecimal(num1 = 0, num2 = 0) {
	return new Decimal(num1).dividedBy(new Decimal(num2)).valueOf()
}

/**
 * 补齐小数位
 * @param num
 * @param fixed
 * @returns {string}
 */
export function toFixedDecimal(num, fixed = 8) {
	const data = Decimal.isDecimal(num) ? num : new Decimal(num * 1)
	return data.toFixed(fixed)
}

/**
 * 比较数字
 * @param num1
 * @param num2
 * @returns {number} -1:小于  0:等于  1:大于
 */
export function compareNumber(num1, num2) {
	return new Decimal(num1).comparedTo(num2)
}

// 图片转湖盐 base64
export function base64ToBlob(base64Data) {
	const dataArr = base64Data.split(',') // 根据,来分隔

	const imageType = dataArr[0].match(/:(.*?);/)[1] // 获取文件类型。使用正则捕获 image/jpeg

	const textData = window.atob(dataArr[1]) // 使用atob() 将base64 转为文本文件
	const arrayBuffer = new ArrayBuffer(textData.length) // 创建一个二进制数据缓冲区，可以理解为一个数组
	const uint8Array = new Uint8Array(arrayBuffer) // 创建一个类型化数组对象，可以理解为上面的数组的成员，给这个对象赋值就会放到上面的数组中。
	for (let i = 0; i < textData.length; i++) {
		uint8Array[i] = textData.charCodeAt(i) // 将文本文件转为UTF-16的ASCII, 放到类型化数组对象中
	}

	return [new Blob([arrayBuffer], { type: imageType }), imageType.slice(6)] // 返回两个值，一个Blob对象，一个图片格式（如jpeg）
}
