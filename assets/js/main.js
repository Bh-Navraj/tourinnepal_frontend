var siteHeader = document.getElementById("site-header");
var menuToggler = document.querySelector(".btn-menu-toggler");
var navigationContent = document.querySelector(".navigation-content");
var menuItems = document.querySelectorAll(".menu-item.has-children > a");
menuToggler.addEventListener("click", function () {
  navigationContent.classList.toggle("active");
  menuToggler.classList.toggle("open");
  document.body.style.overflowY = document.body.style.overflowY === 'hidden' ? '' : 'hidden'; // using tery operator
});
menuItems.forEach(function (item) {
  item.addEventListener("click", function (event) {
    event.preventDefault();
    var parentItem = event.target.closest(".menu-item.has-children");
    if (parentItem) {
      parentItem.classList.toggle("active");
    } else {
      // Collapse all sub-menus
      document.querySelectorAll(".menu-item.has-children.active").forEach(function (item) {
        item.classList.remove("active");
      });
    }
  });
});

// sticky header
window.addEventListener("scroll", function () {
  if (window.scrollY > 0) {
    siteHeader.classList.add("sticky-menu");
  } else {
    siteHeader.classList.remove("sticky-menu");
  }
});