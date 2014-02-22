$(window).ready(function(){
    var route = new Router();

    route.when("home", "template/home.html")
        .when("news", "template/news.html")
        .when("about", "template/about.html")
        .when("test", "template/test.html")
        .otherwise("template/404.html");
})();
