var plant = document.querySelectorAll('#plant path');
plant.forEach((path) => {
  path.style.fill = '#62760c';
});
// var navbar = document.querySelector('nav');
// var sticky = navbar.offsetTop;
// var logo = document.querySelectorAll('.nav-links div');
// window.addEventListener('scroll', () => {
//   if (window.pageYOffset >= sticky) {
//     navbar.classList.add('sticky');
//     logo[0].classList.add('logo-nav');
//     logo[1].classList.add('logo-nav');
//   } else {
//     navbar.classList.remove('sticky');
//     logo[0].classList.remove('logo-nav');
//     logo[1].classList.remove('logo-nav');
//   }
// });
document.addEventListener('DOMContentLoaded', function () {
  var datepicker = document.querySelectorAll('.datepicker');
  var timepicker = document.querySelectorAll('.timepicker');
  var dateInstances = M.Datepicker.init(datepicker, { format: 'dd-mmmm-yyyy' });
  M.Timepicker.init(timepicker);
});
