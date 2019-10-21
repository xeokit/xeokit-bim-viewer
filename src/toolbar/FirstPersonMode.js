import {Controller} from "../Controller.js";

/**
 * Controls first-person mode.
 *
 * Located at {@link Toolbar#firstPerson}.
 */
class FirstPersonMode extends Controller {

    /** @private */
    constructor(parent, cfg) {

        super(parent, cfg);

        const cameraControl = this.viewer.cameraControl;
        cameraControl.firstPerson = false;
        cameraControl.pivoting = true;
        cameraControl.panToPointer = true;

       // this._cursor = new FirstPersonCursor(this.viewer.scene);

        this.on("active", (active) => {

            if (active) {

              //  this.viewer.scene.canvas.canvas.style.cursor = "default";

                const cameraControl = this.viewer.cameraControl;
                cameraControl.firstPerson = true;
                cameraControl.panToPointer = true;
                cameraControl.pivoting = false;

                // this._onHoverSurface = this.viewer.cameraControl.on("hoverSurface", (e) => {
                //    this._cursor.show(e);
                // });
                //
                // this._onHoverOff = this.viewer.cameraControl.on("hoverOff", (e) => {
                //     this._cursor.hide(e);
                // });

            } else {

              //  this.viewer.scene.canvas.canvas.style.cursor = "default";

                const cameraControl = this.viewer.cameraControl;
                cameraControl.firstPerson = false;
                cameraControl.pivoting = true;
                cameraControl.panToPointer = true;
            }
        });
    }

    destroy() {
        super.destroy();
        // this._cursor.destroy();
    }
}

export {FirstPersonMode};