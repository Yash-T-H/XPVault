document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-container input');

    if (searchInput) {
        // Handle search input for all pages when user presses Enter
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = this.value.trim();
                if (query) {
                    window.location.href = `games.html?search=${encodeURIComponent(query)}`;
                } else {
                    window.location.href = 'games.html';
                }
            }
        });

        // Live filtering logic specific to games.html
        const gameCards = document.querySelectorAll('.game-card');
        if (gameCards.length > 0) {
            // Check if there's a search parameter in the URL on load
            const urlParams = new URLSearchParams(window.location.search);
            const searchQuery = urlParams.get('search');

            if (searchQuery) {
                searchInput.value = searchQuery;
                filterGames(searchQuery);
            }

            // Live filtering when user types
            searchInput.addEventListener('input', function () {
                filterGames(this.value);
            });

            function filterGames(query) {
                const lowerCaseQuery = query.toLowerCase();
                gameCards.forEach(card => {
                    const title = card.querySelector('.game-title').textContent.toLowerCase();
                    // Optional: also check game details for matches
                    const details = card.querySelector('.game-details').textContent.toLowerCase();

                    if (title.includes(lowerCaseQuery) || details.includes(lowerCaseQuery)) {
                        card.style.display = 'flex'; 
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        }
    }
});

// Currency Converter Logic
window.currencyRates = {};
window.currentCurrency = localStorage.getItem('selectedCurrency') || 'USD';
window.currencySymbols = { 'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹' };

window.formatPrice = function(price) {
    const rate = window.currencyRates[window.currentCurrency] || 1;
    const symbol = window.currencySymbols[window.currentCurrency] || '$';
    return symbol + (price * rate).toFixed(2);
};

window.updateAllPrices = function() {
    const rate = window.currencyRates[window.currentCurrency] || 1;
    const symbol = window.currencySymbols[window.currentCurrency] || '$';
    
    // Update game cards
    document.querySelectorAll('.game-price').forEach(el => {
        if (!el.hasAttribute('data-base-price')) {
            const val = parseFloat(el.innerText.replace(/[^0-9.]/g, ''));
            el.setAttribute('data-base-price', val);
            el.setAttribute('data-original-text', el.innerText);
        }
        
        const basePrice = parseFloat(el.getAttribute('data-base-price'));
        const converted = (basePrice * rate).toFixed(2);
        let text = el.getAttribute('data-original-text');
        el.innerText = text.replace(/\$([0-9.]+)/, () => `${symbol}${converted}`);
    });
    
    // Check if loadCart exists (we are on cart page)
    if (typeof window.loadCart === 'function') {
        window.loadCart();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const currencySelect = document.getElementById('currency-select');
    if (currencySelect) {
        currencySelect.value = window.currentCurrency;
        
        currencySelect.addEventListener('change', (e) => {
            window.currentCurrency = e.target.value;
            localStorage.setItem('selectedCurrency', window.currentCurrency);
            window.updateAllPrices();
        });
    }

    // Fetch rates
    fetch('https://open.er-api.com/v6/latest/USD')
        .then(res => res.json())
        .then(data => {
            window.currencyRates = data.rates;
            window.currencyRates['USD'] = 1; // Base
            window.updateAllPrices();
        })
        .catch(err => console.error('Error fetching currency rates', err));
});
