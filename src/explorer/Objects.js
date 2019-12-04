import {Controller} from "../Controller.js";
import {StructureTreeViewPlugin} from "@xeokit/xeokit-sdk/src/plugins/StructureTreeViewPlugin/StructureTreeViewPlugin.js";

class Objects extends Controller {

    constructor(parent, cfg = {}) {

        super(parent);

        if (!cfg.objectsTabElement) {
            throw "Missing config: objectsTabElement";
        }

        if (!cfg.showAllObjectsButtonElement) {
            throw "Missing config: showAllObjectsButtonElement";
        }

        if (!cfg.hideAllObjectsButtonElement) {
            throw "Missing config: hideAllObjectsButtonElement";
        }

        if (!cfg.objectsElement) {
            throw "Missing config: objectsElement";
        }

        this._objectsTabElement = cfg.objectsTabElement;
        this._showAllObjectsButtonElement = cfg.showAllObjectsButtonElement;
        this._hideAllObjectsButtonElement = cfg.hideAllObjectsButtonElement;
        this._objectsTabButtonElement = this._objectsTabElement.querySelector(".xeokit-tab-btn");

        if (!this._objectsTabButtonElement) {
            throw "Missing DOM element: ,xeokit-tab-btn";
        }

        const objectsElement = cfg.objectsElement;

        this._modelNodeIDs = {}; // For each model, an array of IDs of tree nodes
        this._muteTreeEvents = false;
        this._muteEntityEvents = false;

        this._tree = new StructureTreeViewPlugin(this.viewer, {
            containerElement: objectsElement
        });
    }

    _addModel(modelId) {
        this._tree.addModel(modelId);
    }

    _removeModel(modelId) {
        this._tree.removeModel(modelId);
    }

    _synchTreeFromScene(modelId) {

    }

    _setObjectVisibilities(metaObject) {

    }

    setEnabled(enabled) {
        if (!enabled) {
            this._objectsTabButtonElement.classList.add("disabled");
            this._showAllObjectsButtonElement.classList.add("disabled");
            this._hideAllObjectsButtonElement.classList.add("disabled");
        } else {
            this._objectsTabButtonElement.classList.remove("disabled");
            this._showAllObjectsButtonElement.classList.remove("disabled");
            this._hideAllObjectsButtonElement.classList.remove("disabled");
        }
    }

    muteEvents() {
        this._muteTreeEvents = true;
        this._muteEntityEvents = true;
    }

    unmuteEvents() {
        this._muteTreeEvents = false;
        this._muteEntityEvents = false;
    }

    selectAll() {
      //  this._tree.selectDeep();
    }

    deselectAll() {
    //    this._tree.deselectDeep();
    }

    destroy() {
        super.destroy();
    }
}

export {Objects};