import os

# Configuration class stores application settings
# These values can be modified easily if needed


class Config:
    # Path to dataset file
    DATA_PATH = os.path.join("data", "fraud_0.1origbase.csv")

    # Folder to save trained models
    MODEL_PATH = os.path.join("models", "saved_models")

    # Random state ensures reproducibility
    RANDOM_STATE = 42

    # Test size for train-test split
    TEST_SIZE = 0.2
