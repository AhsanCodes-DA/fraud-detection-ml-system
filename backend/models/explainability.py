# This file provides proper SHAP explainability
# It explains which features contributed most to fraud prediction

import shap
import pandas as pd


class ExplainabilityEngine:

    def __init__(self, model, feature_names):
        # Create SHAP explainer for tree-based models
        self.explainer = shap.TreeExplainer(model)
        self.feature_names = feature_names

    def explain(self, processed_data):

        # Generate SHAP values
        shap_values = self.explainer.shap_values(processed_data)

        # If binary classification, use index 1 (fraud class)
        if isinstance(shap_values, list):
            shap_values = shap_values[1]

        # Get SHAP values for first row
        values = shap_values[0]

        # Map feature names with SHAP values
        explanation = {}

        for feature, value in zip(self.feature_names, values):
            explanation[feature] = float(round(value, 4))

        # Sort by absolute impact
        explanation = dict(
            sorted(
                explanation.items(),
                key=lambda item: abs(item[1]),
                reverse=True
            )
        )

        return explanation
