import {Controller} from "../Controller.js";
import {DistanceMeasurementsPlugin} from "../../lib/xeokit/plugins/DistanceMeasurementsPlugin/DistanceMeasurementsPlugin.js";

/**
 * Controls distance measurement mode.
 *
 * Located at {@link Toolbar#distance}.
 */
class MeasureDistanceMode extends Controller {

    /** @private */
    constructor(parent, cfg={}) {
        super(parent, cfg);
        this._distanceMeasurements = new DistanceMeasurementsPlugin(this.viewer, {
            container: cfg.container
        });
    }

    /**
     * Activates or deactivates distance measurement mode.
     *
     * Activating this MeasureDistanceMode will deactivate {@link MeasureAngleMode}.
     *
     * @param {boolean} active Whether or not to activate distance measurement mode.
     */
    setActive(active) {
        if (this._active === active) {
            return;
        }
        this._active = active;
        this._active ? this._distanceMeasurements.control.activate() : this._distanceMeasurements.control.deactivate();
        this.fire("active", this._active);
    }

    /**
     * Gets whether or not distance measurement mode is active.
     * @returns {boolean}
     */
    getActive() {
        return this._active;
    }

    /**
     * Clears distance measurements.
     */
    clear() {
        this._distanceMeasurements.clear();
    }

    /** @private */
    _destroy() {
        this._distanceMeasurements.destroy();
        super.destroy();
    }
}

export {MeasureDistanceMode};