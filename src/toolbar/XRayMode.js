import {Controller} from "../Controller.js";

/**
 * X-rays objects with mouse clicks.
 *
 * <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/"             title="Flaticon">www.flaticon.com</a></div>
 *
 * Located at {@link Toolbar#xray}.
 */
class XRayMode extends Controller {

    /** @private */
    constructor(parent, cfg) {
        super(parent, cfg);
    }

    /**
     * Activates or deactivates X-ray mode.
     *
     * @param {boolean} active Whether or not to activate X-ray mode.
     */
    setActive(active) {

        if (this._active === active) {
            return;
        }

        this._active = active;

        if (this._active) {

            this.viewer.scene.canvas.canvas.style.cursor = "crosshair";

            var entity = null;
            var down = false;

            this._onHover = this.viewer.cameraControl.on("hover", (e) => {
                if (down) {
                    return;
                }
                if (entity) {
                    entity.highlighted = false;
                    entity = null;
                }

                entity = e.entity;
                entity.highlighted = true;
            });

            this._onHoverOff = this.viewer.cameraControl.on("hoverOff", (e) => {
                if (down) {
                    return;
                }
                if (entity) {
                    entity.highlighted = false;
                    entity = null;
                }
            });

            this.viewer.scene.input.on("mousedown", () => {
                down = true;
                if (entity) {
                    entity.highlighted = false;
                }
            });

            this.viewer.scene.input.on("mouseup", () => {
                down = false;
                if (entity) {
                    if (!entity.xrayed) {
                        entity.xrayed = true;
                        entity.pickable = false;
                    } else {
                        entity.xrayed = false;
                        entity.pickable = true;
                    }
                    entity.highlighted = false;
                    entity = null;
                }
            });

        } else {

          //  this.viewer.scene.canvas.canvas.style.cursor = "default";

            this.viewer.cameraControl.off(this._onHover);
            this.viewer.cameraControl.off(this._onHoverOff);
          //  this.viewer.cameraControl.off(this._onPicked);
        }

        this.fire("active", this._active);
    }

    /**
     * Gets whether or not X-ray mode is active.
     * @returns {boolean}
     */
    getActive() {
        return this._active;
    }

    /** @private */
    destroy() {
        super.destroy();
        this.setActive(false);
    }
}

export {XRayMode};