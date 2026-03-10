# This service handles full prediction workflow
# It loads trained models and preprocessor
# It automatically selects best model if not specified
# It calculates fraud probability and risk score
# It optionally provides explainability for tree-based models

import pandas as pd
from models.model_loader import ModelLoader
from models.risk_engine import RiskEngine
from utils.metrics import MetricsService


class PredictionService:

    def __init__(self):

        # Load trained models
        self.loader = ModelLoader()

        # Risk scoring engine
        self.risk_engine = RiskEngine()

        # Model metrics service
        self.metrics_service = MetricsService()

        # Feature order used during training
        self.feature_order = [
            "step",
            "type",
            "amount",
            "oldbalanceOrg",
            "newbalanceOrig",
            "oldbalanceDest",
            "newbalanceDest"
        ]

    # Main Prediction Method

    def predict(self, input_data, model_name=None):

        # Auto select best model if none provided
        if model_name is None:
            best_model_info = self.metrics_service.get_best_model()
            model_name = best_model_info["model_name"]

        # Validate model
        model = self.loader.get_model(model_name)
        if model is None:
            raise ValueError("Invalid model name provided.")

        # Force correct feature order

        ordered_input = {}

        for feature in self.feature_order:
            ordered_input[feature] = input_data.get(feature)

        df = pd.DataFrame([ordered_input])

        # Apply preprocessing

        preprocessor = self.loader.get_preprocessor()

        processed = preprocessor.transform(df)

        # Predict fraud probability

        probability = model.predict_proba(processed)[0][1]

        # Convert to risk score
        risk_score = self.risk_engine.calculate_risk_score(probability)

        # Risk category
        risk_category = self.risk_engine.categorize_risk(risk_score)

        explanation = None

        # Explainability for tree models
        if model_name in ["random_forest", "xgboost"]:

            try:
                from models.explainability import ExplainabilityEngine

                feature_names = df.columns.tolist()

                explainer = ExplainabilityEngine(model, feature_names)

                explanation = explainer.explain(processed)

            except Exception:
                explanation = None

        # Return prediction

        return {
            "selected_model": model_name,
            "fraud_probability": float(probability),
            "risk_score": risk_score,
            "risk_category": risk_category,
            "explanation": explanation
        }
