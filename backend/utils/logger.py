import logging
import os

# This function creates and returns a logger object
# Logger helps us track errors and important information during execution


def setup_logger(name: str):
    # Create logs directory if not exists
    if not os.path.exists("logs"):
        os.makedirs("logs")

    # Create logger
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    # Create file handler to save logs into a file
    file_handler = logging.FileHandler("logs/app.log")
    file_handler.setLevel(logging.INFO)

    # Create formatter to define log message structure
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    file_handler.setFormatter(formatter)

    # Avoid duplicate handlers
    if not logger.handlers:
        logger.addHandler(file_handler)

    return logger
