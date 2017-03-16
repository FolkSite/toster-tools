// background.js

const Options = {
	default: {
		hidden: false
	},

	get data() {
		let _ = localStorage[ "options" ];
		if ( !!_ ) {
			return JSON.parse( _ );
		}

		_ = JSON.stringify( Options.default );
		localStorage[ "options" ] = _;
		return JSON.parse( _ );
	},

	set data( options ) {
		let _ = JSON.stringify( options );
		localStorage[ "options" ] = _;
	}
};