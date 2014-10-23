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
    $("#content-container").css("display", "none");
    $("#results-container").css("display", "none");

    $(window).keydown(function(event){
    if( (event.keyCode == 13)) {
      event.preventDefault();
      return false;
    }
    });
});

var networkActive = function() {
    var networkState = navigator.connection.type;

    if(networkState == Connection.NONE || networkState == Connection.UNKNOWN) {
        return false;
    }

    return true;
}

var  backButtonDown = function() {
    /**
     * Quando a aplicação é iniciada ambos divs (#content-container e #results-container) estão com
     * display none. Logo que houve uma primeira pesquisa #results-container vai para inline content container none.
     * Se um conteúdo é acessado #results-container vai para none e #content-container para inline. Nesta hora,
     * se o usuário clicar no back button é para apenas esconder o conteúdo e mostrar results, caso contrário
     * a aplicação deve ser desligada.
     */
    if($("#results-container").css("display") == "none" && $("#content-container").css("display") == "inline") {
        $("#results-container").css("display", "inline");
    	$("#param_search").css("display", "inline");
    	$("#content-container").css("display", "none");
    	return;
    }
    navigator.app.exitApp();
}

var abrirURL = function(url) {
    window.open(url, '_blank', 'location=yes');
}

var formataTitulo = function(titulo) {
    if(titulo.length > 45) {
        titulo = titulo.substring(0, 44) + "...";
    }
    return titulo;
}

var executaBusca = function() {

    if(!networkActive()) {
        alert("Não há conexão de internet. Não será possível executar a busca até que haja conexão!");
        return;
    }

    var paramValue = $.trim($('#campo_search').val());

    if (paramValue == '' || paramValue.length < 3 ) {
        alert("O campo não pode ser vazio nem ter menos de 3 letras.")

        return;
    }
    var jsonParam = {"param":""+paramValue+""};

   $.blockUI({ message: '<h1>Buscando ...</h1>' });

   $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: $('#form_search').attr('action'),
        data: jsonParam,
        dataType: "jsonp",
        jsonp: 'callback',
        timeout: 30000,
        success: function(data) {
            $.unblockUI();
			if (data && data.articles) {
			    $("#param_search").css("display", "inline");
            	$("#content-container").css("display", "none");
				$("#results").html("");
				$("#content").html("");
				if(data.articles.length == 0) {
                    $("#results").append("<p style='text-align:center'>Nenhum resultado encontrado!</p>");
                    return;
                }
				$.each(data.articles, function(key, value) {
					$("#results").append("<li><a id='" + value.id+ "' href='#' onclick='getContent(this)'>"+formataTitulo(value.title)+"</a><li><br />");
				});
				$("ul.ui-listview").quickPagination({pagerLocation:"after", pageSize:"20"});
				$("ul.simplePagerNav li").each(function(index){
                    $(this).css({"padding":"20px", "font-size": "16pt"});
                });
				$("#results-container").css("display", "inline");
				$("#results").addClass("results");
			} // end if
		}, // end success
        error: function (request, textStatus, errorThrown) {
            if(textStatus=="timeout") {
                alert("A consulta está demorando além do tempo esperado. O servidor pode estar fora do ar, a comunicação com o servidor pode estar muito lenta ou sua conexão de dados pode não estar ativa. Tente novamente daqui a alguns instantes. Caso a situação persista, contate o administrador do site do COFFITO.");
            } else {
               alert("Erro: [" + errorThrown + "]");
            }
            $.unblockUI();
        } // end error
		
	}); // end ajax
}

var getContent = function(a) {
    var jsonParam = {"articleid":""+a.id+""};
	var serviceurl = "http://coffito2.hospedagemdesites.ws/site/webservices/vasculhalei/ws-vasculhalei-getcontent.php";
	$.blockUI({ message: '<h1>Buscando ...</h1>' });
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: serviceurl,
        data: jsonParam,
        dataType: "jsonp",
        jsonp: 'callback',
        timeout: 30000,
        success: function(data) {
            $.unblockUI();
            $("#results-container").css("display", "none");
			$("#param_search").css("display", "none");
			$("#content-container").css("display", "inline");
			$("#content").html("");	
            $("#content").append(data.content);
            $("#content a").each(function(){
                var url = $(this).attr('href');
                $(this).on('click', function() {
                    abrirURL(url);
                });
                $(this).attr('href', '#');
            });
        },
        error: function (request, textStatus, errorThrown) {
            if(textStatus=="timeout") {
                alert("A consulta está demorando além do tempo esperado. O servidor pode estar fora do ar, a comunicação com o servidor pode estar muito lenta ou sua conexão de dados pode não estar ativa. Tente novamente daqui a alguns instantes. Caso a situação persista, contate o administrador do site do COFFITO.");
            } else {
                alert("Erro: [" + errorThrown + "]");
            }
            $.unblockUI();
         } // end error
    });
}

var getBack = function() {
	$("#content-container").css("display", "none");
	$("#results-container").css("display", "inline");
	$("#param_search").css("display", "inline");	
}