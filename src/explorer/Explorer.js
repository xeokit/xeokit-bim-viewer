import {Controller} from "../Controller.js";
import {Classes} from "./Classes.js";
import {Objects} from "./Objects.js";
import {Models} from "./Models.js";

/**
 * Manages the explorer trees.
 *
 * Located at {@link Toolbar#explorer}.
 */
class Explorer extends Controller {

    /** @private */
    constructor(parent, cfg = {}) {

        super(parent);

        /**
         *
         * @type {Models}
         */
        this.models = new Models(this, cfg);

        /**
         *
         * @type {Objects}
         */
        this.objects = new Objects(this, cfg);

        /**
         *
         * @type {Classes}
         */
        this.classes = new Classes(this, cfg);

        // /**
        //  *
        //  * @type {Storeys}
        //  */
        // this.storeys = new Storeys(this, cfg);

        $("#unloadAllModels").on('click', (event) => {
            this._unloadAllModels();
            event.preventDefault();
        });

        $("#showAllObjects").on('click', (event) => {
            this._showAllObjects();
            event.preventDefault();
        });

        $("#hideAllObjects").on('click', (event) => {
            this._hideAllObjects();
            event.preventDefault();
        });

        $("#showAllClasses").on('click', (event) => {
            this._showAllObjects();
            event.preventDefault();
        });

        $("#hideAllClasses").on('click', (event) => {
            this._hideAllObjects();
            event.preventDefault();
        });

        // Handling model load events here ensures that we
        // are able to fire "modelLoaded" after both trees updated.

        this.models.on("modelLoaded", (modelId) => {
            this.objects._addModel(modelId);
            this.classes._addModel(modelId);
            this.fire("modelLoaded", modelId);
        });

        this.models.on("modelUnloaded", (modelId) => {
            this.objects._removeModel(modelId);
            this.classes._removeModel(modelId);
            this.fire("modelUnloaded", modelId);
        });
    }

    _unloadAllModels() {
        // TODO
    }

    _showAllObjects() {

        this.objects.muteEvents();
        this.classes.muteEvents();

        this.viewer.scene.setObjectsVisible(this.viewer.scene.objectIds, true);

        this.objects.selectAll();
        this.classes.selectAll();

        this.objects.unmuteEvents();
        this.classes.unmuteEvents();
    }

    _hideAllObjects() {

        this.objects.muteEvents();
        this.classes.muteEvents();

        this.viewer.scene.setObjectsVisible(this.viewer.scene.visibleObjectIds, false);

        this.objects.deselectAll();
        this.classes.deselectAll();

        this.objects.unmuteEvents();
        this.classes.unmuteEvents();
    }

    destroy() {
        super.destroy();
    }
}

export {Explorer};