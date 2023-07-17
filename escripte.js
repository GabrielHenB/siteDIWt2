
const BASE_IMAGENS = 'https://image.tmdb.org/t/p/w500';
const ENDPOINT_BASE = 'https://api.themoviedb.org/3';
const API_KEY = '#'; //placeholder


function VerificaTamanho(textao){
    //FUNCAO PARA CORTAR TEXTOS GRANDES.
    if(textao.length > 204){
        textao = textao.substring(0,204) + '...';
        
    }
    return textao;
}





//FAZ REQUISIÇÃO AJAX E CARREGA O HTML DOS NOVOS FILMES DO EM DESTAQUE
function MostraFilmesEmDestaque(limitar){
    //REQUISICAO AJAX:
    //usando jquery
    $.ajax({
        url: ENDPOINT_BASE + '/tv/top_rated',
        data: {
            api_key: API_KEY,
            language: 'pt-BR'
        }
        /* CASO FOSSE POST. PARA GET NAO PRECISA.
        method: 'POST',
        data: {
            //dados sendo passados
        } */
    }).done(function (data){
        //Executa quando os dados chegam. O data já e o JSON retornado pelo GET anterior.
        let codigo_html = '';
        let adendo = '';
        let textado = '';
        let adicionados = 0;

        //REMONTAR HTML
        for(i = 0; i < data.results.length; i++){
            //o que alterar no codigo html

            for(j = 0; j < data.results[i].genre_ids.length; j++){
                

                if(data.results[i].genre_ids[j] == 16 && adicionados < limitar+1){
                    textado = VerificaTamanho(data.results[i].overview); //limita o tamanho do texto sinopse.
                    adendo = 'https://image.tmdb.org/t/p/w500'+data.results[i].poster_path;
                    codigo_html += `
                    <div class="col-12 col-sm-12 col-md-6 col-lg-3 card-destaques">
                            <div class="row">
                                <div class="card-destaques-cor">
                                    <div class="col-12 card-destaques-thumb">
                                        <img src="${adendo}" alt="thumb"/>
                                    </div>
                                
                                
                                    <div class="col-12 card-destaques-detalhes">
                                        <h5>${data.results[i].name}</h5>
                                        <p><strong>Data de Lançamento: </strong> ${data.results[i].first_air_date}</p>
                                        <p><strong>Média de Avaliações: </strong> ${data.results[i].vote_average}</p>
                                        <p><strong>Sinopse: </strong> ${textado} </p>
                                        <a href="${'https://www.themoviedb.org/tv/' + data.results[i].id}">Leia mais no site</a>
                                    </div>
                                </div>
                            </div>

                    </div>
                    `; adicionados++;
                }
            }
            

        }

        //ALTERAR HTML
        $('#cartazesEmDestaque').html(codigo_html);
    }); 
}
//FIM DO EM DESTAQUE
//COMPLEMENTO DAS ANALISES
function CompletarAnalises(limitador){
    let adendoHTML = '';
    for( i = 0; i < limitador; i++){
        adendoHTML += `
        <div class="col-12 col-sm-12 col-md-12 col-lg-4 card_avaliacoes">
            <div class="row cartao">
                <div class="col-4 cartao-imagem">
                    <img src="t1imagens/reviewer4.png">
                </div>
                <div class="col-8 cartao-texto">
                    <h5>Replicael, o Clonado</h5>
                    <p><span class="negrito">Avaliação:</span>
                            O filme foi fantástico! Recomendaria pros meus amigos, vizinhos, colegas, sims do The Sims, IAs avançadas de Marte,
                            em resumo, todo mundo!
                    </p>
                    <p>
                        <img class="estrelas" src="t1imagens/rating-star-base.png">
                        <span class="data negrito">26/11/2020</span>
                    </p>
                                    
                </div>
            </div>
        </div>
        `;
    }
    $('#caixa-avaliacoes').append(adendoHTML);
}

function CarregarLancamentos(){

    $.ajax({
        url: ENDPOINT_BASE + '/movie/upcoming',
        data: {
            api_key: API_KEY,
            language: 'pt-BR'
        }
        
    }).done(function (data){
        let html_lancamentos = '';
        for(i = 0; i < data.results.length; i++){
            for(j = 0; j < data.results[i].genre_ids.length; j++){
                if(data.results[i].genre_ids[j] == 14){
                    html_lancamentos += `
                        <div class="col-12 col-sm-12 col-md-6 col-lg-2">
                            <div class="card-lancamentos">
                                <a href="${'https://www.themoviedb.org/movie/'+data.results[i].id}">
                                    <img style="width: 100%" src="${'https://image.tmdb.org/t/p/w500' + data.results[i].poster_path}"/>
                                </a>
                                <p>${data.results[i].original_title}</p>
                                <p>${data.results[i].release_date}</p>
                            </div>
                        </div>

                    `;
                }
            }
        }
        $('.lancamentos').html(html_lancamentos);
        $('.lancamentos').prepend(` <h1 class="titulo">Lançamentos: </h1>`);
        $('.lancamentos').append(` <span style="color: rgb(10,200,200)">Todos lançamentos obtidos foram carregados...</span>`);
    });
}

function Pesquisa(){
    let html_pesquisar = '';
    let textado = '';
    html_pesquisar = ` 
        <div class="row">
            <div class="col-12">
                <h1 class="titulo">Pesquisa: Resultados</h1>
            </div>
        </div>
        <div class="row resultados-pesquisa">
            
        </div>
    `;
    $('.lancamentos').html(html_pesquisar);
    
    busca =  $('#caixa-pesquisar').val(); 
    //REQUISICAO AJAX E ALTERACAO HTML
    $.ajax({
        url: ENDPOINT_BASE + '/search/tv',
        data: {
            api_key: API_KEY,
            language: 'pt-BR',
            query: busca
        }
        
    }).done( function(data){
        console.log('Pesquisa completada');
        
        html_pesquisar = '';
        for(i = 0; i < data.results.length; i++){
            for(j = 0; j < data.results[i].genre_ids.length; j++){
                //exibe apenas animações(site portal de animações).
                if(data.results[i].genre_ids[j] == 16){
                    textado = VerificaTamanho(data.results[i].overview);
                    html_pesquisar += ` 
                    <div class="col-12 col-sm-12 col-md-6 col-lg-4">
                        <div class="card-da-pesquisa">
                            <div class="row">
                                <div class="col-4 thumb-pesquisa">
                                    <img width="100%" src="${'https://image.tmdb.org/t/p/w500'+data.results[i].poster_path}" alt="thumb"/>
                                </div>
                                <div class="col-8 detalhes-pesquisa">
                                    <h5>${data.results[i].name}</h5>
                                    <p><strong>Data:</strong> ${data.results[i].first_air_date}</p>
                                    <p><strong>Tipo:</strong> Episódico(Anime)</p>
                                    <p><strong>Média de Avaliações:</strong> ${data.results[i].vote_average}</p>
                                    <p id="sinopse"><strong>Sinopse:</strong> ${textado}</p>
                                    <a href="${'https://www.themoviedb.org/tv/'+data.results[i].id}">Leia mais</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                }
            }
        }
        //ADICIONA AO HTML DO BOX PESQUISAR CRIADO ANTERIORMENTE NA FUNCAO
        $('.resultados-pesquisa').append(html_pesquisar);
        
    });
    //PARTE DA FUNCAO QUE PEGA OS FILMES
    $.ajax({
        url: ENDPOINT_BASE + '/search/movie',
        data: {
            api_key: API_KEY,
            language: 'pt-BR',
            query: busca
        }
        
    }).done(function(data){
        console.log('Pesquisa dos filmes completada');
        html_pesquisar = '';
        for(i = 0; i < data.results.length; i++){
            for(j = 0; j < data.results[i].genre_ids.length; j++){
                //exibe apenas filmes de animações(site portal de animações).
                if(data.results[i].genre_ids[j] == 14){
                    textado = VerificaTamanho(data.results[i].overview);
                    html_pesquisar += ` 
                    <div class="col-12 col-sm-12 col-md-6 col-lg-4">
                        <div class="card-da-pesquisa">
                            <div class="row">
                                <div class="col-4 thumb-pesquisa">
                                    <img width="100%" src="${'https://image.tmdb.org/t/p/w500'+data.results[i].poster_path}" alt="thumb"/>
                                </div>
                                <div class="col-8 detalhes-pesquisa">
                                    <h5>${data.results[i].title}</h5>
                                    <p><strong>Data:</strong> ${data.results[i].release_date}</p>
                                    <p><strong>Tipo:</strong> Filme</p>
                                    <p><strong>Média de Avaliações:</strong> ${data.results[i].vote_average}</p>
                                    <p id="sinopse"><strong>Sinopse:</strong> ${textado}</p>
                                    <a href="${'https://www.themoviedb.org/movie/'+data.results[i].id}">Leia mais</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                }
            }
        }
        $('.resultados-pesquisa').append(html_pesquisar);
    });
}

$(document).ready(function() {
    let limitador = 3; let limitador2 = 2;//limite de boxes carregados por chamada.
    //eventos pesquisa:
    $('#botao-pesquisar').click(function (){
        Pesquisa();
    });
    $('#form-pesquisar').submit(function (event){
        Pesquisa();
        event.preventDefault(); //previne que ele faça o submit e 'resete' a pagina html.
    });
    //eventos lancamentos:
    $('#botaoLancamentos').click(function (){
        CarregarLancamentos();
    });

    //em destaque
    MostraFilmesEmDestaque(limitador);
    $('#carregarMaisEmDestaque').click(function (){
        limitador = limitador + 3;
        console.log('Aumentou');
        MostraFilmesEmDestaque(limitador);
    });
    //ultimas avaliações
    $('#carregarMaisAvaliacoes').click(function (){
        if(limitador2 > 0){
            CompletarAnalises(limitador2);
            limitador2--;
        }
        else{
            alert('Não há mais avaliações para carregar!');
        }
    });
    //ultimas entrevistas
    $('#carregarMaisEntrevistas').click(function (){
        alert('Não há mais entrevistas para carregar!');
    });

    $('.badge').click(function (){
        alert('Desculpe! A função de tags por notícias ainda não foi implementada pelos nossos desenvolvedores preguiçosos!');
    });


});
