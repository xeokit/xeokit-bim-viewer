import {Controller} from "./Controller.js";

class BusyModal extends Controller {

    constructor(parent, cfg = {}) {

        super(parent, cfg);

        document.body.insertAdjacentHTML('beforeend', `<style>

     .xeokit-busy-modal {
            display: none;
            position: fixed;
            z-index: 1;
            padding-top: 100px;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.4);
        }

        .xeokit-busy-modal-content {
            position: relative;
            background-color: #fefefe;
            margin: auto;
            padding: 0;
            border: 1px solid #888;
            border-radius: 0.5em;
            width: 50%;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
            -webkit-animation-name: xeokit-busy-modal-animatetop;
            -webkit-animation-duration: 0.4s;
            animation-name: xeokit-busy-modal-animatetop;
            animation-duration: 0.4s
        }

        /* Add Animation */
        @-webkit-keyframes xeokit-busy-modal-animatetop {
            from {
                opacity: 0
            }
            to {
                opacity: 1
            }
        }

        @keyframes xeokit-busy-modal-animatetop {
            from {
                opacity: 0
            }
            to {
                opacity: 1
            }
        }

        .xeokit-busy-modal-message {
            font-size: 22px;
            padding: 2px 16px;
            background-color: white;
            color: #212529;
        }

        .xeokit-busy-modal-body {
            padding: 2px 16px;
            margin: 20px 2px
        }

        </style>
        <div class="xeokit-busy-modal">
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