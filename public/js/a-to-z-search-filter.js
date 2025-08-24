// ========================================
// A to Z search keyword filtering 
// ========================================
document.addEventListener('DOMContentLoaded', function () {
  // --- Get references to all the important DOM elements ---
  const form = document.querySelector('#keywordSearch'); // The search form
  const searchInput = document.querySelector('#search'); // The search box input
  const sections = document.querySelectorAll('.nhsuk-card.nhsuk-card--feature'); // All alphabetical sections
  const navLis = document.querySelectorAll('#nhsuk-nav-a-z ol > li'); // All nav list items (A–Z)
  const searchedList = document.querySelector('#searched-keywords'); // List of active keywords
  const searchedHeading = document.querySelector('h3.nhsuk-heading-s.nhsuk-u-visually-hidden'); // Heading for keyword list
  const clearAllLink = document.querySelector('#clear-all-keywords'); // "Clear all keywords" link
  const searchedHr = document.querySelector('hr.nhsuk-u-visually-hidden'); // Horizontal rule above keyword list

  // --- Create a lookup map from letter -> nav <li> for quick access ---
  const letterToLi = new Map();
  navLis.forEach(li => {
    const keyEl = li.querySelector('a, span');
    if (!keyEl) return;
    const letter = keyEl.textContent.trim().toUpperCase();
    if (letter) letterToLi.set(letter, li);
  });

  /**
   * Resets the view to its original state:
   * - Shows all sections and their <li> items
   * - Shows all navigation letters
   * - Hides the "searched keywords" heading, clear link, and hr
   */
  function resetView() {
    sections.forEach(section => {
      section.style.display = '';
      section.querySelectorAll('ul li').forEach(li => li.style.display = '');

      // Show "back to top" if present after section
      const backToTop = section.nextElementSibling?.classList.contains('nhsuk-back-to-top') ? section.nextElementSibling : null;
      if (backToTop) backToTop.style.display = '';

      // Show corresponding nav letter
      const h2 = section.querySelector('h2');
      if (h2 && h2.id) {
        const navLi = letterToLi.get(h2.id.toUpperCase());
        if (navLi) navLi.style.display = '';
      }
    });

    // Hide keyword UI elements
    searchedHeading.classList.add('nhsuk-u-visually-hidden');
    clearAllLink.classList.add('nhsuk-u-visually-hidden');
    if (searchedHr) searchedHr.classList.add('nhsuk-u-visually-hidden');
  }

  /**
   * Updates the page based on the current list of keywords:
   * - Only shows <li> items that match ANY active keyword
   * - Hides sections, nav letters, and back-to-top links with no matches
   */
  function updateDisplay() {
    const keywords = Array.from(searchedList.querySelectorAll('li')).map(li => li.dataset.keyword);
    if (keywords.length === 0) {
      resetView();
      return;
    }

    // Keep track of which letters should be visible
    const lettersToShow = new Set();
    sections.forEach(section => {
      const h2 = section.querySelector('h2');
      const letter = h2?.id ? h2.id.toUpperCase() : null;
      const lis = section.querySelectorAll('ul li');
      let matchCount = 0;
      lis.forEach(li => {
        const liText = li.innerText.toLowerCase();
        const match = keywords.some(kw => liText.includes(kw.toLowerCase()));
        li.style.display = match ? '' : 'none';
        if (match) matchCount++;
      });
      if (matchCount > 0) {
        section.style.display = '';
        if (letter) lettersToShow.add(letter);
        const backToTop = section.nextElementSibling?.classList.contains('nhsuk-back-to-top') ? section.nextElementSibling : null;
        if (backToTop) backToTop.style.display = '';
      } else {
        section.style.display = 'none';
        const backToTop = section.nextElementSibling?.classList.contains('nhsuk-back-to-top') ? section.nextElementSibling : null;
        if (backToTop) backToTop.style.display = 'none';
      }
    });

    // Now hide nav letters that aren't in lettersToShow
    navLis.forEach(li => {
      const letterText = li.textContent.trim().toUpperCase();
      if (!lettersToShow.has(letterText)) {
        li.style.display = 'none';
      } else {
        li.style.display = '';
      }
    });
  }

  /**
   * Handles the search form submission:
   * - Supports multiple comma-separated keywords in one search
   * - Adds each keyword as a clickable "tag" with an X to remove it
   * - Avoids adding duplicates
   */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get input, trim spaces, and convert to lowercase
    const rawInput = searchInput.value.trim().toLowerCase();
    if (!rawInput) return;

    // Split into an array of keywords by commas, trim, and remove empties
    const keywordsArray = rawInput.split(',').map(k => k.trim()).filter(k => k.length > 0);
    if (keywordsArray.length === 0) return;

    // Show keyword-related UI elements
    searchedHeading.classList.remove('nhsuk-u-visually-hidden');
    clearAllLink.classList.remove('nhsuk-u-visually-hidden');
    if (searchedHr) searchedHr.classList.remove('nhsuk-u-visually-hidden');

    // Add each keyword to the list if not already present
    keywordsArray.forEach(keyword => {
      const exists = Array.from(searchedList.querySelectorAll('li')).some(li => li.dataset.keyword === keyword);
      if (!exists) {
        const li = document.createElement('li');
        li.dataset.keyword = keyword;
        li.innerHTML = `<button type="button" class="nhsuk-tag nhsuk-tag--blue a-to-z-search-tag">
                                ${keyword} <span class="remove-x">×</span>
                              </button>`;
        searchedList.appendChild(li);
      }
    });

    // Clear the search box after adding
    searchInput.value = '';

    // Refresh the displayed results
    updateDisplay();
  });

  /**
   * Handles clicking the X on a keyword tag:
   * - Removes the keyword from the list
   * - Updates the displayed sections accordingly
   */
  searchedList.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-x')) {
      const li = e.target.closest('li');
      if (li) {
        li.remove();
        updateDisplay();
      }
    }
  });

  /**
   * Handles clicking the "Clear all keywords" link:
   * - Empties the keyword list
   * - Fully resets the page view
   */
  clearAllLink.addEventListener('click', function (e) {
    e.preventDefault();
    searchedList.innerHTML = '';
    resetView();
  });
});
// ========================================