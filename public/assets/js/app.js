$(document).ready(function () {
    //wait 1 second after page load to display magazine
    var intro = setTimeout(function () {
        $('#scientificAmCard').fadeIn(4000);
    }, 1000);
    //button for scraping website
    $('#getScientificAmericanArticles').on('click', function () {
        $.get('/health-news', function (response) {
            console.log(response)
            response.forEach(function (elem, index) {
                var title = elem.title;
                var imgLink = elem.imageLink;
                var articleLink = elem.link;
                var id = elem._id;
                var commentArr = elem.comment;
                createArticleCard(title, articleLink, imgLink, id, commentArr);
                
            })
                
        })
    });
   $('<input type="submit">').on('click', function(e) {
       e.preventDefault();
        $.post('/newComment',function(response) {
            console.log(response)
        })
   })
})

function createArticleCard(title, link, imgLink, id, comments) {

    var columnDiv = $('<div>').attr('class', 'col s6');
    var cardDiv = $('<div>').attr({
        class: 'card article-card',
        id: id
    });
    //---------Image Section of card----------
    var image = $('<img>').attr({
        src: imgLink,
        class: "responsive-img"
    });
    var articleLink = $('<a>').attr('href', link).append(image);
    var title = $('<span>').attr('class', 'card-title article-title card-title').html(title);
    var imgDiv = $('<div>').attr('class', 'card-image waves-effect waves-block waves-light').append(articleLink).append(title);
    //---------Content Space (not revealed)----------
    var contentTitle = $('<span  class = "card-title activator grey-text text-darken-4"> Comments <i class="material-icons right">more_vert</i></span>');
    var contentDiv = $('<div>').attr('class', 'card-content').append(contentTitle);
    //---------Comment reveal Section-----------
    var commentsTitle = $('<span>').attr('class', 'card-title grey-text text-darken-4').html(' Comments <i class="material-icons right">close</i>');
    var commentsDiv = $('<div>').attr('id', 'commentsInsert'); 
    //form
    var commentText = $('<input>').attr({
        type: "text",
        name: "comment",
        placeholder: "Enter Comment Here!"
    })
    var idInput = $('<input>').attr({
        type: "hidden",
        value: id,
        name: "articleId"
    })
    var formSubmitBtn = $('<input type="submit" value="Submit" class="btn">')
    var commentFormInput = $('<form>').attr({
        class: 'row', 
        action: "/newComment", 
        method: "POST"
    }).append(commentText).append(idInput).append(formSubmitBtn);
    comments.forEach(function(elem, index) {
        var newP = $('<p>').html('<i class="material-icons">chat_bubble_outline</i>   '  +  elem.body);
        commentsDiv.append(newP);
    })
    var cardRevealDiv = $('<div>').attr('class', 'card-reveal').append(commentsTitle).append(commentsDiv).append(commentFormInput)
    cardDiv.append(imgDiv).append(contentDiv).append(cardRevealDiv);
    columnDiv.append(cardDiv);

    
    $('#articles_wrapper').append(columnDiv);
}