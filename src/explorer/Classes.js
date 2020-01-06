import {Controller} from "../Controller.js";
import {TreeViewPlugin} from "@xeokit/xeokit-sdk/src/plugins/TreeViewPlugin/TreeViewPlugin.js";

class Classes extends Controller {

    constructor(parent, cfg = {}) {

        super(parent);

        if (!cfg.classesTabElement) {
            throw "Missing config: classesTabElement";
        }

        if (!cfg.showAllClassesButtonElement) {
            throw "Missing config: showAllClassesButtonElement";
        }

        if (!cfg.hideAllClassesButtonElement) {
            throw "Missing config: hideAllClassesButtonElement";
        }

        if (!cfg.classesElement) {
            throw "Missing config: classesElement";
        }

        this._classesTabElement = cfg.classesTabElement;
        this._showAllClassesButtonElement = cfg.showAllClassesButtonElement;
        this._hideAllClassesButtonElement = cfg.hideAllClassesButtonElement;
        this._classesTabButtonElement = this._classesTabElement.querySelector(".xeokit-tab-btn");

        if (!this._classesTabButtonElement) {
            throw "Missing DOM element: xeokit-tab-btn";
        }

        const classesElement = cfg.classesElement;

        this._treeView = new TreeViewPlugin(this.viewer, {
            containerElement: classesElement,
            hierarchy: "types",
            autoAddModels: false
        });

        this._onModelLoaded = this.viewer.scene.on("modelLoaded", (modelId) =>{
            if (this.viewer.metaScene.metaModels[modelId]) {
                this._treeView.addModel(modelId);
            }
        });

        this._onModelUnloaded = this.viewer.scene.on("modelUnloaded", (modelId) => {
            if (this.viewer.metaScene.metaModels[modelId]) {
                this._treeView.removeModel(modelId);
            }
        });
    }

    setEnabled(enabled) {
        if (!enabled) {
            this._classesTabButtonElement.classList.add("disabled");
            this._showAllClassesButtonElement.classList.add("disabled");
            this._hideAllClassesButtonElement.classList.add("disabled");
        } else {
            this._classesTabButtonElement.classList.remove("disabled");
            this._showAllClassesButtonElement.classList.remove("disabled");
            this._hideAllClassesButtonElement.classList.remove("disabled");
        }
    }

    destroy() {
        super.destroy();
        this._treeView.destroy();
        this.viewer.scene.off(this._onModelLoaded);
        this.viewer.scene.off(this._onModelUnloaded);
    }
}

export {Classes};