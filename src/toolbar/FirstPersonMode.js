import {Controller} from "../Controller.js";
import {Node} from "../../lib/xeokit/viewer/scene/nodes/Node.js";
import {PhongMaterial} from "../../lib/xeokit/viewer/scene/materials/PhongMaterial.js";
import {VBOGeometry} from "../../lib/xeokit/viewer/scene/geometry/VBOGeometry.js";
import {buildSphereGeometry} from "../../lib/xeokit/viewer/scene/geometry/builders/buildSphereGeometry.js";
import {Mesh} from "../../lib/xeokit/viewer/scene/mesh/Mesh.js";
import {math} from "../../lib/xeokit/viewer/scene/math/math.js";

const zeroVec = new Float32Array([0, 0, -1]);
const quat = new Float32Array(4);

// class FirstPersonCursor {
//
//     constructor(scene) {
//         this._node = new Node(scene, {
//             pickable: false,
//             visible: false, // Initially invisible
//             position: [0, 0, 0],
//             scale:[2,2,0.1],
//             children: [
//                 new Mesh(scene, {
//                     geometry: new VBOGeometry(scene, buildSphereGeometry({radius: .4})),
//                     material: new PhongMaterial(scene, {emissive: [1, 0, 0], diffuse: [0, 0, 0]}),
//                     pickable: false,
//                     selected: true
//                 })
//             ]
//         });
//
//         this._dir = math.vec3();
//     }
//
//     show(pickResult) {
//         this._node.position = pickResult.worldPos;
//         this._node.visible = true;
//         this._dir.set(pickResult.worldNormal);
//         math.vec3PairToQuaternion(zeroVec, this._dir, quat);
//         this._node.quaternion = quat;
//     }
//
//     hide() {
//         this._node.visible = false;
//     }
// }

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