function StaticFileDispatcher(req, res) {
    this.request = req;
    this.response = res;
    this.types = ['css', 'js', 'html', 'jpg'];   
    this.getType = function() {
        var self = this;
        if(self.request.url === null || self.request.url === '') return null;  
        for(var i=0; i<self.types.length; i++) {
            if((self.request.url).endsWith(self.types[i])) {
                return self.types[i];
            } 
        } 
        return null;
    }; 
    this.requiresDispatch = function() {  
        var self = this;    
        var requestUrl = this.request.url;      
        if(requestUrl === null || requestUrl === '') return false;  
        for(var i=0; i<self.types.length; i++) {
            if(requestUrl.endsWith(self.types[i])) {
                return true;
            } 
        }          
        return false;
    };
    this.getContentType = function() {
        var type = this.getType();
        var contentType;
        switch(type) {
            case 'css':
                contentType = 'text/css';
                break;
            case 'js':
                contentType = 'text/js';
                break;
            case 'html':
                contentType = 'text/html';
                break;
            case 'jpg':
                contentType = 'image/jpeg';
                break;
            default:
                contentType = 'text/plain';
        }
        return contentType;        
    };
}



//server config & dispatcher
http.createServer(function(req, res) {
    //var requestUrl = req.url; 
    var staticFile = new StaticFileDispatcher(req, res);
    console.log(staticFile.requiresDispatch());  
    if(staticFile.requiresDispatch()) {
        console.log(staticFile.getContentType());
        console.log(req.url);
        res.writeHead(200, {'Content-Type': staticFile.getContentType()});
        var info;
        if(staticFile.getType() === 'html') {
            info = fs.readFileSync(__dirname + '/public' + req.url);
        } else {
            info = fs.readFileSync(__dirname + '/public' + req.url, 'utf8');
        }
        res.end(info, 'binary'); 
    }
}).listen(port, "127.0.0.1");
console.log('server running at http://127.0.0.1:' + port);
