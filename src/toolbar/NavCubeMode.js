import {Controller} from "../Controller.js";
import {NavCubePlugin} from "@xeokit/xeokit-sdk/src/plugins/NavCubePlugin/NavCubePlugin.js";

class NavCubeMode extends Controller {

    constructor(parent, cfg) {

        super(parent, cfg);

        if (!cfg.navCubeCanvasElement) {
            throw "Missing config: navCubeCanvasElement";
        }

        const navCubeCanvasElement = cfg.navCubeCanvasElement;

        this._navCube = new NavCubePlugin(this.viewer, {
            canvasElement: navCubeCanvasElement,
            fitVisible: true,
            color: "#CFCFCF"
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

export {NavCubeMode};