/*
    author: Vinicius Ramos
    date: 27/08/2014

    This function calls the web service hosted at www.coffito.org.br
    to perform law search at the website.

    It passes the search parameter to the web service and processes the results returned.

    It creates an hyperlink for each page found.

 */

/*
	Evitando que o formulário seja submetido quando o usuário clicar no botão enter"
 */
$(document).ready(function() {
  $(window).keydown(function(event){
    if( (event.keyCode == 13)) {
      event.preventDefault();
      return false;
    }
  });
});

var executaBusca = function() {
    var paramValue = $('#campo_search').val();
    var jsonParam = {"param":""+paramValue+""};
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: $('#form_search').attr('action'),
        data: jsonParam,
        dataType: "jsonp",
        jsonp: 'callback',
        success: function(data) {
            $("#results").html("");
            $.each(data.articles, function(key, value) {
                $("#results").append("<li><a href='#'>"+value.title+"</a><li><br />");
            });
        },
        error: function (request, textStatus, errorThrown) {
            console.log("Response Text: [" + errorThrown + "]");
        }
    });
}