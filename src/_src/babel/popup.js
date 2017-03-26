'use strict';

var _utils = require('./utils');

$(document).ready(function () {
    $('label[data-msg="extension_name"]').html((0, _utils._l)('extension_name'));

    var AJAXCheckbox = $('#AJAXCheckbox');
    var BadgeCheckbox = $('#BadgeCheckbox');
    var NotifyCheckbox = $('#NotifyCheckbox');
    var IntervalInput = $('#IntervalInput');
    var ToolBarCheckbox = $('#ToolBarCheckbox');
    var KBDCheckbox = $('#KBDCheckbox');
    var HidePanelCheckbox = $('#HidePanelCheckbox');
    var HideRightSidebarCheckbox = $('#HideRightSidebarCheckbox');
    var SaveButton = $('#save_options');

    var save_options = function save_options() {
        var opt = {};
        opt.ajax = !!AJAXCheckbox.prop('checked');
        opt.use_notifications = !!NotifyCheckbox.prop('checked');
        opt.use_badge_icon = !!BadgeCheckbox.prop('checked');
        opt.interval = parseInt(IntervalInput.val(), 10);
        opt.show_toolbar = !!ToolBarCheckbox.prop('checked');
        opt.use_kbd = !!KBDCheckbox.prop('checked');
        opt.hide_top_panel = !!HidePanelCheckbox.prop('checked');
        opt.hide_right_sidebar = !!HideRightSidebarCheckbox.prop('checked');
        window.Extension.Options = Object.assign({}, window.Extension.Options, opt);
        window.Extension.saveOptions();
    };

    var restore_options = function restore_options() {
        window.Extension.loadOptions();
        var opt = window.Extension.Options;
        AJAXCheckbox.prop({
            checked: !!opt.ajax
        });
        NotifyCheckbox.prop({
            checked: !!opt.use_notifications
        });
        BadgeCheckbox.prop({
            checked: !!opt.use_badge_icon
        });
        IntervalInput.val(opt.interval);
        ToolBarCheckbox.prop({
            checked: !!opt.show_toolbar
        });
        KBDCheckbox.prop({
            checked: !!opt.use_kbd
        });
        HidePanelCheckbox.prop({
            checked: !!opt.hide_top_panel
        });
        HideRightSidebarCheckbox.prop({
            checked: !!opt.hide_right_sidebar
        });
    };

    SaveButton.on('click', save_options);
    SaveButton.text((0, _utils._l)('action_save'));

    $.each($('label[data-msg^="options_"]'), function (i, item) {
        var msg = $(item).data('msg');
        $(item).text((0, _utils._l)(msg));
    });

    _utils.Device.runtime.getBackgroundPage(function (backgroundPageInstance) {
        window.Extension = backgroundPageInstance.Ext;
        restore_options();

        var feedButton = $('button[data-msg="feed_url"]');
        var newQuestionButton = $('button[data-msg="new_question_url"]');

        feedButton.html((0, _utils._l)('feed_url', [window.Extension.Options.feed_url, '<span class="glyphicon glyphicon-home"></span>']));

        newQuestionButton.html((0, _utils._l)('new_question_url', [window.Extension.Options.new_question_url, '<span class="glyphicon glyphicon-plus"></span>']));

        feedButton.on('click', function (e) {
            (0, _utils.openWin)(window.Extension.Options.feed_url);
        });

        newQuestionButton.on('click', function (e) {
            (0, _utils.openWin)(window.Extension.Options.new_question_url);
        });
    });
}); /* global Extension, $ */