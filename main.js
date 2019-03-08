
(function () {
    function _(selector) {
        return document.querySelector(selector);
    }
    let searchInput = _("#search-input");
    let resultList = _("#result");
    let searchBtn = _("#searchBtn");
    let progress = _("#progress");
    let ascBtn = _("#asc");
    let desBtn = _("#dsc");
    progress.style.display = "none";
    ascBtn.style.display = "none";
    desBtn.style.display = "none";
    let successResult = [];

    //fetching data from the wikipedia endpoint using fetch api
    function fetchData(value) {
        const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&origin=*&srsearch=${value}&utf8=&format=json`;
        return fetch(url, {
            method: "GET"
        })
            .then(res => res.json())
            .catch(err => console.log(err));

    }
    //this method will be invoked when search button is clicked
    function performSearch() {
        result.innerHTML = "";
        progress.style.display = "none";
        if (searchInput.value && searchInput.value.length >= 3) {
            let inputval = encodeURIComponent(searchInput.value);
            fetchData(inputval).then(data => {
                let { search } = data.query;
                search = getSortedResult(search, "asc");

                if (search && search.length) {
                    ascBtn.style.display = "block";
                    desBtn.style.display = "block";
                    successResult = search;
                    successSearchResult(search);
                } else {
                    result.innerHTML = "No Result Found";
                }
            })
        } else {
            ascBtn.style.display = "none";
            desBtn.style.display = "none";
            progress.style.display = "block";
            progress.innerHTML = "Please enter atleast 3 characters";
            setTimeout(() => {
                progress.style.display = "none";
            }, 3000);
        }

    }
    searchBtn.addEventListener("click", performSearch);
    ascBtn.addEventListener("click", successSearchResult.bind(null, successResult, "asc"));
    desBtn.addEventListener("click", successSearchResult.bind(null, successResult, "dsc"));

    //this method will display list of dynamic data in the li element after api returns data
    function successSearchResult(resultArr, type) {
        resultList.innerHTML = "";
        if (type == "asc" || type == "dsc") {
            resultArr = getSortedResult(successResult, type);

        }
        resultArr.forEach(item => {

            let li = document.createElement("li");
            li.className = "list-group-item";
            li.innerHTML = item['title'];
            resultList.appendChild(li);
        })


    }

    // method that will sort the data
    function getSortedResult(result, type) {
        if (type === "asc") {
            return result.sort((a, b) => {
                if (a.title > b.title) {
                    return 1;
                }
                else if (a.title < b.title) {
                    return -1;
                } else {
                    return 0;
                }
            })
        }
        else if (type === "dsc") {
            return result.sort((a, b) => {
                if (a.title > b.title) {
                    return -1;
                }
                else if (a.title < b.title) {
                    return 1;
                } else {
                    return 0;
                }
            })
        }
    }

})();