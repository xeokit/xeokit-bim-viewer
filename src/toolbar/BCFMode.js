import {BCFViewpointsPlugin} from "../../lib/xeokit/plugins/BCFViewpointsPlugin/BCFViewpointsPlugin.js";
import {math} from "../../lib/xeokit/viewer/scene/math/math.js";
import {Controller} from "../Controller.js";

/**
 * @desc Manages BCF viewpoints.
 *
 * Located at {@link Toolbar#bcf}.
 */
class BCFMode extends Controller {

    constructor(parent, cfg) {
        super(parent);
        this._element = document.getElementById(cfg.bcfPanelId);
        this._records = [];
        this._recordsMap = {};
        this._bcfViewpointsPlugin = new BCFViewpointsPlugin(this.viewer, {});
    }

    createViewpoint() {
        const viewpointId = math.createUUID();
        const viewpoint = this._bcfViewpointsPlugin.getViewpoint();
        const record = {
            id: viewpointId,
            viewpoint: viewpoint
        };
        this._records.push(record);
        this._recordsMap[record.id] = record;
        this._repaint();
    }

    clearViewpoints() {
        this._records = [];
        this._recordsMap = {};
        this._repaint();
    }

    _repaint() {
        var h = "";
        for (var i = 0, len = this._records.length; i < len; i++) {
            const record = this._records[i];
            h += '<br><div class="panel panel-primary">';
            h += '<div class="panel-heading">';
            h += '<a id="' + record.id + '" href=""><img src="' + record.viewpoint.snapshot.snapshot_data + '" style="border: 1px solid black;" width="150", height="130"></a>';
            h += '</div>';
            h += '</div>';
        }
        const self = this;
        this._element.innerHTML = h;
        for (var i = 0, len = this._records.length; i < len; i++) {
            (function () {
                const record = self._records[i];
                $("#" + record.id).on('click', (event) => {
                    self._bcfViewpointsPlugin.setViewpoint(record.viewpoint);
                    event.preventDefault();
                });
            })();
        }
    }

    /** @private */
    destroy() {
        super.destroy();
        this._bcfViewpointsPlugin.destroy();
    }
}

export {BCFMode};