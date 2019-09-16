import {Controller} from "../Controller.js";

/**
 * Controls click-to-query-element mode.
 *
 * Located at {@link Toolbar#query}.
 */
class QueryMode extends Controller {

    /** @private */
    constructor(parent) {

        super(parent);

        this.on("active", (active) => {

            if (active) {

                this.viewer.scene.canvas.canvas.style.cursor = "crosshair";

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
                        entity.highlighted = false;
                        entity = null;
                    }
                });

                this.viewer.scene.input.on("mouseup", () => {
                    if (entity) {
                        alert(entity.id);
                    }
                });

            } else {
                this.viewer.cameraControl.off(this._onHover);
                this.viewer.cameraControl.off(this._onHoverOff);
                //  this.viewer.cameraControl.off(this._onPicked);
            }

        });
    }

    /** @private */
    destroy() {
        this.setActive(false);
        super.destroy();
    }
}

export {QueryMode};