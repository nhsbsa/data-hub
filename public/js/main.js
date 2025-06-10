// ES6 or Vanilla JavaScript
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleBtn');
  const input = document.getElementById('password-input');
  if (toggleBtn && input) {
    toggleBtn.addEventListener('click', function () {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      toggleBtn.textContent = isPassword ? 'Hide' : 'Show';
    });
  } else {
    console.log('not on the right page...');
  }
  const button = document.getElementById('hide-getting-started');
  const expander = document.getElementById('getting-started-expander');
  const className = 'nhsuk-expander-hidden';
  if (button && expander) {
    button.addEventListener('click', () => {
      expander.classList.toggle(className);
    });
  } else {
    console.log("wont work here...");
  }
});