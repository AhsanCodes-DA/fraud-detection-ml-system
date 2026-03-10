# This file provides API endpoints related to ML models
# It returns available models, best model, and evaluation metrics


from flask import Blueprint, jsonify
import os

from config import Config
from utils.metrics import MetricsService
from utils.logger import setup_logger


model_bp = Blueprint("model_bp", __name__)

# Initialize logger
logger = setup_logger(__name__)


@model_bp.route("/api/models", methods=["GET"])
def get_models():

    try:
        logger.info("Models API request received")

        # Detect available trained model files dynamically
        model_files = []

        for file in os.listdir(Config.MODEL_PATH):
            if file.endswith(".pkl") and file != "preprocessor.pkl":
                model_name = file.replace(".pkl", "")
                model_files.append(model_name)

        #  Get model performance metrics
        metrics_service = MetricsService()

        all_metrics = metrics_service.evaluate_all_models()
        best_model = metrics_service.get_best_model()

        logger.info("Models API response prepared successfully")

        # Return structured response
        return jsonify({
            "status": "success",
            "available_models": model_files,
            "best_model": best_model,
            "model_metrics": all_metrics
        })

    except Exception as e:
        logger.error(f"Model route error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
