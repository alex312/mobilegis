export interface View {
    readonly element:HTMLElement;
    readonly navigationView:NavigationView;
    syncLayout(left:number, top:number, width:number, height:number);
    attach(parent:View);
    detach(parent:View);
}

export interface NavigationView extends View {
    open(view:View);
    push(view:View);
    pop(n?:number);
}
