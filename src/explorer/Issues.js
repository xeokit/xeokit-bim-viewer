import {Controller} from "../Controller.js";
import {BCFViewpointsPlugin} from "@xeokit/xeokit-sdk/src/plugins/BCFViewpointsPlugin/BCFViewpointsPlugin.js";
import {math} from "@xeokit/xeokit-sdk/src/viewer/scene/math/math.js";

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

        $("#createIssue").on('click', (event) => {
            this._createIssue();
            event.preventDefault();
        });

        $("#clearIssues").on('click', (event) => {
            this.clearIssues();
            event.preventDefault();
        });
    }

    _createIssue() {
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
                    self._bcfViewpointsPlugin.setViewpoint(record.viewpoint, {immediate: false});
                    event.preventDefault();
                });
            })();
        }
    }

    setToolbarEnabled(enabled) {
        if (!enabled) {
            $("#issues-tab").addClass("disabled");
            $("#createIssue").addClass("disabled");
            $("#clearIssues").addClass("disabled");
        } else {
            $("#issues-tab").removeClass("disabled");
            $("#createIssue").removeClass("disabled");
            $("#clearIssues").removeClass("disabled");
        }
    }

    /** @private */
    destroy() {
        super.destroy();
        this._bcfViewpointsPlugin.destroy();
    }
}

export {Issues};