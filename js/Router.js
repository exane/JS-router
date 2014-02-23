var Router = (function(){

    var Router = function(viewSelector){
        this._resolved = false;
        this._route = {
            routeUrl: [],
            templateUrl: [],
            otherwise: ""
        };
        this._cache = {};
        this._view = viewSelector || "#view";

        this.init();
    };
    var r = Router.prototype;

    r.init = function(){
        $(window).on("hashchange", {ctx: this}, r.onHashChange)
    };

    r.filterUrl = function(hashUrl, isTrimmed){
        var str;

        if(typeof isTrimmed == "undefined")
            isTrimmed = false;
        if(typeof hashUrl == "undefined")
            str = this.trimHashUrl(this.getHash());
        else if(isTrimmed)
            str = hashUrl;
        else
            str = this.trimHashUrl(hashUrl);

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

        this._route.routeUrl[this._route.routeUrl.length] = routeUrl;
        this._route.templateUrl[this._route.templateUrl.length] = templateUrl;

        if(route != urlRoute) return this;

        this.loadTemplate(routeUrl, templateUrl);
        this._resolved = true;

        return this;
    };

    r.otherwise = function(template){
        this._route.otherwise = template;
        if(this._resolved){
            this._resolved = false;
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

        for(var i = 0; i < this._route.routeUrl.length; i++) {
            if(url != this._route.routeUrl[i]) continue;

            var template = this._route.templateUrl[i];
            this.loadTemplate(url, template);

            return 0;
        }

        var template = this._route.otherwise;
        this.loadTemplate(url, template);

        return 1;

    };

    r.storeCache = function(name, data){

        this._cache[name] = data;
    };

    r.loadCache = function(name){
        return this._cache[name];
    };

    r.isCached = function(name){
        return this._cache[name];
    };

    r.loadTemplate = function(name, template){
        var that = this;
        $.ajax({
            url: template,
            type: "GET",
            dataType: "html",
            beforeSend: function(){
                if(that.isCached(name)){
                    $(that._view + " *").remove();
                    $(that._view).append(that.loadCache(name));
                    return false;
                }
                return true;
            },
            success: function(data){
                that.storeCache(name, data);
                $(that._view + " *").remove();
                $(that._view).append(data);
            }
        });
    };

    r.copyArray = function(arr){
        var res = [];

        for(var i = 0; i < arr.length; i++)
            res[i] = arr[i];

        return res;
    };


    return Router;

})();
