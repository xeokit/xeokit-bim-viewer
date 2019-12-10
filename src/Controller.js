import {Map} from "@xeokit/xeokit-sdk/src/viewer/scene/utils/Map.js";
import {utils} from "@xeokit/xeokit-sdk/src/viewer/scene/utils.js";

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

    // _mutexActivationOLD(controllers) {
    //     const mutedControllers = [];
    //     const numControllers = controllers.length;
    //     for (let i = 0; i < numControllers; i++) {
    //         mutedControllers[i] = false;
    //     }
    //     for (let i = 0; i < numControllers; i++) {
    //         const controller = controllers[i];
    //         controller.on("active", (function () {
    //             const _i = i;
    //             return function (active) {
    //
    //                 if (!active) {
    //                     console.log("  returning (" + controller.id + " active == false)");
    //                     return;
    //                 }
    //                 if (mutedControllers[_i]) {
    //                     console.log("  returning (" + controller.id + " muted)");
    //                     return;
    //                 }
    //                 for (let j = 0; j < numControllers; j++) {
    //                     if (j === _i) {
    //                         continue;
    //                     }
    //                     console.log("   muting: " + controllers[j].id);
    //                     mutedControllers[j] = true;
    //                     console.log("   deactivating: " + controllers[j].id);
    //                     controllers[j].setActive(false);
    //                     console.log("   unmuting " + controllers[j].id);
    //                     mutedControllers[j] = false;
    //                 }
    //             };
    //         })());
    //     }
    // }

    _mutexActivation(controllers) {
        const numControllers = controllers.length;
        for (let i = 0; i < numControllers; i++) {
            const controller = controllers[i];
            controller.on("active", (function () {
                const _i = i;
                return function (active) {
                    if (!active) {
                        return;
                    }
                    for (let j = 0; j < numControllers; j++) {
                        if (j === _i) {
                            continue;
                        }
                        controllers[j].setActive(false);
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

export {Controller};