/* RISK PREDICTION MODULE                                */
/* Handles transaction form submission                   */
/* Sends data to backend ML API                          */
/* Displays fraud probability and risk category          */
/* Enhanced UI styling + AI Risk Meter                   */


const predictionForm = document.getElementById("predictionForm");

if (predictionForm) {

    predictionForm.addEventListener("submit", async function(e) {

        e.preventDefault();

        /* Collect form data                           */


        const formData = new FormData(predictionForm);

        const payload = {

            step: Number(formData.get("step")),
            type: formData.get("type"),
            amount: Number(formData.get("amount")),
            oldbalanceOrg: Number(formData.get("oldbalanceOrg")),
            newbalanceOrig: Number(formData.get("newbalanceOrig")),
            oldbalanceDest: Number(formData.get("oldbalanceDest")),
            newbalanceDest: Number(formData.get("newbalanceDest"))

        };

        try {


            /* Send request to Flask API                    */


            const response = await fetch("http://127.0.0.1:5000/api/predict", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(payload)

            });

            const result = await response.json();

            if (result.status !== "success") {

                alert("Prediction failed.");
                return;

            }

            /* Extract prediction results                  */


            const data = result.data;

            const probability = Number(data.fraud_probability).toFixed(4);
            const score = Number(data.risk_score).toFixed(3);
            const category = data.risk_category;
            const model = data.selected_model;


            /* Dynamic dashboard accent color              */
            /* Changes when switching models               */


            const accentColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--accent-color')
                .trim();


            /* Display Fraud Probability */


            document.getElementById("riskScore").innerHTML = `
                <div style="
                    text-align:center;
                    padding:35px;
                    color:white;
                ">

                    <h2 style="
                        font-size:30px;
                        color:${accentColor};
                        margin-bottom:10px;
                        text-shadow:0 0 20px ${accentColor};
                    ">
                        Fraud Probability
                    </h2>

                    <div style="
                        font-size:64px;
                        font-weight:800;
                        color:${accentColor};
                        text-shadow:0 0 40px ${accentColor};
                        margin-bottom:10px;
                        transition:0.3s;
                    ">
                        ${probability}
                    </div>

                    <p style="margin-top:10px;color:#94a3b8">
                        Risk Score: <b>${score}</b>
                    </p>

                    <p style="color:#94a3b8">
                        Model Used: <b>${model}</b>
                    </p>

                </div>
            `;


            /* Display Risk Category                       */


            let color = "#22c55e";

            if (category === "Medium Risk") color = "#f59e0b";
            if (category === "High Risk") color = "#ef4444";

            /* Calculate AI Risk Meter width               */


            const meterWidth = Math.min(score * 4, 100);

            document.getElementById("riskCategory").innerHTML = `
                <div style="
                    margin-top:15px;
                    padding:14px;
                    border-radius:10px;
                    text-align:center;
                    font-size:20px;
                    font-weight:700;
                    background:rgba(15,23,42,0.6);
                    color:${color};
                    border:1px solid ${color};
                    box-shadow:0 0 10px rgba(0,0,0,0.4);
                ">
                    ${category}
                </div>

                <div style="
                    width:80%;
                    height:10px;
                    background:#1e293b;
                    border-radius:20px;
                    margin:25px auto 10px auto;
                    overflow:hidden;
                ">

                    <div style="
                        width:${meterWidth}%;
                        height:100%;
                        background:${accentColor};
                        box-shadow:0 0 15px ${accentColor};
                        transition:width 0.6s ease;
                    ">
                    </div>

                </div>

                <p style="
                    text-align:center;
                    font-size:13px;
                    color:#94a3b8;
                    margin-top:6px;
                ">
                    AI Risk Meter
                </p>
            `;

        } catch (error) {

            console.error("Prediction Error:", error);

            alert("Prediction failed. Check backend connection.");

        }

    });

}