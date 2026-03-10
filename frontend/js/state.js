/* Stores selected model and notifies listeners          */


/* Global state object */
const AppState = {

    /* Currently selected model */
    selectedModel: null,

    /* Listeners that react to model change */
    listeners: [],

    /* Change selected model */
    setModel(modelName) {

        this.selectedModel = modelName;

        /* Notify all listeners */
        this.listeners.forEach(callback => callback(modelName));
    },

    /* Subscribe to model change */
    subscribe(callback) {
        this.listeners.push(callback);
    }
};