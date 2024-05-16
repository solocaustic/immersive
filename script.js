document.addEventListener("DOMContentLoaded", function() {
    var grid = document.querySelector('.grid');
    var masonry = new Masonry(grid, {
        // Options
        itemSelector: '.grid-item',
        // More options can be added here
    });
});
