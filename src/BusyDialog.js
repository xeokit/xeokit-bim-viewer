import {Controller} from "./Controller.js";

class BusyDialog extends Controller {

    constructor(parent, cfg = {}) {
        super(parent, cfg);

        this._dialog = $(`<div id="loadingDialog" class="modal" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-body" style="text-align:center;">
                <br>
                <div class="loader" style="display:inline-block;"></div>

                <br>
                <div class="modal-header" style="display:inline-block; border: 0;">
                    <h5 class="modal-title" id="exampleModalLabel"><span id="loadingDialogModelName"></span>&quot;
                    </h5>
                </div>
            </div>
        </div>
    </div>
</div>`);

        this._dialog.appendTo("body");
    }

    show(message) {
        $('#loadingDialogModelName').text(message);
        $('#loadingDialog').modal('show');
    }

    hide() {
        $('#loadingDialog').modal('hide');
    }

    destroy() {
        super.destroy();
        this._dialog.remove();

    }
}

export {BusyDialog};