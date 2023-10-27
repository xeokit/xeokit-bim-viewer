import {Controller} from "../Controller.js";
import {AngleMeasurementsPlugin, AngleMeasurementsMouseControl, ContextMenu} from "@xeokit/xeokit-sdk";

/** @private */
export class MeasureAngleTool extends Controller {

    constructor(parent, cfg) {

        super(parent);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        const buttonElement = cfg.buttonElement;

        this._contextMenu = new ContextMenu({
            items: [
                [
                    {
                        getTitle: (context) => {
                            return context.measurement.labelsVisible ? "Hide Measurement Label" : "Show Measurement Label";
                        },
                        doAction: function (context) {
                            context.measurement.labelsVisible = !context.measurement.labelsVisible;
                        }
                    }
                ], [
                    {
                        title: "Delete Measurement",
                        doAction: function (context) {
                            context.measurement.destroy();
                        }
                    }
                ]
            ]
        });

        this._contextMenu.on("hidden", () => {
            if (this._contextMenu.context.measurement) {
                this._contextMenu.context.measurement.setHighlighted(false);
            }
        });

        this._angleMeasurementsPlugin = new AngleMeasurementsPlugin(this.viewer, {});

        this._angleMeasurementsPlugin.on("mouseOver", (e) => {
            e.measurement.setHighlighted(true);
        });

        this._angleMeasurementsPlugin.on("mouseLeave", (e) => {
            if (this._contextMenu.shown && this._contextMenu.context.measurement.id === e.measurement.id) {
                return;
            }
            e.measurement.setHighlighted(false);
        });

        this._angleMeasurementsPlugin.on("contextMenu", (e) => {
            this._contextMenu.context = { // Must set context before showing menu
                angleMeasurementsPlugin: this._angleMeasurementsPlugin,
                measurement: e.measurement
            };
            this._contextMenu.show(e.event.clientX, e.event.clientY);
            e.event.preventDefault();
        });

        this._angleMeasurementsMouseControl  = new AngleMeasurementsMouseControl(this._angleMeasurementsPlugin, {
         //   pointerLens : new PointerLens(viewer)
        })

        this._angleMeasurementsMouseControl.snapping = true;
        
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
                this._angleMeasurementsMouseControl.activate();
            } else {
                buttonElement.classList.remove("active");
                this._angleMeasurementsMouseControl.deactivate();
            }
        });

        buttonElement.addEventListener("click", (event) => {
            if (this.getEnabled()) {
                const active = this.getActive();
                this.setActive(!active);
            }
            event.preventDefault();
        });

        this.bimViewer.on("reset", () => {
            this.setActive(false);
            this.clear();
        });
    }

    getNumMeasurements() {
        return Object.keys(this._angleMeasurementsPlugin.measurements).length;
    }

    setSnappingEnabled(snappingEnabled) {
        return this._angleMeasurementsMouseControl.snapping = snappingEnabled;
    }

    getSnappingEnabled() {
        return this._angleMeasurementsMouseControl.snapping;
    }

    clear() {
        this._angleMeasurementsPlugin.clear();
    }

    destroy() {
        this._angleMeasurementsPlugin.destroy();
        this._angleMeasurementsMouseControl.destroy();
        this._contextMenu.destroy();
        super.destroy();
    }
}