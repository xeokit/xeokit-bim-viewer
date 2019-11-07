import {BCFViewpointsPlugin} from "../../lib/xeokit/plugins/BCFViewpointsPlugin/BCFViewpointsPlugin.js";
import {math} from "../../lib/xeokit/viewer/scene/math/math.js";
import {Controller} from "../Controller.js";

/**
 * @desc Manages issues.
 *
 * Located at {@link Explorer#issues}.
 */
class Issues extends Controller {

    constructor(parent, cfg) {
        super(parent, cfg);
        this._element = document.getElementById(cfg.issuesPanelId);
        this._issues = [];
        this._issuesMap = {};
        this._bcfViewpointsPlugin = new BCFViewpointsPlugin(this.viewer, {});
    }

    createIssue() {
        const viewpointId = math.createUUID();
        const viewpoint = this._bcfViewpointsPlugin.getViewpoint();
        const record = {
            id: viewpointId,
            viewpoint: viewpoint
        };
        this._issues.push(record);
        this._issuesMap[record.id] = record;
        this._repaint();
    }

    clearIssues() {
        this._issues = [];
        this._issuesMap = {};
        this._repaint();
    }

    _repaint() {
        const html = [];
        for (var i = 0, len = this._issues.length; i < len; i++) {
            const record = this._issues[i];
            html.push('<br><div class="panel panel-primary">');
            html.push('<div class="panel-heading">');
            html.push('<a id="' + record.id + '" href=""><img src="' + record.viewpoint.snapshot.snapshot_data + '" style="border: 1px solid black;" width="150", height="130"></a>');
            html.push('</div>');
            html.push('</div>');
        }
        const self = this;
        this._element.innerHTML = html.join("");
        for (var i = 0, len = this._issues.length; i < len; i++) {
            (function () {
                const record = self._issues[i];
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

export {Issues};