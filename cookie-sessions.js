var crypto = require( 'crypto' ),
    utils  = new function() {
        this.enc = function( msg, salt ){
            var cipher  = crypto.createCipher( 'aes-256-cbc', salt );
            var crypted = cipher.update( toText( msg ), 'utf8', 'hex' );
                crypted+= cipher.final( 'hex' );
            return crypted;
        };
        this.dec = function( enc, salt ) {
            var decipher = crypto.createDecipher( 'aes-256-cbc', salt );
            var dec      = decipher.update( enc, 'hex', 'utf8' );
            dec         += decipher.final( 'utf8' );
            return toNative( dec );
        }
        var toText = function( msg ) {
            try { msg = JSON.stringify( msg ) } catch( e ) {}
            return msg;
        };
        var toNative = function( msg ) {
            try { msg = JSON.parse( msg ) } catch( e ) {}
            return msg;
        };
    };



module.exports = function( name, expiry, salt ) {
    expiry = expiry || 900000;
    salt   = salt   || 'lame salt';
    
    return function(req, res, next) {
        req.session = req.cookies[name] || {};
        if( typeof req.session == "string" ) req.session = utils.dec( req.session, salt );
        
        res.on('header', function(){
            res.cookie(name, utils.enc( req.session, salt ), { expires: new Date(Date.now() + expiry ) } );
        });
        next();
    }
}