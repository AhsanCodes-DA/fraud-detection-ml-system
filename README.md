# 🛡️ Fraud Detection Intelligence System

A full machine learning powered fraud detection system designed to identify suspicious financial transactions using multiple predictive models, explainable AI techniques, and an interactive analytics dashboard.

This project demonstrates how machine learning pipelines, model explainability, and real-time visualization can be combined to build an intelligent fraud monitoring platform.

---

# 📌 Project Overview

Financial institutions process thousands of transactions every second, making manual fraud detection extremely difficult.

This project simulates a fraud intelligence system that analyzes transaction data and predicts the likelihood of fraudulent activity.

The system trains multiple machine learning models and provides visual insights through a dashboard to help understand fraud patterns and model decisions.

The goal is not only to detect fraud but also to explain why a transaction is flagged as risky.

---

# 🚀 Key Features

* Machine learning fraud detection pipeline  
* Multiple model comparison system  
* Real-time fraud probability prediction  
* Interactive analytics dashboard  
* Fraud pattern visualization  
* Fraud heatmap analysis  
* Explainable AI insights  
* Risk scoring engine  
* Model switching and performance comparison  

---

# 🧰 Technologies Used

## ⚙️ Backend

Python  
Flask  
Scikit-Learn  
XGBoost  
Pandas  
NumPy  
Joblib  
Imbalanced-Learn (SMOTE)

The backend handles:

data preprocessing  
model training  
model evaluation  
prediction APIs  
fraud analytics APIs  

---

## 🎨 Frontend

HTML  
CSS  
Tailwind CSS  
JavaScript  

The frontend provides:

interactive fraud analytics dashboard  
model performance visualization  
fraud trend charts  
risk prediction interface  

---

## 📊 Data Visualization

ApexCharts

Used for:

Fraud trend charts  
Fraud distribution charts  
Fraud heatmap visualization  
Model performance charts  

---

# 🤖 Machine Learning Models

The system trains and compares three models:

### Logistic Regression
A baseline classification algorithm used for fraud detection.

### Random Forest
An ensemble learning method that improves prediction accuracy using multiple decision trees.

### XGBoost
An advanced gradient boosting algorithm optimized for high performance on structured datasets.

---

# 🧠 Advanced Techniques Used

### Data Preprocessing Pipeline

A custom preprocessing module prepares the dataset for machine learning models.

### Handling Imbalanced Dataset

Fraud datasets are highly imbalanced.

The project uses:

SMOTE (Synthetic Minority Oversampling Technique)

to balance fraud and non-fraud samples.

### Hyperparameter Tuning

The XGBoost model is tuned using parameters such as:

learning rate  
max depth  
subsampling  
scale_pos_weight  

to improve model performance.

### Explainable AI

Tree-based models generate feature importance explanations to show which features influence fraud predictions.

### Risk Scoring Engine

Fraud probability is converted into:

Risk Score  
Risk Category  

to make results easier to interpret.

---

# 📂 Dataset

The system uses a financial transaction dataset containing approximately *1 million records*.

Key features include:

step  
type  
amount  
oldbalanceOrg  
newbalanceOrig  
oldbalanceDest  
newbalanceDest  

The target variable is:

isFraud

---

# 🏗️ Project Architecture

User Input  
⬇  
Frontend Dashboard  
⬇  
Flask API  
⬇  
Prediction Service  
⬇  
Preprocessor  
⬇  
Machine Learning Models  
⬇  
Fraud Probability Output  

The backend exposes APIs used by the frontend dashboard to fetch analytics and run predictions.

---

# 📁 Project Folder Structure


Fraud-Intelligence-System

backend
│
├── data
│   └── fraud_0.1origbase.csv
│
├── logs
│   └── app.log
│
├── models
│   ├── saved_models
│   ├── explainability.py
│   ├── model_loader.py
│   ├── preprocessing.py
│   ├── risk_engine.py
│   └── train_models.py
│
├── routes
│   ├── dashboard_routes.py
│   ├── model_routes.py
│   └── prediction_routes.py
│
├── services
│   ├── financial_simulator.py
│   ├── heatmap_service.py
│   └── prediction_service.py
│
├── utils
│   ├── logger.py
│   └── metrics.py
│
├── venv
│   (Python virtual environment for managing project dependencies)
│
├── app.py
│
├── config.py
│
└── requirements.txt


frontend
│
├── assets
│
├── css
│   ├── animations.css
│   ├── base.css
│   ├── components.css
│   └── layout.css
│
├── icons
│
├── js
│
└── index.html


---

# 🧩 Important Backend Modules

### utils/logger.py

Handles application logging.  
Logs important events, errors, and API activity into *logs/app.log* for debugging and monitoring.

---

### utils/metrics.py

Calculates machine learning model performance metrics such as:

Accuracy  
Precision  
Recall  
F1 Score  

These metrics are used to compare models and select the best performing model.

---

### venv folder

The *venv (virtual environment)* folder contains a separate Python environment created for this project.

It stores all installed dependencies so they do not conflict with other Python projects on the system.

---

# 🔌 API Endpoints

### Dashboard Analytics

GET /api/dashboard

Returns:

fraud statistics  
model performance metrics  
fraud trends  

---

### Fraud Prediction

POST /api/predict

Example request:


{
  "step": 100,
  "type": "TRANSFER",
  "amount": 10000,
  "oldbalanceOrg": 15000,
  "newbalanceOrig": 5000,
  "oldbalanceDest": 0,
  "newbalanceDest": 10000
}


The API returns:

fraud probability  
risk score  
risk category  
selected model  

---

# ▶️ How to Run the Project

### 1️⃣ Clone the repository


git clone <repository-url>
cd Fraud-Intelligence-System


---

### 2️⃣ Create virtual environment


python -m venv venv


---

### 3️⃣ Activate virtual environment

Windows


venv\Scripts\activate


Linux / Mac


source venv/bin/activate


---

### 4️⃣ Install dependencies


pip install -r backend/requirements.txt


---

### 5️⃣ Train the models


python backend/models/train_models.py


This generates trained .pkl model files inside the *saved_models* directory.

---

### 6️⃣ Start the backend server


python backend/app.py


The Flask API will run at:


http://127.0.0.1:5000


---

### 7️⃣ Run the frontend

Open:


frontend/index.html


in your browser.

The dashboard will automatically connect to the backend API.

---

# 🔮 Future Improvements

Real-time fraud monitoring system

Database integration

User authentication system

Cloud deployment

Streaming fraud detection pipeline

---

# 👨‍💻 Author

Developed by  

*Ahsan Saifi*

AI & Machine Learning Internship Project  
Fraud Detection Intelligence System
