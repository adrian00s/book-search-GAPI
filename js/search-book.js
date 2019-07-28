let $input = $('#inputSearch');
let $submit = $('#searchBtn');

$submit.on('click', request);

function request(e){
    let q = $input.val();
    console.log('requested...');

    $.get(
        `https://www.googleapis.com/books/v1/volumes?q=${q}`,{
            q: q,
            key: "AIzaSyADF0uyRcMqM9biNqbEg6Dd-wBejPwixPg"
        },
    ).done(function(data){

        for([key, value] of Object.entries(data.items)){
            var getContent = document.getElementById('content');

            getContent.innerHTML += "Book: " + value.volumeInfo.title + '</br>';
        }
        console.log("requested successfully")
    }).fail(function(){
        console.log("theres something wrong with your request")
    });
    e.preventDefault();
}

