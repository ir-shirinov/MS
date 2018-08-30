var openMenu = document.querySelector(".page-header__toogle");
var mobileMenu = document.querySelector(".main-nav");
var siteSearch = document.querySelector(".page-header__search");
var cart = document.querySelector(".page-header__cart");

openMenu.addEventListener("click", function (evt) {
  mobileMenu.classList.toggle("show");
  siteSearch.classList.toggle("show");
  cart.classList.toggle("show");
  openMenu.classList.toggle("page-header__toogle--open");
})
