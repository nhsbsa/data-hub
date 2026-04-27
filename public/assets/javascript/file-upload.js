// app/assets/javascript/file-upload.js
if (MOJFrontend.dragAndDropSupported() && MOJFrontend.formDataSupported() && MOJFrontend.fileApiSupported()) {
  MOJFrontend.MultiFileUpload = function(params) {
    this.defaultParams = {
      uploadFileEntryHook: $.noop,
      uploadFileExitHook: $.noop,
      uploadFileErrorHook: $.noop,
      fileDeleteHook: $.noop,
      uploadStatusText: "Uploading files, please wait",
      dropzoneHintText: "Drag and drop files here or",
      dropzoneButtonText: "Choose files"
    };
    this.params = $.extend({}, this.defaultParams, params);
    this.params.container.addClass("moj-multi-file-upload--enhanced");
    this.feedbackContainer = this.params.container.find(".moj-multi-file__uploaded-files");
    this.setupFileInput();
    this.setupDropzone();
    this.setupLabel();
    this.setupStatusBox();
    this.params.container.on("click", ".moj-multi-file-upload__delete", $.proxy(this, "onFileDeleteClick"));
  };
  MOJFrontend.MultiFileUpload.prototype.setupDropzone = function() {
    this.fileInput.wrap('<div class="moj-multi-file-upload__dropzone" />');
    this.dropzone = this.params.container.find(".moj-multi-file-upload__dropzone");
    this.dropzone.on("dragover", $.proxy(this, "onDragOver"));
    this.dropzone.on("dragleave", $.proxy(this, "onDragLeave"));
    this.dropzone.on("drop", $.proxy(this, "onDrop"));
  };
  MOJFrontend.MultiFileUpload.prototype.setupLabel = function() {
    this.label = $('<label for="' + this.fileInput[0].id + '" class="govuk-button govuk-button--secondary">' + this.params.dropzoneButtonText + "</label>");
    this.dropzone.append('<p class="govuk-body">' + this.params.dropzoneHintText + "</p>");
    this.dropzone.append(this.label);
  };
  MOJFrontend.MultiFileUpload.prototype.setupFileInput = function() {
    this.fileInput = this.params.container.find(".moj-multi-file-upload__input");
    this.fileInput.on("change", $.proxy(this, "onFileChange"));
    this.fileInput.on("focus", $.proxy(this, "onFileFocus"));
    this.fileInput.on("blur", $.proxy(this, "onFileBlur"));
  };
  MOJFrontend.MultiFileUpload.prototype.setupStatusBox = function() {
    this.status = $('<div aria-live="polite" role="status" class="govuk-visually-hidden" />');
    this.dropzone.append(this.status);
  };
  MOJFrontend.MultiFileUpload.prototype.onDragOver = function(e) {
    e.preventDefault();
    this.dropzone.addClass("moj-multi-file-upload--dragover");
  };
  MOJFrontend.MultiFileUpload.prototype.onDragLeave = function() {
    this.dropzone.removeClass("moj-multi-file-upload--dragover");
  };
  MOJFrontend.MultiFileUpload.prototype.onDrop = function(e) {
    e.preventDefault();
    this.dropzone.removeClass("moj-multi-file-upload--dragover");
    this.feedbackContainer.removeClass("moj-hidden");
    this.status.html(this.params.uploadStatusText);
    this.uploadFiles(e.originalEvent.dataTransfer.files);
  };
  MOJFrontend.MultiFileUpload.prototype.uploadFiles = function(files) {
    for (var i = 0; i < files.length; i++) {
      this.uploadFile(files[i]);
    }
  };
  MOJFrontend.MultiFileUpload.prototype.onFileChange = function(e) {
    this.feedbackContainer.removeClass("moj-hidden");
    this.status.html(this.params.uploadStatusText);
    this.uploadFiles(e.currentTarget.files);
    this.fileInput.replaceWith($(e.currentTarget).val("").clone(true));
    this.setupFileInput();
    this.fileInput.focus();
  };
  MOJFrontend.MultiFileUpload.prototype.onFileFocus = function(e) {
    this.label.addClass("moj-multi-file-upload--focused");
  };
  MOJFrontend.MultiFileUpload.prototype.onFileBlur = function(e) {
    this.label.removeClass("moj-multi-file-upload--focused");
  };
  MOJFrontend.MultiFileUpload.prototype.getSuccessHtml = function(success) {
    return '<span class="moj-multi-file-upload__success"> <svg class="moj-banner__icon" fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25"><path d="M25,6.2L8.7,23.2L0,14.1l4-4.2l4.7,4.9L21,2L25,6.2z"/></svg> ' + success.messageHtml + "</span>";
  };
  MOJFrontend.MultiFileUpload.prototype.getErrorHtml = function(error) {
    return '<span class="moj-multi-file-upload__error"> <svg class="moj-banner__icon" fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25"><path d="M13.6,15.4h-2.3v-4.5h2.3V15.4z M13.6,19.8h-2.3v-2.2h2.3V19.8z M0,23.2h25L12.5,2L0,23.2z"/></svg> ' + error.message + "</span>";
  };
  MOJFrontend.MultiFileUpload.prototype.getFileRowHtml = function(file) {
    var html = "";
    html += '<div class="govuk-summary-list__row moj-multi-file-upload__row">';
    html += '  <div class="govuk-summary-list__value moj-multi-file-upload__message">';
    html += '<span class="moj-multi-file-upload__filename">' + file.name + "</span>";
    html += '<span class="moj-multi-file-upload__progress">0%</span>';
    html += "  </div>";
    html += '  <div class="govuk-summary-list__actions moj-multi-file-upload__actions"></div>';
    html += "</div>";
    return html;
  };
  MOJFrontend.MultiFileUpload.prototype.getDeleteButtonHtml = function(file) {
    var html = '<button class="moj-multi-file-upload__delete govuk-button govuk-button--secondary govuk-!-margin-bottom-0" type="button" name="delete" value="' + file.filename + '">';
    html += 'Delete <span class="govuk-visually-hidden">' + file.originalname + "</span>";
    html += "</button>";
    return html;
  };
  MOJFrontend.MultiFileUpload.prototype.uploadFile = function(file) {
    this.params.uploadFileEntryHook(this, file);
    var formData = new FormData();
    formData.append("documents", file);
    var item = $(this.getFileRowHtml(file));
    this.feedbackContainer.find(".moj-multi-file-upload__list").append(item);
    $.ajax({
      url: this.params.uploadUrl,
      type: "post",
      data: formData,
      processData: false,
      contentType: false,
      success: $.proxy(function(response) {
        if (response.error) {
          item.find(".moj-multi-file-upload__message").html(this.getErrorHtml(response.error));
          this.status.html(response.error.message);
        } else {
          item.find(".moj-multi-file-upload__message").html(this.getSuccessHtml(response.success));
          this.status.html(response.success.messageText);
        }
        item.find(".moj-multi-file-upload__actions").append(this.getDeleteButtonHtml(response.file));
        this.params.uploadFileExitHook(this, file, response);
      }, this),
      error: $.proxy(function(jqXHR, textStatus, errorThrown) {
        this.params.uploadFileErrorHook(this, file, jqXHR, textStatus, errorThrown);
      }, this),
      xhr: function() {
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(e) {
          if (e.lengthComputable) {
            var percentComplete = e.loaded / e.total;
            percentComplete = parseInt(percentComplete * 100, 10);
            item.find(".moj-multi-file-upload__progress").text(" " + percentComplete + "%");
          }
        }, false);
        return xhr;
      }
    });
  };
  MOJFrontend.MultiFileUpload.prototype.onFileDeleteClick = function(e) {
    e.preventDefault();
    var button = $(e.currentTarget);
    var data = {};
    data[button[0].name] = button[0].value;
    $.ajax({
      url: this.params.deleteUrl,
      type: "post",
      dataType: "json",
      data,
      success: $.proxy(function(response) {
        if (response.error) {
        } else {
          button.parents(".moj-multi-file-upload__row").remove();
          if (this.feedbackContainer.find(".moj-multi-file-upload__row").length === 0) {
            this.feedbackContainer.addClass("moj-hidden");
          }
        }
        this.params.fileDeleteHook(this, response);
      }, this)
    });
  };
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L2ZpbGUtdXBsb2FkLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpZihNT0pGcm9udGVuZC5kcmFnQW5kRHJvcFN1cHBvcnRlZCgpICYmIE1PSkZyb250ZW5kLmZvcm1EYXRhU3VwcG9ydGVkKCkgJiYgTU9KRnJvbnRlbmQuZmlsZUFwaVN1cHBvcnRlZCgpKSB7XG4gICAgTU9KRnJvbnRlbmQuTXVsdGlGaWxlVXBsb2FkID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICB0aGlzLmRlZmF1bHRQYXJhbXMgPSB7XG4gICAgICAgIHVwbG9hZEZpbGVFbnRyeUhvb2s6ICQubm9vcCxcbiAgICAgICAgdXBsb2FkRmlsZUV4aXRIb29rOiAkLm5vb3AsXG4gICAgICAgIHVwbG9hZEZpbGVFcnJvckhvb2s6ICQubm9vcCxcbiAgICAgICAgZmlsZURlbGV0ZUhvb2s6ICQubm9vcCxcbiAgICAgICAgdXBsb2FkU3RhdHVzVGV4dDogJ1VwbG9hZGluZyBmaWxlcywgcGxlYXNlIHdhaXQnLFxuICAgICAgICBkcm9wem9uZUhpbnRUZXh0OiAnRHJhZyBhbmQgZHJvcCBmaWxlcyBoZXJlIG9yJyxcbiAgICAgICAgZHJvcHpvbmVCdXR0b25UZXh0OiAnQ2hvb3NlIGZpbGVzJ1xuICAgICAgfTtcbiAgIFxuICAgICAgdGhpcy5wYXJhbXMgPSAkLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0UGFyYW1zLCBwYXJhbXMpO1xuICAgXG4gICAgICB0aGlzLnBhcmFtcy5jb250YWluZXIuYWRkQ2xhc3MoJ21vai1tdWx0aS1maWxlLXVwbG9hZC0tZW5oYW5jZWQnKTtcbiAgIFxuICAgICAgdGhpcy5mZWVkYmFja0NvbnRhaW5lciA9IHRoaXMucGFyYW1zLmNvbnRhaW5lci5maW5kKCcubW9qLW11bHRpLWZpbGVfX3VwbG9hZGVkLWZpbGVzJyk7XG4gICAgICB0aGlzLnNldHVwRmlsZUlucHV0KCk7XG4gICAgICB0aGlzLnNldHVwRHJvcHpvbmUoKTtcbiAgICAgIHRoaXMuc2V0dXBMYWJlbCgpO1xuICAgICAgdGhpcy5zZXR1cFN0YXR1c0JveCgpO1xuICAgICAgdGhpcy5wYXJhbXMuY29udGFpbmVyLm9uKCdjbGljaycsICcubW9qLW11bHRpLWZpbGUtdXBsb2FkX19kZWxldGUnLCAkLnByb3h5KHRoaXMsICdvbkZpbGVEZWxldGVDbGljaycpKTtcbiAgICB9O1xuICAgXG4gICAgTU9KRnJvbnRlbmQuTXVsdGlGaWxlVXBsb2FkLnByb3RvdHlwZS5zZXR1cERyb3B6b25lID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmZpbGVJbnB1dC53cmFwKCc8ZGl2IGNsYXNzPVwibW9qLW11bHRpLWZpbGUtdXBsb2FkX19kcm9wem9uZVwiIC8+Jyk7XG4gICAgICB0aGlzLmRyb3B6b25lID0gdGhpcy5wYXJhbXMuY29udGFpbmVyLmZpbmQoJy5tb2otbXVsdGktZmlsZS11cGxvYWRfX2Ryb3B6b25lJyk7XG4gICAgICB0aGlzLmRyb3B6b25lLm9uKCdkcmFnb3ZlcicsICQucHJveHkodGhpcywgJ29uRHJhZ092ZXInKSk7XG4gICAgICB0aGlzLmRyb3B6b25lLm9uKCdkcmFnbGVhdmUnLCAkLnByb3h5KHRoaXMsICdvbkRyYWdMZWF2ZScpKTtcbiAgICAgIHRoaXMuZHJvcHpvbmUub24oJ2Ryb3AnLCAkLnByb3h5KHRoaXMsICdvbkRyb3AnKSk7XG4gICAgfTtcbiAgIFxuICAgIE1PSkZyb250ZW5kLk11bHRpRmlsZVVwbG9hZC5wcm90b3R5cGUuc2V0dXBMYWJlbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5sYWJlbCA9ICQoJzxsYWJlbCBmb3I9XCInK3RoaXMuZmlsZUlucHV0WzBdLmlkKydcIiBjbGFzcz1cImdvdnVrLWJ1dHRvbiBnb3Z1ay1idXR0b24tLXNlY29uZGFyeVwiPicrIHRoaXMucGFyYW1zLmRyb3B6b25lQnV0dG9uVGV4dCArJzwvbGFiZWw+Jyk7XG4gICAgICB0aGlzLmRyb3B6b25lLmFwcGVuZCgnPHAgY2xhc3M9XCJnb3Z1ay1ib2R5XCI+JyArIHRoaXMucGFyYW1zLmRyb3B6b25lSGludFRleHQgKyAnPC9wPicpO1xuICAgICAgdGhpcy5kcm9wem9uZS5hcHBlbmQodGhpcy5sYWJlbCk7XG4gICAgfTtcbiAgIFxuICAgIE1PSkZyb250ZW5kLk11bHRpRmlsZVVwbG9hZC5wcm90b3R5cGUuc2V0dXBGaWxlSW5wdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZmlsZUlucHV0ID0gdGhpcy5wYXJhbXMuY29udGFpbmVyLmZpbmQoJy5tb2otbXVsdGktZmlsZS11cGxvYWRfX2lucHV0Jyk7XG4gICAgICB0aGlzLmZpbGVJbnB1dC5vbignY2hhbmdlJywgJC5wcm94eSh0aGlzLCAnb25GaWxlQ2hhbmdlJykpO1xuICAgICAgdGhpcy5maWxlSW5wdXQub24oJ2ZvY3VzJywgJC5wcm94eSh0aGlzLCAnb25GaWxlRm9jdXMnKSk7XG4gICAgICB0aGlzLmZpbGVJbnB1dC5vbignYmx1cicsICQucHJveHkodGhpcywgJ29uRmlsZUJsdXInKSk7XG4gICAgfTtcbiAgIFxuICAgIE1PSkZyb250ZW5kLk11bHRpRmlsZVVwbG9hZC5wcm90b3R5cGUuc2V0dXBTdGF0dXNCb3ggPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuc3RhdHVzID0gJCgnPGRpdiBhcmlhLWxpdmU9XCJwb2xpdGVcIiByb2xlPVwic3RhdHVzXCIgY2xhc3M9XCJnb3Z1ay12aXN1YWxseS1oaWRkZW5cIiAvPicpO1xuICAgICAgdGhpcy5kcm9wem9uZS5hcHBlbmQodGhpcy5zdGF0dXMpO1xuICAgIH07XG4gICBcbiAgICBNT0pGcm9udGVuZC5NdWx0aUZpbGVVcGxvYWQucHJvdG90eXBlLm9uRHJhZ092ZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLmRyb3B6b25lLmFkZENsYXNzKCdtb2otbXVsdGktZmlsZS11cGxvYWQtLWRyYWdvdmVyJyk7XG4gICAgfTtcbiAgIFxuICAgIE1PSkZyb250ZW5kLk11bHRpRmlsZVVwbG9hZC5wcm90b3R5cGUub25EcmFnTGVhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZHJvcHpvbmUucmVtb3ZlQ2xhc3MoJ21vai1tdWx0aS1maWxlLXVwbG9hZC0tZHJhZ292ZXInKTtcbiAgICB9O1xuICAgXG4gICAgTU9KRnJvbnRlbmQuTXVsdGlGaWxlVXBsb2FkLnByb3RvdHlwZS5vbkRyb3AgPSBmdW5jdGlvbihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLmRyb3B6b25lLnJlbW92ZUNsYXNzKCdtb2otbXVsdGktZmlsZS11cGxvYWQtLWRyYWdvdmVyJyk7XG4gICAgICB0aGlzLmZlZWRiYWNrQ29udGFpbmVyLnJlbW92ZUNsYXNzKCdtb2otaGlkZGVuJyk7XG4gICAgICB0aGlzLnN0YXR1cy5odG1sKHRoaXMucGFyYW1zLnVwbG9hZFN0YXR1c1RleHQpO1xuICAgICAgdGhpcy51cGxvYWRGaWxlcyhlLm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzKTtcbiAgICB9O1xuICAgXG4gICAgTU9KRnJvbnRlbmQuTXVsdGlGaWxlVXBsb2FkLnByb3RvdHlwZS51cGxvYWRGaWxlcyA9IGZ1bmN0aW9uKGZpbGVzKSB7XG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy51cGxvYWRGaWxlKGZpbGVzW2ldKTtcbiAgICAgIH1cbiAgICB9O1xuICAgXG4gICAgTU9KRnJvbnRlbmQuTXVsdGlGaWxlVXBsb2FkLnByb3RvdHlwZS5vbkZpbGVDaGFuZ2UgPSBmdW5jdGlvbihlKSB7XG4gICAgICB0aGlzLmZlZWRiYWNrQ29udGFpbmVyLnJlbW92ZUNsYXNzKCdtb2otaGlkZGVuJyk7XG4gICAgICB0aGlzLnN0YXR1cy5odG1sKHRoaXMucGFyYW1zLnVwbG9hZFN0YXR1c1RleHQpO1xuICAgICAgdGhpcy51cGxvYWRGaWxlcyhlLmN1cnJlbnRUYXJnZXQuZmlsZXMpO1xuICAgICAgdGhpcy5maWxlSW5wdXQucmVwbGFjZVdpdGgoJChlLmN1cnJlbnRUYXJnZXQpLnZhbCgnJykuY2xvbmUodHJ1ZSkpO1xuICAgICAgdGhpcy5zZXR1cEZpbGVJbnB1dCgpO1xuICAgICAgdGhpcy5maWxlSW5wdXQuZm9jdXMoKTtcbiAgICB9O1xuICAgXG4gICAgTU9KRnJvbnRlbmQuTXVsdGlGaWxlVXBsb2FkLnByb3RvdHlwZS5vbkZpbGVGb2N1cyA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHRoaXMubGFiZWwuYWRkQ2xhc3MoJ21vai1tdWx0aS1maWxlLXVwbG9hZC0tZm9jdXNlZCcpO1xuICAgIH07XG4gICBcbiAgICBNT0pGcm9udGVuZC5NdWx0aUZpbGVVcGxvYWQucHJvdG90eXBlLm9uRmlsZUJsdXIgPSBmdW5jdGlvbihlKSB7XG4gICAgICB0aGlzLmxhYmVsLnJlbW92ZUNsYXNzKCdtb2otbXVsdGktZmlsZS11cGxvYWQtLWZvY3VzZWQnKTtcbiAgICB9O1xuICAgXG4gICAgTU9KRnJvbnRlbmQuTXVsdGlGaWxlVXBsb2FkLnByb3RvdHlwZS5nZXRTdWNjZXNzSHRtbCA9IGZ1bmN0aW9uKHN1Y2Nlc3MpIHtcbiAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCJtb2otbXVsdGktZmlsZS11cGxvYWRfX3N1Y2Nlc3NcIj4gPHN2ZyBjbGFzcz1cIm1vai1iYW5uZXJfX2ljb25cIiBmaWxsPVwiY3VycmVudENvbG9yXCIgcm9sZT1cInByZXNlbnRhdGlvblwiIGZvY3VzYWJsZT1cImZhbHNlXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjUgMjVcIiBoZWlnaHQ9XCIyNVwiIHdpZHRoPVwiMjVcIj48cGF0aCBkPVwiTTI1LDYuMkw4LjcsMjMuMkwwLDE0LjFsNC00LjJsNC43LDQuOUwyMSwyTDI1LDYuMnpcIi8+PC9zdmc+ICcgKyBzdWNjZXNzLm1lc3NhZ2VIdG1sICsgJzwvc3Bhbj4nO1xuICAgIH07XG4gICBcbiAgICBNT0pGcm9udGVuZC5NdWx0aUZpbGVVcGxvYWQucHJvdG90eXBlLmdldEVycm9ySHRtbCA9IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwibW9qLW11bHRpLWZpbGUtdXBsb2FkX19lcnJvclwiPiA8c3ZnIGNsYXNzPVwibW9qLWJhbm5lcl9faWNvblwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiByb2xlPVwicHJlc2VudGF0aW9uXCIgZm9jdXNhYmxlPVwiZmFsc2VcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNSAyNVwiIGhlaWdodD1cIjI1XCIgd2lkdGg9XCIyNVwiPjxwYXRoIGQ9XCJNMTMuNiwxNS40aC0yLjN2LTQuNWgyLjNWMTUuNHogTTEzLjYsMTkuOGgtMi4zdi0yLjJoMi4zVjE5Ljh6IE0wLDIzLjJoMjVMMTIuNSwyTDAsMjMuMnpcIi8+PC9zdmc+ICcrIGVycm9yLm1lc3NhZ2UgKyc8L3NwYW4+JztcbiAgICB9O1xuICAgXG4gICAgTU9KRnJvbnRlbmQuTXVsdGlGaWxlVXBsb2FkLnByb3RvdHlwZS5nZXRGaWxlUm93SHRtbCA9IGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgIHZhciBodG1sID0gJyc7XG4gICAgICBodG1sICs9ICc8ZGl2IGNsYXNzPVwiZ292dWstc3VtbWFyeS1saXN0X19yb3cgbW9qLW11bHRpLWZpbGUtdXBsb2FkX19yb3dcIj4nO1xuICAgICAgaHRtbCArPSAnICA8ZGl2IGNsYXNzPVwiZ292dWstc3VtbWFyeS1saXN0X192YWx1ZSBtb2otbXVsdGktZmlsZS11cGxvYWRfX21lc3NhZ2VcIj4nO1xuICAgICAgaHRtbCArPSAgICAgICAnPHNwYW4gY2xhc3M9XCJtb2otbXVsdGktZmlsZS11cGxvYWRfX2ZpbGVuYW1lXCI+JytmaWxlLm5hbWUrJzwvc3Bhbj4nO1xuICAgICAgaHRtbCArPSAgICAgICAnPHNwYW4gY2xhc3M9XCJtb2otbXVsdGktZmlsZS11cGxvYWRfX3Byb2dyZXNzXCI+MCU8L3NwYW4+JztcbiAgICAgIGh0bWwgKz0gJyAgPC9kaXY+JztcbiAgICAgIGh0bWwgKz0gJyAgPGRpdiBjbGFzcz1cImdvdnVrLXN1bW1hcnktbGlzdF9fYWN0aW9ucyBtb2otbXVsdGktZmlsZS11cGxvYWRfX2FjdGlvbnNcIj48L2Rpdj4nO1xuICAgICAgaHRtbCArPSAnPC9kaXY+JztcbiAgICAgIHJldHVybiBodG1sO1xuICAgIH07XG4gICBcbiAgICBNT0pGcm9udGVuZC5NdWx0aUZpbGVVcGxvYWQucHJvdG90eXBlLmdldERlbGV0ZUJ1dHRvbkh0bWwgPSBmdW5jdGlvbihmaWxlKSB7XG4gICAgICB2YXIgaHRtbCA9ICc8YnV0dG9uIGNsYXNzPVwibW9qLW11bHRpLWZpbGUtdXBsb2FkX19kZWxldGUgZ292dWstYnV0dG9uIGdvdnVrLWJ1dHRvbi0tc2Vjb25kYXJ5IGdvdnVrLSEtbWFyZ2luLWJvdHRvbS0wXCIgdHlwZT1cImJ1dHRvblwiIG5hbWU9XCJkZWxldGVcIiB2YWx1ZT1cIicgKyBmaWxlLmZpbGVuYW1lICsgJ1wiPic7XG4gICAgICBodG1sICs9ICdEZWxldGUgPHNwYW4gY2xhc3M9XCJnb3Z1ay12aXN1YWxseS1oaWRkZW5cIj4nICsgZmlsZS5vcmlnaW5hbG5hbWUgKyAnPC9zcGFuPic7XG4gICAgICBodG1sICs9ICc8L2J1dHRvbj4nO1xuICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfTtcbiAgIFxuICAgIE1PSkZyb250ZW5kLk11bHRpRmlsZVVwbG9hZC5wcm90b3R5cGUudXBsb2FkRmlsZSA9IGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgIHRoaXMucGFyYW1zLnVwbG9hZEZpbGVFbnRyeUhvb2sodGhpcywgZmlsZSk7XG4gICAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZG9jdW1lbnRzJywgZmlsZSk7XG4gICAgICB2YXIgaXRlbSA9ICQodGhpcy5nZXRGaWxlUm93SHRtbChmaWxlKSk7XG4gICAgICB0aGlzLmZlZWRiYWNrQ29udGFpbmVyLmZpbmQoJy5tb2otbXVsdGktZmlsZS11cGxvYWRfX2xpc3QnKS5hcHBlbmQoaXRlbSk7XG4gICBcbiAgICAgICQuYWpheCh7XG4gICAgICAgIHVybDogdGhpcy5wYXJhbXMudXBsb2FkVXJsLFxuICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogJC5wcm94eShmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAgIGl0ZW0uZmluZCgnLm1vai1tdWx0aS1maWxlLXVwbG9hZF9fbWVzc2FnZScpLmh0bWwodGhpcy5nZXRFcnJvckh0bWwocmVzcG9uc2UuZXJyb3IpKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzLmh0bWwocmVzcG9uc2UuZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl0ZW0uZmluZCgnLm1vai1tdWx0aS1maWxlLXVwbG9hZF9fbWVzc2FnZScpLmh0bWwodGhpcy5nZXRTdWNjZXNzSHRtbChyZXNwb25zZS5zdWNjZXNzKSk7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cy5odG1sKHJlc3BvbnNlLnN1Y2Nlc3MubWVzc2FnZVRleHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpdGVtLmZpbmQoJy5tb2otbXVsdGktZmlsZS11cGxvYWRfX2FjdGlvbnMnKS5hcHBlbmQodGhpcy5nZXREZWxldGVCdXR0b25IdG1sKHJlc3BvbnNlLmZpbGUpKTtcbiAgICAgICAgICB0aGlzLnBhcmFtcy51cGxvYWRGaWxlRXhpdEhvb2sodGhpcywgZmlsZSwgcmVzcG9uc2UpO1xuICAgICAgICB9LCB0aGlzKSxcbiAgICAgICAgZXJyb3I6ICQucHJveHkoZnVuY3Rpb24oanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgICAgdGhpcy5wYXJhbXMudXBsb2FkRmlsZUVycm9ySG9vayh0aGlzLCBmaWxlLCBqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pO1xuICAgICAgICB9LCB0aGlzKSxcbiAgICAgICAgeGhyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgeGhyLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGlmIChlLmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICAgICAgdmFyIHBlcmNlbnRDb21wbGV0ZSA9IGUubG9hZGVkIC8gZS50b3RhbDtcbiAgICAgICAgICAgICAgcGVyY2VudENvbXBsZXRlID0gcGFyc2VJbnQocGVyY2VudENvbXBsZXRlICogMTAwLCAxMCk7XG4gICAgICAgICAgICAgIGl0ZW0uZmluZCgnLm1vai1tdWx0aS1maWxlLXVwbG9hZF9fcHJvZ3Jlc3MnKS50ZXh0KCcgJyArIHBlcmNlbnRDb21wbGV0ZSArICclJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgIHJldHVybiB4aHI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gICBcbiAgICBNT0pGcm9udGVuZC5NdWx0aUZpbGVVcGxvYWQucHJvdG90eXBlLm9uRmlsZURlbGV0ZUNsaWNrID0gZnVuY3Rpb24oZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBpZiB1c2VyIHJlZnJlc2hlcyBwYWdlIGFuZCB0aGVuIGRlbGV0ZXNcbiAgICAgIHZhciBidXR0b24gPSAkKGUuY3VycmVudFRhcmdldCk7XG4gICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgZGF0YVtidXR0b25bMF0ubmFtZV0gPSBidXR0b25bMF0udmFsdWU7XG4gICAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IHRoaXMucGFyYW1zLmRlbGV0ZVVybCxcbiAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICBzdWNjZXNzOiAkLnByb3h5KGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICAgLy8gaGFuZGxlIGVycm9yXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJ1dHRvbi5wYXJlbnRzKCcubW9qLW11bHRpLWZpbGUtdXBsb2FkX19yb3cnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIGlmKHRoaXMuZmVlZGJhY2tDb250YWluZXIuZmluZCgnLm1vai1tdWx0aS1maWxlLXVwbG9hZF9fcm93JykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tDb250YWluZXIuYWRkQ2xhc3MoJ21vai1oaWRkZW4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5wYXJhbXMuZmlsZURlbGV0ZUhvb2sodGhpcywgcmVzcG9uc2UpO1xuICAgICAgICB9LCB0aGlzKVxuICAgICAgfSk7XG4gICAgfTtcbiAgfSJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxJQUFHLFlBQVkscUJBQXFCLEtBQUssWUFBWSxrQkFBa0IsS0FBSyxZQUFZLGlCQUFpQixHQUFHO0FBQ3hHLGNBQVksa0JBQWtCLFNBQVMsUUFBUTtBQUM3QyxTQUFLLGdCQUFnQjtBQUFBLE1BQ25CLHFCQUFxQixFQUFFO0FBQUEsTUFDdkIsb0JBQW9CLEVBQUU7QUFBQSxNQUN0QixxQkFBcUIsRUFBRTtBQUFBLE1BQ3ZCLGdCQUFnQixFQUFFO0FBQUEsTUFDbEIsa0JBQWtCO0FBQUEsTUFDbEIsa0JBQWtCO0FBQUEsTUFDbEIsb0JBQW9CO0FBQUEsSUFDdEI7QUFFQSxTQUFLLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxLQUFL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
