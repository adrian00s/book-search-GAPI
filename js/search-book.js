let $input = $('#inputSearch');
let $submit = $('#searchBtn');
let getContent = document.getElementById('content');

$submit.on('click', request);

function request(e, maxResults, startIndex){
    startIndex = 0;
    maxResults = 5;

    let q = $input.val();

    $.get(
        `https://www.googleapis.com/books/v1/volumes?q=${q}`,{
            q: q,
            key: "AIzaSyADF0uyRcMqM9biNqbEg6Dd-wBejPwixPg",
            startIndex: startIndex,
            maxResults: maxResults,
            filter: 'paid-ebooks' 
        },
    ).done(function(data){
        let results = maxResults;
        let index = startIndex;

        drawContent(data);

        console.log("Returned " + data.totalItems);

        if (startIndex === 0) $('#prev').css('display','none');

        // Pass next index to 'next' button
        $('#next').on('click', function(){
            if(data.totalItems > results){
                var newIndex = index += results;
                nextPrevPage(newIndex, results);

                $('body, html').animate({
                    'scrollTop': 0
                }, 750);
            }
        });

    }).fail(function(){
        getContent.style.display = 'block';
        getContent.innerHTML = '<h5 style=color:red>There\'s something wrong with your request. Try again</h5>';
    });

    e.preventDefault();
}

function drawContent(data){
        let q = $input.val();
        
        getContent.innerHTML = '';
        getContent.style.display = 'block';

        $('main').css('margin-bottom','60px');

        if(data.items === undefined){
            getContent.innerHTML = `<h5 style=color:red>There are no results for your query: "${q}". Try something else</h5>`;
            $('main').css('margin-bottom','436.5px');
        }else{
            for([key, value] of Object.entries(data.items)){

                let config;
                let authorsExists = (value.volumeInfo.authors === undefined) ? value.volumeInfo.authors=['No author'] : value.volumeInfo.authors;
                let  checkAuthor =  (value.volumeInfo.authors.length > 1) ? 'Authors: ' : 'Author: ' ;
                checkAuthor += (value.volumeInfo.authors === undefined) ? " " : " ";

                let checkPrice = (value.saleInfo.retailPrice === undefined) ? value.saleInfo.retailPrice='Not specified': value.saleInfo.retailPrice;
                
                // format authors
                    for(let i = 0; i <authorsExists.length; i++ ){
                        config = {
                            maxChars: 15,
                            checkChars: function(){
                                let returnValue;
                                if(authorsExists[i].length >=this.maxChars){
                                    let separate = authorsExists[0].substring(authorsExists[0].length-3,authorsExists[0].length);
                                    // change text
                                    returnValue = authorsExists[0].replace(separate, "...");
                                }else{
                                    returnValue = authorsExists[0];     
                                }
                                return returnValue;
                            }
                        }
                    }
       
                let store = (value.volumeInfo.description !== undefined) ? value.volumeInfo.description : 'This book has no description';
                let category = (value.volumeInfo.categories !== undefined) ?  value.volumeInfo.categories : 'No category';
                
                value.saleInfo.retailPrice.currencyCode = " EUR";

                getContent.innerHTML += '';
                getContent.innerHTML += `
                <div class="row mb-3 border-bottom items">
                    <div class="col-md-3 col-lg-2 d-flex justify-content-center">
                            <img class="border rounded mb-3" src="${value.volumeInfo.imageLinks.thumbnail}" alt="${value.volumeInfo.title}">
                    </div>
                    <div class="col-md-9 pl-0 pr-0">
                            <p class="d-block d-md-none text-center">${value.volumeInfo.title}</p>
                            <h5 class="d-none d-md-block">${value.volumeInfo.title}</h5>
                            
                            <div class="container d-block d-md-none text-center">
                                <span class="badge badge-pill d-md-block badge-primary p-2 mb-2">${value.saleInfo.retailPrice.amount + value.saleInfo.retailPrice.currencyCode || checkPrice}</span>
                                <p class="badge badge-pill badge-info d-md-block p-2">${checkAuthor} ${config.checkChars()}</p>
                            </div>
                            
                            <span class="badge badge-pill d-none d-md-inline badge-primary">${value.saleInfo.retailPrice.amount + value.saleInfo.retailPrice.currencyCode || checkPrice}</span></span>
                            <p class="badge badge-pill badge-info d-none d-md-inline">${checkAuthor} ${config.checkChars()}</p>
    
                        <div class=row>
                            <div class="col-md-12 mt-md-3 mt-2">
                                <p class="amount text-justify description">${store}</p>
                            </div>
                        </div>
    
                        <div class=row>
                            <div class="col-6 pr-0 col-md-3">
                                <p class="badge badge-pill badge-danger pt-2 mt-2">${category}</p>
                            </div>
                            
                            <div class="col-6 pl-0 col-md-9 text-right">
                                <a href="${value.volumeInfo.canonicalVolumeLink}" target=blank type="button" class="btn btn-outline-success btn-rounded waves-effect btn-sm">
                                    <i class="mr-1 far fa-shopping-cart"></i> Store
                                </a>
                            </div>
                            
                        </div>
                    </div>
                </div>`;
            }            
        }

        $('.items:last').after('<div id=btn-container class="container text-center"></di>');
        $('#btn-container').append(`
        <button id=prev class="btn btn-outline-warning waves-effect btn-md">PREV <i class="far fa-arrow-left"></i></button>
        <button id=next class="btn btn-outline-success waves-effect btn-md">NEXT <i class="far fa-arrow-right"></i></button>`);          
}

function nextPrevPage(newIndex, maxResults){
    let q = $input.val();

    let getIndex = newIndex;
    let getMaxResults = maxResults;

    $.get(
        `https://www.googleapis.com/books/v1/volumes?q=${q}`,{
            q: q,
            key: "AIzaSyADF0uyRcMqM9biNqbEg6Dd-wBejPwixPg",
            startIndex: newIndex,
            maxResults: maxResults,
            filter: 'paid-ebooks' 
        },
    ).done(function(data){
        drawContent(data);

        if(newIndex === 0) $('#prev').css('display', 'none');

        $('#next').on('click', function(){
            if(data.totalItems > getMaxResults){
                var newIndex = getIndex += getMaxResults;
                nextPrevPage(newIndex, getMaxResults);
            }

            $('body, html').animate({
                'scrollTop': 0
            }, 750);
        });
        
        // add listener here so prev can be identified every time a new request is made
        $('#prev').on('click', function(){
            if(data.totalItems > getMaxResults){
                var newIndex = getIndex -= getMaxResults;
                nextPrevPage(newIndex, getMaxResults);
            }

            $('body, html').animate({
                'scrollTop': 0
            }, 750);
         }); 

    }).fail(function(){
        getContent.style.display = 'block';
        getContent.innerHTML = '<h5 style=color:red>There\'s something wrong with your request. Try again</h5>';
    });
}