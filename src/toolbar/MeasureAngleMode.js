import {Controller} from "../Controller.js";
import {AngleMeasurementsPlugin} from "../../lib/xeokit/plugins/AngleMeasurementsPlugin/AngleMeasurementsPlugin.js";

/**
 * Controls angle measurement mode
 *
 * Located at {@link Toolbar#angle}.
 */
class MeasureAngleMode extends Controller {

    /** @private */
    constructor(parent, cfg) {
        super(parent, cfg);
        this._angleMeasurements = new AngleMeasurementsPlugin(this.viewer, {
            container: cfg.container
        });
    }

    /**
     * Activates or deactivates angle measurement mode.
     *
     * Activating this MeasureAngleMode will deactivate {@link MeasureDistanceMode}.
     *
     * @param {boolean} active Whether or not to activate angle measurement mode.
     */
    setActive(active) {
        if (this._active === active) {
            return;
        }
        this._active = active;
        this._active ? this._angleMeasurements.control.activate() : this._angleMeasurements.control.deactivate();
        this.fire("active", this._active);
    }

    /**
     * Gets whether or not angle measurement mode is active.
     * @returns {boolean}
     */
    getActive() {
        return this._active;
    }

    /**
     * Clears angle measurements.
     */
    clear() {
        this._angleMeasurements.clear();
    }

    /** @private */
    destroy() {
        this._angleMeasurements.destroy();
        super.destroy();
    }
}

export {MeasureAngleMode};