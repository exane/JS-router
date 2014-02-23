js_router
=========

Syntax:

Construct: 
    new Router( [optional] string viewSelector );<br>
    if no parameter are given, default would be "body" as standard selector.
    
Methodes:<br>
    .when( string routeUrl, string templateUrl )<br>
    .otherwise( string templateUrl )<br>
    
    
example:<br>
    var route = new Router("#view");<br>
    route.when("home", "template/home.html")<br>
         .when("news", "template/news.html")<br>
         .when("about", "template/about.html")<br>
         .when("test", "template/test.html")<br>
         .otherwise("template/404.html");<br>
