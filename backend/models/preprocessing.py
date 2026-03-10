import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler


class Preprocessor:
    def __init__(self):
        self.label_encoders = {}
        self.scaler = StandardScaler()
        self.fitted = False

    def fit_transform(self, df: pd.DataFrame):
        df = df.copy()

        # Encode categorical columns
        for column in df.select_dtypes(include=["object"]).columns:
            le = LabelEncoder()
            df[column] = le.fit_transform(df[column])
            self.label_encoders[column] = le

        # Scale numeric features
        df_scaled = self.scaler.fit_transform(df)

        self.fitted = True
        return df_scaled

    def transform(self, df: pd.DataFrame):
        if not self.fitted:
            raise Exception(
                "Preprocessor must be fitted before calling transform.")

        df = df.copy()

        for column in df.select_dtypes(include=["object"]).columns:
            if column in self.label_encoders:
                df[column] = self.label_encoders[column].transform(df[column])

        df_scaled = self.scaler.transform(df)

        return df_scaled
