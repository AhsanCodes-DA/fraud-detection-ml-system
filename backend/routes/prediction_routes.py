# This file defines API route for real-time fraud prediction
# It receives transaction data from frontend
# It uses PredictionService
# It supports optional model switching
# It returns structured prediction response


from flask import Blueprint, request, jsonify
from services.prediction_service import PredictionService
from utils.logger import setup_logger


# Create Blueprint for prediction routes
prediction_bp = Blueprint("prediction_bp", __name__)

# Initialize logger
logger = setup_logger(__name__)


@prediction_bp.route("/api/predict", methods=["POST"])
def predict():

    try:
        # Log request received
        logger.info("Prediction request received")

        # Get JSON data from frontend
        input_data = request.get_json()

        # Validate request body
        if not input_data:
            logger.warning("Prediction request failed: No input data provided")
            return jsonify({
                "status": "error",
                "message": "No input data provided"
            }), 400

        # Optional model selection
        # If not provided, PredictionService auto-selects best model
        model_name = input_data.get("model_name")

        # Remove model_name from actual feature dictionary
        if "model_name" in input_data:
            input_data.pop("model_name")

        # Initialize prediction service inside route
        prediction_service = PredictionService()

        # Call prediction service
        result = prediction_service.predict(input_data, model_name)

        # Log successful prediction
        logger.info(
            f"Prediction successful using model: {result.get('selected_model')}")

        return jsonify({
            "status": "success",
            "data": result
        })

    except Exception as e:
        logger.error(f"Prediction route error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
