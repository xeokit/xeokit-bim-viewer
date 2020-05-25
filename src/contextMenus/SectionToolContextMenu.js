import {ContextMenu} from "@xeokit/xeokit-sdk/src/extras/ContextMenu/ContextMenu.js";

/**
 * @private
 */
class SectionToolContextMenu extends ContextMenu {
    constructor(cfg = {}) {
        super({
            context: cfg.context,
            items: [
                [
                    {
                        title: "Clear Slices",
                        getEnabled: function (context) {
                            return (context.bimViewer.getNumSections() > 0);
                        },
                        doAction: function (context) {
                            context.bimViewer.clearSections();
                        }
                    }
                ]
            ]
        });
    }
}

export {SectionToolContextMenu};