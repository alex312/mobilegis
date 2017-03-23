import {WebApi} from "seecool/StaticLib";

class BerthApi extends WebApi {
    //GET api/Berth/GetAllPiles
    public Get_GetAllPiles() {
        return this.baseApi({
            url: this.url + "/GetAllPiles",
            type: 'get'
        })
    }
}

export default BerthApi