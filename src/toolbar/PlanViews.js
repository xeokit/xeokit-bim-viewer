import {PlanViewsPlugin} from "../../lib/xeokit/plugins/PlanViewsPlugin/PlanViewsPlugin.js";
import {Controller} from "../Controller.js";
import {ObjectsMemento} from "../../lib/xeokit/viewer/scene/mementos/ObjectsMemento.js";
import {CameraMemento} from "../../lib/xeokit/viewer/scene/mementos/CameraMemento.js";

// var planViewCursor = new (function () {
//
//     const zeroVec = new Float32Array([0, 0, -1]);
//     const quat = new Float32Array(4);
//
//     var node = new Node(viewer.scene, {
//         pickable: false,
//         visible: false, // Initially invisible
//         position: [0, 0, 0],
//
//         children: [
//             new Mesh(viewer.scene, {
//                 geometry: new VBOGeometry(viewer.scene, buildSphereGeometry({radius: .4})),
//                 material: new PhongMaterial(viewer.scene, {emissive: [1, 0, 0], diffuse: [0, 0, 0]}),
//                 pickable: false
//             })
//         ]
//     });
//
//     this.show = function (pickResult) {
//         node.position = pickResult.worldPos;
//         node.visible = true;
//
//         (this._dir = this._dir || math.vec3()).set(pickResult.worldNormal || [0, 0, 1]);
//         math.vec3PairToQuaternion(zeroVec, this._dir, quat);
//         node.quaternion = quat;
//     };
//
//     this.hide = function () {
//         node.visible = false;
//     };
// })();

/**
 * @desc Manages plan views.
 *
 * Located at {@link Toolbar#planViews}.
 */
class PlanViews extends Controller {

    constructor(parent) {

        super(parent);

        this._planViewsPlugin = new PlanViewsPlugin(this.viewer, {});

        this._objectsMemento = new ObjectsMemento();
        this._cameraMemento = new CameraMemento();

        this._currentPlanView = null;

        this._ondblclick = this.viewer.scene.input.on("dblclick", (coords) => {

            if (this._currentPlanView) {

                const pickResult = this.viewer.scene.pick({
                    canvasPos: coords,
                    pickSurface: true  // <<------ This causes picking to find the intersection point on the entity
                });

                if (pickResult) {

                    this.quitPlanView();

                    this._currentPlanView = null;

                    const eye = [pickResult.worldPos[0], pickResult.worldPos[1] + 1, pickResult.worldPos[2]];
                    const look = [pickResult.worldPos[0], pickResult.worldPos[1] + 1, pickResult.worldPos[2] + 1.0];

                    //   planViewCursor.hide();

                    this.viewer.cameraFlight.flyTo({
                        projection: 'perspective',
                        duration: 2.0,
                        eye: eye,
                        look: look,
                        up: [0, 1, 0]
                    }, () => {

                     //   this._objectsMemento.restoreObjects(this.viewer.scene);

                        this.viewer.cameraControl.firstPerson = true;
                        this.viewer.cameraControl.planView = false;
                        this.viewer.cameraControl.walking = true;
                        this.viewer.cameraControl.doublePickFlyTo = true;

                        this.toolbar.firstPerson.setActive(true);
                    })
                }
            }
        });

        this.on("active", (active) => { // TODO: Deactivate on destroy to unsubscribe surfacePicked
            if (active) {
                this.openPlanView(Object.keys(this._planViewsPlugin.planViews)[2]);
            } else {
                this.closePlanView();
            }
        });
    }


    get planViews() {
        return this._planViewsPlugin.planViews;
    }

    get modelPlanViews() {
        return this._planViewsPlugin.modelPlanViews;
    }

    openPlanView(planViewId) {

        const planView = this._planViewsPlugin.planViews[planViewId];

        if (!planView) {
            return;
        }

        if (this._currentPlanView) {

        //    this._planViewsPlugin.loadPlanViewObjectStates(planView.id);
            this._planViewsPlugin.loadPlanViewCameraState(planView.id);

        } else {

            this._cameraMemento.saveCamera(this.viewer.scene);
      //      this._objectsMemento.saveObjects(this.viewer.scene);

        //    this._planViewsPlugin.loadPlanViewObjectStates(planView.id);
            this._planViewsPlugin.loadPlanViewCameraState(planView.id, () => {
            });
        }

        this.viewer.cameraControl.planView = true;
        this.viewer.cameraControl.doublePickFlyTo = false;

        this._currentPlanView = planView;

        this._ondblclick = this.viewer.scene.input.on("dblclick", function (coords) {
            const pickResult = viewer.scene.pick({
                canvasPos: coords,
                pickSurface: true  // <<------ This causes picking to find the intersection point on the entity
            });
        })
    }

    get currentPlanView() {
        return this._currentPlanView;
    }

    closePlanView() {
        if (this._currentPlanView === null) {
            return;
        }
        this._cameraMemento.restoreCamera(this.viewer.scene, () => {
        });
      //  this._objectsMemento.restoreObjects(this.viewer.scene);
        this.viewer.cameraControl.planView = false;
        this.viewer.cameraControl.doublePickFlyTo = true;
        this._currentPlanView = null;
    }

    quitPlanView() {
        if (this._currentPlanView === null) {
            return;
        }
        this.viewer.cameraControl.planView = false;
        this.viewer.cameraControl.doublePickFlyTo = true;
        this._currentPlanView = null;
    }

    /** @private */
    destroy() {
        super.destroy();
        this._planViewsPlugin.destroy();
    }
}

export {PlanViews};