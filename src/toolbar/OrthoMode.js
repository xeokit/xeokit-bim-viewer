import {Controller} from "../Controller.js";

/** @private */
class OrthoMode extends Controller {

    constructor(parent, cfg) {

        super(parent, cfg);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        this._buttonElement = cfg.buttonElement;

        this.on("enabled", (enabled) => {
            if (!enabled) {
                this._buttonElement.classList.add("disabled");
            } else {
                this._buttonElement.classList.remove("disabled");
            }
        });

        this._buttonElement.addEventListener("click", (event) => {
            if (this.getEnabled()) {
                this.setActive(!this.getActive(), ()=>{});
            }
            event.preventDefault();
        });

        this.bimViewer.on("reset", () => {
            this.setActive(false);
        });

        this._active = false;
        this._buttonElement.classList.remove("active");
    }

    setActive(active, done) {
        if (this._active === active) {
            if (done) {
                done();
            }
            return;
        }
        this._active = active;
        if (active) {
            this._buttonElement.classList.add("active");
            if (done) {
                this._enterOrthoMode(() => {
                    this.fire("active", this._active);
                    done();
                });
            } else {
                this._enterOrthoMode();
                this.fire("active", this._active);
            }
        } else {
            this._buttonElement.classList.remove("active");
            if (done) {
                this._exitOrthoMode(() => {
                    this.fire("active", this._active);
                    done();
                });
            } else {
                this._exitOrthoMode();
                this.fire("active", this._active);
            }
        }
    }

    _enterOrthoMode(done) {
        if (done) {
            this.viewer.cameraFlight.flyTo({projection: "ortho", duration: 0.5}, done);
        } else {
            this.viewer.cameraFlight.jumpTo({projection: "ortho"});
        }
    }

    _exitOrthoMode(done) {
        if (done) {
            this.viewer.cameraFlight.flyTo({projection: "perspective", duration: 0.5}, done);
        } else {
            this.viewer.cameraFlight.jumpTo({projection: "perspective"});
        }
    }
}

export {OrthoMode};