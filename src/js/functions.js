/* equal height of divs */
function equalHeight(element) {
    totalHeight = 0;
    element.css("height", "auto");
    element.each(function () {
        height = $(this).outerHeight();
        if (totalHeight < height) {
            totalHeight = height;
        }
    });
    element.css("height", totalHeight);
}
