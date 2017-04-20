import $ from 'jquery';

import marked from 'marked';

import {
    Device,
    openWin,
    getPage,
    _l
}
from './_modules/utils';

marked.setOptions( {
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
} );

$( document ).ready( () => {
    Device.runtime.getBackgroundPage( ( BGInstance ) => {
        window.BG = BGInstance;

        window.promise = getPage( Device.runtime.getURL( 'CHANGELOG.md' ) );
        window.promise.then( ( mdstring ) => {
                $( '#changelog' ).html( marked( mdstring ) );
            } )
            .then( () => ( window.promise = null ) );

        const homeButton = $( 'button[data-action="go_to_home"]' );

        homeButton.attr( {
            title: _l( 'action_go_to_home' )
        } );

        homeButton.on( 'click', ( e ) => {
            openWin( window.BG.Ext.Options.home_url );
        } );

        const feedbackButton = $( 'button[data-action="go_to_feedback"]' );

        feedbackButton.attr( {
            title: _l( 'action_go_to_feedback' )
        } );

        feedbackButton.on( 'click', ( e ) => {
            openWin( window.BG.Ext.Options.feedback_url );
        } );

        const optionsButton = $( 'button[data-action="go_to_options"]' );

        optionsButton.attr( {
            title: _l( 'action_go_to_options' )
        } );

        optionsButton.on( 'click', ( e ) => {
            Device.runtime.openOptionsPage();
        } );

        const feedButton = $( 'button[data-action="go_to_feed"]' );

        feedButton.attr( {
            title: _l( 'action_go_to_feed' )
        } );

        feedButton.on( 'click', ( e ) => {
            openWin( window.BG.Ext.Options.feed_url );
        } );

        const newQuestionButton = $( 'button[data-action="go_to_new_question"]' );

        newQuestionButton.attr( {
            title: _l( 'action_go_to_new_question' )
        } );

        newQuestionButton.on( 'click', ( e ) => {
            openWin( window.BG.Ext.Options.new_question_url );
        } );
    } );
} );
