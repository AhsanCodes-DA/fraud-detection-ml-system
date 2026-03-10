
import os

import pandas as pd

import joblib

# importing train_test_split to split dataset into training and testing sets
from sklearn.model_selection import train_test_split

# importing Logistic Regression algorithm
from sklearn.linear_model import LogisticRegression

# importing Random Forest algorithm
from sklearn.ensemble import RandomForestClassifier

# importing evaluation metrics to measure model performance
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

from xgboost import XGBClassifier

# importing SMOTE to handle class imbalance by oversampling minority class
from imblearn.over_sampling import SMOTE


from config import Config

# importing custom preprocessing class used to clean and transform data
from models.preprocessing import Preprocessor


# main function that trains models and saves them
def train_and_save_models():

    # print message indicating training process has started
    print("\nStarting training pipeline...\n")

    #  Load Dataset

    # reading dataset from path defined in config file
    df = pd.read_csv(Config.DATA_PATH)

    # dropping columns that are not useful for model training
    df = df.drop(columns=["nameOrig", "nameDest", "isFlaggedFraud"])

    # separating features (X) and target label (y)
    X = df.drop("isFraud", axis=1)
    y = df["isFraud"]

    # 2. Train-Test Split (Before any preprocessing)

    # splitting dataset into training and testing sets
    # test_size defines how much data will be used for testing
    # stratify keeps fraud ratio balanced in both train and test sets
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=Config.TEST_SIZE,
        random_state=Config.RANDOM_STATE,
        stratify=y
    )

    # Preprocessing

    # creating instance of preprocessing class
    preprocessor = Preprocessor()

    # fitting preprocessing on training data and transforming it
    X_train_processed = preprocessor.fit_transform(X_train)

    # transforming test data using same preprocessing rules
    X_test_processed = preprocessor.transform(X_test)

    #  Logistic + Random Forest (Using SMOTE)

    # creating SMOTE object to balance fraud and non fraud samples
    smote = SMOTE(random_state=Config.RANDOM_STATE)

    # applying SMOTE to training data to generate synthetic fraud samples
    X_train_resampled, y_train_resampled = smote.fit_resample(
        X_train_processed,
        y_train
    )

    # initializing Logistic Regression model
    logistic = LogisticRegression(max_iter=1000)

    # initializing Random Forest model with multiple decision trees
    rf = RandomForestClassifier(
        n_estimators=300,
        max_depth=None,
        random_state=Config.RANDOM_STATE,
        n_jobs=-1
    )

    # training Logistic Regression using balanced dataset
    logistic.fit(X_train_resampled, y_train_resampled)

    # training Random Forest using balanced dataset
    rf.fit(X_train_resampled, y_train_resampled)

    # sXGBoost (NO SMOTE, Use scale_pos_weight)

    # calculating number of non fraud transactions
    neg = sum(y_train == 0)

    # calculating number of fraud transactions
    pos = sum(y_train == 1)

    # calculating imbalance ratio between majority and minority class
    base_ratio = neg / pos

    # slightly reducing imbalance weight to stabilize model training
    scale_pos_weight = base_ratio * 0.6

    # printing imbalance weight used by XGBoost
    print(f"Adjusted scale_pos_weight used: {scale_pos_weight:.2f}")

    # initializing XGBoost model with advanced tuned parameters
    xgb = XGBClassifier(
        n_estimators=800,
        learning_rate=0.02,
        max_depth=7,
        min_child_weight=5,
        gamma=1,
        subsample=0.85,
        colsample_bytree=0.85,
        scale_pos_weight=scale_pos_weight,
        random_state=Config.RANDOM_STATE,
        eval_metric="logloss",
        n_jobs=-1
    )

    # training XGBoost model using processed training data
    # evaluation set used to monitor performance on test data
    xgb.fit(
        X_train_processed,
        y_train,
        eval_set=[(X_test_processed, y_test)],
        verbose=False
    )

    # Evaluation

    # printing evaluation section header
    print("\n===== MODEL EVALUATION RESULTS =====\n")

    # dictionary storing model names and objects
    models = {
        "Logistic Regression": logistic,
        "Random Forest": rf,
        "XGBoost (Tuned)": xgb
    }

    # looping through each trained model for evaluation
    for name, model in models.items():

        # generating predictions using test dataset
        y_pred = model.predict(X_test_processed)

        # printing model name
        print(f"Model: {name}")

        # calculating accuracy score
        print("Accuracy :", round(accuracy_score(y_test, y_pred), 4))

        # calculating precision score
        print("Precision:", round(precision_score(y_test, y_pred), 4))

        # calculating recall score
        print("Recall   :", round(recall_score(y_test, y_pred), 4))

        # calculating F1 score
        print("F1 Score :", round(f1_score(y_test, y_pred), 4))

        # printing separator line
        print("-----------------")

    #  Save Models

    # creating directory to store trained models if it does not exist
    os.makedirs(Config.MODEL_PATH, exist_ok=True)

    # saving logistic regression model
    joblib.dump(logistic, os.path.join(Config.MODEL_PATH, "logistic.pkl"))

    # saving random forest model
    joblib.dump(rf, os.path.join(Config.MODEL_PATH, "random_forest.pkl"))

    # saving XGBoost model
    joblib.dump(xgb, os.path.join(Config.MODEL_PATH, "xgboost.pkl"))

    # saving preprocessing object to reuse during prediction
    joblib.dump(preprocessor, os.path.join(
        Config.MODEL_PATH, "preprocessor.pkl"))

    # printing success message
    print("\nModels saved successfully.\n")


# running the training pipeline if this script is executed directly
if __name__ == "__main__":
    train_and_save_models()
