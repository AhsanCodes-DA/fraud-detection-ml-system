# This file converts model probability into a risk score
# Risk score helps classify transaction into Low, Medium, High, Critical


class RiskEngine:

    # Convert probability (0 to 1) into score (0 to 100)
    def calculate_risk_score(self, probability):
        score = probability * 100
        # Force clean two decimal format
        return round(float(score), 2)

    # Categorize risk level based on score
    def categorize_risk(self, score):

        if score < 30:
            return "Low Risk"

        elif score < 60:
            return "Medium Risk"

        elif score < 85:
            return "High Risk"

        else:
            return "Critical Risk"
