# This file provides unified dashboard API endpoint
# It aggregates all backend analytics into one clean response
# Used by frontend to load full dashboard with single API call


from flask import Blueprint, jsonify
from services.heatmap_service import HeatmapService
from services.financial_simulator import FinancialSimulator
from utils.metrics import MetricsService
from utils.logger import setup_logger


dashboard_bp = Blueprint("dashboard_bp", __name__)

# Initialize logger
logger = setup_logger(__name__)


@dashboard_bp.route("/api/dashboard", methods=["GET"])
def unified_dashboard():

    try:
        logger.info("Dashboard API request received")

        # Initialize services
        heatmap_service = HeatmapService()
        metrics_service = MetricsService()
        financial_simulator = FinancialSimulator()

        # Dashboard Summary
        summary_data = heatmap_service.dashboard_summary()

        # Fraud Charts Data
        fraud_by_type = heatmap_service.fraud_by_type()
        fraud_trend = heatmap_service.fraud_trend_over_time()
        fraud_ratio = heatmap_service.fraud_ratio_by_type()

        #  Model Metrics
        all_models_metrics = metrics_service.evaluate_all_models()
        best_model = metrics_service.get_best_model()

        # Financial Simulation (Real Test Set)
        model = metrics_service.loader.get_model(best_model["model_name"])
        y_pred = model.predict(metrics_service.X_test_processed)

        financial_result = financial_simulator.simulate(
            metrics_service.y_test,
            y_pred
        )

        logger.info("Dashboard API response prepared successfully")

        return jsonify({
            "summary": summary_data,
            "fraud_by_type": fraud_by_type,
            "fraud_trend": fraud_trend,
            "fraud_ratio": fraud_ratio,
            "model_metrics": all_models_metrics,
            "best_model": best_model,
            "financial_simulation": financial_result
        })

    except Exception as e:
        logger.error(f"Dashboard route error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
