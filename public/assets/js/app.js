$(document).ready(function () {
    //wait 1 second after page load to display magazine
    var intro = setTimeout(function () {
        $('#scientificAmCard').fadeIn(4000);
    }, 1000);
    //button for scraping website
    $('#getScientificAmericanArticles').on('click', function () {
        $.get('/health-news', function (response) {
            response.forEach(function (elem, index) {
                var title = elem.title;
                var imgLink = elem.imageLink;
                var articleLink = elem.link;
                createArticleCard(title, articleLink, imgLink);
            })
                
        })
    })
})

function createArticleCard(title, link, imgLink) {

    var columnDiv = $('<div>').attr('class', 'col s6');
    var cardDiv = $('<div>').attr('class', 'card article-card');
    var image = $('<img>').attr({
        src: imgLink,
        class: "responsive-img"
    });
    var articleLink = $('<a>').attr('href', link).append(image);
    var title = $('<span>').attr('class', 'card-title truncate card-title').html(title);
    var imgDiv = $('<div>').attr('class', 'card-image waves-effect waves-block waves-light').append(articleLink).append(title);
    
    var commentsTitle = $('<span  class = "activator grey-text text-darken-4"> Comments <i class="material-icons right">close</i></span>');
    var contentDiv = $('<div>').attr('class', 'card-content').append(commentsTitle);

    var comments = $('<div>').attr('id', 'commentsInsert');    
    var cardRevealDiv = $('<div>').attr('class', 'card-reveal').append(comments)
    cardDiv.append(imgDiv).append(contentDiv).append(cardRevealDiv);
    columnDiv.append(cardDiv);
    $('#articles_wrapper').append(columnDiv);
}