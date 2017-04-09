/* global Ext, $ */
/* eslint class-methods-use-this: "off" */
/* eslint no-use-before-define: "off" */
/* eslint no-useless-escape: "off" */
/* eslint no-control-regex: "off" */
/* eslint no-extend-native: "off" */
import {
    Device,
    getPage
} from './utils';

import QuestionParser from './parser';

Array.prototype.remove = function ( ...args ) {
    const a = [ ...args ];
    let L = a.length;
    let what;
    let ax;
    while ( L && this.length ) {
        what = a[ --L ];
        ax = this.indexOf( what );
        if ( ax > -1 ) {
            this.splice( ax, 1 );
        }
    }
    return this;
};

HTMLTextAreaElement.prototype.setCaretPosition = function ( start, end ) {
    end = typeof end !== 'undefined' ? end : start;
    this.selectionStart = start;
    this.selectionEnd = end;
    this.focus();
};

HTMLTextAreaElement.prototype.hasSelection = function () {
    if ( this.selectionStart === this.selectionEnd ) {
        return false;
    }
    return true;
};

HTMLTextAreaElement.prototype.isMultilineSelection = function () {
    const re = /(\n)/g;
    if ( ( this.value.substring( this.selectionStart, this.selectionEnd ).match( re ) || [] ).length > 0 ) {
        return true;
    }
    return false;
};

window.activeIDs = [];

const state = {
    onQuestionPage: window.location.pathname.startsWith( '/q/' ),
    onFeedPage: window.location.pathname === '' || window.location.pathname === '/' || window.location.pathname.startsWith( '/my/feed' ),
    onAllQuestionsPage: window.location.pathname.startsWith( '/questions' ),
    onTagQuestionsPage: window.location.pathname.startsWith( '/tag/' ) && /\/?_?questions_?/g.test( window.location.pathname )
};

( () => {
    if ( window.location.hash.startsWith( '#comment_' ) ) {
        const comment = $( window.location.hash ).closest( 'li[role^="answer_item"]' );
        window.activeIDs.push( $( comment ).attr( 'id' ) );
    }
} )();

const callbackMessage = ( request, sender, callback ) => {
    window.Ext.callbackMessage( request, sender, callback );
};

const selectors = {
    textareaSelectorAll: 'textarea.textarea',
    QuestionCommentsRootSelector: 'ul[role="question_comments_list"]',
    SolutionsRootSelector: '#solutions > ul#solutions_list',
    AnswersRootSelector: '#answers > ul#answers_list',
    TagsListRootSelector: '#question_show ul.tags-list',
    FeedRootSelector: 'ul.content-list[role="content-list"]'
};

const Parser = new QuestionParser( selectors );

class Extension {
    constructor( ...args ) {
        this.Timer = undefined;
        this.OldTitle = $( document ).prop( 'title' );
        const defaults = Object.freeze( {
            ajax: true,
            check_answers: false,
            check_feed: true,
            interval: 10,
            use_sound: true,
            name_sound: 'sound/sound1.ogg',
            use_kbd: true,
            use_tab: false,
            hide_top_panel: false,
            hide_right_sidebar: false
        } );
        this.Options = Object.assign( {}, defaults );

        this.Sound = new Audio( Device.runtime.getURL( this.Options.name_sound ) );
    }

    stopTimer() {
        clearInterval( this.Timer );
    }

    startTimer() {
        this.Timer = setInterval( () => {
            if ( state.onQuestionPage && this.Options.check_answers ) {
                this.updatePage();
            }
            if ( ( state.onFeedPage || state.onAllQuestionsPage || state.onTagQuestionsPage ) && this.Options.check_feed ) {
                this.updateFeed();
            }
        }, this.Options.interval * 1000 );
    }

    reStartTimer() {
        this.stopTimer();

        if ( this.Options.ajax && ( this.Options.interval > 0 ) ) {
            this.startTimer();
        }
    }

    addHighlight() {
        const id = 'highlightContentScript';
        if ( $( `#${id}` ).get( 0 ) ) return;
        $( '<script/>', {
            src: Device.runtime.getURL( 'js/highlight.js' ),
            id: id,
            async: true
        } ).appendTo( 'head' );
    }

    removeHighlight() {
        const id = 'highlightContentScript';
        try {
            $( `#${id}` ).remove();
        } catch ( e ) {}
    }

    updateQuestionComments( body ) {
        const newQuestionComments = Parser.getQuestionComments( body );
        const QuestionCommentsRoot = $( document ).find( selectors.QuestionCommentsRootSelector );
        QuestionCommentsRoot.find( 'li' ).remove( 'li[role*="comments_item"]' );
        for ( let i = 0; i < newQuestionComments.length; i++ ) {
            const comment = newQuestionComments[ i ];
            const li = $( '<li/>', {
                class: 'content-list__item',
                role: 'comments_item'
            } );
            $( li ).html( comment.content );
            $( li ).insertBefore( $( QuestionCommentsRoot.find( 'li.content-list__item' ).last() ) );
        }
    }

    updateSolutions( body ) {
        const localSolutions = Parser.getSolutions( document );
        const Solutions = Parser.getSolutions( body );
        const SolutionsRoot = $( document ).find( selectors.SolutionsRootSelector );
        let solutionsDeleteArray = [];

        if ( Solutions.length < localSolutions.length ) {
            solutionsDeleteArray = localSolutions.filter( item => !Solutions.find( search => search.id === item.id ) );
        }

        $( '#solutions span[role="answers_counter"]' ).text( ( localSolutions.length - solutionsDeleteArray.length ) );

        for ( let i = 0; i < solutionsDeleteArray.length; i++ ) {
            const _id = $( solutionsDeleteArray[ i ] ).attr( 'id' );
            $( SolutionsRoot ).find( 'li' ).remove( `#${_id}` );
        }

        for ( let i = 0; i < Solutions.length; i++ ) {
            const solution = $( Solutions[ i ] );
            const currentId = $( solution ).attr( 'id' );
            const exists = $( SolutionsRoot ).find( `li#${currentId}` ).get( 0 );
            if ( !window.activeIDs.includes( currentId ) ) {
                if ( exists ) {
                    const isEdition = $( exists ).find( 'div.answer-form_edit[role*="edit_answer_form"]' ).get( 0 );
                    if ( !isEdition ) {
                        $( exists ).html( $( solution ).html() );
                    }
                } else {
                    $( SolutionsRoot ).append( $( solution ) );
                }
            }
        }
    }

    updateAnswers( body ) {
        const localAnswers = Parser.getAnswers( document );
        const Answers = Parser.getAnswers( body );
        const AnswersRoot = $( document ).find( selectors.AnswersRootSelector );
        let answersDeleteArray = [];

        if ( Answers.length < localAnswers.length ) {
            answersDeleteArray = localAnswers.filter( item => !Answers.find( search => search.id === item.id ) );
        }

        $( '#answers span[role="answers_counter"]' ).text( ( localAnswers.length - answersDeleteArray.length ) );

        for ( let i = 0; i < answersDeleteArray.length; i++ ) {
            const _id = $( answersDeleteArray[ i ] ).attr( 'id' );
            $( AnswersRoot ).find( 'li' ).remove( `#${_id}` );
        }

        for ( let i = 0; i < Answers.length; i++ ) {
            const answer = $( Answers[ i ] );
            const currentId = $( answer ).attr( 'id' );
            const exists = $( AnswersRoot ).find( `li#${currentId}` ).get( 0 );
            if ( !window.activeIDs.includes( currentId ) ) {
                if ( exists ) {
                    const isEdition = $( exists ).find( 'div.answer-form_edit[role*="edit_answer_form"]' ).get( 0 );
                    if ( !isEdition ) {
                        $( exists ).html( $( answer ).html() );
                    }
                } else {
                    $( AnswersRoot ).append( $( answer ) );
                    if ( this.Options.use_sound ) {
                        this.Sound.play();
                    }
                }
            }
        }
    }

    updateFeed() {
        getPage( window.location.href ).then( ( body ) => {
            const Questions = Parser.getFeed( body );
            const FeedRoot = $( document ).find( selectors.FeedRootSelector );

            for ( let i = 0; i < Questions.length; i++ ) {
                const question = $( Questions[ i ] );
                const href = $( question ).find( 'a[itemprop="url"]' ).attr( 'href' );
                const exists = $( FeedRoot ).find( 'li' ).find( `a[href="${href}"]` ).get( 0 );

                if ( exists ) {
                    const parent = $( exists ).closest( 'li.content-list__item' ).get( 0 );
                    $( parent ).html( $( question ).html() );
                } else {
                    $( question ).addClass( 'new-item' );
                    $( FeedRoot ).prepend( $( question ) );
                    $( FeedRoot ).find( ' li.new-item:first-child' ).fadeIn( 2000 );
                    $( FeedRoot ).find( ' li.content-list__item:last-child' ).remove();
                    if ( this.Options.use_sound ) {
                        this.Sound.play();
                    }
                }
            }

            const count = $( FeedRoot ).find( ' li.new-item' ).length;

            if ( count > 0 ) {
                $( document ).prop( 'title', `[${count}] - ${this.OldTitle}` );
            } else {
                $( document ).prop( 'title', this.OldTitle );
            }
        } );
    }

    updatePage() {
        getPage( window.location.href ).then( ( body ) => {
            this.updateQuestionComments( body );
            this.updateSolutions( body );
            this.updateAnswers( body );
        } );
    }

    addKeyDownSendListener() {
        $( document ).delegate( selectors.textareaSelectorAll, 'keydown', ( event ) => {
            if ( !event ) {
                const event = window.event;
            }
            const form = $( event.target.form );
            const button = $( 'button[type="submit"]', form );
            if ( ( event.ctrlKey || event.metaKey ) && ( event.keyCode === 13 || event.keyCode === 10 ) ) {
                if ( this.Options.use_kbd ) {
                    button.click();
                }
            }
        } );
    }

    addKeyDownIndentFormatListener() {
        $( document ).delegate( selectors.textareaSelectorAll, 'keydown', ( event ) => {
            if ( !event ) {
                const event = window.event;
            }

            if ( event.keyCode !== 9 || ( event.ctrlKey || event.metaKey ) || event.altKey ) return;

            if ( !this.Options.use_tab ) return false;

            const tabString = '\t';
            const target = event.target;
            const selectionStart = target.selectionStart;
            const selectionEnd = target.selectionEnd;

            let lineStart = selectionStart;
            for ( lineStart = selectionStart; lineStart >= 0 && target.value[ lineStart ] !== '\n'; lineStart-- );

            let lineEnd = selectionEnd;
            for ( lineEnd = selectionEnd; lineEnd < target.value.length && target.value[ lineEnd ] !== '\n'; lineEnd++ );


            let text = target.value.substring( lineStart, lineEnd );

            // Are we selecting multiple lines?
            if ( target.hasSelection() && target.isMultilineSelection() ) {
                let numChanges = 0;
                let firstLineNumChanges = 1;

                if ( !event.shiftKey ) { // Normal Tab
                    const re = new RegExp( '(\n[ ]*)', 'g' );

                    numChanges = ( text.match( re ) || [] ).length;

                    text = text.replace( re, `\$1${tabString}` );
                } else { // Shift+Tab
                    const re = new RegExp( `(\n[ ]*)${tabString}`, 'g' );

                    numChanges = ( text.match( re ) || [] ).length;

                    let indexOfNewLine = 1;
                    for ( indexOfNewLine = 1; indexOfNewLine < text.length && text[ indexOfNewLine ] !== '\n'; ++indexOfNewLine );
                    firstLineNumChanges = ( text.substring( 0, indexOfNewLine ).match( re ) || [] ).length;

                    text = text.replace( re, '$1' );
                }


                target.value = target.value.substring( 0, lineStart ) + text + target.value.substring( lineEnd, target.value.length );

                // Keep the selection we had before
                const newSelectionStart = ( selectionStart + ( tabString.length * ( ( !event.shiftKey ) ? 1 : -1 ) ) * firstLineNumChanges );
                const newSelectionEnd = selectionEnd + ( ( tabString.length * numChanges * ( ( !event.shiftKey ) ? 1 : -1 ) ) );


                target.setCaretPosition( newSelectionStart, newSelectionEnd );
            } else {
                // We are not in multiline so
                // we should add a tab at the position
                // only shift-tab if there is a tab present before
                if ( !event.shiftKey ) { // Normal Tab
                    target.value = target.value.substring( 0, selectionStart ) + tabString + target.value.substring( selectionEnd, target.value.length );

                    target.setCaretPosition( selectionStart + tabString.length, selectionEnd + tabString.length );
                } else if ( target.value.substring( selectionStart - tabString.length, selectionStart ) === tabString ) { // Shift+Tab
                    target.value = target.value.substring( 0, selectionStart - tabString.length ) + target.value.substring( selectionEnd, target.value.length );
                    target.setCaretPosition( selectionStart - tabString.length, selectionEnd - tabString.length );
                }
            }
            return false;
        } );
    }

    updateSidebar( html ) {
        const aside = $( 'aside.layout__navbar[role="navbar"]' );
        const eventsListExists = aside.children( 'ul.events-list' ).find( 'li' ).get( 0 );

        try {
            aside.children( 'ul.events-list' ).remove();
        } catch ( e ) {}

        if ( html ) {
            aside.append( $( html ) );
            const newEventsListExists = $( html ).find( 'li' ).get( 0 );
            if ( this.Options.use_sound && newEventsListExists && !eventsListExists ) {
                this.Sound.play();
            }
        }
    }

    switchTopPanel() {
        const topPanel = $( 'div.tmservices-panel[role="tm_panel"]' );

        if ( this.Options.hide_top_panel ) {
            topPanel.hide();
        } else {
            topPanel.show();
        }
    }

    switchRightSidebar() {
        const mainPage = $( 'main.page' );

        if ( this.Options.hide_right_sidebar ) {
            $( 'div.dropdown__menu' ).css( {
                left: '-150px'
            } );
            mainPage.css( {
                marginRight: '0px'
            } );
        } else {
            $( 'div.dropdown__menu' ).css( {
                left: '0px'
            } );
            mainPage.css( {
                marginRight: '300px'
            } );
        }
    }

    callbackMessage( request, sender, callback ) {
        if ( request && request.cmd ) {
            switch ( request.cmd ) {
            case 'updateSidebar':
                this.updateSidebar( request.data );
                break;
            case 'options':
            default:
                this.Options = Object.assign( {}, this.Options, request.data || {} );

                if ( state.onQuestionPage && this.Options.check_answers ) {
                    this.addHighlight();
                } else {
                    this.removeHighlight();
                }

                this.Sound = new Audio( Device.runtime.getURL( this.Options.name_sound ) );
                this.switchTopPanel();
                this.switchRightSidebar();
                this.addKeyDownSendListener();
                this.addKeyDownIndentFormatListener();
                this.reStartTimer();
                break;
            }
        }
    }

    sendMessageToBackgroundScript( request ) {
        Device.runtime.sendMessage( request, {}, callbackMessage );
    }
}

window.Ext = new Extension();

Device.runtime.onMessage.addListener( callbackMessage );

window.Ext.sendMessageToBackgroundScript( {
    cmd: 'options'
} );

if ( state.onQuestionPage ) {
    $( document ).delegate( 'a[role="toggle_answer_comments"]', 'click', ( event ) => {
        if ( !event ) {
            const event = window.event;
        }

        const target = $( event.target ).closest( 'a[role="toggle_answer_comments"]' );
        const answerId = target.attr( 'id' ).replace( /[^\d]/g, '' ).replace( /([\d]+)/, 'answer_item_$1' );
        const isHidden = target.closest( 'footer' ).siblings( 'div.answer__comments' ).hasClass( 'hidden' );

        if ( isHidden ) {
            window.activeIDs.remove( answerId );
        } else {
            window.activeIDs.push( answerId );
        }
    } );
}
