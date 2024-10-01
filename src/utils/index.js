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
 * wei 为单位值转为币种单位的字符串值
 * @param {*} amount 从区块链中取的的以 wei 为单位余额
 * @param {*} decimals 此币种的精度
 * @returns {String} 币种为单位的字符串值
 */
export function format2Balance(amount, decimals) {
	if (!amount || !decimals) return amount
	const decimalsFlag = Math.pow(10, decimals)
	const amountDec = new Decimal(amount)
	const balance = amountDec.div(decimalsFlag).toString()
	return balance
}

/**
 * 币种单位的值转为 wei 为单位的字符串值
 * @param {*} balance 币种为单位的值
 * @param {*} decimals 此币种的精度
 * @returns {String} wei为单位的字符串值
 */
export function format2Amount(balance, decimals) {
	if (!balance || !decimals) return balance
	const decimalsFlag = Math.pow(10, decimals)
	const balanceDec = new Decimal(balance)
	const amount = balanceDec.mul(decimalsFlag).toString()
	return amount
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
	return new Decimal(num1 * 1).dividedBy(new Decimal(num2 * 1)).toFixed(fixed)
}

/**
 * 加
 * @param num1
 * @param num2
 * @returns {string}
 */
export function plusForValueDecimal(num1 = 0, num2 = 0) {
	return new Decimal(num1 * 1).plus(new Decimal(num2 * 1)).valueOf()
}

/**
 * 减
 * @param num1
 * @param num2
 * @returns {string}
 */
export function minusForValueDecimal(num1 = 0, num2 = 0) {
	return new Decimal(num1 * 1).minus(new Decimal(num2 * 1)).valueOf()
}

/**
 * 乘
 * @param num1
 * @param num2
 * @returns {string}
 */
export function timesForValueDecimal(num1 = 0, num2 = 0) {
	return new Decimal(num1 * 1).times(new Decimal(num2 * 1)).valueOf()
}

/**
 * 除
 * @param num1
 * @param num2
 * @returns {*}
 */
export function dividedForValueDecimal(num1 = 0, num2 = 0) {
	return new Decimal(num1 * 1).dividedBy(new Decimal(num2 * 1)).valueOf()
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
