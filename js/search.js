document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categorySelect');
    const searchResults = document.getElementById('searchResults');
    const searchResultTemplate = document.getElementById('searchResultTemplate').innerHTML;

    searchResults.innerHTML = 'Games Loading...';

    fetch('games.json')
        .then(response => response.json())
        .then(data => {
            const mockData = data;

            function renderTemplate(template, data) {
                return template.replace(/{{(.*?)}}/g, (match, key) => data[key.trim()] || '');
            }

            function renderSearchResults(searchTerm = '', category = 'all') {
                searchResults.innerHTML = '';

                const filteredResults = mockData.filter(item => {
                    const itemCategory = String(item.category).trim().toLowerCase();
                    const selectedCategory = String(category).trim().toLowerCase();
                    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesCategory = category === 'all' || itemCategory === selectedCategory;
                    return matchesSearch && matchesCategory;
                });

                if (filteredResults.length === 0) {
                    searchResults.innerHTML = '<p>No games were found. Request some from our <a href="https://discord.gg/cnetwork" style="text-decoration:underline">Discord server</a>!</p>';
                    return;
                }

                filteredResults.forEach((result, index) => {
                    const renderedTemplate = renderTemplate(searchResultTemplate, result);

                    const wrapper = document.createElement('div');
                    wrapper.innerHTML = renderedTemplate;
                    const resultElement = wrapper.firstElementChild;

                    resultElement.classList.add('fade-in');
                    resultElement.style.animationDelay = `${index * 20}ms`;

                    searchResults.appendChild(resultElement);
                });
            }

            function debounce(fn, delay) {
                let timeout;
                return function (...args) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => fn.apply(this, args), delay);
                };
            }

            const debouncedSearch = debounce(() => {
                renderSearchResults(searchInput.value.trim(), categorySelect.value);
            }, 250);

            renderSearchResults('', categorySelect.value);

            searchInput.addEventListener('input', debouncedSearch);

            categorySelect.addEventListener('change', function () {
                renderSearchResults('', categorySelect.value);
                searchInput.value = '';
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});

//changed js for faster loading