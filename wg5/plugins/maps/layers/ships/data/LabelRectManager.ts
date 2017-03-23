interface rectangle{left:number,top:number,width:number,height:number}
class LabelRectManager{
    rects:Array<rectangle>;
    constructor(){
        this.rects=[];
    }
    tryPut(rect:rectangle){
        for(var R of this.rects){
            if(!((R.left+R.width<rect.left)||(R.top+R.height<rect.top)||(R.left>rect.left+rect.width)||(R.top>rect.top+rect.height))){
            //if((Math.abs(R.left-rect.left)<R.width)&&(Math.abs(R.top-rect.top)<R.height)){
                return false;
            }
        }
        this.rects.push(rect);
        return true
    }
    clear(){
        this.rects=[];
    }
}
export default LabelRectManager;
