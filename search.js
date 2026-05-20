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
