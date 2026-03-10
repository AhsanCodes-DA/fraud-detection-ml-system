# This service calculates realistic financial impact
# based on confusion matrix values


class FinancialSimulator:

    def __init__(self):
        """
        Financial assumptions aligned with project PDF
        """

        self.average_fraud_amount = 5000        # average fraud value
        self.false_positive_cost = 50           # cost per wrong fraud alert
        self.detection_reward_rate = 0.25       # company earns 25% of detected fraud

    # Simulate financial impact using actual predictions

    def simulate(self, y_true, y_pred):
        """
        y_true: actual labels
        y_pred: model predictions
        """

        # Initialize counters
        true_positive = 0
        false_positive = 0
        false_negative = 0
        true_negative = 0

        # Build confusion matrix manually
        for actual, predicted in zip(y_true, y_pred):

            if actual == 1 and predicted == 1:
                true_positive += 1

            elif actual == 0 and predicted == 1:
                false_positive += 1

            elif actual == 1 and predicted == 0:
                false_negative += 1

            else:
                true_negative += 1

        # Financial calculations

        fraud_prevented_amount = true_positive * self.average_fraud_amount
        missed_fraud_loss = false_negative * self.average_fraud_amount

        revenue_generated = fraud_prevented_amount * self.detection_reward_rate
        total_false_positive_cost = false_positive * self.false_positive_cost

        net_profit = revenue_generated - total_false_positive_cost - missed_fraud_loss

        return {
            "true_positive": true_positive,
            "false_positive": false_positive,
            "false_negative": false_negative,
            "true_negative": true_negative,
            "fraud_prevented_amount": fraud_prevented_amount,
            "missed_fraud_loss": missed_fraud_loss,
            "revenue_generated": revenue_generated,
            "false_positive_cost": total_false_positive_cost,
            "net_profit": net_profit
        }
