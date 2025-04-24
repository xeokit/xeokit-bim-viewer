import { BIMViewer } from '../../src/BIMViewer.js';
import { Server } from '../../src/server/Server.js';
import faRegularWoff from '@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff2';
import faSolidWoff from '@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2';
import faBrandsWoff from '@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2';
import faRegularTtf from '@fortawesome/fontawesome-free/webfonts/fa-regular-400.ttf';
import faSolidTtf from '@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf';
import faBrandsTtf from '@fortawesome/fontawesome-free/webfonts/fa-brands-400.ttf';
import style from '@fortawesome/fontawesome-free/css/all.css';

const headStyleinnerHtml = `
    @font-face {
        font-family: 'Font Awesome 6 Free';
        font-display: block;
        font-weight: 900;
        src: url(${faSolidWoff}) format("woff2"), url(${faSolidTtf}) format("truetype");
    }
    @font-face {
        font-family: 'Font Awesome 6 Free';
        font-display: block;
        font-weight: 400;
        src: url(${faRegularWoff}) format("woff2"), url(${faRegularTtf}) format("truetype");
    }
    @font-face {
        font-family: 'Font Awesome 5 Free';
        font-display: block;
        font-weight: 900;
        src: url(${faSolidWoff}) format("woff2"), url(${faSolidTtf}) format("truetype");
    }
    @font-face {
        font-family: 'Font Awesome 5 Free';
        font-display: block;
        font-weight: 400;
        src: url(${faRegularWoff}) format("woff2"), url(${faRegularTtf}) format("truetype");
    }
    @font-face {
        font-family: 'Font Awesome 6 Brands';
        font-display: block;
        font-weight: 400;
        src: url(${faBrandsWoff}) format("woff2"), url(${faBrandsTtf}) format("truetype");
    }
    @font-face {
        font-family: 'Font Awesome 5 Brands';
        font-display: block;
        font-weight: 400;
        src: url(${faBrandsWoff}) format("woff2"), url(${faBrandsTtf}) format("truetype");
    }
`

const innerHtml = `
    <input type="checkbox" id="explorer_toggle" />
    <label for="explorer_toggle" class="xeokit-i18n explorer_toggle_label xeokit-btn fas fa-2x fa-sitemap"
        data-xeokit-i18ntip="toolbar.toggleExplorer" data-tippy-content="Toggle explorer"></label>
    <input type="checkbox" id="inspector_toggle" />
    <label id="inspector_toggle_label" for="inspector_toggle"
        class="xeokit-i18n inspector_toggle_label xeokit-btn fas fa-info-circle fa-2x"
        data-xeokit-i18ntip="toolbar.toggleProperties" data-tippy-content="Toggle properties"></label>
    <div id="myExplorer"></div>
    <div id="myToolbar"></div>
    <div id="myInspector"></div>
    <div id="myViewer">
        <canvas id="myCanvas"></canvas>
        <canvas id="myNavCubeCanvas"></canvas>
    </div>
    <div class="xeokit-marker"></div>
    <link
      rel="stylesheet"
      href="./xeokit-bim-viewer.css"
      type="text/css"
    />
    <style type="text/css">
        ${style}

        :host {
            display: block;
            position: relative;
            width: 100%;
            height: 100%;
            font-family: "Roboto", sans-serif;
            font-size: 14px;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            margin: 0;
            overflow: clip;
            background: #f2f2f2;
        }

        :host #myViewer {
            display: flex;
            width: 100%;
            height: 100%;
            align-items: stretch;
            z-index: 10000;
            overflow: clip;
            position: absolute;
            left: 0;
            right: 0;
            --left: 0;
            --right: 0;
            transition: all 300ms ease-in-out;
        }

        :host #myToolbar {
            font-family: 'Font Awesome 6 Free';
            min-width: 400px;
            top: 0;
            align-items: center;
            justify-content: center;
            padding: 0;
            z-index: 100000;
            pointer-events: none;
            position: absolute;
            left: 95px;
            transition: all 300ms ease-in-out;
        }

        :host #myCanvas {
            width: 100%;
            height: 100%;
            cursor: default;
            pointer-events: all;
            margin: 0;
            position: relative;
        }

        :host #myNavCubeCanvas {
            position: absolute;
            width: 200px;
            height: 200px;
            bottom: 0;
            right: 0;
            z-index: 200000;
        }

        :host #myExplorer {
            position: absolute;
            height: 100%;
            color: #fff;
            background: #03103f;
            overflow: auto;
            border-right: 2px solid #212529;
            padding: 0px;
            padding-bottom: 100px;
            padding-left: 15px;
            user-select: none;
            top: 0;
            left: -460px;
            z-index: 10;
            width: 460px;
            transition: all 300ms ease-in-out;
        }

        :host #explorer_toggle {
            display: none;
        }

        :host .explorer_toggle_label {
            position: absolute;
            top: 10px;
            left: 20px;
            -webkit-user-select: none;
            -ms-user-select: none;
            user-select: none;
            flex: 1 1 auto;
            color: #03103f;
            background-color: white;
            text-align: center;
            vertical-align: middle;
            border: 2px solid #1d2453;
            padding: 0.375rem 0.75rem;
            border-radius: 0.25rem;
            -webkit-appearance: button;
            overflow: visible;
            margin: 0 2px 0 0;
            box-sizing: border-box;
            align-items: flex-start;
            pointer-events: all;
            z-index: 100000;
            transition: all 300ms ease-in-out;
        }

        :host .explorer_toggle_label:hover {
            cursor: pointer;
        }

        :host #explorer_toggle:checked + .explorer_toggle_label {
            left: 480px;
            color: #fff;
            background-color: #03103f;
            border-color: #03103f;
        }

        :host #explorer_toggle:checked ~ #myExplorer {
            left: 0;
        }

        :host #explorer_toggle:checked ~ #myViewer {
            left: 460px;
            --left: 460;
            width: calc(100% - (var(--left) + var(--right)));
        }

        :host #explorer_toggle:checked ~ #myToolbar {
            left: 555px;
        }

        :host #explorer_toggle:not(:checked) + .explorer_toggle_label {
            left: 20px;
            color: #fff;
            background-color: #03103f;
            border-color: #03103f;
        }

        :host #explorer_toggle:not(:checked) ~ #myExplorer {
            left: -460px;
        }

        :host #explorer_toggle:not(:checked) ~ #myViewer {
            left: 0;
            --left: 0;
            width: calc(100% - var(--right));
        }

        :host #explorer_toggle:not(:checked) ~ #myToolbar {
            left: 95px;
        }

        :host #myInspector {
            position: absolute;
            height: 100%;
            color: #fff;
            background: #03103f;
            overflow: auto;
            border-left: 2px solid #212529;
            padding: 0;
            top: 0;
            right: -360px;
            z-index: 40;
            width: 358px;
            transition: all 300ms ease-in-out;
        }

        :host #inspector_toggle {
            display: none;
        }

        :host .inspector_toggle_label {
            position: absolute;
            top: 10px;
            right: 20px;
            -webkit-user-select: none;
            -ms-user-select: none;
            user-select: none;
            flex: 1 1 auto;
            color: #03103f;
            background-color: white;
            text-align: center;
            vertical-align: middle;
            border: 2px solid #1d2453;
            padding: 0.375rem 0.75rem; /* FIXME */
            border-radius: 0.25rem;
            -webkit-appearance: button;
            overflow: visible;
            margin: 0 2px 0 0; /* FIXME */
            box-sizing: border-box;
            align-items: flex-start;
            pointer-events: all;
            z-index: 100000;
            transition: all 300ms ease-in-out;
        }

        :host .inspector_toggle_label:hover {
            cursor: pointer;
        }

        :host #inspector_toggle:checked + .inspector_toggle_label {
            right: 380px;
            color: #fff;
            background-color: #03103f;
            border-color: #03103f;
        }

        :host #inspector_toggle:checked ~ #myViewer {
            --right: 360;
            right: 360px;
            width: calc(100% - (var(--left) + var(--right)));
        }

        :host #inspector_toggle:checked ~ #myInspector {
            right: 0;
            --right: 0;
        }

        :host #inspector_toggle:not(:checked) ~ #myInspector {
            right: -380px;
            --right: -380px;
        }

        :host #inspector_toggle:not(:checked) ~ #myViewer {
            --right: 0;
            right: 0;
            width: calc(100% - var(--left));
        }

        :host .xeokit-camera-pivot-marker {
            display: none !important;
        }

        :host .xeokit-marker {
            color: #ffffff;
            position: absolute;
            width: 15px;
            height: 15px;
            border-radius: 100%;
            border: 1px solid #ebebeb;
            background: #444444;
            box-shadow: 3px 3px 5px 1px #212529;
            z-index: 10000;
            pointer-events: none;
            display: none;
        }
    </style>
`
class BimViewerWebComponent extends HTMLElement {
    static get observedAttributes() {
        return [
            "projectId",
            "modelId",
            "dataDir",
            "tab",
            "configs",
            "openExplorer",
            "enableEditModels"
        ];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = innerHtml;
        this.bimViewer = null;
        this.projectId = "";
        this.modelId = "";
        this.dataDir = "/app/data";
        this.tab = "";
        this.configs = "";
        this.openExplorer = false;
        this.enableEditModels = false;

        const canvas = this.shadowRoot.getElementById("myCanvas");

        canvas.addEventListener("wheel", (e) => {
            e.preventDefault();
        });
    }

        /**
     * Register a custom HTMLElement.
     *
     * @param {String} name Element's name, defaults to 'xeokit-bim-viewer', must be lowercase and contain at least one hyphen.
    */
    static register(name = "xeokit-bim-viewer") {
        customElements.define(name, this);
    }

    dispatchEvent(event) {
        super.dispatchEvent(event);

        const attrName = 'on' + event.type;
        const handler = this.getAttribute(attrName);
        if (handler) {
            try {
                const func = new Function('event', handler);
                func.call(this, event);
            } catch (e) {
                console.error('Error executing inline event handler:', e);
            }
        }
    }

    connectedCallback() {
        this.projectId = this.getAttribute("projectId");

        if (!this.projectId) {
            return;
        }
        const style = document.createElement('style');
        style.innerHTML = headStyleinnerHtml;
        document.getElementsByTagName('head')[0].appendChild(style);

        this.openExplorer = this.getAttribute("openExplorer");

        this.setExplorerOpen(this.openExplorer === "true");

        this.enableEditModels = this.getAttribute("enableEditModels") === "true";
        this.dataDir = this.getAttribute("dataDir") || "/app/data";

        const server = new Server({
            dataDir: this.dataDir
        });

        const bimViewer = new BIMViewer(server, {
            enableMeasurements: true,
            canvasElement: this.shadowRoot.getElementById("myCanvas"), // WebGL canvas
            keyboardEventsElement: this.shadowRoot, // Optional, defaults to this.shadowRoot
            explorerElement: this.shadowRoot.getElementById("myExplorer"), // Left panel
            toolbarElement: this.shadowRoot.getElementById("myToolbar"), // Toolbar
            inspectorElement: this.shadowRoot.getElementById("myInspector"), // Right panel
            navCubeCanvasElement: this.shadowRoot.getElementById("myNavCubeCanvas"),
            busyModelBackdropElement: this.shadowRoot.getElementById("myViewer"),
            enableEditModels: this.enableEditModels,
            containerElement: this.shadowRoot
        });

        bimViewer.viewer.cameraControl.on("picked", (pickResult) => {
            if (pickResult && pickResult.entity) {
                const objectId = pickResult.entity.id;
                const metaObject = bimViewer.viewer.metaScene.metaObjects[objectId];
                if (metaObject) {
                    this.dispatchEvent(new CustomEvent('objectSelected', {
                        detail: metaObject,
                        bubbles: true,
                        composed: true
                    }));
                }
            }
        });

        bimViewer.setConfigs({
            "showSpaces": false, // Default
            "selectedGlowThrough": true,
            "highlightGlowThrough": true,
            "dtxEnabled": true // Enable data texture scene representation for models - may be slow on low-spec GPUs
        });

        bimViewer.on("openExplorer", () => {
            this.setExplorerOpen(true);
        });

        bimViewer.on("openInspector", () => {
            this.setInspectorOpen(true);
        });

        bimViewer.on("addModel", (event) => { // "Add" selected in Models tab's context menu
            console.log("addModel: " + JSON.stringify(event, null, "\t"));
        });

        bimViewer.on("editModel", (event) => { // "Edit" selected in Models tab's context menu
            console.log("editModel: " + JSON.stringify(event, null, "\t"));
        });

        bimViewer.on("deleteModel", (event) => { // "Delete" selected in Models tab's context menu
            console.log("deleteModel: " + JSON.stringify(event, null, "\t"));
        });

        this.configs = this.getAttribute("configs");
        if (this.configs) {
            const configNameVals = this.configs.split(/,(?![^\[\]]*\])/);
            for (let i = 0, len = configNameVals.length; i < len; i++) {
                const configNameValStr = configNameVals[i];
                const configNameVal = configNameValStr.split(":");
                const configName = configNameVal[0];
                const configVal = configNameVal[1];
                bimViewer.setConfig(configName, configVal);
            }
        }

        bimViewer.loadProject(this.projectId, () => {
            this.modelId = this.getAttribute("modelId");
            if (this.modelId) {
                bimViewer.loadModel(this.modelId);
            }
            this.tab = this.getAttribute("tab");
            if (this.tab) {
                bimViewer.openTab(this.tab);
            }
        },
            (errorMsg) => {
                console.error(errorMsg);
            });
        this.bimViewer = bimViewer;
    }

    setExplorerOpen(explorerOpen) {
        const toggle = this.shadowRoot.getElementById("explorer_toggle");
        if (toggle) {
            toggle.checked = explorerOpen;
        }
    }

    setInspectorOpen(inspectorOpen) {
        const toggle = this.shadowRoot.getElementById("inspector_toggle");
        if (toggle) {
            toggle.checked = inspectorOpen;
        }
    }
}

export default BimViewerWebComponent;