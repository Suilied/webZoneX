// this thing is used to reboot the webzone
const http = require('http');
const { execSync } = require('child_process');

let server = http.createServer( (req, res) => {
    if( req.method === "POST" ){
        console.log("POST");

        let body = '';
        req.on('data', (data) => {
            body += data;
            //console.log("Partial body:", body);
        });

        req.on('end', () => {
            console.log('FullBody:', body);
            // TODO: Check for relevant info in the body
            // Such as credentials, magic number or whatever
            // just so not everybody can reset the server for no reason
            
            // TODO: Run script under ./bin/deploy.sh
            const stdout = execSync('bash ./bin/deploy.sh');

            // Don't forget to give some feedback for the Post!
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('POST Received: '+stdout);
        });
    }
    else if( req.method === "GET" ) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end("API is Online!");
    }
}).listen('3100');