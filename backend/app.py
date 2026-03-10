# This is main Flask application file
# It registers all routes and starts the server

from flask import Flask
from flask_cors import CORS

from routes.prediction_routes import prediction_bp
from routes.dashboard_routes import dashboard_bp
from routes.model_routes import model_bp


def create_app():

    app = Flask(__name__)

    # Enable CORS for frontend connection
    CORS(app)

    # Register blueprints
    app.register_blueprint(prediction_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(model_bp)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
