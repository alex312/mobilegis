export class MapHolder {
    holder: any = null;

    createHolder() {
        if (this.holder)
            return;
        let showWebGis = window["scmap"];
        this.holder = showWebGis.then(function (mapfactory) {

            var div = document.createElement('div');
            div.style.height = "100%";
            var factory = mapfactory(div);

            var container = document.createElement('div');
            container.appendChild(div);
            document.body.appendChild(container);
            container.style.marginTop = "-100px";
            container.style.marginLeft = "-100px";
            container.style.width = '50px';
            container.style.height = "50px";
            container.style.overflow = "hidden";

            return factory.create().then(function () {
                let tool = factory.getApi();
                tool.bind("selectedFeatureChange", this.onSelecteedFeatureChange.bind(this));
                return {
                    mapContainer: container,
                    tool: tool,
                };
            }.bind(this))
        }.bind(this));
    }


    selectFeatureActions: { [key: string]: Function };

    registSelectFeatureAction(key: string, fun: { (env: any, data: { type: string, data: any }): void }) {
        if (!this.selectFeatureActions)
            this.selectFeatureActions = {};
        this.selectFeatureActions[key] = fun;
    }

    // get selectFeatureActions() {
    //     return this._selectFeatureActions;
    // }

    // set selectFeatureActions(value) {
    //     this._selectFeatureActions = value;
    // }


    private onSelecteedFeatureChange(env: any, data: { type: string, data: any }) {
        for (let action in this.selectFeatureActions) {
            this.selectFeatureActions[action](env, data);
        }
    }
}

export const MapHolderImp = new MapHolder();