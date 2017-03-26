'use strict';

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var Device = utils.Device; /* global Device, Extension, browser, chrome */


var AJAXCheckbox = utils.$('#AJAXCheckbox');
var BadgeCheckbox = utils.$('#BadgeCheckbox');
var NotifyCheckbox = utils.$('#NotifyCheckbox');
var IntervalInput = utils.$('#IntervalInput');
var ToolBarCheckbox = utils.$('#ToolBarCheckbox');
var KBDCheckbox = utils.$('#KBDCheckbox');
var HidePanelCheckbox = utils.$('#HidePanelCheckbox');
var HideRightSidebarCheckbox = utils.$('#HideRightSidebarCheckbox');
var SaveButton = utils.$('#save_options');

var save_options = function save_options() {
    var opt = {};
    opt.ajax = !!AJAXCheckbox.checked;
    opt.use_notifications = !!NotifyCheckbox.checked;
    opt.use_badge_icon = !!BadgeCheckbox.checked;
    opt.interval = parseInt(IntervalInput.value, 10);
    opt.show_toolbar = !!ToolBarCheckbox.checked;
    opt.use_kbd = !!KBDCheckbox.checked;
    opt.hide_top_panel = !!HidePanelCheckbox.checked;
    opt.hide_right_sidebar = !!HideRightSidebarCheckbox.checked;
    window.Extension.Options = Object.assign({}, window.Extension.Options, opt);
    window.Extension.saveOptions();
};

var restore_options = function restore_options() {
    window.Extension.loadOptions();
    var opt = window.Extension.Options;
    AJAXCheckbox.checked = !!opt.ajax;
    NotifyCheckbox.checked = !!opt.use_notifications;
    BadgeCheckbox.checked = !!opt.use_badge_icon;
    IntervalInput.value = String(opt.interval);
    ToolBarCheckbox.checked = !!opt.show_toolbar;
    KBDCheckbox.checked = !!opt.use_kbd;
    HidePanelCheckbox.checked = !!opt.hide_top_panel;
    HideRightSidebarCheckbox.checked = !!opt.hide_right_sidebar;
};

document.addEventListener('DOMContentLoaded', function () {
    SaveButton.addEventListener('click', save_options);

    var items = utils.$$('label[data-msg]');

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var msg = item.dataset.msg;
        item.innerHTML = Device.i18n.getMessage(msg);
    }

    SaveButton.innerText = Device.i18n.getMessage('action_save');

    Device.runtime.getBackgroundPage(function (backgroundPageInstance) {
        window.Extension = backgroundPageInstance.Ext;
        restore_options();

        var feed_label = utils.$('label[data-msg="feed_url"]');
        feed_label.innerHTML = Device.i18n.getMessage('feed_url', [window.Extension.Options.feed_url, Device.i18n.getMessage('action_go_to_website')]);

        var new_question_label = utils.$('label[data-msg="new_question_url"]');
        new_question_label.innerHTML = Device.i18n.getMessage('new_question_url', [window.Extension.Options.new_question_url, Device.i18n.getMessage('action_new_question')]);
    });
});