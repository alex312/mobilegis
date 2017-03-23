// 基础数据文件 全部使用 export 方式导出
// 文件仅用于定义 interface

export interface pdata { //Promise的返回类型
    state: string,
    data: any
}
export interface IWebApi {
    url: string,
    baseApi: (ajax: JQueryAjaxSettings)=>PromiseLike<any>
}
export interface AnyConstractorClass {
    new(...anyArguments): Object;
}
export var AnyConstractorClass: any;

export interface IDCFeature {
    id: string,
    data: any
}

//export class OL{
//    OL3(){
//        (function(){
//
//            return
//        })()
//    }
//}

export interface IBerth {
    Name: string,
    Lon: number,
    Lat: number
}
export interface IBerthDTO {
    Code: string,
    Lon: number,
    Lat: number
}

export interface ICctvStaticInfo {
    IsWhole: boolean,
    Items: Array<ICctvDTO>,
    Section: string,
    Version: number
}
export interface IStreams {
    Channel: number,
    Index: number,
    Name: string,
    StreamType: number,
    Url: string
}
export interface IInfoCctvStatic {
    Altitude: number,
    Heading: number,
    ImageType: number,
    Latitude: number
    Longitude: number,
    Name: string,
    Platform: number,
    Streams: Array<IStreams>,
    VideoId: string,
    ViewPort: number
}
export interface ICctv {
    Info: IInfoCctvStatic,
    IsDeleted: boolean,
    Key: string
}
export interface ICctvDTO {
    Info: string,
    IsDeleted: boolean,
    Key: string
}
export interface IInfoCctvPosition {

}
export interface IInfoCctvDynamic {
    Altitude: number,
    COG: number,
    Heading: number,
    Latitude: number,
    Longitude: number,
    SOG: number,
    VideoId: string,
    ViewPort: number
}
export interface IInfoCctvHierarchy {
    Id: string,
    Name: string,
    Type: number,
    ElementId: string,
    ParentId: string
}
export interface IInfoMerge {
    Altitude: number,
    Heading: number,
    ImageType: number,
    Latitude: number
    Longitude: number,
    Name: string,
    Platform: number,
    Streams: Array<IStreams>,
    VideoId: string,
    ViewPort: number,
    COG: number,
    SOG: number,
    Type: number,
    ElementId: string,
    ParentId: string
}

export interface ShipTypes {

}
export interface DealTypes {

}
export interface AnchorDealTypes {

}
export interface IEventDealDTO {
    Id: number, //integer
    EventId: number, //integer
    TrackId: string ,//string
    VesselId: string ,//string
    MMSI: string ,//string
    RouteName: string ,//string
    ShipName: string ,//string
    EventTime: Date,//date
    Place: string ,//string
    IsChina: boolean,//boolean
    ShipType: ShipTypes,//ShipTypes
    IsTrouble: boolean,//boolean
    DealType: DealTypes, //DealTypes
    AnchorDealType: AnchorDealTypes,//AnchorDealTypes
    ChargeMan: string ,//string
    Area: string ,//string
    IsLiveLaw: boolean,//boolean
    IsNetVessel: boolean,//boolean
    IsEscape: boolean,//boolean
    Description: string ,//string
    LastUpdateTime: Date//date
}

export interface IExposeSetFocusOption {name: string,id: string
}


export interface IViewFieldConstructorOption {
    viewModel?: any;
    baseDom?: HTMLElement;
    viewTemplate?: string;
    viewDom?: JQuery;//viewDom=baseDom+viewTemplate
}

/**
 * Plugin 的 View
 */
export interface IViewField {
    /**
     * 返回View的Dom树
     */
    ViewDom: HTMLElement,
    ViewModelStruct: any,
    Updata: Function,
    IfNull?: Function|boolean,
}


export interface IRITSEventData {

}
export interface IRITSEventDataDTO {
    Cog: number,
    Description: string,
    EndTime: Date,
    EventTime: string,
    Geometry: string,
    Heading: number,
    Id: number,
    LocalName: string,
    MMSI: string,
    OperationType: number,
    Place: string,
    ProcessState: number,
    RegionId: string,
    RuleAlias: string,
    RuleId: string,
    RuleType: number,
    ShipNameEn: string,
    Sog: number,
    StatusId: string,
    TrackId: string,
    VesselId: string,
    VesselName: string,
    Distance: number,
    CableId: string
}


export interface IAWEFlag {content: string,color: string
}
;


export interface IWaterDepthData {
    Name: string,
    Lon: number,
    Lat: number
}
export interface IWaterDepthDataDTO {
    Depth: string,
    Lon: number,
    Lat: number
}
export interface ITideDTO {
    Fid: string,
    GateLevel: number,
    RiverLevel: number,
    SeaLevel: number,
    Time: string
}


export interface IWaterDepthData {
    Name: string,
    Lon: number,
    Lat: number
}
export interface IWaterDepthDataDTO {
    Depth: string,
    Lon: number,
    Lat: number
}
export interface ITideDTO {
    Fid: string,
    GateLevel: number,
    RiverLevel: number,
    SeaLevel: number,
    Time: string
}

export interface IRegisterInfoPanelOption {
    name?: string,
    viewField?: IViewField
}
export interface IMainUI {
    Type: string,
    UrlLoad(data: {url: string, search: string,target: string}),
}
export interface IMainMenu {
    MapDiv: HTMLElement,
    RegisterMainMenu(parentMenuName, menuName, menuLabel, callback, style?: {iconFont: string})
}

export interface IBaseMainUI extends IMainUI,IMainMenu {
    RegisterInfoPanel(uiData: IRegisterInfoPanelOption)
    ShowContainer(name, dom: JQuery)
}

export interface IBaseWebgisMainUI extends IMainUI,IMainMenu {
    RegisterToolButton(groupName, buttonName, buttonLabel, callback),
    RegisterToolButtonRight(groupName, buttonName, buttonLabel, callback),
    RegisterToolButtonLeft(groupName, buttonName, buttonLabel, callback),
    RegisterToolElementRight(groupName, element),
    RegisterToolElementLeft(groupName, element),
    RegisterToolElement(groupName, element, position: string),
    RegisterShortBarButton(groupName, buttonName, buttonLabel, callback),
    ShowSidePanel(title, domElement),
    RegisteSearchEvent(name, callback, option?: {info?: string}),
    RemoveSearchEvent(name),
    RegisterSelectFocusEvent(name, callback),
    RemoveSelectFocusEvent(name),
    ShowSelectedObjInfo(objId),
    RegisterBoxSelectedEvent(name, callback),
    RemoveBoxSelectedEvent(name),
    BoxSelected(list, extent),
    ShowMassageInfo(element)
}


//js数据目标的状态//原值 //修改中 //确认OK
//interface IView{name:string,view:string|JQuery}
//interface IEvent{event:()=>{state:boolean,msg:string}}//触发,无参数 //触发,传回当前参数,返回原因
//interface IViewE{name:string,view:string|JQuery,event?:Function|IEvent} //以此数据为指定,触发事件
//
//interface IUIO{name:string,view:any,type:IView|IEvent|IInput,}
//
////[IView,IEvent]
////[Array<IView>,IEvent]
////Array<IViewE>


export interface IEvent {click?: Function,hover?: Function
}
export interface IViewCell {name: string,view: string|JQuery,event?: Function|IEvent
}
export interface IViewCellList {name: string,view: string|JQuery,list: Array<IViewCell>
}


export interface IPlugin {

}
export interface IuiPlugin {
    Type: string
}
export interface IViewInitOption {
    uiPlugin: any,
    viewModel?: any,
}

export interface IView {
    Init(option: IViewInitOption);
}

export interface ILogic {
    ViewModel: any
}


//export interface IRITSEventData{
//
//}
//export interface IRITSEventDataDTO{
//}

//new(option:IViewConstructorOption),
//baseDom:JQuery,
//viewTemplate:string
//viewModel:
//不用跨field的访问方式
//position只可以用 static relitive
//flot不在baseDom上用,自己清除 flot both
//空时不显示(如何显示)(我的内部没了,或不显示了怎么办,代码怎么知道,class(empty不能识别隐藏的))
//不用css改样式
