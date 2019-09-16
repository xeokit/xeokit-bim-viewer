import {Controller} from "../Controller.js";
import {SectionPlanesPlugin} from "../../lib/xeokit/plugins/SectionPlanesPlugin/SectionPlanesPlugin.js";

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

        super(parent);

        this._active = false;

        this._sectionPlanesPlugin = new SectionPlanesPlugin(this.viewer, {
            overviewCanvasId: cfg.sectionPlanesOverviewCanvasId
        });
    }

    /**
     * Sets whether or not this SectionMode is active.
     *
     * Activating this SectionMode will deactivate {@link MeasureMode}.
     *
     * While active, the section planes overview is visible and we can create section planes by clicking
     * on objects. The most recently-created section plane gets a 3D gizmo with which we can reposition it
     * using mouse or touch input.
     *
     * When deactivated, the section planes still exist within the 3D view, but the gizmo and the
     * overview are hidden.
     */
    setActive(active) {

        if (this._active === active) {
            return;
        }

        this._active = active;

        if (this._active) {

            this.viewer.scene.canvas.canvas.style.cursor = "crosshair";

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

        this.fire("active", this._active);
    }

    /**
     * Gets whether or not this SectionMode is active.
     * @returns {boolean}
     */
    getActive() {
        return this._active;
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