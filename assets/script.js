var plant = document.querySelectorAll('#plant path');
plant.forEach((path) => {
  path.style.fill = '#62760c';
});
var chatT = document.querySelectorAll('.T-chat');
     M.Modal.init(chatT, {});
document.addEventListener('DOMContentLoaded', function () {
  var datepicker = document.querySelectorAll('.datepicker');
  var timepicker = document.querySelectorAll('.timepicker');
  var dateInstances = M.Datepicker.init(datepicker, { format: 'dd-mmmm-yyyy' });
  M.Timepicker.init(timepicker);
});
