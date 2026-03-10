# This file evaluates trained models correctly
# It mirrors the training pipeline split logic
# No data leakage
# No SMOTE during evaluation


import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split

from config import Config
from models.model_loader import ModelLoader


class MetricsService:

    def __init__(self):
        """
        Initialize metrics service.
        Loads:
        - Saved models
        - Saved preprocessor
        - Raw dataset
        """

        # Load saved models and preprocessor
        self.loader = ModelLoader()

        # Load dataset
        df = pd.read_csv(Config.DATA_PATH)

        # Drop unused columns (same as training)
        df = df.drop(columns=["nameOrig", "nameDest", "isFlaggedFraud"])

        self.X = df.drop("isFraud", axis=1)
        self.y = df["isFraud"]

        # Perform SAME stratified split as training
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            self.X,
            self.y,
            test_size=Config.TEST_SIZE,
            random_state=Config.RANDOM_STATE,
            stratify=self.y
        )

        # Load saved preprocessor
        self.preprocessor = self.loader.get_preprocessor()

        # Transform test data only (evaluation set)
        self.X_test_processed = self.preprocessor.transform(self.X_test)

    # Evaluate a single model

    def evaluate_model(self, model_name="xgboost"):

        # Load selected trained model
        model = self.loader.get_model(model_name)

        # Predict using untouched test data
        y_pred = model.predict(self.X_test_processed)

        # Compute evaluation metrics
        accuracy = accuracy_score(self.y_test, y_pred)
        precision = precision_score(self.y_test, y_pred)
        recall = recall_score(self.y_test, y_pred)
        f1 = f1_score(self.y_test, y_pred)

        return {
            "model_name": model_name,
            "accuracy": round(float(accuracy), 4),
            "precision": round(float(precision), 4),
            "recall": round(float(recall), 4),
            "f1_score": round(float(f1), 4)
        }

    # Evaluate all models

    def evaluate_all_models(self):

        results = []

        for model_name in ["logistic", "random_forest", "xgboost"]:
            results.append(self.evaluate_model(model_name))

        return results

    # Automatically detect best model by F1 score

    def get_best_model(self):

        results = self.evaluate_all_models()

        best = max(results, key=lambda x: x["f1_score"])

        return best
