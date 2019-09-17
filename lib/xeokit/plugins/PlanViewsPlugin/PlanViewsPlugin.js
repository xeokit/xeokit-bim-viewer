import {Plugin} from "../../viewer/Plugin.js";
import {PlanView} from "./PlanView.js";
import {IFCPlanViewObjectStates} from "./IFCPlanViewObjectStates.js";
import {math} from "../../viewer/scene/math/math.js";
import {ObjectsMemento} from "../../viewer/scene/mementos/ObjectsMemento.js";
import {CameraMemento} from "../../viewer/scene/mementos/CameraMemento.js";

const tempVec3a = math.vec3();
const tempVec3b = math.vec3();

/**
 * @desc A {@link Viewer} plugin that provides plan view images of storeys within IFC building models.
 *
 * ## Summary
 *
 * * Automatically maintains a table of all the IfcBuildingStory elements currently in the Viewer Scene.
 * * Has functions to set camera and object states to show orthographic view of a given IfcBuildingStorey.
 * * Has additional functions to save and load mementos of camera state and object visibilities, useful for UX when transitioning in and out of orthographic IfcBuildingStorey views.
 *
 * A plan view image consists of a downward-looking orthographic snapshot image of {@link Entity}s within a storey
 * belonging to a building model.
 *
 * Each building storey is represented by a {@link MetaObject} of type "IfcBuildingStorey" within the
 * Viewer's {@link MetaScene}.
 *
 * The {@link Entity}s within a storey correspond to {@link MetaObject}s within the structural subtree of
 * the "IfcBuildingStorey" {@link MetaObject}.
 *
 * PlanViewPlugin automatically creates its {@link PlanView}s WHENEVER {@link MetaModel}s
 * are created within its {@link Viewer}'s {@link MetaScene}.
 *
 * PlanViewPlugin configures the visual state of each {@link Entity} within each plan view according to
 * the type of its corresponding {@link MetaObject}, using the map of properties in {@link IFCPlanViewObjectStates}
 * by default. You can customize the appearance of the Entities by providing your own {@link PlanViewsPlugin#objectStates}.
 *
 * [[Run this example](https://xeokit.github.io/xeokit-sdk/examples/#planViews_PlanViewsPlugin)]
 *
 * ````javascript
 * import {Viewer} from "../src/viewer/Viewer.js";
 * import {XKTLoaderPlugin} from "../src/viewer/plugins/XKTLoaderPlugin/XKTLoaderPlugin.js";
 * import {PlanViewsPlugin} from "../src/viewer/plugins/PlanViewsPlugin/PlanViewsPlugin.js";
 *
 * // Create a Viewer, arrange the camera
 *
 * const viewer = new Viewer({
 *        canvasId: "myCanvas",
 *        transparent: true
 *    });
 *
 * viewer.camera.eye = [-2.56, 8.38, 8.27];
 * viewer.camera.look = [13.44, 3.31, -14.83];
 * viewer.camera.up = [0.10, 0.98, -0.14];
 *
 * // Load a model and fit it to view
 *
 * const xktLoader = new XKTLoaderPlugin(viewer);
 *
 * const model = xktLoader.load({
 *      id: "myModel",
 *      src: "./models/xkt/schependomlaan/schependomlaan.xkt",
 *      metaModelSrc: "./metaModels/schependomlaan/metaModel.json",
 *      edges: true
 * });
 *
 * // Add a PlanViewsPlugin
 * // This will automatically create StoreyViews when the model has loaded
 *
 * const planViews = new PlanViewsPlugin(viewer, {
 *      thumbnailSize: [220, 220],
 *      format: "png",  // Default
 *      ortho: true     // Default
 *  });
 *
 *
 * // When model loaded, get all StoreyViews from StoryViewsPlugin
 *
 * model.on("loaded", function () {
 *
 *      const planViewIds = Object.keys(planViews.planViews);
 *
 *      for (var i = 0, len = planViewIds.length; i < len; i++) {
 *
 *          const planViewId  = planViewIds[i];
 *
 *          const planView    = planViews.planViews[planViewId];
 *
 *          const aabb        = planView.aabb; // Boundary of storey elements
 *          const modelId     = planView.modelId; // "myModel"
 *          const planViewId  = planView.planViewId; // ID of IfcBuildingStorey
 *          const thumbnail   = planView.thumbnail;
 *
 *          //...
 *      }
 * });
 * ````
 */
class PlanViewsPlugin extends Plugin {

    /**
     * @constructor
     *
     * @param {Viewer} viewer The Viewer.
     * @param {Object} cfg  Plugin configuration.
     * @param {String} [cfg.id="PlanViews"] Optional ID for this plugin, so that we can find it within {@link Viewer#plugins}.
     * @param {Object} [cfg.objectStates] Map of visual states for the {@link Entity}s as rendered within each {@link PlanView}.  Default value is {@link IFCPlanViewObjectStates}.
     * @param {Boolean} [cfg.ortho=true] Whether to capture an orthographic or perspective view for each {@link PlanView}.
     * @param {Number[]} [cfg.thumbnailSize=200] Size of {@link PlanView} images.
     * @param {String} [cfg.format="png"] Format of {@link PlanView} images. Allowed values are "png" and "jpeg".
     */
    constructor(viewer, cfg = {}) {

        super("PlanViews", viewer);

        this._objectsMemento = new ObjectsMemento();
        this._cameraMemento = new CameraMemento();

        /**
         * A {@link PlanView} for each {@link MetaObject} whose {@link MetaObject#type} equals "IfcBuildingStorey", mapped to {@link Entity#id}.
         * @type {{String:PlanView}}
         */
        this.planViews = {};

        /**
         * A map of {@link PlanView}s for each  {@link MetaModel}.
         * @type {{String: {String:PlanView}}}
         */
        this.modelPlanViews = {};

        this.objectStates = cfg.objectStates;

        this._onModelLoaded = this.viewer.scene.on("modelLoaded", (modelId) => {
            this._buildPlanViewsForModel(modelId);
        });

        viewer.cameraFlight.duration = 1.5;
    }

    /**
     * Sets map of visual states for the {@link Entity}s as rendered within each {@link PlanView}.
     *
     * Default value is {@link IFCPlanViewObjectStates}.
     *
     * @type {{String: Object}}
     */
    set objectStates(value) {
        this._objectStates = value || IFCPlanViewObjectStates;
    }

    /**
     * Gets map of visual states for the {@link Entity}s as rendered within each {@link PlanView}.
     *
     * Default value is {@link IFCPlanViewObjectStates}.
     *
     * @type {{String: Object}}
     */
    get objectStates() {
        return this._objectStates;
    }

    /**
     * Sets the {@link Camera} to the position and projection to view a given {@link PlanView}.
     *
     * @param {String} planViewId ID of a {@link PlanView} in {@link PlanViewsPlugin#planViews}.
     * @param {Function} [done] Callback fired when {@link Camera} has been restored. When supplied, causes an animated
     * flight to the saved state. Otherwise jumps to the saved state.
     */
    loadPlanViewCameraState(planViewId, done) {

        const planView = this.planViews[planViewId];

        if (!planView) {
            this.error("IfcBuildingStorey not found with this ID: " + planViewId);
            if (done) {
                done();
            }
            return;
        }

        const viewer = this.viewer;
        const scene = viewer.scene;
        const camera = scene.camera;

        const aabb = this.viewer.scene.aabb;
        if (aabb[3] < aabb[0] || aabb[4] < aabb[1] || aabb[5] < aabb[2]) { // Don't fly to an inverted boundary
            return;
        }
        if (aabb[3] === aabb[0] && aabb[4] === aabb[1] && aabb[5] === aabb[2]) { // Don't fly to an empty boundary
            return;
        }
        const look2 = math.getAABB3Center(aabb);
        const eyeLookVec = math.subVec3(camera.eye, camera.look, tempVec3a);
        const eyeLookVecNorm = math.normalizeVec3(eyeLookVec);
        const diag = math.getAABB3Diag(aabb);
        const fitFOV = 45; // fitFOV;
        const sca = Math.abs(diag / Math.tan(fitFOV * math.DEGTORAD));

        const orthoScale2 = diag * 1.3;

        const eye2 = tempVec3a;

        eye2[0] = look2[0] + (camera.worldUp[0] * sca);
        eye2[1] = look2[1] + (camera.worldUp[1] * sca);
        eye2[2] = look2[2] + (camera.worldUp[2] * sca);

        const up2 = camera.worldForward;

        if (done) {
            viewer.cameraFlight.flyTo({
                eye: eye2,
                look: look2,
                up: up2,
                projection: "ortho",
                orthoScale: orthoScale2
            }, () => {
                done();
            });
        } else {
            viewer.cameraFlight.jumpTo({
                eye: eye2,
                look: look2,
                up: up2,
                projection: "ortho",
                orthoScale: orthoScale2
            });
        }
    }

    /**
     * Sets {@link Entity}s to the visual states required to view a given {@link PlanView}.
     *
     * @param {String} planViewId ID of a {@link PlanView} in {@link PlanViewsPlugin#planViews}.
     */
    loadPlanViewObjectStates(planViewId) {
        const planView = this.planViews[planViewId];
        if (!planView) {
            this.error("IfcBuildingStorey not found with this ID: " + planViewId);
            return;
        }
        this._showSubObjects(planViewId);
    }

    /**
     * Destroys this PlanViewsPlugin.
     *
     * Closes any currently open {@link PlanView}.
     */
    destroy() {
        this.viewer.scene.off(this._onModelLoaded);
        super.destroy();
    }

    _buildPlanViewsForModel(modelId) {

        this._destroyPlanViewsForModel(modelId);

        const viewer = this.viewer;
        const scene = viewer.scene;
        const metaScene = viewer.metaScene;
        const metaModel = metaScene.metaModels[modelId];
        const model = scene.models[modelId];

        if (!metaModel || !metaModel.rootMetaObject) {
            return;
        }

        const storeyIds = metaModel.rootMetaObject.getObjectIDsInSubtreeByType(["IfcBuildingStorey"]);

        for (let i = 0, len = storeyIds.length; i < len; i++) {
            const planViewId = storeyIds[i];
            const planView = new PlanView(scene.aabb, modelId, planViewId);
            planView._onModelDestroyed = model.once("destroyed", () => {
                this._destroyPlanViewsForModel(modelId);
            });
            this.planViews[planViewId] = planView;
            if (!this.modelPlanViews[modelId]) {
                this.modelPlanViews[modelId] = {};
            }
            this.modelPlanViews[modelId][planViewId] = planView;
        }
    }

    _destroyPlanViewsForModel(modelId) {
        const planViews = this.modelPlanViews[modelId];
        if (planViews) {
            const scene = this.viewer.scene;
            for (let storyObjectId in planViews) {
                if (planViews.hasOwnProperty(storyObjectId)) {
                    const planView = planViews[storyObjectId];
                    const model = scene.models[planView.modelId];
                    if (model) {
                        model.off("destroyed", planView._onModelDestroyed);
                    }
                    delete this.planViews[storyObjectId];
                }
            }
            delete this.modelPlanViews[modelId];
        }
    }

    _showSubObjects(rootObjectId) {

        const viewer = this.viewer;
        const scene = viewer.scene;
        const metaScene = viewer.metaScene;
        const storeyMetaObject = metaScene.metaObjects[rootObjectId];

        if (!storeyMetaObject) {
            return;
        }

        const storeySubObjects = storeyMetaObject.getObjectIDsInSubtree();

        // Hide all objects in the Scene

        scene.setObjectsVisible(viewer.scene.visibleObjectIds, false);

        // With each object the given tree

        for (var i = 0, len = storeySubObjects.length; i < len; i++) {

            const objectId = storeySubObjects[i];
            const metaObject = metaScene.metaObjects[objectId];
            const object = scene.objects[objectId];

            if (object) {

                // Set object's state from objectStates according to its IFC type

                const props = this._objectStates[metaObject.type] || this._objectStates["DEFAULT"];
                object.visible = true;
                if (props) {
                    //  object.visible = true;
                    //  object.edges = props.edges;
                    // // object.xrayed = true;
                    // object.xrayed = props.xrayed;
                    // object.highlighted = props.highlighted;
                    // object.selected = props.selected;
                    //  if (props.colorize) {
                    //      object.colorize = props.colorize;
                    //  }
                    //  if (props.opacity !== null && props.opacity !== undefined) {
                    //      object.opacity = props.opacity;
                    //  }
                }
            }
        }
    }
}

export {PlanViewsPlugin}
