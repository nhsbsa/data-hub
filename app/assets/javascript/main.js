// ES6 or Vanilla JavaScript
const toggleBtn = document.getElementById('toggleBtn');
const input = document.getElementById('password-input');

toggleBtn.addEventListener('click', function () {
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  toggleBtn.textContent = isPassword ? 'Hide' : 'Show';
});