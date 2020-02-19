import {ContextMenu} from "@xeokit/xeokit-sdk/src/extras/ContextMenu/ContextMenu.js";

/**
 * @private
 */
class ModelsContextMenu extends ContextMenu {
    constructor(cfg = {}) {
        super({
            context: cfg.context,
            items: [
                [
                    {
                        title: "Load",
                        getEnabled: function (context) {
                            return (!context.bimViewer.isModelLoaded(context.modelId));
                        },
                        doAction: function (context) {
                            context.bimViewer.loadModel(context.modelId);
                        }
                    },
                    {
                        title: "Unload",
                        getEnabled: function (context) {
                            return context.bimViewer.isModelLoaded(context.modelId);
                        },
                        doAction: function (context) {
                            context.bimViewer.unloadModel(context.modelId);
                        }
                    },
                    {
                        title: "Load All",
                        getEnabled: function (context) {
                            const bimViewer = context.bimViewer;
                            const modelIds = bimViewer.getModelIds();
                            const loadedModelIds = bimViewer.getLoadedModelIds();
                            return (loadedModelIds.length < modelIds.length);
                        },
                        doAction: function (context) {
                            context.bimViewer.loadAllModels();
                        }
                    },
                    {
                        title: "Unload All",
                        getEnabled: function (context) {
                            const loadedModelIds = context.bimViewer.getLoadedModelIds();
                            return (loadedModelIds.length > 0);
                        },
                        doAction: function (context) {
                            context.bimViewer.unloadAllModels();
                        }
                    }
                ]
            ]
        })
    }
}

export {ModelsContextMenu};