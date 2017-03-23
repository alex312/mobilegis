import * as $ from "jquery";

export class Toolbar {
    private element_:HTMLElement;
    private dropdownContainer_:JQuery;
    private tether_:Tether;
    private more_:JQuery;

    constructor(element: HTMLElement) {
        this.element_ = element;
        this.dropdownContainer_ = $(`<div class="map-toolbar-dropdown-container"></div>`)
            .appendTo(document.body);
        this.tether_ = new Tether({
            element: this.dropdownContainer_[0],
            target: this.element_,
            attachment: 'top left',
            targetAttachment: 'bottom left',
            constraints: [{
                to: 'window',
                pin: true,
                attachment: 'together'
            }]
        });

        this.more_ = $(this.addButton({text: '更多', items: []})).hide();
    }

    addInput(options) {
        options = options || {};
        var input = $(`<input type=${options.type || 'text'}>`);
        var ele = (<HTMLInputElement>input[0]);
        if (options.placeholder)
            ele.placeholder = options.placeholder;
        if (options.minWidth != null)
            ele.style.minWidth = options.minWidth;
        if (options.maxWidth != null)
            ele.style.maxWidth = options.maxWidth;
        if (options.flex) {
            ele.style.webkitBoxFlex = options.flex;
            ele.style['mozBoxFlex'] = options.flex;
            ele.style['msFlex'] = options.flex;
            ele.style.webkitFlex = options.flex;
            ele.style.flex = options.flex;
            ele.style.width = '0';
        }
        this.more_.before(input);

        return input[0];
    }

    addButton(options) {
        options = options || {};
        var button = $(`<button type='button'><span>${options.text || ''}</span></button>`);
        if (options.click)
            button.click(options.click);

        if (options.icon)
            button.prepend(`<i class="icon ${options.icon}"></i>`);

        if (options.css)
            button.addClass(options.css);

        let dropdown = null;
        if (options.items) {
            dropdown = $(`<div class="map-toolbar-dropdown"></div>`);
            for (var item of options.items) {
                var menuItem = $(`<button type="button"><span>${item.text || ''}</span></button>`)
                    .addClass('map-toolbar-dropdown-item')
                    .click(item.click)
                    .appendTo(dropdown);
                if (item.css)
                    button.addClass(item.css);
                menuItem.prepend(`<i class="icon ${options.icon || ''}"></i>`);
            }

        } else if (options.dropdown) {
            dropdown = $(`<div class="map-toolbar-dropdown"></div>`)
                .append(options.dropdown);
        }

        if (dropdown) {
            button.append(`<i class="icon icon-dropdown"></i>`);
            this.bindDropdown_(button[0], dropdown[0]);
        }

        if (this.more_)
            this.more_.before(button);
        else
            button.appendTo(this.element_);
        return button[0];
    }

    private bindDropdown_(button:HTMLElement, dropdown:HTMLElement) {
        var timer = 0;
        var container = this.dropdownContainer_[0];
        var tether = this.tether_;
        var element = this.element_;

        function show() {
            if (timer) {
                clearTimeout(timer);
                timer = 0;
            }
            container.classList.add('open');
            if (container.childNodes.length && container.childNodes[0] !== dropdown) {
                container.removeChild(container.childNodes[0]);
            }
            if (container.childNodes[0] !== dropdown) {
                container.appendChild(dropdown);
            }

            tether.setOptions({
                element: container,
                target: button,
                attachment: 'top left',
                targetAttachment: 'bottom left',
                constraints: [{
                    to: 'window',
                    pin: true,
                    attachment: 'together'
                }, {
                    to: element,
                    pin: ['left', 'right']
                }]
            });
            tether.position();
        }

        function hide() {
            if (!timer) {
                timer = setTimeout(function () {
                    timer = 0;
                    if (container.childNodes[0] === dropdown) {
                        container.classList.remove('open');
                    }
                }, 300);
            }
        }

        function hideImmediately() {
            if (timer) {
                clearTimeout(timer);
                timer = 0;
            }
            if (container.childNodes[0] === dropdown) {
                container.classList.remove('open');
            }
        }

        var clicked = false;
        $([button, dropdown]).mouseenter(function (evt:Event) {
            if (!clicked)
                show();
        }).mouseleave(function (evt:Event) {
            hide();
        }).click(function () {
            clicked = true;
            setTimeout(function () {
                clicked = false;
            }, 200);
            hideImmediately();
        });
    }
}

function isAncestorOrSame(ancestor, descendant) {
    while (descendant) {
        if (ancestor === descendant)
            return true;
        descendant = descendant.parentNode;
    }
    return false;
}

export default Toolbar;
