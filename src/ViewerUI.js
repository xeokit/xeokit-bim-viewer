import {Controller} from "./Controller.js";

import {Explorer} from "./explorer/Explorer.js";
import {Toolbar} from "./toolbar/Toolbar.js";

/**
 * @desc UI controller for a xeokit {@link Viewer} toolbar.
 */
class ViewerUI extends Controller {

    /** @private */
    constructor(server, viewer, cfg = {}) {

        super(null, cfg, server, viewer);

        this.explorer = new Explorer(this, cfg);

        this.toolbar = new Toolbar(this, cfg);

        this.explorer.on("modelLoaded", (modelId) => {
            this.toolbar.reset.saveState();
        });

        this.explorer.on("modelUnloaded", (modelId) => {
            this.toolbar.reset.saveState();
        });

        bindButton("#reset", this.toolbar.reset, "reset");
        bindButton("#fit", this.toolbar.fit, "fit");

        bindCheckButton("#firstPerson", this.toolbar.firstPerson);

        bindCheckButton("#ortho", this.toolbar.ortho);

        bindCheckButton("#query", this.toolbar.query);
        bindCheckButton("#xray", this.toolbar.xray);
        bindCheckButton("#hide", this.toolbar.hide);
        bindCheckButton("#select", this.toolbar.select);
        bindCheckButton("#distance", this.toolbar.distance);
        bindCheckButton("#angle", this.toolbar.angle);
        bindCheckButton("#section", this.toolbar.section);
        bindCheckButton("#annotate", this.toolbar.annotate);

        bindButton("#createBCF", this.toolbar.bcf, "createViewpoint");
        bindButton("#clearBCF", this.toolbar.bcf, "clearViewpoints");
        bindButton("#clearAnnotations", this.toolbar.annotate, "clearAnnotations");
        bindButton("#clearSections", this.toolbar.section, "clearSections");

        function bindButton(selector, component, action) {
            $(selector).on('click', function (event) {
                component[action]();
                event.preventDefault();
            });
        }

        function bindCheckButton(selector, component) {
            $(selector).on('click', function (event) {
                component.setActive(!component.getActive());
                event.preventDefault();
            });
            component.on("active", (active) => {
                if (active) {
                    $(selector).addClass("active");
                } else {
                    $(selector).removeClass("active");
                }
            });
            if (component.getActive()) {
                $(selector).addClass("active");
            } else {
                $(selector).removeClass("active");
            }
        }
    }
}

export {ViewerUI};