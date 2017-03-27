'use strict';

var _utils = require('./utils');

$(document).ready(function () {
    $('label[data-msg="extension_name"]').html((0, _utils._l)('extension_name'));

    var inputs = $('#options_form input[type!="button"]');
    var SaveButton = $('#save_options');

    var save_options = function save_options() {
        $.each(inputs, function (i, el) {
            var name = $(el).attr('id');
            var type = $(el).attr('type');
            if (type === 'checkbox') {
                window.Extension.Options[name] = $(el).prop('checked');
            } else if (type === 'number') {
                window.Extension.Options[name] = parseInt($(el).val(), 10);
            } else if (type === 'text') {
                window.Extension.Options[name] = $(el).val();
            } else {
                window.Extension.Options[name] = $(el).val();
            }
        });
        window.Extension.saveOptions();
    };

    var restore_options = function restore_options() {
        window.Extension.loadOptions();
        $.each(inputs, function (i, el) {
            var name = $(el).attr('id');
            var type = $(el).attr('type');
            if (type === 'checkbox') {
                $(el).prop({
                    checked: window.Extension.Options[name]
                });
            } else if (type === 'number') {
                $(el).val(window.Extension.Options[name]);
            } else if (type === 'text') {
                $(el).val(window.Extension.Options[name]);
            }
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

        var feedButton = $('button[data-action="feed_url"]');
        var newQuestionButton = $('button[data-action="new_question_url"]');

        feedButton.attr({
            title: (0, _utils._l)('action_go_to_website')
        });

        newQuestionButton.attr({
            title: (0, _utils._l)('action_new_question')
        });

        feedButton.on('click', function (e) {
            (0, _utils.openWin)(window.Extension.Options.feed_url);
        });

        newQuestionButton.on('click', function (e) {
            (0, _utils.openWin)(window.Extension.Options.new_question_url);
        });
    });
}); /* global Extension, $ */