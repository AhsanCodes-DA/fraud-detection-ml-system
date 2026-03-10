import os
import joblib
from config import Config


# This class loads saved machine learning models
# It also loads the preprocessor used during training


class ModelLoader:

    def __init__(self):
        # Store model folder path
        self.model_path = Config.MODEL_PATH

        # Dictionary to hold loaded models
        self.models = {}

        # Variable to hold preprocessor
        self.preprocessor = None

        # Load models immediately when object is created
        self.load_models()

    def load_models(self):

        # Load Logistic Regression model
        self.models["logistic"] = joblib.load(
            os.path.join(self.model_path, "logistic.pkl")
        )

        # Load Random Forest model
        self.models["random_forest"] = joblib.load(
            os.path.join(self.model_path, "random_forest.pkl")
        )

        # Load XGBoost model
        self.models["xgboost"] = joblib.load(
            os.path.join(self.model_path, "xgboost.pkl")
        )

        # Load preprocessor used during training
        self.preprocessor = joblib.load(
            os.path.join(self.model_path, "preprocessor.pkl")
        )

    # Return requested model
    def get_model(self, model_name):
        return self.models.get(model_name)

    # Return preprocessor
    def get_preprocessor(self):
        return self.preprocessor
