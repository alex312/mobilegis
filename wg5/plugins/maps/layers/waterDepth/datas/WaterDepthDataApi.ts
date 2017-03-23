import {WebApi} from "seecool/StaticLib";

class WaterDepthDataApi extends WebApi{
    //GET api/WaterDepthData/GetAllPiles
    public Get_GetAllPiles(){
        return this.baseApi({
            url:this.url+"/GetAllWaterDepth",
            type:'get'
        })
    }
}

export default WaterDepthDataApi