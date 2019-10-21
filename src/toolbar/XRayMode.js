import {Controller} from "../Controller.js";
import {math} from "../../lib/xeokit/viewer/scene/math/math.js";

function closeEnough(p, q) {
    const CLICK_DIST = 4;
    return (Math.abs(p[0] - q[0]) < 4) && (Math.abs(p[1] - q[1]) < CLICK_DIST);
}

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

        this.on("active", (active) =>{
            if (this._active) {

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

                const lastCoords = math.vec2();

                this._onMousedown = this.viewer.scene.input.on("mousedown", (coords) => {
                    lastCoords[0] = coords[0];
                    lastCoords[1] = coords[1];
                    if (entity) {
                        entity.highlighted = false;
                    }
                });

                this._onMouseup = this.viewer.scene.input.on("mouseup", (coords) => {
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

                this.viewer.cameraControl.off(this._onHover);
                this.viewer.cameraControl.off(this._onHoverOff);
                this.viewer.cameraControl.off(this._onMousedown);
                this.viewer.cameraControl.off(this._onMouseup);
            }
        });
    }

    /** @private */
    destroy() {
        super.destroy();
        this.setActive(false);
    }
}

export {XRayMode};