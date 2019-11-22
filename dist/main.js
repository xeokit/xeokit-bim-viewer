import { utils } from '../../../../../node_modules/@xeokit/xeokit-sdk/src/viewer/scene/utils.js';
import { Map } from '../../../../../node_modules/@xeokit/xeokit-sdk/src/viewer/scene/utils/Map.js';
import { ModelMemento } from '../../../../../node_modules/@xeokit/xeokit-sdk/src/viewer/scene/mementos/ModelMemento.js';
import { math } from '../../../../../node_modules/@xeokit/xeokit-sdk/src/viewer/scene/math/math.js';
import { SectionPlanesPlugin } from '../../../../../node_modules/@xeokit/xeokit-sdk/src/plugins/SectionPlanesPlugin/SectionPlanesPlugin.js';
import { NavCubePlugin } from '../../../../../node_modules/@xeokit/xeokit-sdk/src/plugins/NavCubePlugin/NavCubePlugin.js';
import { XKTLoaderPlugin } from '../../../../../node_modules/@xeokit/xeokit-sdk/src/plugins/XKTLoaderPlugin/XKTLoaderPlugin.js';
import { Viewer } from '../../../../../node_modules/@xeokit/xeokit-sdk/src/viewer/Viewer.js';
import { AmbientLight } from '../../../../../node_modules/@xeokit/xeokit-sdk/src/viewer/scene/lights/AmbientLight.js';
import { DirLight } from '../../../../../node_modules/@xeokit/xeokit-sdk/src/viewer/scene/lights/DirLight.js';

/**
 * Default server client which loads content via HTTP from the file system.
 */
class Server {

    /**
     *
     * @param cfg
     * @param.cfg.dataDir Base directory for content.
     */
    constructor(cfg = {}) {
        this._dataDir = cfg.dataDir || "";
    }

    /**
     * Gets the manifest of all projects.
     * @param done
     * @param error
     */
    getProjects(done, error) {
        const url = this._dataDir + "/projects/index.json";
        console.log("Loading database manifest: " + url);
        utils.loadJSON(url, done, error);
    }

    /**
     * Gets a manifest for a project.
     * @param projectId
     * @param done
     * @param error
     */
    getProject(projectId, done, error) {
        const url = this._dataDir + "/projects/" + projectId + "/index.json";
        console.log("Loading project manifest: " + url);
        utils.loadJSON(url, done, error);
    }

    /**
     * Gets metadata for a model within a project.
     * @param projectId
     * @param modelId
     * @param done
     * @param error
     */
    getMetadata(projectId, modelId, done, error) {
        const url = this._dataDir + "/projects/" + projectId + "/models/" + modelId + "/metadata.json";
        console.log("Loading model metadata: " + url);
        utils.loadJSON(url, done, error);
    }

    /**
     * Gets geometry for a model within a project.
     * @param projectId
     * @param modelId
     * @param done
     * @param error
     */
    getGeometry(projectId, modelId, done, error) {
        const url = this._dataDir + "/projects/" + projectId + "/models/" + modelId + "/geometry.xkt";
        console.log("Loading model geometry: " + url);
        utils.loadArraybuffer(url, done, error);
    }
}

/**
 * @desc Base class for all xeokit-ui components.
 */
class Controller {

    /**
     * @private
     */
    constructor(parent, cfg, server, viewer) {

        this.viewerUI = (parent ? (parent.viewerUI || parent) : this);
        this.server = parent ? parent.server : server;
        this.viewer = parent ? parent.viewer : viewer;

        this._children = [];

        if (parent) {
            parent._children.push(this);
        }

        this._subIdMap = null; // Subscription subId pool
        this._subIdEvents = null; // Subscription subIds mapped to event names
        this._eventSubs = null; // Event names mapped to subscribers
        this._events = null; // Maps names to events
        this._eventCallDepth = 0; // Helps us catch stack overflows from recursive events

        this._enabled = null; // Used by #setEnabled() and #getEnabled()
        this._active = null; // Used by #setActive() and #getActive()
    }

    /**
     * Fires an event on this Controller.
     *
     * @param {String} event The event type name
     * @param {Object} value The event parameters
     * @param {Boolean} [forget=false] When true, does not retain for subsequent subscribers
     */
    fire(event, value, forget) {
        if (!this._events) {
            this._events = {};
        }
        if (!this._eventSubs) {
            this._eventSubs = {};
        }
        if (forget !== true) {
            this._events[event] = value || true; // Save notification
        }
        const subs = this._eventSubs[event];
        let sub;
        if (subs) { // Notify subscriptions
            for (const subId in subs) {
                if (subs.hasOwnProperty(subId)) {
                    sub = subs[subId];
                    this._eventCallDepth++;
                    if (this._eventCallDepth < 300) {
                        sub.callback.call(sub.scope, value);
                    } else {
                        this.error("fire: potential stack overflow from recursive event '" + event + "' - dropping this event");
                    }
                    this._eventCallDepth--;
                }
            }
        }
    }

    /**
     * Subscribes to an event on this Controller.
     *
     * The callback is be called with this component as scope.
     *
     * @param {String} event The event
     * @param {Function} callback Called fired on the event
     * @param {Object} [scope=this] Scope for the callback
     * @return {String} Handle to the subscription, which may be used to unsubscribe with {@link #off}.
     */
    on(event, callback, scope) {
        if (!this._events) {
            this._events = {};
        }
        if (!this._subIdMap) {
            this._subIdMap = new Map(); // Subscription subId pool
        }
        if (!this._subIdEvents) {
            this._subIdEvents = {};
        }
        if (!this._eventSubs) {
            this._eventSubs = {};
        }
        let subs = this._eventSubs[event];
        if (!subs) {
            subs = {};
            this._eventSubs[event] = subs;
        }
        const subId = this._subIdMap.addItem(); // Create unique subId
        subs[subId] = {
            callback: callback,
            scope: scope || this
        };
        this._subIdEvents[subId] = event;
        const value = this._events[event];
        if (value !== undefined) { // A publication exists, notify callback immediately
            callback.call(scope || this, value);
        }
        return subId;
    }

    /**
     * Cancels an event subscription that was previously made with {@link Controller#on} or {@link Controller#once}.
     *
     * @param {String} subId Subscription ID
     */
    off(subId) {
        if (subId === undefined || subId === null) {
            return;
        }
        if (!this._subIdEvents) {
            return;
        }
        const event = this._subIdEvents[subId];
        if (event) {
            delete this._subIdEvents[subId];
            const subs = this._eventSubs[event];
            if (subs) {
                delete subs[subId];
            }
            this._subIdMap.removeItem(subId); // Release subId
        }
    }

    /**
     * Subscribes to the next occurrence of the given event, then un-subscribes as soon as the event is handled.
     *
     * This is equivalent to calling {@link Controller#on}, and then calling {@link Controller#off} inside the callback function.
     *
     * @param {String} event Data event to listen to
     * @param {Function} callback Called when fresh data is available at the event
     * @param {Object} [scope=this] Scope for the callback
     */
    once(event, callback, scope) {
        const self = this;
        const subId = this.on(event,
            function (value) {
                self.off(subId);
                callback.call(scope || this, value);
            },
            scope);
    }

    /**
     * Logs a console debugging message for this Controller.
     *
     * The console message will have this format: *````[LOG] [<component type> <component id>: <message>````*
     *
     * @param {String} message The message to log
     */
    log(message) {
        message = "[LOG]" + this._message(message);
        window.console.log(message);
    }

    _message(message) {
        return " [" + utils.inQuotes(this.id) + "]: " + message;
    }

    /**
     * Logs a warning for this Controller to the JavaScript console.
     *
     * The console message will have this format: *````[WARN] [<component type> =<component id>: <message>````*
     *
     * @param {String} message The message to log
     */
    warn(message) {
        message = "[WARN]" + this._message(message);
        window.console.warn(message);
    }

    /**
     * Logs an error for this Controller to the JavaScript console.
     *
     * The console message will have this format: *````[ERROR] [<component type> =<component id>: <message>````*
     *
     * @param {String} message The message to log
     */
    error(message) {
        message = "[ERROR]" + this._message(message);
        window.console.error(message);
    }

    _mutexActivation(controllers) {
        const mutedControllers = [];
        const numControllers = controllers.length;
        for (let i = 0; i < numControllers; i++) {
            mutedControllers[i] = false;
        }
        for (let i = 0; i < numControllers; i++) {
            const controller = controllers[i];
            controller.on("active", (function () {
                const _i = i;
                return function (active) {
                    if (!active || mutedControllers[_i]) {
                        return;
                    }
                    for (let j = 0; j < numControllers; j++) {
                        if (j === _i) {
                            continue;
                        }
                        mutedControllers[j] = true;
                        controllers[j].setActive(false);
                        mutedControllers[j] = false;
                    }
                };
            })());
        }
    }

    /**
     * Enables or disables this Controller.
     *
     * Fires an "enabled" event on update.
     *
     * @param {boolean} enabled Whether or not to enable.
     */
    setEnabled(enabled) {
        if (this._enabled === enabled) {
            return;
        }
        this._enabled = enabled;
        this.fire("enabled", this._enabled);
    }

    /**
     * Gets whether or not this Controller is enabled.
     * @returns {boolean}
     */
    getEnabled() {
        return this._enabled;
    }

    /**
     * Activates or deactivates this Controller.
     *
     * Fires an "active" event on update.
     *
     * @param {boolean} active Whether or not to activate.
     */
    setActive(active) {
        if (this._active === active) {
            return;
        }
        this._active = active;
        this.fire("active", this._active);
    }

    /**
     * Gets whether or not this Controller is active.
     * @returns {boolean}
     */
    getActive() {
        return this._active;
    }

    /**
     * Destroys this Controller.
     */
    destroy() {
        if (this.destroyed) {
            return;
        }
        /**
         * Fired when this Controller is destroyed.
         * @event destroyed
         */
        this.fire("destroyed", this.destroyed = true);
        this._subIdMap = null;
        this._subIdEvents = null;
        this._eventSubs = null;
        this._events = null;
        this._eventCallDepth = 0;
        for (let i = 0, len = this._children.length; i < len; i++) {
            this._children.destroy();
        }
        this._children = [];
    }
}

class BusyDialog extends Controller {

    constructor(parent, cfg = {}) {
        super(parent, cfg);

//         this._dialog = $(`<div class="loadingDialog modal" tabindex="-1" role="dialog">
//     <div class="modal-dialog" role="document">
//         <div class="modal-content">
//             <div class="modal-body" style="text-align:center;">
//                 <br>
//                 <div class="loader" style="display:inline-block;"></div>
//
//                 <br>
//                 <div class="modal-header" style="display:inline-block; border: 0;">
//                     <h5 class="modal-title"><span class="xeokit-model-message"></span>
//                     </h5>
//                 </div>
//             </div>
//         </div>
//     </div>
// </div>`);
//
//         this._dialog.appendTo("body");
    }

    show(message) {
      //  this._dialog.find('.xeokit-model-message').text(message);
    //    this._dialog.modal('show');
    }

    hide() {
      //  this._dialog.modal('hide');
    }

    destroy() {
        super.destroy();
    //    this._dialog.remove();

    }
}

const tempVec3a = math.vec3();

class ResetAction extends Controller {

    constructor(parent, cfg = {}) {

        super(parent, cfg);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        const buttonElement = cfg.buttonElement;
        const camera = this.viewer.camera;

        this._modelMementos = {};

        // Initial camera position - looking down negative diagonal

        camera.eye = [0.577, 0.577, 0.577];
        camera.look = [0,0,0];
        camera.up = [-1, 1, -1];

        this.viewerUI.models.on("modelLoaded", (modelId) => {
            this._saveModelMemento(modelId);
        });

        this.viewerUI.models.on("modelUnloaded", (modelId) => {
            this._destroyModelMemento(modelId);
        });

        this.on("enabled", (enabled) => {
            if (!enabled) {
                buttonElement.classList.add("disabled");
            } else {
                buttonElement.classList.remove("disabled");
            }
        });

        this.on("active", (active) => {
            if (active) {
                buttonElement.classList.add("active");
            } else {
                buttonElement.classList.remove("active");
            }
        });

        buttonElement.addEventListener("click", (event) => {
            if (this.getEnabled()) {
                this.reset();
            }
            event.preventDefault();
        });
    }

    _saveModelMemento(modelId) {
        const metaModel = this.viewer.metaScene.metaModels[modelId];
        if (!metaModel) {
            this.error("MetaModel not found: " + modelId);
            return;
        }
        const modelMemento = new ModelMemento();
        modelMemento.saveObjects(this.viewer.scene, metaModel);
        this._modelMementos[modelId] = modelMemento;
    }

    _restoreModelMemento(modelId) {
        const metaModel = this.viewer.metaScene.metaModels[modelId];
        if (!metaModel) {
            this.error("MetaModel not found: " + modelId);
            return;
        }
        const modelMemento = this._modelMementos[modelId];
        modelMemento.restoreObjects(this.viewer.scene, metaModel);
    }

    _destroyModelMemento(modelId) {
        delete this._modelMementos[modelId];
    }

    reset() {
        const scene = this.viewer.scene;
        const modelIds = scene.modelIds;
        for (var i = 0, len = modelIds.length; i < len; i++) {
            const modelId = modelIds[i];
            this._restoreModelMemento(modelId);
        }
        this.fire("reset", true);
        this._resetCamera();
    }

    _resetCamera() {
        const viewer = this.viewer;
        const scene = viewer.scene;
        const aabb = scene.getAABB(scene.visibleObjectIds);
        const diag = math.getAABB3Diag(aabb);
        const center = math.getAABB3Center(aabb, tempVec3a);
        const dist = Math.abs(diag / Math.tan(65.0 / 2));     // TODO: fovy match with CameraFlight
        const camera = scene.camera;
        const dir = (camera.yUp) ? [-1, -1, -1] : [1, 1, 1];
        const up = (camera.yUp) ? [-1, 1, -1] : [-1, 1, 1];
        viewer.cameraControl.pivotPos = center;
        viewer.cameraFlight.flyTo({
            look: center,
            eye: [center[0] - (dist * dir[0]), center[1] - (dist * dir[1]), center[2] - (dist * dir[2])],
            up: up,
            orthoScale: diag * 1.3,
            projection: "perspective",
            duration: 1
        });
    }
}

const tempVec3 = math.vec3();

class FitAction extends Controller {

    constructor(parent, cfg={}) {

        super(parent, cfg);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        const buttonElement = cfg.buttonElement;

        this.on("enabled", (enabled) => {
            if (!enabled) {
                buttonElement.classList.add("disabled");
            } else {
                buttonElement.classList.remove("disabled");
            }
        });

        this.on("active", (active) => {
            if (active) {
                buttonElement.classList.add("active");
            } else {
                buttonElement.classList.remove("active");
            }
        });

        buttonElement.addEventListener("click", (event) => {
            if (this.getEnabled()) {
                this.fit();
            }
            event.preventDefault();
        });
    }

    fit() {
        const scene = this.viewer.scene;
        const aabb = scene.getAABB(scene.visibleObjectIds);
        this.viewer.cameraFlight.flyTo({
            aabb: aabb
        });
        this.viewer.cameraControl.pivotPos = math.getAABB3Center(aabb, tempVec3);
    }

    set fov(fov) {
        this.viewer.scene.cameraFlight.fitFOV = fov;
    }

    get fov() {
        return this.viewer.scene.cameraFlight.fitFOV;
    }

    set duration(duration) {
        this.viewer.scene.cameraFlight.duration = duration;
    }

    get duration() {
        return this.viewer.scene.cameraFlight.duration;
    }
}

class FirstPersonMode extends Controller {

    constructor(parent, cfg) {

        super(parent, cfg);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        const buttonElement = cfg.buttonElement;
        const cameraControl = this.viewer.cameraControl;

        cameraControl.firstPerson = false;
        cameraControl.pivoting = true;
        cameraControl.panToPointer = true;

        this.on("enabled", (enabled) => {
            if (!enabled) {
                buttonElement.classList.add("disabled");
            } else {
                buttonElement.classList.remove("disabled");
            }
        });

        this.on("active", (active) => {
            if (active) {
                buttonElement.classList.add("active");
            } else {
                buttonElement.classList.remove("active");
            }
        });

        this.on("active", (active) => {
            if (active) {
                cameraControl.firstPerson = true;
                cameraControl.panToPointer = true;
                cameraControl.pivoting = false;
            } else {
                cameraControl.firstPerson = false;
                cameraControl.pivoting = true;
                cameraControl.panToPointer = true;
            }
            this.viewer.cameraControl.planView = false;
        });

        buttonElement.addEventListener("click", (event) => {
            if (!this.getEnabled()) {
                return;
            }
            const active = this.getActive();
            this.setActive(!active);
            event.preventDefault();
        });

        this.viewerUI.on("reset", ()=>{
            this.setActive(false);
        });
    }
}

class OrthoMode extends Controller {

    constructor(parent, cfg) {

        super(parent, cfg);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        const buttonElement = cfg.buttonElement;

        this.on("enabled", (enabled) => {
            if (!enabled) {
                buttonElement.classList.add("disabled");
            } else {
                buttonElement.classList.remove("disabled");
            }
        });

        this.on("active", (active) => {
            if (active) {
                buttonElement.classList.add("active");
            } else {
                buttonElement.classList.remove("active");
            }
        });
        
        this.on("active", (active) => {
            if (active) {
                this.viewer.cameraFlight.flyTo({projection: "ortho", duration: 0.5}, () => {});
            } else {
                this.viewer.cameraFlight.flyTo({projection: "perspective", duration: 0.5}, () => {});
            }
            this.viewer.cameraControl.planView = false;
        });
        
        buttonElement.addEventListener("click", (event) => {
            this.setActive(!this.getActive());
            event.preventDefault();
        });

        this.viewerUI.on("reset", ()=>{
            this.setActive(false);
        });
    }
}

function closeEnough(p, q) {
    const CLICK_DIST = 4;
    return (Math.abs(p[0] - q[0]) < 4) && (Math.abs(p[1] - q[1]) < CLICK_DIST);
}

class HideMode extends Controller {

    constructor(parent, cfg) {

        super(parent, cfg);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        const buttonElement = cfg.buttonElement;

        this.on("enabled", (enabled) => {
            if (!enabled) {
                buttonElement.classList.add("disabled");
            } else {
                buttonElement.classList.remove("disabled");
            }
        });

        this.on("active", (active) => {
            if (active) {
                buttonElement.classList.add("active");
            } else {
                buttonElement.classList.remove("active");
            }
        });

        this.on("active", (active) => {
           this.activateHideMode(active);
        });

        buttonElement.addEventListener("click", (event) => {
            if (!this.getEnabled()) {
                return;
            }
            const active = this.getActive();
            this.setActive(!active);
            event.preventDefault();
        });

        this.viewerUI.on("reset", ()=>{
            this.setActive(false);
        });
    }

    activateHideMode(active) {
        if (active) {
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
            const lastCoords = math.vec2();
            this._onMousedown = this.viewer.scene.input.on("mousedown", (coords) => {
                lastCoords[0] = coords[0];
                lastCoords[1] = coords[1];
            });
            this._onMouseup = this.viewer.scene.input.on("mouseup", (coords) => {
                if (entity) {
                    if (!closeEnough(lastCoords, coords)) {
                        entity = null;
                        return;
                    }
                    entity.visible = false;
                    entity.highlighted = false;
                    entity = null;
                }
            });
        } else {
            if (entity) {
                entity.highlighted = false;
                entity = null;
            }
            this.viewer.cameraControl.off(this._onHover);
            this.viewer.cameraControl.off(this._onHoverOff);
            this.viewer.cameraControl.off(this._onMousedown);
            this.viewer.cameraControl.off(this._onMouseup);
        }
    }
}

function closeEnough$1(p, q) {
    const CLICK_DIST = 4;
    return (Math.abs(p[0] - q[0]) < 4) && (Math.abs(p[1] - q[1]) < CLICK_DIST);
}

class SelectMode extends Controller {

    constructor(parent, cfg) {

        super(parent);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        const buttonElement = cfg.buttonElement;

        this.on("enabled", (enabled) => {
            if (!enabled) {
                buttonElement.classList.add("disabled");
            } else {
                buttonElement.classList.remove("disabled");
            }
        });

        this.on("active", (active) => {
            if (active) {
                buttonElement.classList.add("active");
            } else {
                buttonElement.classList.remove("active");
            }
        });

        this.on("active", (active) => {
            const viewer = this.viewer;
            const cameraControl = viewer.cameraControl;
            if (active) {
                var entity = null;
                this._onHover = cameraControl.on("hover", (e) => {
                    if (entity) {
                        entity.highlighted = false;
                        entity = null;
                    }
                    entity = e.entity;
                    entity.highlighted = true;
                });
                this._onHoverOff = cameraControl.on("hoverOff", (e) => {
                    if (entity) {
                        entity.highlighted = false;
                        entity = null;
                    }
                });
                const lastCoords = math.vec2();
                this._onMousedown = viewer.scene.input.on("mousedown", (coords) => {
                    lastCoords[0] = coords[0];
                    lastCoords[1] = coords[1];
                });
                this._onMouseup = viewer.scene.input.on("mouseup", (coords) => {
                    if (entity) {
                        if (!closeEnough$1(lastCoords, coords)) {
                            entity = null;
                            return;
                        }
                        entity.selected = !entity.selected;
                        entity = null;
                    }
                });
            } else {
                if (entity) {
                    entity.highlighted = false;
                    entity = null;
                }
                cameraControl.off(this._onHover);
                cameraControl.off(this._onHoverOff);
                cameraControl.off(this._onMousedown);
                cameraControl.off(this._onMouseup);
            }
        });

        buttonElement.addEventListener("click", (event) => {
            if (!this.getEnabled()) {
                return;
            }
            const active = this.getActive();
            this.setActive(!active);
            event.preventDefault();
        });

        this.viewerUI.on("reset", ()=>{
            this.setActive(false);
        });
    }
}

function closeEnough$2(p, q) {
    const CLICK_DIST = 4;
    return (Math.abs(p[0] - q[0]) < 4) && (Math.abs(p[1] - q[1]) < CLICK_DIST);
}

class QueryMode extends Controller {

    constructor(parent, cfg) {

        super(parent);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        const buttonElement = cfg.buttonElement;

        this.on("enabled", (enabled) => {
            if (!enabled) {
                buttonElement.classList.add("disabled");
            } else {
                buttonElement.classList.remove("disabled");
            }
        });

        this.on("active", (active) => {
            if (active) {
                buttonElement.classList.add("active");
            } else {
                buttonElement.classList.remove("active");
            }
        });

        this.on("active", (active) => {
            const viewer = this.viewer;
            const cameraControl = viewer.cameraControl;
            if (active) {
                var entity = null;
                this._onHover = cameraControl.on("hover", (e) => {
                    if (entity) {
                        entity.highlighted = false;
                        entity = null;
                    }
                    entity = e.entity;
                    entity.highlighted = true;
                });
                this._onHoverOff = cameraControl.on("hoverOff", (e) => {
                    if (entity) {
                        entity.highlighted = false;
                        entity = null;
                    }
                });
                const lastCoords = math.vec2();
                this._onMousedown = viewer.scene.input.on("mousedown", (coords) => {
                    lastCoords[0] = coords[0];
                    lastCoords[1] = coords[1];
                });
                this._onMouseup = viewer.scene.input.on("mouseup", (coords) => {
                    if (entity) {
                        if (!closeEnough$2(lastCoords, coords)) {
                            entity = null;
                            return;
                        }
                        this.fire("queryPicked", entity.id);
                        entity = null;
                    } else {
                        this.fire("queryNotPicked", false);
                    }
                });
            } else {
                cameraControl.off(this._onHover);
                cameraControl.off(this._onHoverOff);
                cameraControl.off(this._onMousedown);
                cameraControl.off(this._onMouseup);
            }
        });

        buttonElement.addEventListener("click", (event) => {
            if (!this.getEnabled()) {
                return;
            }
            const active = this.getActive();
            this.setActive(!active);
            event.preventDefault();
        });

        this.viewerUI.on("reset", ()=>{
            this.setActive(false);
        });
    }
}

class SectionMode extends Controller {

    constructor(parent, cfg) {

        super(parent, cfg);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        if (!cfg.sectionPlanesOverviewCanvasElement) {
            throw "Missing config: sectionPlanesOverviewCanvasElement";
        }

        const buttonElement = cfg.buttonElement;
        const sectionPlanesOverviewCanvasElement = cfg.sectionPlanesOverviewCanvasElement;

        this._sectionPlanesPlugin = new SectionPlanesPlugin(this.viewer, {
            overviewCanvas: sectionPlanesOverviewCanvasElement
        });

        this.on("enabled", (enabled) => {
            if (!enabled) {
                buttonElement.classList.add("disabled");
            } else {
                buttonElement.classList.remove("disabled");
            }
        });

        this.on("active", (active) => {
            if (active) {
                buttonElement.classList.add("active");
            } else {
                buttonElement.classList.remove("active");
            }
        });

        this.on("active", (active) =>{
            if (active) {
                this._sectionPlanesPlugin.setOverviewVisible(true);
                this._onPickedSurface = this.viewer.cameraControl.on("pickedSurface", (e) => {
                    const sectionPlane = this._sectionPlanesPlugin.createSectionPlane({
                        pos: e.worldPos,
                        dir: [-e.worldNormal[0], -e.worldNormal[1], -e.worldNormal[2]]
                    });
                    this._sectionPlanesPlugin.showControl(sectionPlane.id);
                });
            } else {
                this.viewer.cameraControl.off(this._onPickedSurface);
                this._sectionPlanesPlugin.hideControl();
                this._sectionPlanesPlugin.setOverviewVisible(false);
            }
        });

        buttonElement.addEventListener("click", (event) => {
            if (!this.getEnabled()) {
                return;
            }
            const active = this.getActive();
            this.setActive(!active);
            event.preventDefault();
        });

        this.viewerUI.on("reset", () => {
            this.clear();
            this.setActive(false);
        });
    }

    clear() {
        this._sectionPlanesPlugin.clear();
    }

    destroy() {
        this._sectionPlanesPlugin.destroy();
        super.destroy();
    }
}

class NavCubeMode extends Controller {

    constructor(parent, cfg) {

        super(parent, cfg);

        if (!cfg.navCubeCanvasElement) {
            throw "Missing config: navCubeCanvasElement";
        }

        const navCubeCanvasElement = cfg.navCubeCanvasElement;

        this._navCube = new NavCubePlugin(this.viewer, {
            canvasElement: navCubeCanvasElement,
            fitVisible: true
        });

        this._navCube.setVisible(this._active);

        // this.on("active", (active) => {
        //     if (active) {
        //         buttonElement.classList.add("active");
        //     } else {
        //         buttonElement.classList.remove("active");
        //     }
        // });

        this.on("active", (active) => {
            this._navCube.setVisible(active);
        });
    }

    destroy() {
        this._navCube.destroy();
        super.destroy();
    }
}

const tempVec3$1 = math.vec3();

class Models extends Controller {

    constructor(parent, cfg) {

        super(parent, cfg);

        if (!cfg.modelsTabElement) {
            throw "Missing config: modelsTabElement";
        }

        if (!cfg.unloadModelsButtonElement) {
            throw "Missing config: unloadModelsButtonElement";
        }

        if (!cfg.modelsElement) {
            throw "Missing config: modelsElement";
        }

        this._modelsTabElement = cfg.modelsTabElement;
        this._unloadModelsButtonElement = cfg.unloadModelsButtonElement;
        this._modelsElement = cfg.modelsElement;

        this._xktLoader = new XKTLoaderPlugin(this.viewer);
        this._modelsInfo = {};
        this._numModelsLoaded = 0;
        this._projectId = null;
    }

    _loadProject(projectId) {
        this.server.getProject(projectId, (projectInfo) => {
            this._projectId = projectId;
            var html = "";
            const modelsInfo = projectInfo.models || [];
            this._modelsInfo = {};
            for (var i = 0, len = modelsInfo.length; i < len; i++) {
                const modelInfo = modelsInfo[i];
                this._modelsInfo[modelInfo.id] = modelInfo;
                html += "<div class='form-check'>";
                html += "<label class='form-check-label'>";
                html += "<input id='" + modelInfo.id + "' type='checkbox' class='form-check-input' value=''>" + modelInfo.name;
                html += "</label>";
                html += "</div>";
            }
            this._modelsElement.innerHTML = html;
            for (var i = 0, len = modelsInfo.length; i < len; i++) {
                const modelInfo = modelsInfo[i];
                const modelId = modelInfo.id;
                const checkBox = document.getElementById("" + modelId);
                checkBox.addEventListener("click", () => {
                    if (checkBox.checked) {
                        this._loadModel(modelId);
                    } else {
                        this._unloadModel(modelInfo.id);
                    }
                });
            }
        }, (errMsg) => {
            this.error(errMsg);
        });
    }

    _loadModel(modelId) {
        const modelInfo = this._modelsInfo[modelId];
        if (!modelInfo) {
            return;
        }
        this.viewerUI.busyDialog.show("Loading model '" + modelInfo.name + "'");
        this.server.getMetadata(this._projectId, modelId,
            (json) => {
                this.server.getGeometry(this._projectId, modelId,
                    (arraybuffer) => {
                        const model = this._xktLoader.load({
                            id: modelId,
                            metaModelData: json,
                            xkt: arraybuffer,
                            edges: true
                        });
                        model.on("loaded", () => {
                            const scene = this.viewer.scene;
                            const aabb = scene.getAABB(scene.visibleObjectIds);
                            this._numModelsLoaded++;
                            if (this._numModelsLoaded === 1) { // Jump camera when only one model
                                this.viewer.cameraFlight.jumpTo({
                                    aabb: aabb
                                });
                                this.viewer.cameraControl.pivotPos = math.getAABB3Center(aabb, tempVec3$1);
                                this.fire("modelLoaded", modelId);
                                this.viewerUI.busyDialog.hide();
                            } else { // Fly camera when multiple models
                                this.viewer.cameraFlight.flyTo({
                                    aabb: aabb
                                }, () => {
                                    this.viewer.cameraControl.pivotPos = math.getAABB3Center(aabb, tempVec3$1);
                                    this.fire("modelLoaded", modelId);
                                    this.viewerUI.busyDialog.hide();
                                });
                            }
                        });
                    },
                    (errMsg) => {
                        this.error(errMsg);
                        this.viewerUI.busyDialog.hide();
                    });
            },
            (errMsg) => {
                this.error(errMsg);
                this.viewerUI.busyDialog.hide();
            });
    }

    _unloadModel(modelId) {
        const model = this.viewer.scene.models[modelId];
        if (!model) {
            this.error("Model not loaded: " + modelId);
            return;
        }
        model.destroy();
        const scene = this.viewer.scene;
        const aabb = scene.getAABB(scene.visibleObjectIds);
        document.getElementById("" + modelId).checked = false;
        this._numModelsLoaded--;
        this.viewer.cameraFlight.flyTo({
            aabb: aabb
        }, () => {
            this.viewer.cameraControl.pivotPos = math.getAABB3Center(aabb, tempVec3$1);
            this.fire("modelUnloaded", modelId);
        });
    }

    _unloadModels() {
        const models = this.viewer.scene.models;
        const modelIds = Object.keys(models);
        for (var i = 0, len = modelIds.length; i < len; i++) {
            const modelId = modelIds[i];
            this._unloadModel(modelId);
        }
    }

    getNumModelsLoaded() {
        return this._numModelsLoaded;
    }

    setEnabled(enabled) {
        if (!enabled) {
            this._unloadModelsButtonElement.classList.add("disabled");
        } else {
            this._unloadModelsButtonElement.classList.remove("disabled");
        }
    }

    /** @private */
    destroy() {
        super.destroy();
        this._xktLoader.destroy();
    }
}

class Objects extends Controller {

    constructor(parent, cfg = {}) {

        super(parent);

        if (!cfg.objectsTabElement) {
            throw "Missing config: objectsTabElement";
        }

        if (!cfg.showAllObjectsButtonElement) {
            throw "Missing config: showAllObjectsButtonElement";
        }

        if (!cfg.hideAllObjectsButtonElement) {
            throw "Missing config: hideAllObjectsButtonElement";
        }

        if (!cfg.objectsElement) {
            throw "Missing config: objectsElement";
        }

        this._objectsTabElement = cfg.objectsTabElement;
        this._showAllObjectsButtonElement = cfg.showAllObjectsButtonElement;
        this._hideAllObjectsButtonElement = cfg.hideAllObjectsButtonElement;

        const objectsElement = cfg.objectsElement;

        this._modelNodeIDs = {}; // For each model, an array of IDs of tree nodes
        this._muteTreeEvents = false;
        this._muteEntityEvents = false;

        this._tree = new InspireTree({
            selection: {
                autoSelectChildren: true,
                autoDeselect: true,
                mode: 'checkbox'
            },
            checkbox: {
                autoCheckChildren: true
            },
            data: []
        });

        new InspireTreeDOM(this._tree, {
            target: objectsElement
        });

        this._tree.on("model.loaded", () => {

            this._tree.on('node.selected', (event, node) => {
                if (this._muteTreeEvents) {
                    return;
                }
                const objectId = event.id;
                const entity = this.viewer.scene.objects[objectId];
                if (entity) {
                    this._muteEntityEvents = true;
                    entity.visible = true;
                    this._muteEntityEvents = false;
                }
            });

            this._tree.on('node.deselected', (event, node) => {
                if (this._muteTreeEvents) {
                    return;
                }
                const objectId = event.id;
                const entity = this.viewer.scene.objects[objectId];
                if (entity) {
                    this._muteEntityEvents = true;
                    entity.visible = false;
                    this._muteEntityEvents = false;
                }
            });

            this.viewer.scene.on("objectVisibility", (entity) => {
                // if (this._muteEntityEvents) {
                //     return;
                // }
                // const node = this._tree.node(entity.id);
                // if (!node) {
                //     return;
                // }
                // this._muteTreeEvents = true;
                // const checked = node.checked();
                // if (entity.visible) {
                //     if (!checked) {
                //         node.check(false);
                //     }
                // } else {
                //     if (checked) {
                //         node.uncheck(false);
                //     }
                // }
                // this._muteTreeEvents = false;
            });
        });
    }

    _addModel(modelId) {
        const data = [];
        const metaModels = this.viewer.metaScene.metaModels;
        const metaModel = metaModels[modelId];
        this._visit(true, data, metaModel.rootMetaObject);
        const modelNodeIDs = [];
        for (var i = 0, len = data.length; i < len; i++) {
            modelNodeIDs.push(data[i].id);
        }
        this._modelNodeIDs[modelId] = modelNodeIDs;
        this._tree.addNodes(data);
        this._synchTreeFromScene(modelId);
    }

    _removeModel(modelId) {
        const modelNodeIDs = this._modelNodeIDs[modelId];
        for (var i = 0, len = modelNodeIDs.length; i < len; i++) {
            const nodeId = modelNodeIDs[i];
            const node = this._tree.node(nodeId);
            if (!node) {
                continue;
            }
            node.remove(true);
        }
    }

    _visit(expand, data, metaObject) {
        if (!metaObject) {
            return;
        }
        const child = {
            id: metaObject.id,
            text: metaObject.name || ("(" + metaObject.type + ")")
        };
        data.push(child);
        const children = metaObject.children;
        if (children) {
            child.children = [];
            for (var i = 0, len = children.length; i < len; i++) {
                this._visit(true, child.children, children[i]);
            }
        }
    }

    _synchTreeFromScene(modelId) {
        this._muteTreeEvents = true;
        const metaModel = this.viewer.metaScene.metaModels[modelId];
        if (!metaModel) {
            return;
        }
        const rootMetaObject = metaModel.rootMetaObject;
        if (!rootMetaObject) {
            return;
        }
        this._muteTreeEvents = true;
        this._setObjectVisibilities(rootMetaObject);
        this._muteTreeEvents = false;
    }

    _setObjectVisibilities(metaObject) {
        if (!metaObject) {
            return;
        }
        const objectId = metaObject.id;
        const entity = this.viewer.scene.objects[objectId];
        if (entity) {
            const node = this._tree.node(objectId);
            if (node) {
                const checked = node.checked();
                if (entity.visible) {
                    if (!checked) {
                        node.check(false);
                    }
                } else {
                    if (checked) {
                        node.uncheck(false);
                    }
                }
            }
        }
        const children = metaObject.children;
        if (children) {
            for (var i = 0, len = children.length; i < len; i++) {
                this._visit(children[i]);
            }
        }
    }

    setEnabled(enabled) {
        if (!enabled) {
            this._objectsTabElement.classList.add("disabled");
            this._showAllObjectsButtonElement.classList.add("disabled");
            this._hideAllObjectsButtonElement.classList.add("disabled");
        } else {
            this._objectsTabElement.classList.remove("disabled");
            this._showAllObjectsButtonElement.classList.remove("disabled");
            this._hideAllObjectsButtonElement.classList.remove("disabled");
        }
    }

    muteEvents() {
        this._muteTreeEvents = true;
        this._muteEntityEvents = true;
    }

    unmuteEvents() {
        this._muteTreeEvents = false;
        this._muteEntityEvents = false;
    }

    selectAll() {
      //  this._tree.selectDeep();
    }

    deselectAll() {
    //    this._tree.deselectDeep();
    }

    destroy() {
        super.destroy();
    }
}

class Classes extends Controller {

    constructor(parent, cfg = {}) {

        super(parent);

        if (!cfg.classesTabElement) {
            throw "Missing config: classesTabElement";
        }

        if (!cfg.showAllClassesButtonElement) {
            throw "Missing config: showAllClassesButtonElement";
        }

        if (!cfg.hideAllClassesButtonElement) {
            throw "Missing config: hideAllClassesButtonElement";
        }

        if (!cfg.classesElement) {
            throw "Missing config: classesElement";
        }

        this._classesTabElement = cfg.classesTabElement;
        this._showAllClassesButtonElement = cfg.showAllClassesButtonElement;
        this._hideAllClassesButtonElement = cfg.hideAllClassesButtonElement;
        this._classesElement = cfg.classesElement;

        this._muteCheckBoxEvents = false;
        this._muteEntityEvents = false;

        this._data = {};

        this.viewer.scene.on("objectVisibility", (entity) => {
            if (this._muteEntityEvents) {
                return;
            }
            const metaObject = this.viewer.metaScene.metaObjects[entity.id];
            if (!metaObject) {
                return;
            }
            const type = metaObject.type;
            const classData = this._data[type];
            if (!classData) {
                return;
            }
            this._muteCheckBoxEvents = true;
            if (entity.visible) {
                classData.numObjectsVisible++;
                if (classData.numObjectsVisible === 1) {
                    document.getElementById("" + type).checked = true;
                }
            } else {
                classData.numObjectsVisible--;
                if (classData.numObjectsVisible === 0) {
                    document.getElementById("" + type).checked = false;
                }
            }
            this._muteCheckBoxEvents = false;
        });

    }

    _addModel(modelId) {
        this._rebuild();
    }

    _removeModel(modelId) {
        this._rebuild();
    }

    _rebuild(cfg) {
        this._createData();
        this._repaint();
    }

    _createData() {
        var t0 = performance.now();
        this._data = {};
        const objectIds = this.viewer.scene.objectIds;
        const metaObjects = this.viewer.metaScene.metaObjects;
        const objects = this.viewer.scene.objects;
        for (var i = 0, len = objectIds.length; i < len; i++) {
            const objectId = objectIds[i];
            const metaObject = metaObjects[objectId];
            if (metaObject) {
                const type = metaObject.type;
                const entity = objects[objectId];
                var classData = this._data[type];
                if (!classData) {
                    classData = {
                        numObjectsVisible: 0,
                        numObjects: 0
                    };
                    this._data[type] = classData;
                }
                if (entity.visible) {
                    classData.numObjectsVisible++;
                }
                classData.numObjects++;
            }
        }
        var t1 = performance.now();
        // console.log("Classes._createData() " + (t1 - t0));
    }

    _repaint() {
        const html = [];
        for (var type in this._data) {
            const classData = this._data[type];
            html.push("<div class='form-check'>");
            html.push("<label class='form-check-label'>");
            html.push("<input id='");
            html.push(type);
            html.push("' type='checkbox' class='form-check-input' value=''");
            if (classData.numObjectsVisible > 0) {
                html.push(" checked ");
            }
            html.push(">");
            html.push(type);
            html.push("</label>");
            html.push("</div>");
        }
        this._classesElement.innerHTML = html.join("");
        for (var type in this._data) {
            const classData = this._data[type];
            const checkBox = document.getElementById("" + type);
            const objectIds = this.viewer.metaScene.getObjectIDsByType(type);
            checkBox.addEventListener("click", () => {
                if (this._muteCheckBoxEvents) {
                    return;
                }
                const visible = checkBox.checked;
                this._muteEntityEvents = true;
                this.viewer.scene.setObjectsVisible(objectIds, visible);
                if (visible) {
                    classData.numObjectsVisible += objectIds.length;
                } else {
                    classData.numObjectsVisible -= objectIds.length;
                }
                this._muteEntityEvents = false;
            });
        }
    }

    setEnabled(enabled) {
        if (!enabled) {
            this._classesTabElement.classList.add("disabled");
            this._showAllClassesButtonElement.classList.add("disabled");
            this._hideAllClassesButtonElement.classList.add("disabled");
        } else {
            this._classesTabElement.classList.remove("disabled");
            this._showAllClassesButtonElement.classList.remove("disabled");
            this._hideAllClassesButtonElement.classList.remove("disabled");
        }
    }
    muteEvents() {
        this._muteCheckBoxEvents = true;
        this._muteEntityEvents = true;
    }

    unmuteEvents() {
        this._muteCheckBoxEvents = false;
        this._muteEntityEvents = false;
    }

    selectAll() {
        for (var type in this._data) {
            const classData = this._data[type];
            classData.numObjectsVisible = classData.numObjects;
            document.getElementById("" + type).checked = true;
        }
    }

    deselectAll() {
        for (var type in this._data) {
            const classData = this._data[type];
            classData.numObjectsVisible = 0;
            document.getElementById("" + type).checked = false;
        }
    }

    destroy() {
        super.destroy();
    }
}

const explorerTemplate = `<div class="xeokit-tabs">
    <div class="xeokit-tab">
        <a class="xeokit-tab-button xeokit-modelsTab" href="#">Models</a>
        <div class="xeokit-tab-content">
            <div class="xeokit-btn-group">
                <button type="button" class="xeokit-unloadAllModels xeokit-btn disabled">Unload all</button>
            </div>
            <div class="xeokit-models" style="overflow-y:scroll;"></div>
        </div>
    </div>
    <div class="xeokit-tab xeokit-objectsTab">
        <a class="xeokit-tab-button" href="#">Objects</a>
        <div class="xeokit-tab-content">
         <div class="xeokit-btn-group">
            <button type="button" class="xeokit-showAllObjects xeokit-btn disabled">Show all</button>
            <button type="button" class="xeokit-hideAllObjects xeokit-btn disabled">Hide all</button>
        </div>
        <div class="xeokit-objects tree-panel" style="overflow-y:scroll;"></div>
        </div>
    </div>
    <div class="xeokit-tab xeokit-classesTab">
        <a class="xeokit-tab-button" href="#">Classes</a>
        <div class="xeokit-tab-content">
            <div class="xeokit-btn-group">
                <button type="button" class="xeokit-showAllClasses xeokit-btn disabled">Show all</button>
                <button type="button" class="xeokit-hideAllClasses xeokit-btn disabled">Hide all</button>
            </div>
            <div class="xeokit-classes tree-panel" style="overflow-y:scroll;"></div>
        </div>
    </div>
</div>`;

const toolbarTemplate = `<div class="xeokit-toolbar">
    <!-- Reset button -->
    <div class="xeokit-btn-group">
        <button type="button" class="xeokit-reset xeokit-btn fa fa-home fa-2x disabled"></button>
    </div>
    <!-- Fit button -->
    <div class="xeokit-btn-group" role="group">
        <button type="button" class="xeokit-fit xeokit-btn fa fa-crop fa-2x disabled"></button>
    </div>
    <!-- First Person mode button -->
    <div class="xeokit-btn-group" role="group">
        <button type="button" class="xeokit-firstPerson xeokit-btn fa fa-male fa-2x disabled"></button>
    </div>
    <!-- Ortho mode button -->
    <div class="xeokit-btn-group" role="group">
        <button type="button" class="xeokit-ortho xeokit-btn fa fa-cube fa-2x disabled"></button>
    </div>
    <!-- Tools button group -->
    <div class="xeokit-xeokit-btn-group" role="group">
        <!-- Hide tool button -->
        <button type="button" class="xeokit-hide xeokit-btn fa fa-eraser fa-2x disabled"></button>
        <!-- Select tool button -->
        <button type="button" class="xeokit-select xeokit-btn fa fa-mouse-pointer fa-2x disabled"></button>
        <!-- Slice tool button -->
        <button type="button" class="xeokit-section xeokit-btn fa fa-cut fa-2x disabled"></button>
        <!-- Query tool button -->
        <button type="button" class="xeokit-query xeokit-btn fa fa-info-circle fa-2x disabled"></button>
    </div>
</div>`;

function initTabs(containerElement) {

    const tabsClass = 'xeokit-tabs';
    const tabClass = 'xeokit-tab';
    const tabButtonClass = 'xeokit-tab-button';
    const activeClass = 'active';

    // Activates the chosen tab and deactivates the rest
    function activateTab(chosenTabElement) {
        let tabList = chosenTabElement.parentNode.querySelectorAll('.' + tabClass);
        for (let i = 0; i < tabList.length; i++) {
            let tabElement = tabList[i];
            if (tabElement.isEqualNode(chosenTabElement)) {
                tabElement.classList.add(activeClass);
            } else {
                tabElement.classList.remove(activeClass);
            }
        }
    }

    // Initialize each tabbed container
    let tabbedContainers = containerElement.querySelectorAll('.' + tabsClass);
    for (let i = 0; i < tabbedContainers.length; i++) {
        let tabbedContainer = tabbedContainers[i];
        // List of tabs for this tabbed container
        let tabList = tabbedContainer.querySelectorAll('.' + tabClass);
        // Make the first tab active when the page loads
        activateTab(tabList[0]);
        // Activate a tab when you click its button
        for (let i = 0; i < tabList.length; i++) {
            let tabElement = tabList[i];
            let tabButton = tabElement.querySelector('.' + tabButtonClass);
            tabButton.addEventListener('click', function (event) {
                event.preventDefault();
                activateTab(event.target.parentNode);
            });
        }
    }
}

/**
 * @desc UI controller for a xeokit {@link Viewer} toolbar.
 */
class ViewerUI extends Controller {

    /**
     * Constructs a ViewerUI.
     * @param {Server} server Data access strategy.
     * @param {*} cfg Configuration.
     */
    constructor(server, cfg = {}) {

        if (!cfg.canvasElement) {
            throw "Config expected: canvasElement";
        }

        if (!cfg.explorerElement) {
            throw "Config expected: explorerElement";
        }

        if (!cfg.toolbarElement) {
            throw "Config expected: toolbarElement";
        }

        if (!cfg.navCubeCanvasElement) {
            throw "Config expected: navCubeCanvasElement";
        }

        if (!cfg.sectionPlanesOverviewCanvasElement) {
            throw "Config expected: sectionPlanesOverviewCanvasElement";
        }

        const canvasElement = cfg.canvasElement;
        const explorerElement = cfg.explorerElement;
        const toolbarElement = cfg.toolbarElement;
        const navCubeCanvasElement = cfg.navCubeCanvasElement;
        const sectionPlanesOverviewCanvasElement = cfg.sectionPlanesOverviewCanvasElement;
        const queryInfoPanelElement = cfg.queryInfoPanelElement;

        super(null, cfg, server, new Viewer({
            canvasElement: canvasElement,
            transparent: true
        }));

        this._customizeViewer();

        explorerElement.innerHTML = explorerTemplate;
        toolbarElement.innerHTML = toolbarTemplate;

        initTabs(explorerElement);

        this.busyDialog = new BusyDialog(this); // TODO: Support external spinner dialog

        // Explorer

        this.models = new Models(this, {
            modelsTabElement: explorerElement.querySelector(".xeokit-modelsTab"),
            unloadModelsButtonElement: explorerElement.querySelector(".xeokit-unloadAllModels"),
            modelsElement: explorerElement.querySelector(".xeokit-models")
        });

        this.objects = new Objects(this, {
            objectsTabElement: explorerElement.querySelector(".xeokit-objectsTab"),
            showAllObjectsButtonElement: explorerElement.querySelector(".xeokit-showAllObjects"),
            hideAllObjectsButtonElement: explorerElement.querySelector(".xeokit-hideAllObjects"),
            objectsElement: explorerElement.querySelector(".xeokit-objects")
        });

        this.classes = new Classes(this, {
            classesTabElement: explorerElement.querySelector(".xeokit-classesTab"),
            showAllClassesButtonElement: explorerElement.querySelector(".xeokit-showAllClasses"),
            hideAllClassesButtonElement: explorerElement.querySelector(".xeokit-hideAllClasses"),
            classesElement: explorerElement.querySelector(".xeokit-classes")
        });

        // Toolbar

        this.reset = new ResetAction(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-reset"),
            active: false
        });

        this.fit = new FitAction(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-fit"),
            active: false
        });

        this.firstPerson = new FirstPersonMode(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-firstPerson"),
            active: false
        });

        this.ortho = new OrthoMode(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-ortho"),
            active: false
        });

        this.hide = new HideMode(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-hide"),
            active: false
        });

        this.select = new SelectMode(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-select"),
            active: false
        });

        this.query = new QueryMode(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-query"),
            queryInfoPanelElement: queryInfoPanelElement,
            active: false
        });

        this.section = new SectionMode(this, {
            buttonElement: toolbarElement.querySelector(".xeokit-section"),
            sectionPlanesOverviewCanvasElement: sectionPlanesOverviewCanvasElement,
            active: false
        });

        this.navCube = new NavCubeMode(this, {
            navCubeCanvasElement: navCubeCanvasElement,
            active: true
        });

        this._mutexActivation([this.query, this.hide, this.select, this.section]);

        this.firstPerson.setActive(false);
        this.ortho.setActive(false);
        this.navCube.setActive(true);

        explorerElement.querySelector(".xeokit-showAllObjects").addEventListener("click", (event) => {
            this._showAllObjects();
            event.preventDefault();
        });

        explorerElement.querySelector(".xeokit-hideAllObjects").addEventListener("click", (event) => {
            this._hideAllObjects();
            event.preventDefault();
        });

        explorerElement.querySelector(".xeokit-showAllClasses").addEventListener("click", (event) => {
            this._showAllObjects();
            event.preventDefault();
        });

        explorerElement.querySelector(".xeokit-hideAllClasses").addEventListener("click", (event) => {
            this._hideAllObjects();
            event.preventDefault();
        });

        explorerElement.querySelector(".xeokit-unloadAllModels").addEventListener("click", (event) => {
            this._enableControls(false); // For quick UI feedback
            this.models._unloadModels();
            event.preventDefault();
        });

        // Handling model load events here ensures that we
        // are able to fire "modelLoaded" after both trees updated.

        this.models.on("modelLoaded", (modelId) => {
            this.objects._addModel(modelId);
            this.classes._addModel(modelId);
            if (this.models.getNumModelsLoaded() === 1) {
                this._enableControls(true);
            }
            this.fire("modelLoaded", modelId);
        });

        this.models.on("modelUnloaded", (modelId) => {
            this.objects._removeModel(modelId);
            this.classes._removeModel(modelId);
            if (this.models.getNumModelsLoaded() === 0) {
                this._enableControls(false);
            }
            this.fire("modelUnloaded", modelId);
        });

        this.query.on("queryPicked", (entityId) => {
            const event = {};
            event.entity = this.viewer.scene.objects[entityId];
            event.metaObject = this.viewer.metaScene.metaObjects[entityId];
            this.fire("queryPicked", event);
        });

        this.query.on("queryNotPicked", () => {
            this.fire("queryNotPicked", true);
        });

        this.reset.on("reset", () => {
            this.fire("reset", true);
        });
    }

    _customizeViewer() {

        const scene = this.viewer.scene;

        scene.highlightMaterial.edges = true;
        scene.highlightMaterial.edgeColor = [.5, .5, 0];
        scene.highlightMaterial.edgeAlpha = 1.0;
        scene.highlightMaterial.fill = true;
        scene.highlightMaterial.fillAlpha = 0.1;
        scene.highlightMaterial.fillColor = [1, 1, 0];

        scene.clearLights();

        new AmbientLight(scene, {
            color: [0.3, 0.3, 0.3],
            intensity: 1.0
        });

        new DirLight(scene, {
            dir: [0.8, -0.6, -0.8],
            color: [1.0, 1.0, 1.0],
            intensity: 1.0,
            space: "world"
        });

        new DirLight(scene, {
            dir: [-0.8, -0.4, 0.4],
            color: [1.0, 1.0, 1.0],
            intensity: 1.0,
            space: "world"
        });

        new DirLight(scene, {
            dir: [0.2, -0.8, 0.8],
            color: [0.6, 0.6, 0.6],
            intensity: 1.0,
            space: "world"
        });
    }

    /**
     * Loads a project into the viewer.
     * Unloads any project already loaded.
     * @param projectId
     */
    loadProject(projectId) {
        this.models._loadProject(projectId);
    }

    /**
     * Saves viewer state to a BCF viewpoint.
     */
    saveBCFViewpoint() {

    }

    /**
     * Sets viewer state to a BCF viewpoint.
     */
    loadBCFViewpoint() {

    }

    _showAllObjects() {

        this.objects.muteEvents();
        this.classes.muteEvents();

        this.viewer.scene.setObjectsVisible(this.viewer.scene.objectIds, true);

        this.objects.selectAll();
        this.classes.selectAll();

        this.objects.unmuteEvents();
        this.classes.unmuteEvents();
    }

    _hideAllObjects() {

        this.objects.muteEvents();
        this.classes.muteEvents();

        this.viewer.scene.setObjectsVisible(this.viewer.scene.visibleObjectIds, false);

        this.objects.deselectAll();
        this.classes.deselectAll();

        this.objects.unmuteEvents();
        this.classes.unmuteEvents();
    }

    _enableControls(enabled) {

        // Explorer

        this.models.setEnabled(enabled);
        this.objects.setEnabled(enabled);
        this.classes.setEnabled(enabled);

        // Toolbar

        this.reset.setEnabled(enabled);
        this.fit.setEnabled(enabled);
        this.firstPerson.setEnabled(enabled);
        this.ortho.setEnabled(enabled);
        this.query.setEnabled(enabled);
        this.hide.setEnabled(enabled);
        this.select.setEnabled(enabled);
        this.section.setEnabled(enabled);
    }
}

export { Server, ViewerUI };
