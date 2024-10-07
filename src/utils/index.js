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

/**
 * 比较数字
 * @param num1
 * @param num2
 * @returns {number} -1:小于  0:等于  1:大于
 */
export function compareNumber(num1, num2) {
	return new Decimal(num1 * 1).comparedTo(num2 * 1)
}

/**
 * 放大指定精度
 * @param num 数字
 * @param decimals 要放大的精度 10的倍数
 * @returns Srting
 */
export const numToPowByDecimail = (num, decimals) => {
	if (!num || !decimals) return num
	// num = new Decimal(num)
	// return num.times(Math.pow(10, decimals)).valueOf()

	// if (!num || !decimals) return num
	// const decimalsFlag = Math.pow(10, decimals - 1)
	// const balanceDec = new Decimal(num)
	// // 放大会转为科学计数法，需要转换
	// return bigNUmToolNumber(balanceDec.mul(decimalsFlag).toString())

	const zeroStr = Array(decimals).fill(0).join('')
	return `${num}${zeroStr}`
}

// 大数字、科学计数法转为完整字符串
export function bigNUmToolNumber(num_str) {
	num_str = num_str.toString()
	if (num_str.indexOf('+') !== -1) {
		num_str = num_str.replace('+', '')
	}
	if (num_str.indexOf('E') !== -1 || num_str.indexOf('e') !== -1) {
		var resValue = '',
			power = '',
			result = null,
			dotIndex = 0,
			resArr = [],
			sym = ''
		var numStr = num_str.toString()
		if (numStr[0] === '-') {
			// 如果为负数，转成正数处理，先去掉‘-’号，并保存‘-’.
			numStr = numStr.substr(1)
			sym = '-'
		}
		if (numStr.indexOf('E') !== -1 || numStr.indexOf('e') !== -1) {
			var regExp = new RegExp('^(((\\d+.?\\d+)|(\\d+))[Ee]{1}((-(\\d+))|(\\d+)))$', 'ig')
			result = regExp.exec(numStr)
			if (result != null) {
				resValue = result[2]
				power = result[5]
				result = null
			}
			if (!resValue && !power) {
				return false
			}
			dotIndex = resValue.indexOf('.') === -1 ? 0 : resValue.indexOf('.')
			resValue = resValue.replace('.', '')
			resArr = resValue.split('')
			if (Number(power) >= 0) {
				var subres = resValue.substr(dotIndex)
				power = Number(power)
				//幂数大于小数点后面的数字位数时，后面加0
				for (var i = 0; i <= power - subres.length; i++) {
					resArr.push('0')
				}
				if (power - subres.length < 0) {
					resArr.splice(dotIndex + power, 0, '.')
				}
			} else {
				power = power.replace('-', '')
				power = Number(power)
				//幂数大于等于 小数点的index位置, 前面加0
				for (var i = 0; i < power - dotIndex; i++) {
					resArr.unshift('0')
				}
				var n = power - dotIndex >= 0 ? 1 : -(power - dotIndex)
				resArr.splice(n, 0, '.')
			}
		}
		resValue = resArr.join('')

		return sym + resValue
	} else {
		return num_str
	}
}

/**
 * 缩小指定精度
 * @param num 数字
 * @param decimals 要缩小的精度 10的倍数
 * @returns {*|string}
 */
export const numFormPowByDecimail = (num, decimals) => {
	if (!num || !decimals) return num
	num = new Decimal(num)
	return num.dividedBy(Math.pow(10, decimals)).valueOf()
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
