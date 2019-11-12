import {Controller} from "../Controller.js";
import {SectionPlanesPlugin} from "@xeokit/xeokit-sdk/src/plugins/SectionPlanesPlugin/SectionPlanesPlugin.js";


/**
 * Controls section planes.
 *
 * Located at {@link Toolbar#section}.
 *
 * When this is active, clicking on the model will create section planes, which you can then reposition interactively.
 *
 * To ensure that clicking does not do anything else while this control is active, activation of this controller
 * will deactivate other controllers that handle click events.
 */
class SectionMode extends Controller {

    /** @private */
    constructor(parent, cfg) {

        super(parent, cfg);

        this._sectionPlanesPlugin = new SectionPlanesPlugin(this.viewer, {
            overviewCanvasId: cfg.sectionPlanesOverviewCanvasId
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
        this.viewerUI.on("reset", () => {
            this.clear();
            this.setActive(false);
        });
    }

    /**
     * Creates a section plane orthogonal to the World-space X-axis, cutting through the center of the scene.
     */
    createX() {
        if (!this._active) {
            this.error("Not active");
            return;
        }
        // const sectionPlane = this._sectionPlanesPlugin.createSectionPlane({
        //     pos: e.worldPos,
        //     dir: [-e.worldNormal[0], -e.worldNormal[1], -e.worldNormal[2]]
        // });
        // this._sectionPlanesPlugin.showControl(sectionPlane.id);
    }

    /**
     * Creates a section plane orthogonal to the World-space Y-axis, cutting through the center of the scene.
     */
    createY() {
        if (!this._active) {
            this.error("Not active");
            return;
        }
        // const sectionPlane = this._sectionPlanesPlugin.createSectionPlane({
        //     pos: e.worldPos,
        //     dir: [-e.worldNormal[0], -e.worldNormal[1], -e.worldNormal[2]]
        // });
        // this._sectionPlanesPlugin.showControl(sectionPlane.id);
    }

    /**
     * Creates a section plane orthogonal to the World-space Z-axis, cutting through the center of the scene.
     */
    createZ() {
        if (!this._active) {
            this.error("Not active");
            return;
        }
        // const sectionPlane = this._sectionPlanesPlugin.createSectionPlane({
        //     pos: e.worldPos,
        //     dir: [-e.worldNormal[0], -e.worldNormal[1], -e.worldNormal[2]]
        // });
        // this._sectionPlanesPlugin.showControl(sectionPlane.id);
    }

    /**
     * Clears all section planes.
     */
    clear() {
        this._sectionPlanesPlugin.clear();
    }

    /** @private */
    _destroy() {
        this._sectionPlanesPlugin.destroy();
        super.destroy();
    }
}

export {SectionMode};