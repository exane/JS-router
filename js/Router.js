var Router = (function(){

    var Router = function(){
        this.resolved = false;
        this.route = {
            routeUrl: [],
            templateUrl: [],
            otherwise: ""
        };


        this.init();
    };
    var r = Router.prototype;

    r.init = function(){
        localStorage.clear();
        $(window).on("hashchange", {ctx: this},r.onHashChange)
    };

    r.filterUrl = function(hashUrl, isTrimmed){
        if(typeof isTrimmed == "undefined") isTrimmed = false;

        if(typeof hashUrl == "undefined")
            var str = this.trimHashUrl(this.getHash());
        else if(isTrimmed)
            var str = hashUrl;
        else
            var str = this.trimHashUrl(hashUrl);

        var result = [];
        var a = 0;
        for(var i = 0; i < str.length; i++) {
            if(str[i] == "/" || i + 1 == str.length){

                if(str[i] == "/")
                    result[result.length] = str.slice(a, i);
                else
                    result[result.length] = str.slice(a, i + 1);
                a = i + 1;
            }
        }

        return result;
    };

    r.getHash = function(){
        return window.location.hash;
    };

    r.trimHashUrl = function(hashUrl){
        return hashUrl.substring(2);
    };

    r.getRoute = function(){
        return this.filterUrl();
    };

    r.when = function(routeUrl, templateUrl){
        var route = this.filterUrl(routeUrl, true);
        var urlRoute = this.trimHashUrl(this.getHash());

        this.route.routeUrl[this.route.routeUrl.length] = routeUrl;
        this.route.templateUrl[this.route.templateUrl.length] = templateUrl;

        if(route != urlRoute) return this;

        this.loadTemplate(routeUrl, templateUrl);
        this.resolved = true;

        return this;
    };

    r.otherwise = function(template){
        this.route.otherwise = template;
        if(this.resolved){
            this.resolved = false;
            return 0;
        }

        this.loadTemplate("otherwise", template);
        return 1;
    };

    r.onHashChange = function(obj){
        var that = obj.data.ctx;
        that.refreshView();
    };

    r.refreshView = function(){
        var that = this;
        var url = this.getRoute();

        for(var i=0; i<this.route.routeUrl.length; i++){
            if(url != this.route.routeUrl[i]) continue;

            var template = this.route.templateUrl[i];
            this.loadTemplate(url, template);

            return 0;
        }

        var template = this.route.otherwise;
        this.loadTemplate(url, template);

        return 1;

    };

    r.storeCache = function(name, data){
        localStorage[name] = data;
    };

    r.loadCache = function(name){
        return localStorage[name];
    };

    r.isCached = function(name){
        return localStorage[name];
    };

    r.loadTemplate = function(name, template){
        var that = this;
        $.ajax({
            url: template,
            dataType: "text",
            beforeSend: function(){
                if(that.isCached(name)) {
                    $("#view *").remove();
                    $("#view").append(that.loadCache(name));
                    return false;
                }
                return true;
            },
            success: function(data){
                that.storeCache(name, data);
                $("#view *").remove();
                $("#view").append(data);
            }
        });
    };

    r.copyArray = function(arr){
        var res = [];

        for(var i=0; i<arr.length; i++)
            res[i] = arr[i];

        return res;
    };


    return Router;

})();
