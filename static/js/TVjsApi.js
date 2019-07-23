var count = 0;
function TVjsApi() {
    this.widgets = null,
    this.datafeeds = null,
    this.symbol = null,
    this.interval = null,
    this.precision = null,
    this.cacheData = {},
    this.lastTime = null,
    this.getBarTimer = null,
    this.isLoading = true,
    this.lang = 'en';
    var self = this;
}
TVjsApi.prototype.switch_market = function(symbol){
    this.symbol = symbol
    this.isLoading = true
    this.widgets && this.widgets.setSymbol(this.symbol, this.interval)
}
TVjsApi.prototype.switch_language = function(lang){
    this.lang = lang
    this.widgets && this.widgets.setLanguage(this.lang)
}
TVjsApi.prototype.getPeriod = function(resolution) {
    var period = ''
    switch (resolution) {
    case '1':
        period = '1m'
        break
    case '3':
        period = '3m'
        break
    case '5':
        period = '5m'
        break
    case '15':
        period = '15m'
        break
    case '30':
        period = '30m'
        break
    case '60':
        period = '1h'
        break
    case '120':
        period = '2h'
        break
    case '240':
        period = '4h'
        break
    case '360':
        period = '6h'
        break
    case '720':
        period = '12h'
        break
    case '1D':
        period = '1d'
        break
    case '1W':
        period = '1w'
        break
    }
    return period
}
TVjsApi.prototype.init = function() {
    //设置默认symbol，interval的默认值
    var upColor = '#00A55E', downColor = '#E44242'
    var symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ETHBTC'
    var interval = arguments.length > 0 && arguments[1] !== undefined ? arguments[1] : '720'
    var precision = arguments.length > 0 && arguments[2] !== undefined ? arguments[2] : 8 
    var lang = arguments.length > 0 && arguments[3] !== undefined ? arguments[3] : 'en' 
    this.symbol = symbol
    this.interval = interval
    this.precision = precision
    this.lang = lang

    this.datafeeds = new datafeeds(this)

    if (!this.widgets) {
        this.widgets = window.tvWidget = new TradingView.widget({
            //默认商品设置
            symbol: symbol,
            //默认请求间隔
            interval: interval,
            //默认是否全屏
            fullscreen: false,
            //默认是否自适应
            autosize: true,
            height:470,
            theme: 'Dark',
            //设置容器
            container_id: 'trade-view',
            datafeed: this.datafeeds,
            library_path: '../../static/charting_library/',
            enabled_features: ["hide_left_toolbar_by_default","move_logo_to_main_pane"],
            disabled_features: [
            "header_symbol_search",
            "header_screenshot",
            "header_undo_redo",
            "header_compare",
            "legend_context_menu",
            "create_volume_indicator_by_default",
            "timeframes_toolbar",
            "pane_context_menu",
            "use_localstorage_for_settings",
            "show_hide_button_in_legend",
            ],
            charts_storage_api_version: "1.1",
            timezone: 'Asia/Shanghai',
            locale: this.lang,
            debug: false,
            overrides: {
                "paneProperties.background": "#131317",
                "paneProperties.vertGridProperties.color": "#201F25",
                "paneProperties.horzGridProperties.color": "#201F25",
                //    K线图样式
                "mainSeriesProperties.candleStyle.upColor": upColor,
                "mainSeriesProperties.candleStyle.downColor": downColor,
                "mainSeriesProperties.candleStyle.borderColor": downColor,
                "mainSeriesProperties.candleStyle.borderUpColor": upColor,
                "mainSeriesProperties.candleStyle.borderDownColor": downColor,
                "mainSeriesProperties.candleStyle.wickUpColor": upColor,
                "mainSeriesProperties.candleStyle.wickDownColor": downColor,
                //    空心K线图样式
                "mainSeriesProperties.hollowCandleStyle.upColor": upColor,
                "mainSeriesProperties.hollowCandleStyle.downColor": downColor,
                "mainSeriesProperties.hollowCandleStyle.borderColor": downColor,
                "mainSeriesProperties.hollowCandleStyle.borderUpColor": upColor,
                "mainSeriesProperties.hollowCandleStyle.borderDownColor": downColor,
                "mainSeriesProperties.hollowCandleStyle.wickUpColor": upColor,
                "mainSeriesProperties.hollowCandleStyle.wickDownColor": downColor,
                //    美国线样式
                "mainSeriesProperties.barStyle.upColor": upColor,
                "mainSeriesProperties.barStyle.downColor": downColor,
                //    线形图样式
                "mainSeriesProperties.lineStyle.color": upColor,
                //    面积图样式
                "mainSeriesProperties.areaStyle.color1": upColor,
                "mainSeriesProperties.areaStyle.color2": downColor,
                "mainSeriesProperties.areaStyle.linecolor": upColor,
                "volumePaneSize": "medium",
                "MACDPaneSize": "tiny",
                'scalesProperties.fontSize': 12,
            },
            studies_overrides: {
                "volume.volume.color.0": downColor,
                "volume.volume.color.1": upColor,
                "volume.volume ma.color": "rgba(136,136,136,0.2)",
                "volume.show ma": true,
            }
        })

        var widgets = this.widgets;
        widgets.onChartReady(function() {
            //设置均线种类 均线样式
            widgets.chart().createStudy('Moving Average', false, false, [5], null, {
                'Plot.color': 'rgb(255, 255, 255)',
                'precision': precision
            });
            widgets.chart().createStudy('Moving Average', false, false, [10], null, {
                'Plot.color': 'rgb(255, 213, 0)',
                'precision': precision
            });
            widgets.chart().createStudy('Moving Average', false, false, [20], null, {
                'Plot.color': 'rgb(255, 0, 191)',
                'precision': precision
            });
            widgets.chart().createStudy('Volume', false, true, [20], null, {});

        })
    }
}
TVjsApi.prototype.sendMessage = function() {
    this.isLoading = true
    window.klineLocal && window.klineLocal.switchPeriod(this.getPeriod(this.interval))
}
TVjsApi.prototype.onMessage = function(data) {
    count++;
    if (count < 5) {
        console.log("这是后台返回的数据" + count + "：" + JSON.stringify(data.length))
    }

    if (data && data.length) {
        var list = []
        var ticker = this.symbol + "-" + this.interval;
        var self = this;
        data.forEach(function(element) {
            list.push({
                time: Number(element[0]),
                open: Number(element[1]),
                high: Number(element[2]),
                low: Number(element[3]),
                close: Number(element[4]),
                volume: Number(element[5])
            })
        }, self)
        this.cacheData[ticker] = list
    }
    this.datafeeds.barsUpdater.updateData()
}
TVjsApi.prototype.getBars = function(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback) {
    // console.log(' >> :', rangeStartDate, rangeEndDate)
    if (this.interval !== resolution) {
        this.interval = resolution
        this.sendMessage()
    }

    var ticker = this.symbol + "-" + this.interval
    if (this.cacheData[ticker] && this.cacheData[ticker].length) {
        this.isLoading = false
        var newBars = []
        this.cacheData[ticker].forEach(item =>{
            if (item.time >= rangeStartDate * 1000 && item.time <= rangeEndDate * 1000) {
                newBars.push(item)
            }
        })
        onLoadedCallback(newBars)
    } else {
        var self = this
        this.getBarTimer = setTimeout(function() {
            self.getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
        },
        10)
    }
}
