export class MapHolder {
    holder: any = null;

    createHolder() {
        if (this.holder)
            return;
        console.log("create");
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

            return factory.create().then(() => {
                let tool = factory.getApi();
                let loading = true;
                tool.bind("selectedFeatureChange", (env: any, data: { type: string, data: any }) => {
                    for (let action in this.selectFeatureActions) {
                        this.selectFeatureActions[action](env, data);
                    }
                });

                tool.bind("moduledChange", (event, data) => {
                    if (data.type === "map") {
                        tool.map.UpdateSize();
                        loading = false;
                    }
                });

                let shipReadyPromise = new Promise((resolve, reject) => {
                    tool.bind("moduledChange", (event, data) => {
                        if (data.type === "shipLayer") {
                            resolve();
                        }
                    });
                })


                return {
                    selectedFeature: this.selectedFeature,
                    mapContainer: container,
                    tool: tool,
                    isLoading: () => { return loading; },
                    shipLayerReady: () => { return shipReadyPromise }
                };

            })
        }.bind(this));
    }


    selectFeatureActions: { [key: string]: Function };

    _selectedFeature: { feature: any, type: string };
    get selectedFeature() {
        return this._selectedFeature;
    }
    set selectedFeature(value) {
        this._selectedFeature = value;
    }

    registSelectFeatureAction(key: string, fun: { (env: any, data: { type: string, data: any }): void }) {
        if (!this.selectFeatureActions)
            this.selectFeatureActions = {};
        this.selectFeatureActions[key] = fun;
    }
}

export const MapHolderImp = new MapHolder();