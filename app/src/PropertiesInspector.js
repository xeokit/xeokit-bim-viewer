
class PropertiesInspector {

    constructor(cfg = {}) {
        this._containerElement = cfg.containerElement;
        this.setObjectInfo();
    }

    setObjectInfo(objectInfo = {}) {
        const html = [
            `<p class="title">Properties</p><table class="xeokit-table">            
            <tbody>`
        ];
        let hasInfo = false;
        for (let name in objectInfo) {
            const value = objectInfo[name];
            html.push(`<tr><td class="td1">${name}:</td><td class="td2">${value}</td></tr>`);
            hasInfo = true;
        }
        if (!hasInfo) {
            html.push(`<tr><td class="td1" colspan="2">Nothing selected.</td></tr>`);
        }
        html.push(`</tbody`);
        const htmlStr = html.join("");
        this._containerElement.innerHTML = htmlStr;
    }

    destroy() {
        this._containerElement.innerHTML = "";
    }
}

export {PropertiesInspector};