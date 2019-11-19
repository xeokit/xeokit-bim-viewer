import {Controller} from "../Controller.js";
import {StoreyViewsPlugin} from "/node_modules/@xeokit/xeokit-sdk/src/plugins/StoreyViewsPlugin/StoreyViewsPlugin.js";
import {CameraMemento} from "/node_modules/@xeokit/xeokit-sdk/src/viewer/scene/mementos/CameraMemento.js";
import {ObjectsMemento} from "/node_modules/@xeokit/xeokit-sdk/src/viewer/scene/mementos/ObjectsMemento.js";
import {math} from "/node_modules/@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";



/**
 * @desc Manages storeys.
 *
 * Located at {@link Toolbar#storeys}.
 */
class Storeys extends Controller {

    constructor(parent, cfg) {

        super(parent, cfg);

        this._element = document.getElementById(cfg.storeysPanelId);

        this._storeyViewsPlugin = new StoreyViewsPlugin(this.viewer);

        this._storeyViewsPlugin.on("storeys", () => {
            this._repaint();
        });

        this._objectsMemento = new ObjectsMemento();
        this._cameraMemento = new CameraMemento();

        this._storeyOpen = false;
        this._openStoreyId = null;

        const canStandOnTypes = {
            IfcSlab: true,
            IfcStair: true,
            IfcFloor: true,
            IfcFooting: true
        };

        const viewer = this.viewer;
        const worldPos = math.vec3();

        viewer.cameraControl.on("pickedSurface", (pickResult) => {

            if (!this._storeyOpen) {
                return;
            }

            const entity = pickResult.entity;
            const metaObject = viewer.metaScene.metaObjects[entity.id];

            if (canStandOnTypes[metaObject.type]) {

                worldPos.set(pickResult.worldPos);
                worldPos[1] += 1.5;

                viewer.cameraFlight.flyTo({
                    eye: worldPos,
                    up: viewer.camera.worldUp,
                    look: math.addVec3(worldPos, viewer.camera.worldForward, []),
                    projection: "perspective",
                    duration: 1.5
                }, () => {

                    viewer.cameraControl.planView = false;
                    viewer.cameraControl.firstPerson = true;
                    viewer.cameraControl.pivoting = false;

                    this._storeyOpen = false;
                    this._openStoreyId = null;
                });
            }
        });

        viewer.cameraControl.on("pickedNothing", (pickResult) => {

            if (!this._storeyOpen) {
                return;
            }

            const openStoreyId = this._openStoreyId;

            this._storeyOpen = false;
            this._openStoreyId = null;

            this._objectsMemento.restoreObjects(this.viewer.scene);
            this._cameraMemento.restoreCamera(this.viewer.scene, () => {
            });

            this.fire("storeyClosed", openStoreyId);

            // TODO: return to previous camera, saved in showStorey on first open storey

            // this._storeyViewsPlugin.gotoStoreyCamera("2SWZMQPyD9pfT9q87pgXa1", {
            //     projection: "ortho",
            //     duration: 1.5,
            //     done: () => {
            //         viewer.cameraControl.planView = true;
            //     }
            // });
        });
    }

    _repaint() {
        const html = [];
        var storeyId;
        const models = this.viewer.scene.models;
        const storeyIds = [];
        for (var modelId in models) {
            const model = this.viewer.scene.models[modelId];
            const metaModel = this.viewer.metaScene.metaModels[modelId];
            if (!metaModel) {
                continue;
            }
            const storeys = this._storeyViewsPlugin.modelStoreys[modelId];
            if (!storeys) {
                continue;
            }
            html.push("<div>" + metaModel.id + "</div>");
            for (storeyId in storeys) {
                const storey = storeys[storeyId];
                if (storey) {
                    html.push("<div class='form-check'>");
                    html.push("<li>");
                    html.push("<a id='" + storey.storeyId + "' href=''>" + storey.name + "</a>");
                    html.push("</li>");
                    html.push("</div>");
                    storeyIds.push(storeyId);
                }
            }
            html.push("<br>");
        }
        this._element.innerHTML = html.join("");
        for (var i = 0, len = storeyIds.length; i < len; i++) {
            const _storeyId = storeyIds[i];
            const link = $("#" + _storeyId);
            link.on('click', (e) => {
                this.showStorey(_storeyId, () => {
                });
                e.preventDefault();
            });
        }
    }

    showStorey(storeyId, done) {

        const storey = this._storeyViewsPlugin.storeys[storeyId];

        if (!storey) {
            return;
        }

        const viewer = this.viewer;
        const scene = viewer.scene;
        const metaScene = viewer.metaScene;
        const metaObject = metaScene.metaObjects[storeyId];

        if (this._storeyOpen) {

            scene.setObjectsVisible(scene.objectIds, true);
            scene.setObjectsXRayed(scene.objectIds, true);

            const objectIds = metaObject.getObjectIDsInSubtree();

            scene.setObjectsVisible(objectIds, true);
            scene.setObjectsXRayed(objectIds, false);

            this._storeyViewsPlugin.gotoStoreyCamera(storeyId, {
                projection: "ortho", // Orthographic projection
                duration: 0.3,       // 2.5 second transition
                done: () => {

                    this._storeyViewsPlugin.showStoreyObjects(storeyId, {
                        hideOthers: true,
                        useObjectStates: true
                    });

                    this.viewer.cameraControl.planView = true; // Disable camera rotation

                    if (done) {
                        done();
                    }
                }
            });

        } else {

            this._cameraMemento.saveCamera(scene);
            this._objectsMemento.saveObjects(scene);

            scene.setObjectsVisible(scene.objectIds, true);
            scene.setObjectsXRayed(scene.objectIds, true);

            const objectIds = metaObject.getObjectIDsInSubtree();

            scene.setObjectsVisible(objectIds, true);
            scene.setObjectsXRayed(objectIds, false);

            this._storeyViewsPlugin.gotoStoreyCamera(storeyId, {
                projection: "ortho", // Orthographic projection
                duration: 1.0,       // 2.5 second transition
                done: () => {

                    this._storeyViewsPlugin.showStoreyObjects(storeyId, {
                        hideOthers: true,
                        useObjectStates: true
                    });

                    this.viewer.cameraControl.planView = true; // Disable camera rotation

                    if (done) {
                        done();
                    }
                }
            });
        }

        this._storeyOpen = true;
        this._openStoreyId = storeyId;

        this.fire("storeyOpened", this._openStoreyId);
    }

    setEnabled(enabled) {
        if (!enabled) {
            $("#storeys-tab").addClass("disabled");
           } else {
            $("#storeys-tab").removeClass("disabled");
        }
    }

    /** @private */
    destroy() {
        super.destroy();
        this._storeyViewsPlugin.destroy();
    }
}

export {Storeys};