function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function isLikelyDomain(input) {
  return /^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(input);
}

function getSearchEngineUrl(engine, query) {
  const encodedQuery = encodeURIComponent(query);
  switch (engine) {
    case "google":
      return `https://www.google.com/search?q=${encodedQuery}`;
    case "bing":
      return `https://www.bing.com/search?q=${encodedQuery}`;
    case "brave":
      return `https://search.brave.com/search?q=${encodedQuery}`;
    default:
      return `https://duckduckgo.com/?q=${encodedQuery}`;
  }
}


const searchSuggestions = [
  'google', 'github', 'gmail', 'green', 'games', 'graphics', 'geography',
  'youtube', 'yahoo', 'yellow', 'year', 'yoga', 'yesterday',
  'facebook', 'firefox', 'food', 'funny', 'free', 'friends', 'fruit',
  'twitter', 'twitch', 'technology', 'travel', 'tutorials', 'time',
  'instagram', 'internet', 'images', 'information', 'ideas', 'interesting',
  'reddit', 'recipes', 'reviews', 'reading', 'research', 'results',
  'netflix', 'news', 'nature', 'new', 'notebook', 'nutrition',
  'amazon', 'apple', 'android', 'animals', 'art', 'astronomy',
  'music', 'movies', 'minecraft', 'maps', 'money', 'mobile',
  'discord', 'download', 'design', 'data', 'development', 'dogs',
  'spotify', 'steam', 'shopping', 'science', 'sports', 'school',
  'wikipedia', 'weather', 'web', 'world', 'work', 'writing',
  'programming', 'python', 'photography', 'phone', 'pizza', 'pets',
  'coding', 'computer', 'cars', 'cats', 'cool', 'cooking',
  'business', 'books', 'best', 'beautiful', 'blue', 'bitcoin',
  'health', 'home', 'how', 'help', 'history', 'html',
  'education', 'email', 'entertainment', 'exercise', 'economics',
  'learning', 'linux', 'language', 'life', 'love', 'latest'
];

function createSuggestionsDropdown() {
  const dropdown = document.createElement('div');
  dropdown.id = 'suggestions-dropdown';
  dropdown.style.cssText = `
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    border: 1px solid #ddd;
    border-top: none;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    display: none;
    border: 2px solid #fff;
     border-radius: 10px;
  `;
  return dropdown;
}

function createSuggestionItem(text, query) {
  const item = document.createElement('div');
  item.className = 'suggestion-item';
  item.textContent = text;
  item.style.cssText = `
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 1px solid #333;
    font-size: 14px;
    color: #ffffff;
    background-color: #000000;

  `;
  
  item.addEventListener('mouseenter', () => {
    item.style.backgroundColor = '#333333';
    item.style.color = '#ffffff';
  });
  
  item.addEventListener('mouseleave', () => {
    item.style.backgroundColor = '#000000';
    item.style.color = '#ffffff';
  });
  
  item.addEventListener('click', () => {
    selectSuggestion(text);
  });
  
  return item;
}

function getSuggestions(query) {
  if (!query || query.length < 1) return [];
  
  const lowerQuery = query.toLowerCase();
  return searchSuggestions
    .filter(suggestion => suggestion.toLowerCase().startsWith(lowerQuery))
    .slice(0, 5); 
}

function showSuggestions(input, suggestions) {
  const dropdown = document.getElementById('suggestions-dropdown');
  
  if (suggestions.length === 0) {
    dropdown.style.display = 'none';
    return;
  }
  
  dropdown.innerHTML = '';
  
  suggestions.forEach(suggestion => {
    const item = createSuggestionItem(suggestion, input.value);
    dropdown.appendChild(item);
  });
  
  dropdown.style.display = 'block';
}

function hideSuggestions() {
  const dropdown = document.getElementById('suggestions-dropdown');
  if (dropdown) {
    dropdown.style.display = 'none';
  }
}

function selectSuggestion(suggestion) {
  const input = document.getElementById("uv-address");
  input.value = suggestion;
  hideSuggestions();
  
  const searchEngine = localStorage.getItem("searchEngine") || "duckduckgo";
  const finalUrl = getSearchEngineUrl(searchEngine, suggestion);
  window.location.href = `/tabs.html#${encodeURIComponent(finalUrl)}`;
}

function handleSearch(event) {
  event.preventDefault();
  
  const input = document.getElementById("uv-address").value.trim();
  const searchEngine = localStorage.getItem("searchEngine") || "duckduckgo";
  
  if (!input) return;
  
  hideSuggestions();
  
  let finalUrl;
  
  if (isValidUrl(input)) {
    finalUrl = input.startsWith("http") ? input : `https://${input}`;
  } else if (isLikelyDomain(input)) {
    finalUrl = `https://${input}`;
  } else {
    finalUrl = getSearchEngineUrl(searchEngine, input);
  }
  
  window.location.href = `/tabs.html#${encodeURIComponent(finalUrl)}`;
}

function setupAutocomplete() {
  const input = document.getElementById("uv-address");
  if (!input) return;
  

  const container = input.parentElement;
  if (container) {
    container.style.position = 'relative';
  }
  

  const dropdown = createSuggestionsDropdown();
  container.appendChild(dropdown);
  

  dropdown.style.setProperty('width', '156px', 'important'); 
  dropdown.style.setProperty('left', '57%', 'important');
  dropdown.style.setProperty('transform', 'translateX(-50%)', 'important');
  dropdown.style.setProperty('top', 'calc(100% + 5px)', 'important'); 
  dropdown.style.setProperty('margin-left', 'auto', 'important');
  dropdown.style.setProperty('margin-right', 'auto', 'important');
  

  input.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    const suggestions = getSuggestions(query);
    showSuggestions(input, suggestions);
  });
  
 
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      hideSuggestions();
    }
  });
  

  input.addEventListener('keydown', (e) => {
    const dropdown = document.getElementById('suggestions-dropdown');
    const items = dropdown.querySelectorAll('.suggestion-item');
    
    if (e.key === 'Escape') {
      hideSuggestions();
      return;
    }
    
    if (items.length === 0) return;
    
    const currentActive = dropdown.querySelector('.suggestion-item.active');
    let activeIndex = currentActive ? Array.from(items).indexOf(currentActive) : -1;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(items[activeIndex].textContent);
      return;
    }
    

    items.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add('active');
        item.style.backgroundColor = '#333333';
        item.style.color = '#ffffff';
      } else {
        item.classList.remove('active');
        item.style.backgroundColor = '#000000';
        item.style.color = '#ffffff';
      }
    });
  });
  

  input.addEventListener('focus', () => {
    if (input.value.trim()) {
      const suggestions = getSuggestions(input.value.trim());
      showSuggestions(input, suggestions);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("searchEngineSelect");
  
  if (select) {
   
    const saved = localStorage.getItem("searchEngine") || "duckduckgo";
    select.value = saved;
    
  
    select.addEventListener("change", () => {
      localStorage.setItem("searchEngine", select.value);
    });
  }
  
 
  const form = document.getElementById("uv-form");
  if (form) {
    form.addEventListener("submit", handleSearch);
  }
  
  
  setupAutocomplete();
});