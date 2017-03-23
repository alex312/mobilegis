import {WebApi} from "seecool/StaticLib";

class BerthApi extends WebApi{
    //GET api/StaticInfo/CCTVDynamic?version={version}
    public Get_CctvDynamic$version(version){
        return this.baseApi({
            url:this.url+`/CCTVDynamic?version=${version}`,
            type:'get'
        })
    }

    //GET api/StaticInfo/CCTVStatic?version={version}
    public Get_CctvStatic$version(version){
        return this.baseApi({
            url:this.url+`/CCTVStatic?version=${version}`,
            type:'get'
        })
    }

    //GET api/StaticInfo/CCTVPosition?version={version}
    public Get_CctvPosition$version(version){
        return this.baseApi({
            url:this.url+`/CCTVPosition?version=${version}`,
            type:'get'
        })
    }

    //GET api/StaticInfo/CCTVHierarchy.default?version={version}
    public Get_CctvHierarchy$$default$version(version){
        return this.baseApi({
            url:this.url+`/CCTVHierarchy.default?version=${version}`,
            type:'get'
        })
    }
}

export default BerthApi