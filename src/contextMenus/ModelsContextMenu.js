import {ContextMenu} from "@xeokit/xeokit-sdk/src/extras/ContextMenu/ContextMenu.js";

/**
 * @private
 * @param {*} cfg Configs
 * @param {Boolean} [cfg.enableEditModels=false] Set true to show Add/Edit/Delete options in the menu.
 */
class ModelsContextMenu extends ContextMenu {

    constructor(cfg = {}) {

        const enableEditModels = (!!cfg.enableEditModels);

        const items = [
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
                }
            ]
        ];

        if (enableEditModels) {

            items.push([
                {
                    title: "Edit",
                    getEnabled: function (context) {
                        return true;
                    },
                    doAction: function (context) {
                        context.bimViewer.editModel(context.modelId);
                    }
                },
                {
                    title: "Delete",
                    getEnabled: function (context) {
                        return true;
                    },
                    doAction: function (context) {
                        context.bimViewer.deleteModel(context.modelId);
                    }
                }
            ]);
        }

        items.push([
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
        ]);

        items.push([
            {
                title: "Clear Slices",
                getEnabled: function (context) {
                    return (context.bimViewer.getNumSections() > 0);
                },
                doAction: function (context) {
                    context.bimViewer.clearSections();
                }
            }
        ]);

        super({
            context: cfg.context,
            items: items
        });
    }
}

export {ModelsContextMenu};