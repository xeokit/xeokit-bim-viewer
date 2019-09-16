import {Controller} from "../Controller.js";

/**
 * Controls click-to-hide mode.
 *
 * Located at {@link Toolbar#hide}.
 */
class HideMode extends Controller {

    /** @private */
    constructor(parent) {
        super(parent);
        this._active = false;
    }

    /**
     * Activates or deactivates hiding mode.
     *
     * @param {boolean} active Whether or not to activate hiding mode.
     */
    setActive(active) {

        if (this._active === active) {
            return;
        }

        this._active = active;

        if (this._active) {

            var entity = null;

            this._onHover = this.viewer.cameraControl.on("hover", (e) => {
                if (entity) {
                    entity.highlighted = false;
                    entity = null;
                }

                entity = e.entity;
                entity.highlighted = true;
            });

            this._onHoverOff = this.viewer.cameraControl.on("hoverOff", (e) => {

                if (entity) {
                    //entity.opacity = 1.0;
                    entity.highlighted = false;
                    entity = null;
                }
            });

            this.viewer.scene.input.on("mouseup", () => {
                if (entity) {
                    entity.visible = false;
                    entity.highlighted = false;
                    entity = null;
                }
            });

        } else {

            this.viewer.cameraControl.off(this._onHover);
            this.viewer.cameraControl.off(this._onHoverOff);
            this.viewer.cameraControl.off(this._onPicked);
        }

        this.fire("active", this._active);
    }

    /**
     * Gets whether or not this UIHide is active.
     * @returns {boolean}
     */
    getActive() {
        return this._active;
    }

    /** @private */
    destroy() {
        this.setActive(false);
        super.destroy();
    }
}

export {HideMode};