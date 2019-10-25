import {Controller} from "../Controller.js";
import {ClassesTree} from "./ClassesTree.js";
import {ObjectsTree} from "./ObjectsTree.js";
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
         * @type {ObjectsTree}
         */
        this.objects = new ObjectsTree(this, cfg);

        /**
         *
         * @type {ClassesTree}
         */
        this.classes = new ClassesTree(this, cfg);

        $("#showAllObjects").on('click', (event) => {
            this._selectAll();
            event.preventDefault();
        });

        $("#hideAllObjects").on('click', (event) => {
            this._deselectAll();
            event.preventDefault();
        });

        $("#showAllClasses").on('click', (event) => {
            this._selectAll();
            event.preventDefault();
        });

        $("#hideAllClasses").on('click', (event) => {
            this._deselectAll();
            event.preventDefault();
        });

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

    _selectAll() {

        this.objects.muteEvents();
        this.classes.muteEvents();

        this.viewer.scene.setObjectsVisible(this.viewer.scene.objectIds, true);

        this.objects.selectAll();
        this.classes.selectAll();

        this.objects.unmuteEvents();
        this.classes.unmuteEvents();
    }

    _deselectAll() {

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