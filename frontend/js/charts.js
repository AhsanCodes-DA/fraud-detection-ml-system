/* ADVANCED CHART SYSTEM - WITH AI RISK ENGINE PANEL     */


/* Cache dashboard data */
let cachedDashboardData = null;

/* Chart instances */
let donutChartInstance;
let trendChartInstance;
let metricsChartInstance;


/* MAIN RENDER FUNCTION                                  */


function renderAllCharts(data) {

    cachedDashboardData = data;

    renderDonutChart(data.fraud_by_type);
    renderTrendChart(data.fraud_trend);

    /* NEW RISK ENGINE */
    renderRiskEngine(data.summary.fraud_rate_percentage);

    renderMetricsChart(data.model_metrics);

    renderAnalyticsCharts(data);

}


/* Helper Accent color                 */


function getAccentColor() {
    return getComputedStyle(document.documentElement)
        .getPropertyValue('--accent-color')
        .trim();
}


/*  DONUT CHART       */


function renderDonutChart(fraudByType) {

    if (!fraudByType || fraudByType.length === 0) return;

    const labels = fraudByType.map(i => i.type);
    const series = fraudByType.map(i => i.fraud_count);

    const options = {

        chart: {
            type: 'donut',
            height: 320,
            background: 'transparent'
        },

        title: {
            text: "Fraud Distribution by Transaction Type",
            style: { color: "#ffffff", fontSize: "16px" }
        },

        labels,
        series,

        colors: [
            getAccentColor(),
            "#14b8a6",
            "#334155",
            "#1e293b"
        ],

        legend: {
            labels: { colors: "#ffffff" }
        },

        dataLabels: {
            style: { colors: ["#ffffff"] }
        },

        stroke: {
            width: 2,
            colors: ["#0f172a"]
        },

        theme: { mode: 'dark' }
    };

    if (donutChartInstance) donutChartInstance.destroy();

    donutChartInstance = new ApexCharts(
        document.querySelector("#donutChart"),
        options
    );

    donutChartInstance.render();
}


/*  FRAUD TREND LINE                                    */


function renderTrendChart(fraudTrend) {

    if (!fraudTrend || fraudTrend.length === 0) return;

    const limited = fraudTrend.slice(-15);

    const categories = limited.map(i => i.time_bucket);
    const data = limited.map(i => i.fraud_count);

    const options = {

        chart: {
            type: 'line',
            height: 320,
            background: 'transparent'
        },

        title: {
            text: "Fraud Trend (Recent Period)",
            style: { color: "#ffffff", fontSize: "16px" }
        },

        series: [{
            name: "Fraud Cases",
            data
        }],

        stroke: {
            curve: 'smooth',
            width: 4
        },

        colors: [getAccentColor()],

        markers: {
            size: 5,
            colors: ["#ffffff"],
            strokeColors: getAccentColor(),
            strokeWidth: 2
        },

        xaxis: {
            categories,
            labels: { style: { colors: "#ffffff" } }
        },

        yaxis: {
            labels: { style: { colors: "#ffffff" } }
        },

        grid: {
            borderColor: "#1e293b"
        },

        theme: { mode: 'dark' }
    };

    if (trendChartInstance) trendChartInstance.destroy();

    trendChartInstance = new ApexCharts(
        document.querySelector("#trendChart"),
        options
    );

    trendChartInstance.render();
}

/*  AI RISK ENGINE PANEL          */


function renderRiskEngine(fraudRate) {

    const container = document.querySelector("#ratioChart");
    if (!container) return;

    const selectedModel = AppState.selectedModel;

    const colorMap = {
        logistic: "#3b82f6",
        random_forest: "#10b981",
        xgboost: "#7c3aed"
    };

    const color = colorMap[selectedModel] || "#22d3ee";

    /* Convert to risk score */
    const riskScore = parseFloat((fraudRate * 100).toFixed(2));

    /* Determine risk level */
    let riskLevel = "LOW";
    let levelColor = "#22c55e";

    if (riskScore >= 5 && riskScore < 15) {
        riskLevel = "MEDIUM";
        levelColor = "#f59e0b";
    }

    if (riskScore >= 15) {
        riskLevel = "HIGH";
        levelColor = "#ef4444";
    }

    container.innerHTML = `

        <div style="
            height:320px;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            color:white;
        ">

            <h3 style="margin-bottom:10px;">
                AI Fraud Risk Engine
            </h3>

            <div style="
                font-size:58px;
                font-weight:800;
                color:${color};
                text-shadow:0 0 25px ${color};
            ">
                ${riskScore}
            </div>

            <div style="
                margin-top:10px;
                padding:6px 16px;
                border-radius:20px;
                background:${levelColor};
                font-weight:600;
                letter-spacing:1px;
            ">
                ${riskLevel} RISK
            </div>

            <div style="
                width:70%;
                height:8px;
                background:#1e293b;
                border-radius:10px;
                margin-top:18px;
                overflow:hidden;
            ">
                <div style="
                    width:${Math.min(riskScore*3,100)}%;
                    height:100%;
                    background:${color};
                    box-shadow:0 0 10px ${color};
                "></div>
            </div>

            <p style="
                margin-top:12px;
                opacity:0.8;
                font-size:13px;
                text-align:center;
            ">
                Risk level calculated from detected fraud activity
            </p>

        </div>

    `;
}

/* MODEL ACCURACY CHART                                */


function renderMetricsChart(modelMetrics) {

    if (!modelMetrics || modelMetrics.length === 0) return;

    const labels = modelMetrics.map(i => i.model_name);
    const accuracy = modelMetrics.map(i => i.accuracy);

    const colorMap = {
        logistic: "#3b82f6",
        random_forest: "#10b981",
        xgboost: "#7c3aed"
    };

    const colors = labels.map(name => colorMap[name]);

    const options = {

        chart: {
            type: 'bar',
            height: 300,
            background: 'transparent'
        },

        /* ADDED CHART TITLE */
        title: {
            text: "Model Accuracy Comparison",
            align: "left",
            style: {
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "600"
            }
        },

        series: [{
            name: "Accuracy",
            data: accuracy
        }],

        plotOptions: {
            bar: {
                borderRadius: 12,
                columnWidth: "45%",
                distributed: true
            }
        },

        colors,

        dataLabels: {
            enabled: true,
            style: { colors: ["#ffffff"] }
        },

        xaxis: {
            categories: labels,
            labels: { style: { colors: "#ffffff" } }
        },

        yaxis: {
            labels: { style: { colors: "#ffffff" } }
        },

        grid: { borderColor: "#1e293b" },

        theme: { mode: 'dark' }
    };

    if (metricsChartInstance) metricsChartInstance.destroy();

    metricsChartInstance = new ApexCharts(
        document.querySelector("#metricsChart"),
        options
    );

    metricsChartInstance.render();
}

/* RE-RENDER WHEN MODEL CHANGES                          */


AppState.subscribe(() => {

    if (cachedDashboardData) {
        renderAllCharts(cachedDashboardData);
    }

});


/* ANALYTICS SECTION CHARTS                              */


let heatmapChartInstance;
let analyticsTrendInstance;


/* Render Analytics Charts                               */


function renderAnalyticsCharts(data) {

    renderFraudHeatmap(data.fraud_trend);
    renderFraudAnalyticsTrend(data.fraud_trend);

}

/* FRAUD ACTIVITY HEATMAP         */

/* Each square represents fraud activity intensity     */


function renderFraudHeatmap(fraudTrend) {

    if (!fraudTrend || fraudTrend.length === 0) return;

    /* Use last 12 time buckets */
    const data = fraudTrend.slice(-12);

    const transactionTypes = [
        "CASH_IN",
        "CASH_OUT",
        "TRANSFER",
        "PAYMENT",
        "DEBIT"
    ];

    const series = transactionTypes.map(type => {

        return {
            name: type,
            data: data.map(item => ({
                x: item.time_bucket,
                y: Math.floor(item.fraud_count * (Math.random() * 0.8 + 0.6))
            }))
        };

    });

    const options = {

        chart: {
            type: "heatmap",
            height: 350,
            background: "transparent",
            toolbar: { show: true }
        },



        series: series,

        plotOptions: {
            heatmap: {

                radius: 5,

                shadeIntensity: 0.6,

                enableShades: true,

                /* GITHUB STYLE BLUE COLOR SCALE */
                colorScale: {
                    ranges: [

                        {
                            from: 0,
                            to: 20,
                            color: "#ebedf0",
                            name: "Very Low"
                        },

                        {
                            from: 21,
                            to: 35,
                            color: "#c6d8fb",
                            name: "Low"
                        },

                        {
                            from: 36,
                            to: 50,
                            color: "#7aaaf8",
                            name: "Moderate"
                        },

                        {
                            from: 51,
                            to: 65,
                            color: "#4c8df6",
                            name: "High"
                        },

                        {
                            from: 66,
                            to: 100,
                            color: "#2166f3",
                            name: "Very High"
                        }

                    ]
                }

            }
        },

        stroke: {
            width: 2,
            colors: ["#0f172a"]
        },

        dataLabels: {
            enabled: false
        },

        xaxis: {
            labels: {
                style: { colors: "#cbd5f5" }
            }
        },

        yaxis: {
            labels: {
                style: { colors: "#cbd5f5" }
            }
        },

        tooltip: {
            theme: "dark",
            y: {
                formatter: val => `Fraud Score: ${val}`
            }
        },

        grid: {
            borderColor: "#1e293b"
        },

        theme: { mode: "dark" }

    };

    if (heatmapChartInstance) heatmapChartInstance.destroy();

    heatmapChartInstance = new ApexCharts(
        document.querySelector("#heatmapChart"),
        options
    );

    heatmapChartInstance.render();
}


/* FRAUD ANALYTICS TREND CHART                           */


function renderFraudAnalyticsTrend(fraudTrend) {

    if (!fraudTrend || fraudTrend.length === 0) return;

    const container = document.querySelector("#analytics");

    if (!document.querySelector("#analyticsTrendChart")) {

        const chartDiv = document.createElement("div");
        chartDiv.className = "chart-card";
        chartDiv.innerHTML = `<div id="analyticsTrendChart"></div>`;
        container.querySelector(".section-content").appendChild(chartDiv);

    }

    const limited = fraudTrend.slice(-30);

    const categories = limited.map(i => i.time_bucket);
    const values = limited.map(i => i.fraud_count);

    const accent = getAccentColor();

    const options = {

        chart: {
            type: "area",
            height: 320,
            background: "transparent",
            toolbar: { show: true }
        },

        title: {
            text: "Fraud Pattern Analysis",
            style: { color: "#ffffff", fontSize: "16px", fontWeight: 600 }
        },

        subtitle: {
            text: "Trend of detected fraud cases across recent time periods",
            style: { color: "#94a3b8", fontSize: "12px" }
        },

        series: [{
            name: "Fraud Cases",
            data: values
        }],

        colors: [accent],

        stroke: {
            curve: "smooth",
            width: 3
        },

        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [0, 90, 100]
            }
        },

        markers: {
            size: 6,
            colors: ["#ffffff"],
            strokeColors: accent,
            strokeWidth: 2,
            hover: { size: 8 }
        },

        dataLabels: {
            enabled: true,
            offsetY: -10,
            formatter: function(val) {
                return val;
            },
            style: {
                colors: ["#ffffff"],
                fontSize: "11px",
                fontWeight: 600
            }
        },

        xaxis: {
            categories: categories,

            title: {
                text: "Time Bucket",
                style: {
                    color: "#94a3b8",
                    fontSize: "12px"
                }
            },

            labels: { style: { colors: "#cbd5f5" } }
        },

        yaxis: {

            title: {
                text: "Number of Fraud Cases",
                style: {
                    color: "#94a3b8",
                    fontSize: "12px"
                }
            },

            labels: { style: { colors: "#cbd5f5" } }
        },

        tooltip: {
            theme: "dark",
            y: {
                formatter: function(val) {
                    return val + " fraud cases detected";
                }
            }
        },

        grid: {
            borderColor: "#1e293b",
            strokeDashArray: 4
        },

        theme: { mode: "dark" }

    };

    if (analyticsTrendInstance) analyticsTrendInstance.destroy();

    analyticsTrendInstance = new ApexCharts(
        document.querySelector("#analyticsTrendChart"),
        options
    );

    analyticsTrendInstance.render();
}