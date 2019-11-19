import {Controller} from "../Controller.js";
import {SectionPlanesPlugin} from "/node_modules/@xeokit/xeokit-sdk/src/plugins/SectionPlanesPlugin/SectionPlanesPlugin.js";

class SectionMode extends Controller {

    constructor(parent, cfg) {

        super(parent, cfg);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        if (!cfg.sectionPlanesOverviewCanvasElement) {
            throw "Missing config: sectionPlanesOverviewCanvasElement";
        }

        const buttonElement = cfg.buttonElement;
        const sectionPlanesOverviewCanvasElement = cfg.sectionPlanesOverviewCanvasElement;

        this._sectionPlanesPlugin = new SectionPlanesPlugin(this.viewer, {
            overviewCanvas: sectionPlanesOverviewCanvasElement.get(0)
        });

        this.on("enabled", (enabled) => {
            if (!enabled) {
                buttonElement.addClass("disabled");
            } else {
                buttonElement.removeClass("disabled");
            }
        });

        this.on("active", (active) => {
            if (active) {
                buttonElement.addClass("active");
            } else {
                buttonElement.removeClass("active");
            }
        });

        this.on("active", (active) =>{
            if (active) {
                this._sectionPlanesPlugin.setOverviewVisible(true);
                this._onPickedSurface = this.viewer.cameraControl.on("pickedSurface", (e) => {
                    const sectionPlane = this._sectionPlanesPlugin.createSectionPlane({
                        pos: e.worldPos,
                        dir: [-e.worldNormal[0], -e.worldNormal[1], -e.worldNormal[2]]
                    });
                    this._sectionPlanesPlugin.showControl(sectionPlane.id);
                });
            } else {
                this.viewer.cameraControl.off(this._onPickedSurface);
                this._sectionPlanesPlugin.hideControl();
                this._sectionPlanesPlugin.setOverviewVisible(false);
            }
        });

        buttonElement.on('click', (event) => {
            if (!this.getEnabled()) {
                return;
            }
            const active = this.getActive();
            this.setActive(!active);
            event.preventDefault();
        });

        this.viewerUI.on("reset", () => {
            this.clear();
            this.setActive(false);
        });
    }

    clear() {
        this._sectionPlanesPlugin.clear();
    }

    destroy() {
        this._sectionPlanesPlugin.destroy();
        super.destroy();
    }
}

export {SectionMode};