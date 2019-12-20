import {Controller} from "../Controller.js";
import {TreeViewPlugin} from "@xeokit/xeokit-sdk/src/plugins/TreeViewPlugin/TreeViewPlugin.js";

class Storeys extends Controller {

    constructor(parent, cfg = {}) {

        super(parent);

        if (!cfg.storeysTabElement) {
            throw "Missing config: storeysTabElement";
        }

        if (!cfg.showAllStoreysButtonElement) {
            throw "Missing config: showAllStoreysButtonElement";
        }

        if (!cfg.hideAllStoreysButtonElement) {
            throw "Missing config: hideAllStoreysButtonElement";
        }

        if (!cfg.storeysElement) {
            throw "Missing config: storeysElement";
        }

        this._storeysTabElement = cfg.storeysTabElement;
        this._showAllStoreysButtonElement = cfg.showAllStoreysButtonElement;
        this._hideAllStoreysButtonElement = cfg.hideAllStoreysButtonElement;
        this._storeysTabButtonElement = this._storeysTabElement.querySelector(".xeokit-tab-btn");

        if (!this._storeysTabButtonElement) {
            throw "Missing DOM element: ,xeokit-tab-btn";
        }

        const storeysElement = cfg.storeysElement;

        this._modelNodeIDs = {}; // For each model, an array of IDs of tree nodes
        this._muteTreeEvents = false;
        this._muteEntityEvents = false;

        this._tree = new TreeViewPlugin(this.viewer, {
            containerElement: storeysElement,
            mode: "storeys"
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
            this._storeysTabButtonElement.classList.add("disabled");
            this._showAllStoreysButtonElement.classList.add("disabled");
            this._hideAllStoreysButtonElement.classList.add("disabled");
        } else {
            this._storeysTabButtonElement.classList.remove("disabled");
            this._showAllStoreysButtonElement.classList.remove("disabled");
            this._hideAllStoreysButtonElement.classList.remove("disabled");
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

export {Storeys};