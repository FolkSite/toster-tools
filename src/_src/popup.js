/* global Device, Extension, browser, chrome */
import * as utils from './utils';

const Device = utils.Device;

const AJAXCheckbox = utils.$( '#AJAXCheckbox' );
const BadgeCheckbox = utils.$( '#BadgeCheckbox' );
const NotifyCheckbox = utils.$( '#NotifyCheckbox' );
const IntervalInput = utils.$( '#IntervalInput' );
const ToolBarCheckbox = utils.$( '#ToolBarCheckbox' );
const KBDCheckbox = utils.$( '#KBDCheckbox' );
const HidePanelCheckbox = utils.$( '#HidePanelCheckbox' );
const HideRightSidebarCheckbox = utils.$( '#HideRightSidebarCheckbox' );
const SaveButton = utils.$( '#save_options' );

const save_options = () => {
    const opt = {};
    opt.ajax = !!AJAXCheckbox.checked;
    opt.use_notifications = !!NotifyCheckbox.checked;
    opt.use_badge_icon = !!BadgeCheckbox.checked;
    opt.interval = parseInt( IntervalInput.value, 10 );
    opt.show_toolbar = !!ToolBarCheckbox.checked;
    opt.use_kbd = !!KBDCheckbox.checked;
    opt.hide_top_panel = !!HidePanelCheckbox.checked;
    opt.hide_right_sidebar = !!HideRightSidebarCheckbox.checked;
    window.Extension.Options = Object.assign( {}, window.Extension.Options, opt );
    window.Extension.saveOptions();
};

const restore_options = () => {
    window.Extension.loadOptions();
    const opt = window.Extension.Options;
    AJAXCheckbox.checked = !!opt.ajax;
    NotifyCheckbox.checked = !!opt.use_notifications;
    BadgeCheckbox.checked = !!opt.use_badge_icon;
    IntervalInput.value = String( opt.interval );
    ToolBarCheckbox.checked = !!opt.show_toolbar;
    KBDCheckbox.checked = !!opt.use_kbd;
    HidePanelCheckbox.checked = !!opt.hide_top_panel;
    HideRightSidebarCheckbox.checked = !!opt.hide_right_sidebar;
};

document.addEventListener( 'DOMContentLoaded', () => {
    SaveButton.addEventListener( 'click', save_options );

    const items = utils.$$( 'label[data-msg]' );

    for ( let i = 0; i < items.length; i++ ) {
        const item = items[ i ];
        const msg = item.dataset.msg;
        item.innerHTML = Device.i18n.getMessage( msg );
    }

    SaveButton.innerText = Device.i18n.getMessage( 'action_save' );

    Device.runtime.getBackgroundPage( ( backgroundPageInstance ) => {
        window.Extension = backgroundPageInstance.Ext;
        restore_options();

        const feed_label = utils.$( 'label[data-msg="feed_url"]' );
        feed_label.innerHTML = Device.i18n.getMessage( 'feed_url', [ window.Extension.Options.feed_url, Device.i18n.getMessage( 'action_go_to_website' ) ] );

        const new_question_label = utils.$( 'label[data-msg="new_question_url"]' );
        new_question_label.innerHTML = Device.i18n.getMessage( 'new_question_url', [ window.Extension.Options.new_question_url, Device.i18n.getMessage( 'action_new_question' ) ] );
    } );
} );
