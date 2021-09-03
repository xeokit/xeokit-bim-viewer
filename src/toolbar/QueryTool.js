import {Controller} from "../Controller.js";

/** @private */
class QueryTool extends Controller {

    constructor(parent, cfg) {

        super(parent);

       //  this.on("active", (active) => {
       //      if (active) {
       //          this._onPick = this.viewer.cameraControl.on("picked", (pickResult) => {
       //              if (!pickResult.entity) {
       //                  return;
       //              }
       // //             this.queryEntity(pickResult.entity);
       //          });
       //          this._onPickedNothing = this.viewer.cameraControl.on("pickedNothing", () => {
       //              this.fire("queryNotPicked", false);
       //          });
       //      } else {
       //
       //          if (this._onPick !== undefined) {
       //              this.viewer.cameraControl.off(this._onPick);
       //              this.viewer.cameraControl.off(this._onPickedNothing);
       //              this._onPick = undefined;
       //              this._onPickedNothing = undefined;
       //          }
       //      }
       //  });
       //
       //  this.bimViewer.on("reset", () => {
       //      this.setActive(false);
       //  });
    }
}

export {QueryTool};