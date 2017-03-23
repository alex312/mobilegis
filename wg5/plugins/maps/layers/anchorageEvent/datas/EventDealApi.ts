
import {WebApi} from "seecool/StaticLib";

class EventDealApi extends WebApi{
    public Get$start_end(start,end){
        return this.baseApi({
            url:this.url,
            type:"get",
            data:{start:start,end:end}
        })
    }

    public Get_StatDealType$year(year) {
        return this.baseApi({
            url:this.url+'/StatDealType',
            type:"get",
            data:{year:year}
        })
    }

    public Get_StatDealType$year_month(year,month) {
        return this.baseApi({
            url:this.url+'/StatDealType',
            type:"get",
            data:{year:year,month:month}
        })
    }
}

export default EventDealApi