export const createElement = ( str, parent ) => {
    const elem = ( parent || document ).createElement( 'div' );
    elem.innerHTML = str;
    if ( elem.childNodes.length > 0 ) {
        return elem.childNodes[ 0 ];
    }
    return elem;
};

export const isChrome = ( window.chrome && /chrome\//i.test( window.navigator.userAgent ) );

export const isOpera = ( ( ( window.opr && window.opr.addons ) || window.opera ) || /opr\//i.test( window.navigator.userAgent ) );

export const isFirefox = ( ( typeof InstallTrigger !== 'undefined' ) || /firefox/i.test( window.navigator.userAgent ) );

export const Device = ( () => {
    if ( typeof browser === 'undefined' ) {
        return chrome;
    }
    return browser;
} )();

export const _l = ( msg, placeholders ) => {
    if ( Array.isArray( placeholders ) ) {
        return Device.i18n.getMessage( msg, placeholders );
    }
    return Device.i18n.getMessage( msg );
};

export const openWin = url => window.open( url, 'wName' );


const status = ( response ) => {
    if ( response.status >= 200 && response.status < 300 ) {
        return Promise.resolve( response );
    }
    return Promise.reject( new Error( response.statusText ) );
};

const body = response => response.text();

export const getPage = ( url, method = 'GET' ) => {
    const headers = new Headers();
    const config = {
        method: method,
        headers: headers,
        credentials: 'include',
        cache: 'no-store',
        client: 'no-window'
    };
    let f = fetch( url, config ).then( status ).then( body ).catch( console.error );
    setTimeout( function () {
        f = null;
    }, 500 );
    return f;
};
