/* Dynamically changes accent color based on model       */


/* Model → Color mapping */
const modelThemeMap = {
    logistic: "#3b82f6", // Blue
    random_forest: "#10b981", // Green
    xgboost: "#7c3aed" // Purple
};

/* Apply accent color to root CSS variable */
function applyTheme(modelName) {

    const color = modelThemeMap[modelName] || "#7c3aed";

    /* Update CSS variable */
    document.documentElement.style.setProperty("--accent-color", color);

    /* Update glow variable */
    document.documentElement.style.setProperty(
        "--accent-glow",
        color + "80"
    );
}

/* Subscribe to model changes */
AppState.subscribe((modelName) => {
    applyTheme(modelName);
});