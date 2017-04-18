if ( window.location.pathname.startsWith( '/q/' ) ) {
    const listeners = [];
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    let observer;

    const checkSelector = ( selector, fn ) => {
        const elements = document.querySelectorAll( selector );
        for ( let i = 0; i < elements.length; i++ ) {
            const element = elements[ i ];
            if ( !element.ready ) {
                element.ready = true;
                fn( element );
            }
        }
    };

    const checkListeners = () => {
        for ( let i = 0; i < listeners.length; i++ ) {
            const listener = listeners[ i ];
            checkSelector( listener.selector, listener.fn );
        }
    };

    const ready = ( selector, fn ) => {
        listeners.push( {
            selector: selector,
            fn: fn
        } );
        if ( !observer ) {
            observer = new MutationObserver( checkListeners );
            observer.observe( document.documentElement, {
                childList: true,
                subtree: true
            } );
        }
        checkSelector( selector, fn );
    };

    ready( '#question_show code', ( element ) => {
        if ( window.hljs ) {
            window.hljs.highlightBlock( element );
        }
    } );
}
