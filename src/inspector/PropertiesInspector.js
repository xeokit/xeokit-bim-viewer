import {Controller} from "../Controller.js";

/** @private */
class PropertiesInspector extends Controller {

    constructor(parent, cfg = {}) {

        super(parent);

        if (!cfg.propertiesTabElement) {
            throw "Missing config: propertiesTabElement";
        }

        if (!cfg.propertiesElement) {
            throw "Missing config: propertiesElement";
        }

        this._metaObject = null;

        this._propertiesTabElement = cfg.propertiesTabElement;
        this._propertiesElement = cfg.propertiesElement;
        this._propertiesTabButtonElement = this._propertiesTabElement.querySelector(".xeokit-tab-btn");

        if (!this._propertiesTabButtonElement) {
            throw "Missing DOM element: ,xeokit-tab-btn";
        }

        this._onModelUnloaded = this.viewer.scene.on("modelUnloaded", (modelId) => {
            if (this._metaObject) {
                const metaModels = this._metaObject.metaModels;
                for (let i = 0, len = metaModels.length; i < len; i++) {
                    if (metaModels[i].id === modelId) {
                        this.clear();
                        return;
                    }
                }
            }
        });

        this.bimViewer.on("reset", () => {
            this.clear();
        });

        document.addEventListener('click', this._clickListener = (e) => {
            if (!e.target.matches('.xeokit-accordion .xeokit-accordion-button')) {
                return;
            } else {
                if (!e.target.parentElement.classList.contains('active')) {
                    e.target.parentElement.classList.add('active');
                } else {
                    e.target.parentElement.classList.remove('active');
                }
            }
        });

        this.clear();
    }

    showObjectPropertySets(objectId) {
        const metaObject = this.viewer.metaScene.metaObjects[objectId];
        if (!metaObject) {
            return;
        }
        const propertySets = metaObject.propertySets;
        if (propertySets && propertySets.length > 0) {
            this._setPropertySets(metaObject, propertySets);
        } else {
            this._setPropertySets(metaObject);
        }
        this._metaObject = metaObject;
    }

    clear() {
        const html = [],
            localizedText = this.viewer.localeService.translate('propertiesInspector.noObjectSelectedWarning') || 'No object inspected. Right-click or long-tab an object and select \'Inspect Properties\' to view its properties here.';
        html.push(`<div class="element-attributes">`);
        html.push(`<p class="xeokit-i18n subsubtitle no-object-selected-warning" data-xeokit-i18n="propertiesInspector.noObjectSelectedWarning">${localizedText}</p>`);
        html.push(`</div>`);
        const htmlStr = html.join("");
       this._propertiesElement.innerHTML = htmlStr;
    }

    _setPropertySets(metaObject, propertySets) {
        const html = [];
        html.push(`<div class="element-attributes">`);
        if (!metaObject) {
            html.push(`<p class="subsubtitle">No object selected</p>`);
        } else {
            html.push('<table class="xeokit-table">');
            html.push(`<tr><td class="td1">Name:</td><td class="td2">${metaObject.name}</td></tr>`);
            if (metaObject.type) {
                html.push(`<tr><td class="td1">Class:</td><td class="td2">${metaObject.type}</td></tr>`);
            }
            html.push(`<tr><td class="td1">UUID:</td><td class="td2">${metaObject.originalSystemId}</td></tr>`);
            html.push(`<tr><td class="td1">Viewer ID:</td><td class="td2">${metaObject.id}</td></tr>`);
            const attributes = metaObject.attributes;
            if (attributes) {
                for (let key in attributes) {
                    html.push(`<tr><td class="td1">${capitalizeFirstChar(key)}:</td><td class="td2">${attributes[key]}</td></tr>`);
                }
            }
            html.push('</table>');
            if (!propertySets || propertySets.length === 0) {
                const localizedText = this.viewer.localeService.translate('propertiesInspector.noPropSetWarning') || 'No properties sets found for this object';
                html.push(`<p class="xeokit-i18n subtitle xeokit-no-prop-set-warning" data-xeokit-i18n="propertiesInspector.noPropSetWarning">${localizedText}</p>`);
                html.push(`</div>`);
            } else {
                html.push(`</div>`);
                html.push(`<div class="xeokit-accordion">`);
                for (let i = 0, len = propertySets.length; i < len; i++) {
                    const propertySet = propertySets[i];
                    const properties = propertySet.properties || [];
                    if (properties.length > 0) {
                        html.push(`<div class="xeokit-accordion-container">
                                        <p class="xeokit-accordion-button"><span></span>${propertySet.name}</p>                                       
                                        <div class="xeokit-accordion-panel">                                           
                                            <table class="xeokit-table"><tbody>`);
                        for (let i = 0, len = properties.length; i < len; i++) {
                            const property = properties[i];
                            html.push(`<tr><td class="td1">${property.name || property.label}:</td><td class="td2">${property.value}</td></tr>`);
                        }
                        html.push(`</tbody></table>
                        </div>
                        </div>`);
                    } else {
                        //  html.push(`<p class="subtitle">No properties sets found.</p>`);
                    }
                }
                html.push(`</div>`);
            }
        }
        this._propertiesElement.innerHTML = html.join("");
    }

    setEnabled(enabled) {
        if (!enabled) {
            this._propertiesTabButtonElement.classList.add("disabled");
        } else {
            this._propertiesTabButtonElement.classList.remove("disabled");
        }
    }

    destroy() {
        super.destroy();
        this.viewer.scene.off(this._onModelLoaded);
        this.viewer.scene.off(this._onModelUnloaded);
        document.removeEventListener('click', this._clickListener);
    }
}

function capitalizeFirstChar(str) {
    if (!str) {
        return str;
    }
   return str.charAt(0).toUpperCase() + str.slice(1);
}

export {PropertiesInspector};