module.exports = function (env) { /* eslint-disable-line func-names,no-unused-vars */
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  const filters = {};

  filters.contains = function( haystack, needle ){
    let check = false;
    if( haystack.indexOf( needle ) > -1 ){
      check = true;
    }
    return check;
  };

  filters.generateAToZLinks = function( letters ){

    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let activeLetters = ( /^[A-Z]+$/.test(letters) ) ? letters.split('') : [];

    let html = '<nav class="nhsuk-u-clear"><ol class="nhsuk-list">';
    allLetters.forEach(function(letter, i){
      html += '<li class="nhsuk-u-margin-bottom-0 nhsuk-u-float-left nhsuk-u-margin-right-1">';
      if( activeLetters.indexOf(letter) > -1 ){
        html += '<a class="nhsuk-u-font-size-22 nhsuk-u-padding-2 nhsuk-u-display-block" href="#'+letter+'">'+letter+'</a>';
      } else {
        html += '<span class="nhsuk-u-font-size-22 nhsuk-u-padding-2 nhsuk-u-display-block nhsuk-u-secondary-text-color">'+letter+'</span>';
      }
      html += '</li>';
    });

    html += '</ol></nav>';

    return html;

  }

  /* ------------------------------------------------------------------
    add your methods to the filters obj below this comment block:
    @example:

    filters.sayHi = function(name) {
        return 'Hi ' + name + '!'
    }

    Which in your templates would be used as:

    {{ 'Paul' | sayHi }} => 'Hi Paul'

    Notice the first argument of your filters method is whatever
    gets 'piped' via '|' to the filter.

    Filters can take additional arguments, for example:

    filters.sayHi = function(name,tone) {
      return (tone == 'formal' ? 'Greetings' : 'Hi') + ' ' + name + '!'
    }

    Which would be used like this:

    {{ 'Joel' | sayHi('formal') }} => 'Greetings Joel!'
    {{ 'Gemma' | sayHi }} => 'Hi Gemma!'

    For more on filters and how to write them see the Nunjucks
    documentation.

  ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters;
};
