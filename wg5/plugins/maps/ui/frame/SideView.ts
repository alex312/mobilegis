import {View, NavigationView} from "./View";

export class SideView implements NavigationView {
    private element_:HTMLElement;
    private stack_:[View,any][];
    private layout_:[number,number, number, number];

    constructor(element:HTMLElement) {
        this.element_ = element;
        this.stack_ = [];
        this.layout_ = [0, 0, 0, 0];
    }

    get element():HTMLElement {
        return this.element_;
    }

    get navigationView() {
        return this;
    }

    open(view:View) {
        while (this.stack_.length > 1) {
            let [v,] = this.stack_.shift();
            v.detach(this);
            this.element_.removeChild(v.element);
        }

        if (this.stack_.length) {
            var [cv,] = this.stack_.pop();
            cv.element.style.transform = 'translate(-70%, 0)';
            cv.element.style.opacity = '0';
            cv.detach(this);
            setTimeout(function () {
                this.element_.removeChild(cv.element);
            }, 300);
        }

        this.push(view);
    }

    push(view:View) {
        if (this.stack_.length) {
            var entry = this.stack_[this.stack_.length - 1];
            var [cv, mark] = entry;
            cv.element.style.transform = 'translate(-70%, 0)';
            cv.element.style.opacity = '0';
            setTimeout(function () {
                if (entry[1] == mark)
                    cv.element.style.display = 'none';
            }, 300);
        }

        view.element.classList.add('sc-view');
        view.element.style.transform = "translate(70%, 0)";
        this.element_.appendChild(view.element);
        view.attach(this);
        this.stack_.push([view, 0]);
        view.syncLayout(0, 0, this.layout_[2], this.layout_[3]);

        requestAnimationFrame(function () {
            view.element.style.transform = "translate(0, 0)";
            view.element.style.opacity = '1';
        });
    }

    pop(n:number = 1) {
        if (n <= 0)
            n = this.stack_.length + n;
        if (n > this.stack_.length)
            throw new RangeError();

        var removing = this.stack_.splice(this.stack_.length - n, n);
        var [tmv,] = removing[n - 1];
        tmv.element.style.display = 'block';
        requestAnimationFrame(function () {
            tmv.element.style.transform = "translate(70%, 0)";
            tmv.element.style.opacity = '0';
        });
        for (let [v,] of removing)
            v.detach(this);
        setTimeout(() => {
            for (let [v,] of removing) {
                this.element_.removeChild(v.element);
            }
        }, 300);

        if (this.stack_.length) {
            var entry = this.stack_[this.stack_.length - 1];
            var [v,] = entry;
            v.element.style.display = 'block';
            v.syncLayout(0, 0, this.layout_[2], this.layout_[3]);

            requestAnimationFrame(function () {
                v.element.style.transform = "translate(0, 0)";
                v.element.style.opacity = '1';
            });
            entry[1]++;
        }
    }

    attach(view:View) {

    }

    detach(view:View) {

    }

    syncLayout(left:number, top:number, width:number, height:number) {
        this.layout_ = [left, top, width, height];
        if (this.stack_.length) {
            var [v,] = this.stack_[this.stack_.length - 1];
            v.syncLayout(0, 0, width, height);
        }
    }
}

export default SideView;
