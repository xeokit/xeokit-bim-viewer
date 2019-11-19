import {Controller} from "./Controller.js";

class BusyDialog extends Controller {

    constructor(parent, cfg = {}) {
        super(parent, cfg);

        this._dialog = $(`<div class="loadingDialog modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-body" style="text-align:center;">
                <br>
                <div class="loader" style="display:inline-block;"></div>

                <br>
                <div class="modal-header" style="display:inline-block; border: 0;">
                    <h5 class="modal-title"><span class="xeokit-model-message"></span>
                    </h5>
                </div>
            </div>
        </div>
    </div>
</div>`);

        this._dialog.appendTo("body");
    }

    show(message) {
        this._dialog.find('.xeokit-model-message').text(message);
        this._dialog.modal('show');
    }

    hide() {
        this._dialog.modal('hide');
    }

    destroy() {
        super.destroy();
        this._dialog.remove();

    }
}

export {BusyDialog};