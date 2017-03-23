import {WebApi} from "seecool/StaticLib";

class LocationApi extends WebApi{
    public Get$types(types){
        return this.baseApi({
            url:this.url,
            type:'get',
            data:{types:types}
        })
    }
}

export default LocationApi