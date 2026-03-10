let globalDashboardData = null;

document.addEventListener("DOMContentLoaded", loadDashboard);

/* Main Load Function                                   */


async function loadDashboard() {

    showLoadingState();

    try {

        const response = await fetch("http://127.0.0.1:5000/api/dashboard");
        const data = await response.json();

        if (!data) return;

        globalDashboardData = data;

        renderKPICards(data);

        setTimeout(() => {
            renderAllCharts(data);
        }, 100);

        renderModelSwitcher(data.model_metrics);

        AppState.setModel(data.best_model.model_name);

        setActiveModelButton(data.best_model.model_name);

        /* Update title color for default model */
        updateDashboardTitle(data.best_model.model_name);

    } catch (error) {
        console.error("Dashboard Load Error:", error);
    }

}


/* Model Switcher                                      */


function renderModelSwitcher(modelMetrics) {

    const container = document.getElementById("modelSwitcher");
    container.innerHTML = "";

    modelMetrics.forEach(model => {

        const button = document.createElement("button");

        button.className = `model-switch-btn ${model.model_name}`;

        button.textContent = model.model_name.replace("_", " ").toUpperCase();

        button.addEventListener("click", () => {

            AppState.setModel(model.model_name);

            setActiveModelButton(model.model_name);

            updateBestModelKPI(model.model_name);

            renderModelDetails(model.model_name);

            /* Update dashboard title glow */
            updateDashboardTitle(model.model_name);

        });

        container.appendChild(button);

    });

}

/* ===================================================== */
/* ACTIVE BUTTON STYLE                                  */
/* ===================================================== */

function setActiveModelButton(modelName) {

    document.querySelectorAll(".model-switch-btn")
        .forEach(btn => {

            btn.classList.remove("active");

            if (btn.classList.contains(modelName)) {
                btn.classList.add("active");
            }

        });

}

/* ===================================================== */
/* DASHBOARD TITLE COLOR CHANGE                         */
/* ===================================================== */

function updateDashboardTitle(modelName) {

    const title = document.querySelector(".project-title");

    if (!title) return;

    const colors = {
        logistic: "#3b82f6",
        random_forest: "#10b981",
        xgboost: "#7c3aed"
    };

    const color = colors[modelName] || "#22d3ee";

    title.style.background = `linear-gradient(90deg, ${color}, #22d3ee)`;
    title.style.webkitBackgroundClip = "text";
    title.style.webkitTextFillColor = "transparent";
    title.style.textShadow = `0 0 20px ${color}`;
}

/* ===================================================== */
/* UPDATE KPI MODEL                                     */
/* ===================================================== */

function updateBestModelKPI(modelName) {

    const modelData = globalDashboardData.model_metrics
        .find(m => m.model_name === modelName);

    if (!modelData) return;

    const kpiCards = document.querySelectorAll(".kpi-card");

    const bestCard = kpiCards[3];

    bestCard.querySelector("h4").textContent = "Selected Model";

    bestCard.querySelector("h2").classList.add("model-text");

    bestCard.querySelector("h2").textContent =
        modelName.replace("_", " ").toUpperCase();

    bestCard.querySelector(".kpi-back-content p").textContent =
        "Accuracy: " + modelData.accuracy;

}

/* MODEL DETAILS PANEL */

function renderModelDetails(modelName) {

    const container = document.getElementById("modelMetricsTable");

    if (!container) return;

    const model = globalDashboardData.model_metrics
        .find(m => m.model_name === modelName);

    if (!model) return;

    const colors = {
        logistic: "#3b82f6",
        random_forest: "#10b981",
        xgboost: "#7c3aed"
    };

    const accent = colors[modelName] || "#22d3ee";

    const accuracyPercent = Math.round(model.accuracy * 100);

    container.innerHTML = `

    <div class="chart-card" style="
        padding:40px;
        border-radius:16px;
        background:linear-gradient(135deg,#0f172a,#020617);
        border:1px solid rgba(255,255,255,0.05);
        box-shadow:0 0 40px rgba(0,0,0,0.6);
    ">

        <h2 style="
            color:${accent};
            font-weight:800;
            font-size:22px;
            margin-bottom:30px;
            letter-spacing:2px;
            text-shadow:0 0 20px ${accent};
        ">
            ${modelName.replace("_"," ").toUpperCase()} MODEL INTELLIGENCE
        </h2>

        <div style="
            display:grid;
            grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
            gap:24px;
        ">

            ${createMetricCard("Accuracy", model.accuracy, accent)}
            ${createMetricCard("Precision", model.precision || "N/A", accent)}
            ${createMetricCard("Recall", model.recall || "N/A", accent)}
            ${createMetricCard("F1 Score", model.f1_score || "N/A", accent)}

        </div>

        <div style="margin-top:45px">

            <div style="
                font-size:13px;
                color:#94a3b8;
                margin-bottom:8px;
            ">
                Accuracy Performance Meter
            </div>

            <div style="
                width:100%;
                height:12px;
                background:#1e293b;
                border-radius:20px;
                overflow:hidden;
            ">

                <div style="
                    width:${accuracyPercent}%;
                    height:100%;
                    background:${accent};
                    box-shadow:0 0 20px ${accent};
                    transition:width 1s ease;
                "></div>

            </div>

        </div>

    </div>
    `;
}


/* ===================================================== */
/* KPI CARD BUILDER                                      */
/* ===================================================== */

function createMetricCard(label, value, accent) {

    return `

<div style="
    background:rgba(15,23,42,0.75);
    padding:26px;
    border-radius:14px;
    text-align:center;
    border:1px solid rgba(255,255,255,0.05);
    transition:all 0.3s ease;
    box-shadow:0 10px 30px rgba(0,0,0,0.6);
"

onmouseover="this.style.transform='translateY(-6px)';
this.style.border='1px solid ${accent}';
this.style.boxShadow='0 0 25px ${accent}';"

onmouseout="this.style.transform='translateY(0)';
this.style.border='1px solid rgba(255,255,255,0.05)';
this.style.boxShadow='0 10px 30px rgba(0,0,0,0.6)';"

>

<div style="
    color:#94a3b8;
    font-size:13px;
    letter-spacing:1px;
    margin-bottom:10px;
">
${label}
</div>

<div style="
    color:white;
    font-size:34px;
    font-weight:800;
    text-shadow:0 0 10px rgba(255,255,255,0.4);
">
${value}
</div>

</div>

`;

}

/* ===================================================== */
/* LOADING STATE                                        */
/* ===================================================== */

function showLoadingState() {

    const container = document.getElementById("kpiContainer");

    container.innerHTML = "";

    for (let i = 0; i < 4; i++) {

        const skeleton = document.createElement("div");

        skeleton.className = "kpi-card";

        skeleton.innerHTML = `
        <div class="kpi-inner">
            <div class="kpi-front">
                <h4>Loading...</h4>
                <h2>--</h2>
            </div>
        </div>`;

        container.appendChild(skeleton);

    }

}

/* ===================================================== */
/* NUMBER FORMAT                                        */
/* ===================================================== */

function formatNumber(value) {

    if (typeof value === "number") {

        return value.toLocaleString();

    }

    return value;

}

/* ===================================================== */
/* KPI RENDERING                                        */
/* ===================================================== */

function renderKPICards(data) {

    const container = document.getElementById("kpiContainer");

    container.innerHTML = "";

    const kpis = [

        {
            title: "Total Transactions",
            value: formatNumber(data.summary.total_transactions),
            description: "All processed transactions in dataset",
            highlight: "Live Dataset"
        },

        {
            title: "Total Fraud Cases",
            value: formatNumber(data.summary.total_fraud_cases),
            description: "Confirmed fraud transactions detected",
            highlight: "Risk Analysis"
        },

        {
            title: "Fraud Rate %",
            value: data.summary.fraud_rate_percentage + "%",
            description: "Fraud percentage across total volume",
            highlight: "Anomaly Ratio"
        },

        {
            title: "Best Model",
            value: data.best_model.model_name.replace("_", " ").toUpperCase(),
            description: "Accuracy: " + data.best_model.accuracy,
            highlight: "Top Performer",
            model: true
        }

    ];

    kpis.forEach(kpi => {
        container.appendChild(createKPICard(kpi));
    });

}

/* ===================================================== */
/* CREATE KPI CARD                                      */
/* ===================================================== */

function createKPICard(kpi) {

    const card = document.createElement("div");

    card.className = "kpi-card";

    card.innerHTML = `

    <div class="kpi-inner">

        <div class="kpi-front">

            <h4>${kpi.title}</h4>

            <h2 class="${kpi.model?'model-text':''}">
                ${kpi.value}
            </h2>

        </div>

        <div class="kpi-back">

            <div class="kpi-back-content">

                <span class="kpi-badge">${kpi.highlight}</span>

                <p>${kpi.description}</p>

            </div>

        </div>

    </div>

    `;

    card.addEventListener("dblclick", () => {
        card.classList.toggle("flipped");
    });

    return card;

}