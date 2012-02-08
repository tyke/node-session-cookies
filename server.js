var express = require( 'express' ),
    cookie  = require( './cookie-sessions' ),
    server  = express.createServer();

server.use( express.bodyParser() );
server.use( express.cookieParser() );
server.use( express.methodOverride() );
server.use( cookie( 'sid', 2592000000, 'partysalt' ) );

//start the server up
server.listen( 8080 );