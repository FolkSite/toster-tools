function $( selector, parent ) {
    return ( parent || document ).querySelector( selector );
}

function $$( selector, parent ) {
    return ( parent || document ).querySelectorAll( selector );
}

function createElement( str, parent ) {
    let elem = ( parent || document ).createElement( 'div' );
    elem.innerHTML = str;
    if ( elem.childNodes.length > 0 ) {
        return elem.childNodes[ 0 ];
    }
    return elem;
}


module.exports.$ = $;
module.exports.$$ = $$;
module.exports.createElement = createElement;