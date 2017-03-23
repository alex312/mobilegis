export function squaredDistance(lon0:number, lat0:number, lon1:number, lat1:number):number {
    var dx = lon0 - lon1;
    var dy = lat0 - lat1;
    return dx * dx + dy * dy;
}
