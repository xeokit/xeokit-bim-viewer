import {ContextMenu} from "@xeokit/xeokit-sdk/dist/xeokit-sdk.es.js";

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
                    getTitle: (context) => {
                        return context.viewer.localeService.translate("modelsContextMenu.loadModel") || "Load";
                    },
                    getEnabled: (context) => {
                        return (!context.bimViewer.isModelLoaded(context.modelId));
                    },
                    doAction: (context) => {
                        context.bimViewer.loadModel(context.modelId);
                    }
                },
                {
                    getTitle: (context) => {
                        return context.viewer.localeService.translate("modelsContextMenu.unloadModel") || "Unload";
                    },
                    getEnabled: (context) => {
                        return context.bimViewer.isModelLoaded(context.modelId);
                    },
                    doAction: (context) => {
                        context.bimViewer.unloadModel(context.modelId);
                    }
                }
            ]
        ];

        if (enableEditModels) {

            items.push([
                {
                    getTitle: (context) => {
                        return context.viewer.localeService.translate("modelsContextMenu.editModel") || "Edit";
                    },
                    getEnabled: (context) => {
                        return true;
                    },
                    doAction: (context) => {
                        context.bimViewer.editModel(context.modelId);
                    }
                },
                {
                    getTitle: (context) => {
                        return context.viewer.localeService.translate("modelsContextMenu.deleteModel") || "Delete";
                    },
                    getEnabled: (context) => {
                        return true;
                    },
                    doAction: (context) => {
                        context.bimViewer.deleteModel(context.modelId);
                    }
                }
            ]);
        }

        items.push([
            {
                getTitle: (context) => {
                    return context.viewer.localeService.translate("modelsContextMenu.loadAllModels") || "Load All";
                },
                getEnabled: (context) => {
                    const bimViewer = context.bimViewer;
                    const modelIds = bimViewer.getModelIds();
                    const loadedModelIds = bimViewer.getLoadedModelIds();
                    return (loadedModelIds.length < modelIds.length);
                },
                doAction: (context) => {
                    context.bimViewer.loadAllModels();
                }
            },
            {
                getTitle: (context) => {
                    return context.viewer.localeService.translate("modelsContextMenu.unloadAllModels") || "Unload All";
                },
                getEnabled: (context) => {
                    const loadedModelIds = context.bimViewer.getLoadedModelIds();
                    return (loadedModelIds.length > 0);
                },
                doAction: (context) => {
                    context.bimViewer.unloadAllModels();
                }
            }
        ]);

        items.push([
            {
                getTitle: (context) => {
                    return context.viewer.localeService.translate("modelsContextMenu.clearSlices") || "Clear Slices";
                },
                getEnabled: (context) => {
                    return (context.bimViewer.getNumSections() > 0);
                },
                doAction: (context) => {
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