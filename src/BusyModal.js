import {Controller} from "./Controller.js";

/** @private */
class BusyModal extends Controller {

    constructor(parent, cfg = {}) {

        super(parent, cfg);

        document.body.insertAdjacentHTML('beforeend', `<div class="xeokit-busy-modal">
            <div class="xeokit-busy-modal-content">
                <div class="xeokit-busy-modal-body">
              <div class="xeokit-busy-modal-message">Default text</div>
                </div>
            </div>
        </div>`);

        this._modal = document.querySelector(".xeokit-busy-modal");
    }

    show(message) {
        this._modalVisible = true;
        document.querySelector('.xeokit-busy-modal-message').innerText = message;
        this._modal.style.display = 'block';
    }

    hide() {
        this._modalVisible = false;
        this._modal.style.display = 'none';
    }

    destroy() {
        super.destroy();
        if (this._modal) {
            this._modal.parentNode.removeChild(this._modal);
            this._modal = null;
        }
    }
}

export {BusyModal};