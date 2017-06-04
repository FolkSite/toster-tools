import $ from 'jquery';

import {
    Device,
    getPage
} from './_modules/utils';

import QuestionParser from './_modules/parser';

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

const activeIDs = [];

const selectors = {
    textareaSelectorAll: 'textarea.textarea',
    preCodeSelectorAll: 'pre > code',
    highlightScriptId: '#highlightContentScript',
    QuestionCommentsRootSelector: 'ul[role="question_comments_list"]',
    SolutionsRootSelector: '#solutions > ul#solutions_list',
    AnswersRootSelector: '#answers > ul#answers_list',
    TagsListRootSelector: '#question_show ul.tags-list',
    FeedRootSelector: 'ul.content-list[role="content-list"]',
    commentsWrapper: 'ul.content-list_comments[role="answer_comments_list"]'
};

const state = {
    onQuestionPage: window.location.pathname.startsWith( '/q/' ),
    onFeedPage: window.location.pathname === '' || window.location.pathname === '/' || window.location.pathname.startsWith( '/my/feed' ),
    onAllQuestionsPage: window.location.pathname.startsWith( '/questions' ),
    onTagQuestionsPage: window.location.pathname.startsWith( '/tag/' ) && /\/?_?questions_?/g.test( window.location.pathname )
};

const callbackMessage = ( ...args ) => {
    window.Ext.callbackMessage( ...args );
};

const commentsShowHideHandler = function ( event ) {
    const target = $( event.target ).closest( 'a[role="toggle_answer_comments"]' );
    const answerId = target.attr( 'id' ).replace( /[^\d]/g, '' ).replace( /([\d]+)/, 'answer_item_$1' );
    const isHidden = target.closest( 'footer' ).siblings( 'div.answer__comments' ).hasClass( 'hidden' );

    if ( isHidden ) {
        activeIDs.remove( answerId );
    } else {
        activeIDs.push( answerId );
    }
};

const ctrlEnterHandler = function ( event ) {
    const form = $( event.target.form );
    const button = $( 'button[type="submit"]', form );
    if ( ( event.ctrlKey || event.metaKey ) && ( event.keyCode === 13 || event.keyCode === 10 ) ) {
        button.click();
    }
};

const mentionLinkClickHandler = function ( event ) {
    event.preventDefault();
    const form = $( this ).closest( selectors.commentsWrapper ).find( 'form' );
    const textarea = form.find( 'textarea' );
    const username = $( this ).data( 'username' );
    let value = textarea.val();
    textarea.val( `${value}@${username}: ` );
    textarea.trigger( 'input' );
    textarea.focus();
    value = null;
    return false;
};

if ( window.location.hash.startsWith( '#comment_' ) ) {
    const comment = $( window.location.hash ).closest( 'li[role^="answer_item"]' );
    activeIDs.push( $( comment ).attr( 'id' ) );
}

if ( state.onQuestionPage ) {
    $( document ).on( 'click', 'a[role="toggle_answer_comments"]', commentsShowHideHandler );
}

const Parser = new QuestionParser( selectors );

class Extension {
    constructor( ...args ) {
        const defaults = Object.freeze( {
            check_answers: false,
            check_feed: true,
            interval_answers: 10,
            interval_feed: 10,
            use_sound: true,
            sound_notify: 'sound/sound1.ogg',
            sound_answers: 'sound/sound2.ogg',
            sound_feed: 'sound/sound3.ogg',
            use_kbd: true,
            hide_top_panel: false,
            hide_right_sidebar: false,
            monospace_textarea: false,
            monospace_code: false,
            feed_border_color: '#8c9480',
            use_sign: false,
            sign_string: '',
        } );
        this.Options = Object.assign( {}, defaults );
        this.timers = {
            feedTimer: false,
            pageTimer: false
        };
        this.OldTitle = $( document ).prop( 'title' );
        this.loadSounds();
    }

    loadSounds() {
        this.notifySound = new Audio( Device.runtime.getURL( this.Options.sound_notify ) );
        this.answersSound = new Audio( Device.runtime.getURL( this.Options.sound_answers ) );
        this.feedSound = new Audio( Device.runtime.getURL( this.Options.sound_feed ) );
    }

    stopTimer( name ) {
        clearInterval( this.timers[ name ] );
        window.promise = null;
    }

    startTimer( name ) {
        switch ( name ) {
        case 'pageTimer':
            if ( this.Options.interval_answers > 0 ) {
                this.timers[ name ] = setInterval( () => {
                    if ( state.onQuestionPage && this.Options.check_answers ) {
                        this.updatePage();
                    }
                }, this.Options.interval_answers * 1000 );
            }
            break;
        case 'feedTimer':
            if ( this.Options.interval_feed > 0 ) {
                this.timers[ name ] = setInterval( () => {
                    if ( ( state.onFeedPage || state.onAllQuestionsPage || state.onTagQuestionsPage ) && this.Options.check_feed ) {
                        this.updateFeed();
                    }
                }, this.Options.interval_feed * 1000 );
            }
            break;
        default:
            break;
        }
    }

    reStartTimer( name ) {
        this.stopTimer( name );
        this.startTimer( name );
    }

    addHighlight() {
        const id = selectors.highlightScriptId;
        if ( $( `${id}` ).get( 0 ) ) return;
        $( '<script/>', {
            src: Device.runtime.getURL( 'js/highlight.js' ),
            id: id.replace( /#/g, '' ),
            async: true
        } ).appendTo( 'body' );
    }

    removeHighlight() {
        try {
            const id = selectors.highlightScriptId;
            $( `${id}` ).remove();
        } catch ( e ) {}
    }

    updateQuestionComments( body ) {
        const newQuestionComments = Parser.getQuestionComments( body );
        const QuestionCommentsRoot = $( document ).find( selectors.QuestionCommentsRootSelector );
        let comment;
        let li;

        QuestionCommentsRoot.find( 'li' ).remove( 'li[role*="comments_item"]' );

        for ( let i = 0; i < newQuestionComments.length; i++ ) {
            comment = newQuestionComments[ i ];
            li = $( '<li/>', {
                class: 'content-list__item',
                role: 'comments_item'
            } );
            $( li ).html( comment.content );
            $( li ).insertBefore( $( QuestionCommentsRoot.find( 'li.content-list__item' ).last() ) );
        }

        comment = null;
        li = null;
        body = null;
    }

    updateSolutions( body ) {
        const localSolutions = Parser.getSolutions( document );
        const Solutions = Parser.getSolutions( body );
        const SolutionsRoot = $( document ).find( selectors.SolutionsRootSelector );
        let solutionsDeleteArray = [];
        let solution;
        let exists;

        if ( Solutions.length < localSolutions.length ) {
            solutionsDeleteArray = localSolutions.filter( item => !Solutions.find( search => search.id === item.id ) );
        }

        $( '#solutions span[role="answers_counter"]' ).text( ( localSolutions.length - solutionsDeleteArray.length ) );

        for ( let i = 0; i < solutionsDeleteArray.length; i++ ) {
            const _id = $( solutionsDeleteArray[ i ] ).attr( 'id' );
            $( SolutionsRoot ).find( 'li' ).remove( `#${_id}` );
        }

        for ( let i = 0; i < Solutions.length; i++ ) {
            solution = $( Solutions[ i ] );
            const currentId = $( solution ).attr( 'id' );
            exists = $( SolutionsRoot ).find( `li#${currentId}` ).get( 0 );
            if ( !activeIDs.includes( currentId ) ) {
                if ( exists ) {
                    let isEdition = $( exists ).find( 'div.answer-form_edit[role*="edit_answer_form"]' ).get( 0 );
                    if ( !isEdition ) {
                        $( exists ).html( $( solution ).html() );
                    }
                    isEdition = null;
                } else {
                    $( SolutionsRoot ).append( $( solution ) );
                }
            }
        }

        solutionsDeleteArray = null;
        solution = null;
        exists = null;
        body = null;
    }

    updateAnswers( body ) {
        const localAnswers = Parser.getAnswers( document );
        const Answers = Parser.getAnswers( body );
        const AnswersRoot = $( document ).find( selectors.AnswersRootSelector );
        let answersDeleteArray = [];
        let answer;
        let exists;

        if ( Answers.length < localAnswers.length ) {
            answersDeleteArray = localAnswers.filter( item => !Answers.find( search => search.id === item.id ) );
        }

        $( '#answers span[role="answers_counter"]' ).text( ( localAnswers.length - answersDeleteArray.length ) );

        for ( let i = 0; i < answersDeleteArray.length; i++ ) {
            const _id = $( answersDeleteArray[ i ] ).attr( 'id' );
            $( AnswersRoot ).find( 'li' ).remove( `#${_id}` );
        }

        for ( let i = 0; i < Answers.length; i++ ) {
            answer = $( Answers[ i ] );
            const currentId = $( answer ).attr( 'id' );
            exists = $( AnswersRoot ).find( `li#${currentId}` ).get( 0 );
            if ( !activeIDs.includes( currentId ) ) {
                if ( exists ) {
                    let isEdition = $( exists ).find( 'div.answer-form_edit[role*="edit_answer_form"]' ).get( 0 );
                    if ( !isEdition ) {
                        $( exists ).html( $( answer ).html() );
                    }
                    isEdition = null;
                } else {
                    $( AnswersRoot ).append( $( answer ) );
                    if ( this.Options.use_sound ) {
                        this.answersSound.play();
                    }
                }
            }
        }

        answersDeleteArray = null;
        answer = null;
        exists = null;
        body = null;
    }

    updatePage() {
        window.promise = getPage( window.location.href );
        window.promise.then( ( body ) => {
                this.updateQuestionComments( body );
                this.updateSolutions( body );
                this.updateAnswers( body );
                body = null;
                return Promise.resolve();
            } )
            .then( () => ( window.promise = null ) );
    }

    updateFeed() {
        window.promise = getPage( window.location.href );
        window.promise.then( ( body ) => {
                const Questions = Parser.getFeed( body );
                const FeedRoot = $( document ).find( selectors.FeedRootSelector );
                let question;
                let href;
                let exists;
                let parent;

                for ( let i = 0; i < Questions.length; i++ ) {
                    question = $( Questions[ i ] );
                    href = $( question ).find( 'a[itemprop="url"]' ).attr( 'href' );
                    exists = $( FeedRoot ).find( 'li' ).find( `a[href="${href}"]` ).get( 0 );

                    if ( exists ) {
                        parent = $( exists ).closest( 'li.content-list__item' ).get( 0 );
                        $( parent ).html( $( question ).html() );
                    } else {
                        $( question ).addClass( 'new-item' ).css( 'border', `1px solid ${this.Options.feed_border_color}` );
                        $( FeedRoot ).prepend( $( question ) );
                        $( FeedRoot ).find( ' li.new-item:first-child' ).fadeIn( 2000 );
                        // $( FeedRoot ).find( ' li.content-list__item:last-child' ).remove();
                        if ( this.Options.use_sound ) {
                            this.feedSound.play();
                        }
                    }
                }

                const count = $( FeedRoot ).find( ' li.new-item' ).length;

                if ( count > 0 ) {
                    $( document ).prop( 'title', `[${count}] - ${this.OldTitle}` );
                } else {
                    $( document ).prop( 'title', this.OldTitle );
                }

                question = null;
                href = null;
                exists = null;
                parent = null;
                body = null;
                return Promise.resolve();
            } )
            .then( () => ( window.promise = null ) );
    }

    addSignToSubmitListener() {
        if ( state.onQuestionPage ) {
            try {
                $( '#bindFirst' ).remove();
            } catch ( e ) {}

            $( '<script/>', {
                src: Device.runtime.getURL( 'js/bind.js' ),
                id: 'bindFirst',
                'data-use': this.Options.use_sign,
                'data-string': this.Options.sign_string
            } ).appendTo( 'body' );
        }
    }

    addKeyDownSendListener() {
        if ( this.Options.use_kbd ) {
            $( document ).off( 'keydown', selectors.textareaSelectorAll, ctrlEnterHandler );
            $( document ).on( 'keydown', selectors.textareaSelectorAll, ctrlEnterHandler );
        } else {
            $( document ).off( 'keydown', selectors.textareaSelectorAll, ctrlEnterHandler );
        }
    }

    addMentionLinkClickListener() {
        $( document ).off( 'click', 'a[role="comment_mention_link"]', mentionLinkClickHandler );
        $( document ).on( 'click', 'a[role="comment_mention_link"]', mentionLinkClickHandler );
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
                this.notifySound.play();
            }
        }

        html = null;
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

    switchMonoSpaceFont() {
        const textarea = $( selectors.textareaSelectorAll );
        const preCode = $( selectors.preCodeSelectorAll );

        if ( this.Options.monospace_textarea ) {
            textarea.addClass( 'monospace' );
        } else {
            textarea.removeClass( 'monospace' );
        }

        if ( this.Options.monospace_code ) {
            preCode.addClass( 'monospace' );
        } else {
            preCode.removeClass( 'monospace' );
        }
    }

    callbackMessage( request, sender, callback ) {
        if ( request && request.cmd ) {
            const timersKeys = Object.keys( this.timers );
            switch ( request.cmd ) {
            case 'updateSidebar':
                this.updateSidebar( request.data );
                break;
            case 'options':
                this.Options = Object.assign( {}, this.Options, request.data || {} );

                if ( state.onQuestionPage && this.Options.check_answers ) {
                    this.addHighlight();
                    this.addMentionLinkClickListener();
                } else {
                    this.removeHighlight();
                }

                this.loadSounds();
                this.switchTopPanel();
                this.switchRightSidebar();
                this.switchMonoSpaceFont();
                this.addKeyDownSendListener();
                this.addSignToSubmitListener();

                for ( let i = 0, len = timersKeys.length; i < len; i++ ) {
                    this.reStartTimer( timersKeys[ i ] );
                }
                break;
            default:
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
