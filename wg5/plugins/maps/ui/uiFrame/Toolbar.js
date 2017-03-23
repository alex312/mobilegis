"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";

    var Toolbar = function () {
        function Toolbar(element) {
            _classCallCheck(this, Toolbar);

            this.element_ = element;
            this.dropdownContainer_ = $("<div class=\"map-toolbar-dropdown-container\"></div>").appendTo(document.body);
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
            this.more_ = $(this.addButton({ text: '更多', items: [] })).hide();
        }

        _createClass(Toolbar, [{
            key: "addInput",
            value: function addInput(options) {
                options = options || {};
                var input = $("<input type=" + (options.type || 'text') + ">");
                var ele = input[0];
                if (options.placeholder) ele.placeholder = options.placeholder;
                if (options.minWidth != null) ele.style.minWidth = options.minWidth;
                if (options.maxWidth != null) ele.style.maxWidth = options.maxWidth;
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
        }, {
            key: "addButton",
            value: function addButton(options) {
                options = options || {};
                var button = $("<button type='button'><span>" + (options.text || '') + "</span></button>");
                if (options.click) button.click(options.click);
                if (options.icon) button.prepend("<i class=\"icon " + options.icon + "\"></i>");
                if (options.css) button.addClass(options.css);
                var dropdown = null;
                if (options.items) {
                    dropdown = $("<div class=\"map-toolbar-dropdown\"></div>");
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = options.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var item = _step.value;

                            var menuItem = $("<button type=\"button\"><span>" + (item.text || '') + "</span></button>").addClass('map-toolbar-dropdown-item').click(item.click).appendTo(dropdown);
                            if (item.css) button.addClass(item.css);
                            menuItem.prepend("<i class=\"icon " + (item.icon || '') + "\"></i>");
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                } else if (options.dropdown) {
                    dropdown = $("<div class=\"map-toolbar-dropdown\"></div>").append(options.dropdown);
                }
                if (dropdown) {
                    button.append("<i class=\"fa fa-caret-down\"></i>");
                    this.bindDropdown_(button[0], dropdown[0]);
                }
                if (this.more_) this.more_.before(button);else button.appendTo(this.element_);
                return button[0];
            }
        }, {
            key: "bindDropdown_",
            value: function bindDropdown_(button, dropdown) {
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
                $([button, dropdown]).mouseenter(function (evt) {
                    if (!clicked) show();
                }).mouseleave(function (evt) {
                    hide();
                }).click(function () {
                    clicked = true;
                    setTimeout(function () {
                        clicked = false;
                    }, 200);
                    hideImmediately();
                });
            }
        }]);

        return Toolbar;
    }();

    exports.Toolbar = Toolbar;
    function isAncestorOrSame(ancestor, descendant) {
        while (descendant) {
            if (ancestor === descendant) return true;
            descendant = descendant.parentNode;
        }
        return false;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Toolbar;
});