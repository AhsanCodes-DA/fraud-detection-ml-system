# This service prepares aggregated fraud analytics data
# It is optimized for large datasets (1M+ rows)
# It does NOT send raw rows to frontend
# It only returns summarized data for charts


import pandas as pd
from config import Config


class HeatmapService:

    def __init__(self):
        """
        Load only required columns to reduce memory usage.
        This is important for large datasets.
        """

        # Read only necessary columns instead of full dataset
        self.df = pd.read_csv(
            Config.DATA_PATH,
            usecols=["step", "type", "isFraud"]
        )

    # Fraud Count by Transaction Type by Bar / Donut Chart

    def fraud_by_type(self):
        """
        Returns total fraud cases grouped by transaction type.
        Used for bar chart or donut chart.
        """

        # Filter only fraud transactions
        fraud_df = self.df[self.df["isFraud"] == 1]

        # Count fraud cases per transaction type
        fraud_counts = (
            fraud_df
            .groupby("type")
            .size()
            .reset_index(name="fraud_count")
        )

        # Convert to dictionary format for API response
        return fraud_counts.to_dict(orient="records")

    # Fraud Trend Over Time by Line Chart - Aggregated

    def fraud_trend_over_time(self, bucket_size=50):
        """
        Returns fraud counts grouped into time buckets.
        bucket_size controls how many steps are merged together.
        This prevents line chart from having thousands of points.
        """

        # Filter fraud transactions only
        fraud_df = self.df[self.df["isFraud"] == 1]

        # Create time buckets
        fraud_df.loc[:, "time_bucket"] = (
            fraud_df["step"] // bucket_size) * bucket_size

        # Count fraud per time bucket
        trend = (
            fraud_df
            .groupby("time_bucket")
            .size()
            .reset_index(name="fraud_count")
        )

        # Sort by time
        trend = trend.sort_values("time_bucket")

        return trend.to_dict(orient="records")

    # Fraud Ratio by Transaction Type (Donut / Heatmap)

    def fraud_ratio_by_type(self):
        """
        Returns fraud percentage per transaction type.
        Used for donut chart or risk heatmap.
        """

        # Total transactions per type
        total_counts = self.df.groupby("type").size()

        # Fraud transactions per type
        fraud_counts = (
            self.df[self.df["isFraud"] == 1]
            .groupby("type")
            .size()
        )

        # Combine total and fraud counts
        ratio_df = pd.DataFrame({
            "total_transactions": total_counts,
            "fraud_transactions": fraud_counts
        }).fillna(0)

        # Calculate fraud percentage
        ratio_df["fraud_percentage"] = (
            ratio_df["fraud_transactions"] /
            ratio_df["total_transactions"] * 100
        )

        # Reset index for clean JSON output
        ratio_df = ratio_df.reset_index()

        return ratio_df.to_dict(orient="records")

    # Dashboard Card Data

    def dashboard_summary(self):
        """
        Returns overall fraud summary numbers for dashboard cards.
        """

        total_transactions = len(self.df)
        total_fraud = int(self.df["isFraud"].sum())

        fraud_rate = round((total_fraud / total_transactions) * 100, 4)

        return {
            "total_transactions": total_transactions,
            "total_fraud_cases": total_fraud,
            "fraud_rate_percentage": fraud_rate
        }
