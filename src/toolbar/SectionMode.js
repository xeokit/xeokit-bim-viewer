import {Controller} from "../Controller.js";
import {SectionPlanesPlugin} from "@xeokit/xeokit-sdk/src/plugins/SectionPlanesPlugin/SectionPlanesPlugin.js";

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
            overviewCanvas: sectionPlanesOverviewCanvasElement
        });

        this.on("enabled", (enabled) => {
            if (!enabled) {
                buttonElement.classList.add("disabled");
            } else {
                buttonElement.classList.remove("disabled");
            }
        });

        this.on("active", (active) => {
            if (active) {
                buttonElement.classList.add("active");
            } else {
                buttonElement.classList.remove("active");
            }
        });

        this.on("active", (active) =>{
          this.activateSectionMode(active);
        });

        buttonElement.addEventListener("click", (event) => {
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

    activateSectionMode(active) {
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