(function () {
    "use strict";

    const list_element = document.getElementById('articles');
    const pagination_element = document.getElementById('pagination');
    let current_page = 1;
    let rows = 8;

    const by_default = 'https://free-news.p.rapidapi.com/v1/search?q=';
    let search_query = 'https://free-news.p.rapidapi.com/v1/search?q=Latest';
    
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'free-news.p.rapidapi.com',
            'X-RapidAPI-Key': '7ea16c9ffcmshcae2c2874dc4bd6p1a37c8jsn409a63316d06'
        }
    };

    const getNewsData = async() => {
        await fetch(search_query, options)
        .then(response => response.json())
        .then(response => {
            if (response.articles) {
            DisplayList(response.articles, list_element, rows, current_page);
            SetupPagination(response.articles, pagination_element, rows); 
            }
            else {
                list_element.innerHTML= "";
                const no_articles = document.createElement("h3");
                no_articles.innerHTML = "No articles have been found.";
                list_element.appendChild(no_articles);
            }
            
        })
        .catch(err => console.error(err));
    }

    function SearchElement() {
        const wrapper = document.createElement('form');
        wrapper.setAttribute("role", "search");
        wrapper.setAttribute("onsubmit", "event.preventDefault();");
        const input = document.createElement('input');
        input.setAttribute("type", "search");
        input.setAttribute("Placeholder", "Search News...");
        input.setAttribute("id", "search");
        input.required = true;
        const button = document.createElement('button');
        button.setAttribute("type", "submit");
        button.innerHTML = "GO";
        button.addEventListener('click', () => {
            const event = document.getElementById('search');
            if (event.value == '') search_query = by_default + 'Latest';
            else {
                search_query = by_default + encodeURIComponent(event.value);
                getNewsData();
                console.log(search_query); 
            }
        });
        wrapper.appendChild(input);
        wrapper.appendChild(button);
        const newsTitle = document.querySelector('.news-title');
        newsTitle.append(wrapper);
    }

    function DisplayList (items, wrapper, rows_per_page, page) {
        wrapper.innerHTML = "";
        page--;
    
        let start = rows_per_page * page;
        let end = start + rows_per_page;
        let paginatedItems = items.slice(start, end);

        paginatedItems.forEach((item) => {
            wrapper.appendChild(createCard(item));
        });
    }

    // Creating a Card Snippet
    function createCard(data){
    const card = document.createElement("div");
    card.setAttribute("class", "card");
    // articles.media
    const articleImage = document.createElement("img");
    articleImage.setAttribute("src", `${data.media}`);      
    // articles.title
    const articleTitle = document.createElement("h2");
    articleTitle.innerHTML = `${data.title}`;
    // articles.summary
    const articleSummary = document.createElement("p");
    articleSummary.setAttribute("class", "truncate-overflow");
    articleSummary.innerHTML = data.summary;
    // the article
    const article = document.createElement("article");
    // articles.published_date
    const articleDate = document.createElement("span");
    articleDate.setAttribute("class", "published-date");
    // Fix the date format
    let dateSplit = (
        data.published_date_precision == "full" ? 
        data.published_date.split(' ')[0] : 
        data.published_date
    );
    let date = new Date(Date.parse(dateSplit));
    articleDate.innerHTML = date.toLocaleDateString();  
    // articles.topic
    const articleTopic = document.createElement("span");
    articleTopic.setAttribute("class", "topic");
    articleTopic.innerHTML = `${data.rank} <b>|</b> ${data.topic}`;
    
    article.appendChild(articleTitle);
    article.appendChild(articleSummary);
    article.appendChild(articleDate);
    article.appendChild(articleTopic);
    // Append children to Card
    card.appendChild(articleImage);
    card.appendChild(article);

    return card;
    }

    function SetupPagination (items, wrapper, rows_per_page) {
        wrapper.innerHTML = "";
    
        let page_count = Math.ceil(items.length / rows_per_page);
        for (let i = 1; i < page_count + 1; i++) {
            let btn = PaginationButton(i, items);
            wrapper.appendChild(btn);
        }
    }
    
    function PaginationButton (page, items) {
        let button = document.createElement('button');
        button.innerText = page;
    
        if (current_page == page) button.classList.add('active');
    
        button.addEventListener('click', function () {
            current_page = page;
            DisplayList(items, list_element, rows, current_page);
    
            let current_btn = document.querySelector('.page-numbers button.active');
            current_btn.classList.remove('active');
    
            button.classList.add('active');
        });
    
        return button;
    }

    SearchElement();
    getNewsData();
 
})();
