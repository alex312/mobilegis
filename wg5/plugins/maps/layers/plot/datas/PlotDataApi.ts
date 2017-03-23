import {WebApi} from "../../../../../seecool/StaticLib";

export class PlotDataApi extends WebApi {
    //GET api/PlotInfo?key={key}
    public Get$key(key){
        return this.baseApi({
            url:this.url,
            type:'get',
            data:{key:key}
        })
    }
}
export default PlotDataApi