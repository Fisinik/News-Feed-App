(function () {
  "use strict";

  const list_element = document.getElementById("articles");
  const pagination_element = document.getElementById("pagination");
  let current_page = 1;
  let rows = 8;

  const by_default = "https://free-news.p.rapidapi.com/v1/search?q=";
  let search_query = "https://free-news.p.rapidapi.com/v1/search?q=Latest";

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Host": "free-news.p.rapidapi.com",
      "X-RapidAPI-Key": "7ea16c9ffcmshcae2c2874dc4bd6p1a37c8jsn409a63316d06",
    },
  };

  const getNewsData = async () => {
    await fetch(search_query, options)
      .then((response) => response.json())
      .then((response) => {
        if (response.articles) {
          DisplayList(response.articles, list_element, rows, current_page);
          SetupPagination(response.articles, pagination_element, rows);
        } else {
          list_element.innerHTML = "";
          const no_articles = document.createElement("h3");
          no_articles.innerHTML = "No articles have been found.";
          list_element.appendChild(no_articles);
        }
      })
      .catch((err) => console.error(err));
  };

  function SearchElement() {
    const wrapper = document.createElement("form");
    wrapper.setAttribute("role", "search");
    wrapper.setAttribute("onsubmit", "event.preventDefault();");
    const input = document.createElement("input");
    input.setAttribute("type", "search");
    input.setAttribute("Placeholder", "Search News...");
    input.setAttribute("id", "search");
    input.required = true;
    const button = document.createElement("button");
    button.setAttribute("type", "submit");
    // add search icon
    const searchIcon = createSearchIcon();
    button.append(searchIcon);
    // add event listener
    button.addEventListener("click", () => {
      const event = document.getElementById("search");
      if (event.value == "") search_query = by_default + "Latest";
      else {
        search_query = by_default + encodeURIComponent(event.value);
        getNewsData();
      }
    });
    wrapper.appendChild(input);
    wrapper.appendChild(button);
    const newsTitle = document.querySelector(".news-title");
    newsTitle.append(wrapper);
  }

  function createSearchIcon() {
    // Create the SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "15");
    svg.setAttribute("height", "15");
    svg.setAttribute("viewBox", "0 0 20 20");
  
    // Create the path element
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d", "M19.6952 18.2156L14.7659 13.2668C16.0337 11.8111 16.7283 9.98025 16.7283 8.07434C16.7283 3.62224 12.9763 0 8.363 0C3.75194 0 0 3.62224 0 8.07434C0 12.5278 3.75194 16.15 8.363 16.15C10.0944 16.15 11.7458 15.6462 13.1554 14.6878L18.1238 19.6761C18.3315 19.8855 18.6102 20 18.9106 20C19.1929 20 19.4606 19.8956 19.6652 19.7055C20.1002 19.3027 20.1125 18.6356 19.6952 18.2156ZM8.363 2.1069C11.7722 2.1069 14.5459 4.78475 14.5459 8.07434C14.5459 11.3657 11.7722 14.0431 8.363 14.0431C4.95562 14.0431 2.18234 11.3657 2.18234 8.07434C2.18234 4.78475 4.95562 2.1069 8.363 2.1069Z");
    path.setAttribute("fill", "url(#paint0_linear_0_33)");

    // Create the linear gradient element
    const linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    linearGradient.setAttribute("id", "paint0_linear_0_33");
    linearGradient.setAttribute("x1", "20");
    linearGradient.setAttribute("y1", "0");
    linearGradient.setAttribute("x2", "0");
    linearGradient.setAttribute("y2", "0");
    linearGradient.setAttribute("gradientUnits", "userSpaceOnUse");

    // Create the first stop element
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("stop-color", "#576345");

    // Create the second stop element
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "1");
    stop2.setAttribute("stop-color", "#576345");

    // Add the stops to the linear gradient
    linearGradient.appendChild(stop1);
    linearGradient.appendChild(stop2);

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.appendChild(linearGradient);

    // Add the linear gradient to the SVG
    svg.appendChild(path);
    svg.appendChild(defs);

    // Return the SVG element
    return svg;
  }

  function DisplayList(items, wrapper, rows_per_page, page) {
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
  function createCard(data) {
    const card = document.createElement("div");
    card.setAttribute("class", "card");
    // Add an on click event listener that opens the modal
    // card.addEventListener("click", () => openModal(item));
    card.addEventListener("click", () => openModal(data));
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
    let dateSplit =
      data.published_date_precision == "full"
        ? data.published_date.split(" ")[0]
        : data.published_date;
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

  function SetupPagination(items, wrapper, rows_per_page) {
    wrapper.innerHTML = "";

    let page_count = Math.ceil(items.length / rows_per_page);
    for (let i = 1; i < page_count + 1; i++) {
      let btn = PaginationButton(i, items);
      wrapper.appendChild(btn);
    }
  }

  function PaginationButton(page, items) {
    let button = document.createElement("button");
    button.innerText = page;

    if (current_page == page) button.classList.add("active");

    button.addEventListener("click", function () {
      current_page = page;
      DisplayList(items, list_element, rows, current_page);

      let current_btn = document.querySelector(".page-numbers button.active");
      current_btn.classList.remove("active");

      button.classList.add("active");
    });

    return button;
  }

  // Define a function that opens a modal containing the data of the specified item
  function openModal(item) {
    // Create the modal container
    console.log(item);
    const modal = document.createElement("div");
    modal.classList.add("modal");

    // Create the modal content
    const content = document.createElement("div");
    content.classList.add("modal-content");
    var modalClose = document.createElement("span");
    modalClose.className = "modal-close";
    modalClose.innerHTML = "&times;";
    content.appendChild(modalClose);

    modalClose.addEventListener("click", function () {
      modal.style.display = "none";
    });

    // Add the item's image
    const image = document.createElement("img");
    image.src = item.media;
    content.appendChild(image);

    // Add the item's title
    const title = document.createElement("h3");
    title.textContent = item.title;
    content.appendChild(title);

    // Add the item's description
    const description = document.createElement("p");
    description.textContent = item.summary;
    content.appendChild(description);

    // Add the modal content to the modal container
    modal.appendChild(content);

    // Add the modal to the page
    document.body.appendChild(modal);
    window.addEventListener("click", function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });
    // Add an event listener to close the modal when the escape key is pressed
    window.addEventListener("keydown", function (event) {
      if (event.code === "Escape") {
        modal.style.display = "none";
      }
    });
  }

  SearchElement();
  getNewsData();
})();
