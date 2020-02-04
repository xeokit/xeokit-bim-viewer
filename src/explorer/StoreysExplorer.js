import {Controller} from "../Controller.js";
import {TreeViewPlugin} from "@xeokit/xeokit-sdk/src/plugins/TreeViewPlugin/TreeViewPlugin.js";
import {ContextMenu} from "@xeokit/xeokit-sdk/src/extras/ContextMenu/ContextMenu.js";
import {TreeViewContextMenuItems} from "../contextMenuItems/TreeViewContextMenuItems.js";

/** @private */
class StoreysExplorer extends Controller {

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
            throw "Missing DOM element: .xeokit-tab-btn";
        }

        const storeysElement = cfg.storeysElement;

        this._treeView = new TreeViewPlugin(this.viewer, {
            containerElement: storeysElement,
            autoAddModels: false,
            hierarchy: "storeys"
        });

        this._treeViewContextMenu = new ContextMenu({
            items: TreeViewContextMenuItems
        });

        this._treeView.on("contextmenu", (e) => {
            this._treeViewContextMenu.show(e.event.pageX, e.event.pageY);
            this._treeViewContextMenu.context = {
                viewer: e.viewer,
                treeViewPlugin: e.treeViewPlugin,
                treeViewNode: e.treeViewNode
            };
        });

        this._onModelLoaded = this.viewer.scene.on("modelLoaded", (modelId) =>{
            const modelInfo = this.bimViewer._modelsExplorer.getModelInfo(modelId);
            if (!modelInfo) {
                return;
            }
            this._treeView.addModel(modelId, {
                rootName: modelInfo.name
            });
        });

        this._onModelUnloaded = this.viewer.scene.on("modelUnloaded", (modelId) => {
            if (this.viewer.metaScene.metaModels[modelId]) {
                this._treeView.removeModel(modelId);
            }
        });

        this.bimViewer.on("reset", () => {
            this._treeView.collapse();
            this._treeView.expandToDepth(1);
        });
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

    showNodeInTreeView(objectId) {
        this._treeView.collapse();
        this._treeView.showNode(objectId);
    }

    unShowNodeInTreeView() {
        this._treeView.unShowNode();
    }

    destroy() {
        super.destroy();
        this._treeView.destroy();
        this._treeViewContextMenu.destroy();
        this.viewer.scene.off(this._onModelLoaded);
        this.viewer.scene.off(this._onModelUnloaded);
    }
}

export {StoreysExplorer};