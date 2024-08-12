function switchLanguage(lang) {
  document.querySelectorAll('[data-en]').forEach(function(element) {
      element.textContent = element.getAttribute(`data-${lang}`);
  });
}

document.getElementById('dropdownMenuButton').addEventListener('click', function() {
  var dropdownMenu = this.nextElementSibling;
  dropdownMenu.classList.toggle('show');
});
