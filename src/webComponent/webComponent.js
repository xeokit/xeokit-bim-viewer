import { BIMViewer } from '../../src/BIMViewer.js';
import { Server } from '../../src/server/Server.js';

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
    <link
      rel="stylesheet"
      href="./app/lib/fontawesome-free-5.11.2-web/css/all.min.css"
      type="text/css"
    />
    <link
      rel="stylesheet"
      href="./xeokit-bim-viewer.css"
      type="text/css"
    />
    <style>
        xeokit-bim-viewer {
            width: 100vw;
            height: 100vh;
        }

        html,
        body {
            height: 100%;
            background: #f2f2f2;
            touch-action: none;
        }

        body {
            font-family: "Roboto", sans-serif;
            font-size: 14px;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            margin: 0;
            overflow: hidden;
        }

        :host #myViewer {
            display: flex;
            width: 100%;
            height: 100%;
            align-items: stretch;
            z-index: 10000;
            /*overflow: hidden;*/
            position: absolute;
            left: 0;
            right: 0;
            --left: 0;
            --right: 0;
            transition: all 300ms ease-in-out;
        }

        :host #myToolbar {
            min-width: 400px;
            top: 0;
            align-items: center;
            justify-content: center;
            padding: 0;
            z-index: 100000;
            pointer-events: none;
            position: fixed;
            left: 95px;
            transition: all 300ms ease-in-out;
        }

        :host #myCanvas {
            width: 100%;
            height: 100%;
            background: #f2f2f2;
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
            position: fixed;
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
    </style>
`


class BimViewerWebComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = innerHtml;
    }

    /**
     * Register a custom HTMLElement.
     *
     * @param {String} name Element's name, defaults to 'xeokit-bim-viewer', must be lowercase and contain at least one hyphen.
    */
    static register(name = "xeokit-bim-viewer") {
        customElements.define(name, this);
    }

    connectedCallback() {
        const requestParams = this.getRequestParams();
        const projectId = requestParams.projectId;

        if (!projectId) {
            return;
        }

        const openExplorer = requestParams.openExplorer;
        this.setExplorerOpen(openExplorer === "true");

        const enableEditModels = (requestParams.enableEditModels === "true");

        const server = new Server({
            dataDir: requestParams.dataDir || "/app/data"
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
            enableEditModels: enableEditModels
        }, this.shadowRoot);

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

        const viewerConfigs = requestParams.configs;
        if (viewerConfigs) {
            const configNameVals = viewerConfigs.split(",");
            for (let i = 0, len = configNameVals.length; i < len; i++) {
                const configNameValStr = configNameVals[i];
                const configNameVal = configNameValStr.split(":");
                const configName = configNameVal[0];
                const configVal = configNameVal[1];
                bimViewer.setConfig(configName, configVal);
            }
        }

        bimViewer.loadProject(projectId, () => {
            const modelId = requestParams.modelId;
            if (modelId) {
                bimViewer.loadModel(modelId);
            }
            const tab = requestParams.tab;
            if (tab) {
                bimViewer.openTab(tab);
            }
            this.watchHashParams();
        },
            (errorMsg) => {
                console.error(errorMsg);
            });



        window.bimViewer = bimViewer;
    }

    parseHashParams() {
        const params = getHashParams();
        const actionsStr = params.actions;
        if (!actionsStr) {
            return;
        }
        const actions = actionsStr.split(",");
        if (actions.length === 0) {
            return;
        }
        for (let i = 0, len = actions.length; i < len; i++) {
            const action = actions[i];
            switch (action) {
                case "focusObject":
                    const objectId = params.objectId;
                    if (!objectId) {
                        console.error("Param expected for `focusObject` action: 'objectId'");
                        break;
                    }
                    bimViewer.setAllObjectsSelected(false);
                    bimViewer.setObjectsSelected([objectId], true);
                    break;
                case "focusObjects":
                    const objectIds = params.objectIds;
                    if (!objectIds) {
                        console.error("Param expected for `focusObjects` action: 'objectIds'");
                        break;
                    }
                    const objectIdArray = objectIds.split(",");
                    bimViewer.setAllObjectsSelected(false);
                    bimViewer.setObjectsSelected(objectIdArray, true);
                    bimViewer.viewFitObjects(objectIdArray, () => {
                    });
                    break;
                case "clearFocusObjects":
                    bimViewer.setAllObjectsSelected(false);
                    bimViewer.viewFitAll();
                    // TODO: view fit nothing?
                    break;
                case "openTab":
                    const tabId = params.tabId;
                    if (!tabId) {
                        console.error("Param expected for `openTab` action: 'tabId'");
                        break;
                    }
                    bimViewer.openTab(tabId);
                    break;
                default:
                    console.error("Action not supported: '" + action + "'");
                    break;
            }
        }
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

    getRequestParams() {
        const vars = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
            vars[key] = value;
        });
        return vars;
    }

    getHashParams() {
        const hashParams = {};
        let e;
        const a = /\+/g;  // Regex for replacing addition symbol with a space
        const r = /([^&;=]+)=?([^&;]*)/g;
        const d = function (s) {
            return decodeURIComponent(s.replace(a, " "));
        };
        const q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
            hashParams[d(e[1])] = d(e[2]);
        }
        return hashParams;
    }

    watchHashParams() {
        let lastHash = "";
        window.setInterval(() => {
            const currentHash = window.location.hash;
            if (currentHash !== lastHash) {
                parseHashParams();
                lastHash = currentHash;
            }
        }, 400);
    }
}

export default BimViewerWebComponent;