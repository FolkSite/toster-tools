/* global Extension, $ */
import {
    Device,
    openWin,
    _l
}
from './utils';

$( document ).ready( () => {
    $( 'label[data-msg="extension_name"]' ).html( _l( 'extension_name' ) );

    const AJAXCheckbox = $( '#AJAXCheckbox' );
    const BadgeCheckbox = $( '#BadgeCheckbox' );
    const NotifyCheckbox = $( '#NotifyCheckbox' );
    const IntervalInput = $( '#IntervalInput' );
    const ToolBarCheckbox = $( '#ToolBarCheckbox' );
    const KBDCheckbox = $( '#KBDCheckbox' );
    const HidePanelCheckbox = $( '#HidePanelCheckbox' );
    const HideRightSidebarCheckbox = $( '#HideRightSidebarCheckbox' );
    const SaveButton = $( '#save_options' );

    const save_options = () => {
        const opt = {};
        opt.ajax = !!AJAXCheckbox.prop( 'checked' );
        opt.use_notifications = !!NotifyCheckbox.prop( 'checked' );
        opt.use_badge_icon = !!BadgeCheckbox.prop( 'checked' );
        opt.interval = parseInt( IntervalInput.val(), 10 );
        opt.show_toolbar = !!ToolBarCheckbox.prop( 'checked' );
        opt.use_kbd = !!KBDCheckbox.prop( 'checked' );
        opt.hide_top_panel = !!HidePanelCheckbox.prop( 'checked' );
        opt.hide_right_sidebar = !!HideRightSidebarCheckbox.prop( 'checked' );
        window.Extension.Options = Object.assign( {}, window.Extension.Options, opt );
        window.Extension.saveOptions();
    };

    const restore_options = () => {
        window.Extension.loadOptions();
        const opt = window.Extension.Options;
        AJAXCheckbox.prop( {
            checked: !!opt.ajax
        } );
        NotifyCheckbox.prop( {
            checked: !!opt.use_notifications
        } );
        BadgeCheckbox.prop( {
            checked: !!opt.use_badge_icon
        } );
        IntervalInput.val( opt.interval );
        ToolBarCheckbox.prop( {
            checked: !!opt.show_toolbar
        } );
        KBDCheckbox.prop( {
            checked: !!opt.use_kbd
        } );
        HidePanelCheckbox.prop( {
            checked: !!opt.hide_top_panel
        } );
        HideRightSidebarCheckbox.prop( {
            checked: !!opt.hide_right_sidebar
        } );
    };

    SaveButton.on( 'click', save_options );
    SaveButton.text( _l( 'action_save' ) );

    $.each( $( 'label[data-msg^="options_"]' ), ( i, item ) => {
        const msg = $( item ).data( 'msg' );
        $( item ).text( _l( msg ) );
    } );

    Device.runtime.getBackgroundPage( ( backgroundPageInstance ) => {
        window.Extension = backgroundPageInstance.Ext;
        restore_options();

        const feedButton = $( 'button[data-msg="feed_url"]' );
        const newQuestionButton = $( 'button[data-msg="new_question_url"]' );

        feedButton.html( _l( 'feed_url', [ window.Extension.Options.feed_url, '<span class="glyphicon glyphicon-home"></span>' ] ) );

        newQuestionButton.html( _l( 'new_question_url', [ window.Extension.Options.new_question_url, '<span class="glyphicon glyphicon-plus"></span>' ] ) );

        feedButton.on( 'click', ( e ) => {
            openWin( window.Extension.Options.feed_url );
        } );

        newQuestionButton.on( 'click', ( e ) => {
            openWin( window.Extension.Options.new_question_url );
        } );
    } );
} );
