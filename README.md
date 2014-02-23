js_router
=========

Syntax:

Construct: 
    new Router( [optional] string viewSelector );
    if no parameter are given, default would be "body" as standard selector.
    
Methodes:
    .when( string routeUrl, string templateUrl )
    .otherwise( string templateUrl )
    
    
example:
    var route = new Router("#view");
    route.when("home", "template/home.html")
         .when("news", "template/news.html")
         .when("about", "template/about.html")
         .when("test", "template/test.html")
         .otherwise("template/404.html");
