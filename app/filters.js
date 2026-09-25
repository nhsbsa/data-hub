const { structuredClone } = require('worker_threads');

module.exports = function (env) { /* eslint-disable-line func-names,no-unused-vars */
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  const filters = {};

  //
  // CONCAT
  // Merges as many arrays as you can chuck at it...
  //
  filters.concat = function(){

    let concatanated = [];
    if( arguments.length > 0 ){
      concatanated = [].concat( ...arguments );
    }

    return concatanated;

  }

  //
  // GET DIRECTORY FILES
  // Takes a directory and outputs an array of file names with the directory prepended
  //
  filters.getDirectoryFiles = function(directory) {

    const fs = require('fs');
    const path = require('path');

    try {
      const fullPath = path.join(process.cwd(), directory);

      const files = fs.readdirSync(fullPath, { withFileTypes: true })
        .filter(item => item.isFile())
        .map(item => ( directory + item.name ) );

      return JSON.stringify(files);
    } catch (error) {
      console.error(`Error reading directory: ${directory}`, error);
      return JSON.stringify([]);
    }
  };

  //
  // GET JSON FROM CSVS
  // Takes the array from 
  //
  filters.getJSONFromCSVs = function( csvFiles, existingFiles ){

    const allFiles = ( Array.isArray(existingFiles) ) ? existingFiles : [];

    csvFiles = JSON.parse(csvFiles);

    if( Array.isArray( csvFiles ) && csvFiles.length > 0 ){

      const fs = require('fs');
      const { parse } = require('csv-parse/sync');
      
      csvFiles.forEach( function( csv ){

        if( csv.substring(csv.length - 4) === '.csv' ){
          let csvJSON = fs.readFileSync(csv, 'utf8');
          csvJSON = parse(csvJSON, { columns: true, skip_empty_lines: true });
          allFiles.push( csvJSON[0] );
        }

      });

    }

    return allFiles;

  };

  //
  // GET ACTIVE LETTERS
  //
  filters.getActiveLetters = function( items ){

    items = ( Array.isArray( items ) && items.length > 0 ) ? items : [];

    const letters = [];

    items.forEach(function( item ){
      letters.push( item.letter );
    });

    return letters.join('');

  };

  //
  // SORT ITEMS ALPHABETICALLY
  // Takes an array of objects and sort them into objects
  //
  filters.sortItemsAlphabetically = function( items ){

    items = ( Array.isArray( items ) && items.length > 0 ) ? items : [];

    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const letterArrays = [];

    allLetters.forEach( function( letter ){

      const letterArray = [];

      items.forEach( function( item ){

        if( item && item.data_product_name.toUpperCase().substring(0,1) === letter ){
          letterArray.push( item );
        }
      });

      if( letterArray.length > 0 ){

        letterArray.sort( function(a, b) {
          return a.data_product_name.localeCompare( b.data_product_name, undefined, { sensitivity: 'base' } )
        } );

        letterArrays.push({
          letter: letter,
          items: letterArray
        });


      }

    });

    return letterArrays;

  };


  //
  // SORT ITEMS ALPHABETICALLY SIMPLE
  // Takes an array of objects and sorts them by data_product_name
  //
  filters.sortItemsAlphabeticallySimple = function( items ){
    
    items = ( Array.isArray( items ) && items.length > 0 ) ? items : [];

    items.sort( function(a, b) {
          return a.data_product_name.localeCompare( b.data_product_name, undefined, { sensitivity: 'base' } )
    } );

    return items;
  
  }

  //
  // MAKE COMPARISON AND CONVERT TO TABLE ROWS
  // Takes the public and prescribing objects and compares them, outputting table rows
  // Sepcifically for this page: /data-hub/mvp/v6/comparison
  //
  filters.makeComparisonAndConvertToTableRows = function( publicItems, prescribingItems ){

    publicItems = ( Array.isArray( publicItems ) && publicItems.length > 0 ) ? publicItems : [];
    prescribingItems = ( Array.isArray( prescribingItems ) && prescribingItems.length > 0 ) ? prescribingItems : [];

    console.log( publicItems );
    console.log( prescribingItems );

    const tableItems = [];

    publicItems.forEach( function( publicItem ){

      if( publicItem ){

        const obj = [
          { html : '<a href="../view?id=' + publicItem.data_product_external_id + '&tag=' + publicItem.tag + '">'+ publicItem.data_product_name +'</a>' }
        ];
        
        prescribingItems.forEach( function( prescribingItem ){

          if( prescribingItem ){

            console.log( prescribingItem.data_product_name );

            if( publicItem.data_product_name.toLowerCase().trim() === prescribingItem.data_product_name.toLowerCase().trim() ){
              
              
              
              obj.push(
                { html : '<a href="../view?id=' + prescribingItem.data_product_external_id + '&tag=' + prescribingItem.tag + '">'+ prescribingItem.data_product_name +'</a>' }
              );
            } 

          }

        });

        if( obj.length === 1 ){
          obj.push( { text: '' } );
        }

        tableItems.push( obj );

      }

    });

    return tableItems;

  }

  //
  // CONVERT TO TABLE ROWS
  // Takes a simple array of objects, and outputs rows for the table component
  //
  filters.convertToTableRows = function( items ){

    items = ( Array.isArray( items ) && items.length > 0 ) ? items : [];

    const tableItems = [];

    items.forEach( function( item ){

      if( item ){

        const obj = [
          { html : '<a href="../view?id=' + item.data_product_external_id + '&tag=' + item.tag + '">'+ item.data_product_name +'</a>' },
          { html : filters.getTag( item.tag ) }
        ];

        tableItems.push( obj );

      }

    });

    return tableItems;

  }

  //
  // CONTAINS
  //
  filters.contains = function( haystack, needle ){
    let check = false;
    if( haystack.indexOf( needle ) > -1 ){
      check = true;
    }
    return check;
  };

  //
  // GENERATE A-Z LINKS
  //
  filters.generateAToZLinks = function( letters ){

    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let activeLetters = ( /^[A-Z]+$/.test(letters) ) ? letters.split('') : [];

    let html = '';

    if( letters ){
      html += '<nav class="nhsuk-u-clear"><ol class="nhsuk-list">';
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
    }

    return html;

  }

  //
  // GET TAG TEXT
  //
  filters.getTagText = function( txt ){

    let newText = '';

    if( txt ){

      switch( txt ){
        case 'ePACT':
          newText = 'Prescribing and dispensing';
          break;
        case 'eDEN':
          newText = 'Dental';
          break;
        case 'eOPS':
          newText = 'Ophthalmic';
          break;
        case 'PUBLIC_AVAILABLE_DATA':
          newText = 'Public';
          break;
      }

    }

    return newText;

  };

  //
  // GET TAG
  //
  filters.getTag = function( txt ){

    let newHTML = '';

    if( txt ){

      switch( txt ){
          case 'ePACT':
            newHTML = '<strong class="nhsuk-tag nhsuk-tag--blue">' + filters.getTagText(txt) + '</strong>';
            break;
          case 'eDEN':
            newHTML = '<strong class="nhsuk-tag nhsuk-tag--green">' + filters.getTagText(txt) + '</strong>';
            break;
          case 'eOPS':
            newHTML = '<strong class="nhsuk-tag nhsuk-tag--yellow">' + filters.getTagText(txt) + '</strong>';
            break;
          case 'PUBLIC_AVAILABLE_DATA':
            newHTML = '<strong class="nhsuk-tag nhsuk-tag--white">' + filters.getTagText(txt) + '</strong>';
            break;
        }

      }

      return newHTML;

  }



  //
  // GET ITEM FROM ID
  //
  filters.getItemFromID = function( id, items ){
    
    let item = { error: 'No report found with ID: ' + id };

    if( Array.isArray( items ) && items.length > 0 ){

      items.forEach( function( report ){

        if( report.data_product_external_id && report.data_product_external_id === id ){
          item = report;
        }
      });

    }

    return item;

  };

  //
  // FORMAT DATE TIME
  //
  filters.formatDateTime = function formatDateTime(dateInput) {

    console.log( dateInput );

    const date = ( dateInput instanceof Date ) ? dateInput : new Date(dateInput);

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'long' });
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const amPm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12 || 12;

    return `${day} ${month} ${year} at ${hours}:${minutes} ${amPm}`;
  };


  //
  // PROCESS MARKDOWN
  //
  filters.processMarkdown = function( markdown ){

    const MarkdownIt = require('markdown-it');
    const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
    });

    return md.render( markdown || '').split('<h2>').join('<h2 class="nhsuk-heading-m">');

  }

  //
  // FILTER REPORTS BY SEARCH TERM
  //
  filters.filterReportsBySearchTerm = function( searchTerms, items ){

    let filteredItems = [];

    console.log( 'FILTERING' );
    console.log( searchTerms );

    if( Array.isArray(items) && items.length > 0 && Array.isArray( searchTerms ) && searchTerms.length > 0 ){

      items.forEach(function( item ){
        
        searchTerms.forEach( function( searchTerm ){

          const searchTermNameIndex = item.data_product_name.toLowerCase().indexOf( searchTerm.toLowerCase() );
          const searchTermDescriptionIndex = item.data_product_description.toLowerCase().indexOf( searchTerm.toLowerCase() );

          if( searchTermNameIndex > -1 || searchTermDescriptionIndex > -1 ){

            if( searchTermNameIndex > -1 ){
              item.data_product_name = item.data_product_name.substring(0,searchTermNameIndex) + '<mark>' + item.data_product_name.substring(searchTermNameIndex,searchTermNameIndex+searchTerm.length) + '</mark>' + item.data_product_name.substring(searchTermNameIndex+searchTerm.length);
            }

            if( searchTermDescriptionIndex > -1 ){
              item.data_product_description = item.data_product_description.substring(0,searchTermDescriptionIndex) + '<mark>' + item.data_product_description.substring(searchTermDescriptionIndex,searchTermDescriptionIndex+searchTerm.length) + '</mark>' + item.data_product_description.substring(searchTermDescriptionIndex+searchTerm.length);
            }

            if( !filters.arrayContainsReport( item.data_product_external_id, filteredItems ) ){
              filteredItems.push( item );
            }

          }

        });

      });
    } else {
      filteredItems = items;
    }

    return filteredItems;

  };


  //
  // ARRAY CONTAINS REPORT
  //
  filters.arrayContainsReport = function( id, reports ){

    let check = false;

    reports.forEach(function( report ){
      if( report.data_product_external_id === id ){
        check = true;
      }
    });

    return check;

  };


  //
  // FILTER REPORTS BY TYPE
  //
  filters.filterReportsByType = function( reportTypeFilters, items ){

    items = ( Array.isArray( items ) && items.length > 0 ) ? items : [];

    const newItems = [];

    if( Array.isArray(reportTypeFilters) &&  reportTypeFilters.length > 0 ){

      items.forEach(function( item ){
        if( reportTypeFilters.indexOf( item.tag ) > -1 ){
          newItems.push( item );
        }
      });

    }

    return newItems;

  }


  return filters;
};
