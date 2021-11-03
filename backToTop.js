/**
 * Will add a back to top button when scrolled down 20 pixels. Icons use Google Material Icons.
 * @example
 * backToTop({color: 'red', backgroundColor: 'black', hoverEvent: {color: 'black', backgroundColor: 'red'}})
 * @param {String} [style] The style to set the button to
 * @param {String} [value] The value to set the style to
 */
function backToTop(style, value) {
    var padding = 20; // Number of pixels at the top before it shows the button
    var color = 'white';
    var backgroundColor = 'black';
    var icon = 'keyboard_arrow_up';
    var hoverColor = color;
    var hoverBackgroundColor = backgroundColor;
    var hoverIcon = icon;
    var align = 'right';
    // modify
    if (typeof style == 'object') {
        if (style.padding) { padding = style.padding };
        if (style.color) { color = style.color };
        if (style.backgroundColor) { backgroundColor = style.backgroundColor };
        if (style.icon) { icon = style.icon };
        if (style.align) { align = style.align };
        if (style.smooth) { smooth = style.smooth };
        if (style.hoverEvent) {
            if (style.hoverEvent.color) { hoverColor = style.hoverEvent.color };
            if (style.hoverEvent.backgroundColor) { hoverBackgroundColor = style.hoverEvent.backgroundColor };
            if (style.hoverEvent.icon) { hoverIcon = style.hoverEvent.icon };
        }
    } else if (typeof style == 'string') {
        if (style == 'padding') { padding = value };
        if (style == 'color') { color = value };
        if (style == 'backgroundColor') { backgroundColor = value };
        if (style == 'icon') { icon = value };
        if (style == 'align') { align = value };
        if (style == 'smooth') { smooth = value };
        if (style == 'hoverEvent.color') { hoverColor = value };
        if (style == 'hoverEvent.backgroundColor') { hoverBackgroundColor = value };
        if (style == 'hoverEvent.icon') { hoverIcon = value };
    }
    /* align */
    if (align == 'left') {
        styleAlign = 'left: 30px';
    } else if (align == 'right') {
        styleAlign = 'right: 30px';
    } else if (align == 'center') {
        styleAlign = 'right: 45%';
    } else {
        console.error('unknown align type ' + align + ', excepted values are left, right, center.');
        styleAlign = 'right: 30px';
    }
    const BODY = document.querySelector('body')
    BODY.innerHTML = BODY.innerHTML + '<button class="material-icons" style="' + styleAlign + ';color: ' + color + '; background-color: ' + backgroundColor + '; display: none;position: fixed;bottom: 30px;z-index: 99;border: none;outline: none;cursor: pointer;padding: 1px;border-radius: 100%;font-size: 50px;" id="backToTopBtn">' + icon + '</button>';
    btn = document.getElementById("backToTopBtn");
    window.onscroll = function () {
        if (document.body.scrollTop > padding || document.documentElement.scrollTop > padding) {
            btn.style.display = "block";
        } else {
            btn.style.display = "none";
        }
    };
    $('#backToTopBtn').click(function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });
    $('#backToTopBtn').mouseenter(function () {
        btn.style.color = hoverColor;
        btn.style.backgroundColor = hoverBackgroundColor;
        btn.innerHTML = hoverIcon;
    });
    $('#backToTopBtn').mouseleave(function () {
        btn.style.color = color;
        btn.style.backgroundColor = backgroundColor;
        btn.innerHTML = icon;

    });
}