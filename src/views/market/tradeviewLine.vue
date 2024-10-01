<template>
	<div class="tradingview-box">
		<!-- TradingView Widget BEGIN -->
		<div class="tradingview-widget-container" id="container">
			<div class="tradingview-widget-container__widget"></div>
		</div>
		<!-- TradingView Widget END -->
	</div>
</template>
<script setup>
import { ref, onMounted } from 'vue'

onMounted(() => {
	const container = document.querySelector('#container')

	const script = document.createElement('script')
	script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js'
	script.type = 'text/javascript'
	script.async = true
	script.innerHTML = `
    {
        "symbol": "BINANCE:BTCUSDT",
        "width": "140",
        "height": "60",
        "locale": "zh_CN",
        "dateRange": "1M",
        "colorTheme": "light",
        "trendLineColor": "rgba(255, 229, 153, 1)",
        "underLineColor": "rgba(255, 242, 204, 1)",
        "underLineBottomColor": "rgba(255, 229, 153, 0)",
        "isTransparent": true,
        "autosize": false,
        "largeChartUrl": "",
        "chartOnly": true,
        "noTimeScale": true
    }

`
	// script.innerHTML = `
	//         {
	//           "symbols": [
	//             [
	//               "BITSTAMP:BTCUSD|1M"
	//             ]
	//           ],
	//           "chartOnly": true,
	//           "width": "100",
	//           "height": "50",
	//           "locale": "zh_CN",
	//           "colorTheme": "light",
	//           "autosize": false,
	//           "showVolume": false,
	//           "showMA": false,
	//           "hideDateRanges": true,
	//           "hideMarketStatus": false,
	//           "hideSymbolLogo": false,
	//           "scalePosition": "no",
	//           "scaleMode": "Normal",
	//           "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
	//           "fontSize": "10",
	//           "noTimeScale": true,
	//           "valuesTracking": "1",
	//           "changeMode": "price-and-percent",
	//           "chartType": "area",
	//           "maLineColor": "#2962FF",
	//           "maLineWidth": 1,
	//           "maLength": 9,
	//           "headerFontSize": "medium",
	//           "lineWidth": 1,
	//           "lineType": 0,
	//           "dateRanges": [
	//             "1m|30",
	//             "3m|60",
	//             "12m|1D",
	//             "60m|1W",
	//             "all|1M"
	//           ],
	//           "lineColor": "rgba(255, 241, 118, 0.73)",
	//           "topColor": "rgba(255, 245, 157, 0.72)",
	//           "bottomColor": "rgba(255, 249, 196, 1)",
	//           "downColor": "#f7525f",
	//           "upColor": "#22ab94",
	//           "borderUpColor": "#22ab94",
	//           "borderDownColor": "#f7525f",
	//           "wickUpColor": "#22ab94",
	//           "wickDownColor": "#f7525f"
	//         }`;
	container.appendChild(script)

	const link = document.createElement('style')
	// link.type = "text/css";
	// link.rel = "stylesheet";
	link.innerHTML = `
            .js-copyright-label{
                display: none;
            }
    `
	container.appendChild(link)
})
</script>

<style lang="scss">
.tradingview-box {
	overflow: hidden;
}
</style>
