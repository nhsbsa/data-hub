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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L2ZpbGUtdXBsb2FkLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpZihNT0pGcm9udGVuZC5kcmFnQW5kRHJvcFN1cHBvcnRlZCgpICYmIE1PSkZyb250ZW5kLmZvcm1EYXRhU3VwcG9ydGVkKCkgJiYgTU9KRnJvbnRlbmQuZmlsZUFwaVN1cHBvcnRlZCgpKSB7XHJcbiAgICBNT0pGcm9udGVuZC5NdWx0aUZpbGVVcGxvYWQgPSBmdW5jdGlvbihwYXJhbXMpIHtcclxuICAgICAgdGhpcy5kZWZhdWx0UGFyYW1zID0ge1xyXG4gICAgICAgIHVwbG9hZEZpbGVFbnRyeUhvb2s6ICQubm9vcCxcclxuICAgICAgICB1cGxvYWRGaWxlRXhpdEhvb2s6ICQubm9vcCxcclxuICAgICAgICB1cGxvYWRGaWxlRXJyb3JIb29rOiAkLm5vb3AsXHJcbiAgICAgICAgZmlsZURlbGV0ZUhvb2s6ICQubm9vcCxcclxuICAgICAgICB1cGxvYWRTdGF0dXNUZXh0OiAnVXBsb2FkaW5nIGZpbGVzLCBwbGVhc2Ugd2FpdCcsXHJcbiAgICAgICAgZHJvcHpvbmVIaW50VGV4dDogJ0RyYWcgYW5kIGRyb3AgZmlsZXMgaGVyZSBvcicsXHJcbiAgICAgICAgZHJvcHpvbmVCdXR0b25UZXh0OiAnQ2hvb3NlIGZpbGVzJ1xyXG4gICAgICB9O1xyXG4gICBcclxuICAgICAgdGhpcy5wYXJhbXMgPSAkLmV4dGVuZCh7fSwgdGhpcy5kZWZhdWx0UGFyYW1zLCBwYXJhbXMpO1xyXG4gICBcclxuICAgICAgdGhpcy5wYXJhbXMuY29udGFpbmVyLmFkZENsYXNzKCdtb2otbXVsdGktZmlsZS11cGxvYWQtLWVuaGFuY2VkJyk7XHJcbiAgIFxyXG4gICAgICB0aGlzLmZlZWRiYWNrQ29udGFpbmVyID0gdGhpcy5wYXJhbXMuY29udGFpbmVyLmZpbmQoJy5tb2otbXVsdGktZmlsZV9fdXBsb2FkZWQtZmlsZXMnKTtcclxuICAgICAgdGhpcy5zZXR1cEZpbGVJbnB1dCgpO1xyXG4gICAgICB0aGlzLnNldHVwRHJvcHpvbmUoKTtcclxuICAgICAgdGhpcy5zZXR1cExhYmVsKCk7XHJcbiAgICAgIHRoaXMuc2V0dXBTdGF0dXNCb3goKTtcclxuICAgICAgdGhpcy5wYXJhbXMuY29udGFpbmVyLm9uKCdjbGljaycsICcubW9qLW11bHRpLWZpbGUtdXBsb2FkX19kZWxldGUnLCAkLnByb3h5KHRoaXMsICdvbkZpbGVEZWxldGVDbGljaycpKTtcclxuICAgIH07XHJcbiAgIFxyXG4gICAgTU9KRnJvbnRlbmQuTXVsdGlGaWxlVXBsb2FkLnByb3RvdHlwZS5zZXR1cERyb3B6b25lID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRoaXMuZmlsZUlucHV0LndyYXAoJzxkaXYgY2xhc3M9XCJtb2otbXVsdGktZmlsZS11cGxvYWRfX2Ryb3B6b25lXCIgLz4nKTtcclxuICAgICAgdGhpcy5kcm9wem9uZSA9IHRoaXMucGFyYW1zLmNvbnRhaW5lci5maW5kKCcubW9qLW11bHRpLWZpbGUtdXBsb2FkX19kcm9wem9uZScpO1xyXG4gICAgICB0aGlzLmRyb3B6b25lLm9uKCdkcmFnb3ZlcicsICQucHJveHkodGhpcywgJ29uRHJhZ092ZXInKSk7XHJcbiAgICAgIHRoaXMuZHJvcHpvbmUub24oJ2RyYWdsZWF2ZScsICQucHJveHkodGhpcywgJ29uRHJhZ0xlYXZlJykpO1xyXG4gICAgICB0aGlzLmRyb3B6b25lLm9uKCdkcm9wJywgJC5wcm94eSh0aGlzLCAnb25Ecm9wJykpO1xyXG4gICAgfTtcclxuICAgXHJcbiAgICBNT0pGcm9udGVuZC5NdWx0aUZpbGVVcGxvYWQucHJvdG90eXBlLnNldHVwTGFiZWwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy5sYWJlbCA9ICQoJzxsYWJlbCBmb3I9XCInK3RoaXMuZmlsZUlucHV0WzBdLmlkKydcIiBjbGFzcz1cImdvdnVrLWJ1dHRvbiBnb3Z1ay1idXR0b24tLXNlY29uZGFyeVwiPicrIHRoaXMucGFyYW1zLmRyb3B6b25lQnV0dG9uVGV4dCArJzwvbGFiZWw+Jyk7XHJcbiAgICAgIHRoaXMuZHJvcHpvbmUuYXBwZW5kKCc8cCBjbGFzcz1cImdvdnVrLWJvZHlcIj4nICsgdGhpcy5wYXJhbXMuZHJvcHpvbmVIaW50VGV4dCArICc8L3A+Jyk7XHJcbiAgICAgIHRoaXMuZHJvcHpvbmUuYXBwZW5kKHRoaXMubGFiZWwpO1xyXG4gICAgfTtcclxuICAgXHJcbiAgICBNT0pGcm9udGVuZC5NdWx0aUZpbGVVcGxvYWQucHJvdG90eXBlLnNldHVwRmlsZUlucHV0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRoaXMuZmlsZUlucHV0ID0gdGhpcy5wYXJhbXMuY29udGFpbmVyLmZpbmQoJy5tb2otbXVsdGktZmlsZS11cGxvYWRfX2lucHV0Jyk7XHJcbiAgICAgIHRoaXMuZmlsZUlucHV0Lm9uKCdjaGFuZ2UnLCAkLnByb3h5KHRoaXMsICdvbkZpbGVDaGFuZ2UnKSk7XHJcbiAgICAgIHRoaXMuZmlsZUlucHV0Lm9uKCdmb2N1cycsICQucHJveHkodGhpcywgJ29uRmlsZUZvY3VzJykpO1xyXG4gICAgICB0aGlzLmZpbGVJbnB1dC5vbignYmx1cicsICQucHJveHkodGhpcywgJ29uRmlsZUJsdXInKSk7XHJcbiAgICB9O1xyXG4gICBcclxuICAgIE1PSkZyb250ZW5kLk11bHRpRmlsZVVwbG9hZC5wcm90b3R5cGUuc2V0dXBTdGF0dXNCb3ggPSBmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy5zdGF0dXMgPSAkKCc8ZGl2IGFyaWEtbGl2ZT1cInBvbGl0ZVwiIHJvbGU9XCJzdGF0dXNcIiBjbGFzcz1cImdvdnVrLXZpc3VhbGx5LWhpZGRlblwiIC8+Jyk7XHJcbiAgICAgIHRoaXMuZHJvcHpvbmUuYXBwZW5kKHRoaXMuc3RhdHVzKTtcclxuICAgIH07XHJcbiAgIFxyXG4gICAgTU9KRnJvbnRlbmQuTXVsdGlGaWxlVXBsb2FkLnByb3RvdHlwZS5vbkRyYWdPdmVyID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHRoaXMuZHJvcHpvbmUuYWRkQ2xhc3MoJ21vai1tdWx0aS1maWxlLXVwbG9hZC0tZHJhZ292ZXInKTtcclxuICAgIH07XHJcbiAgIFxyXG4gICAgTU9KRnJvbnRlbmQuTXVsdGlGaWxlVXBsb2FkLnByb3RvdHlwZS5vbkRyYWdMZWF2ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLmRyb3B6b25lLnJlbW92ZUNsYXNzKCdtb2otbXVsdGktZmlsZS11cGxvYWQtLWRyYWdvdmVyJyk7XHJcbiAgICB9O1xyXG4gICBcclxuICAgIE1PSkZyb250ZW5kLk11bHRpRmlsZVVwbG9hZC5wcm90b3R5cGUub25Ecm9wID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHRoaXMuZHJvcHpvbmUucmVtb3ZlQ2xhc3MoJ21vai1tdWx0aS1maWxlLXVwbG9hZC0tZHJhZ292ZXInKTtcclxuICAgICAgdGhpcy5mZWVkYmFja0NvbnRhaW5lci5yZW1vdmVDbGFzcygnbW9qLWhpZGRlbicpO1xyXG4gICAgICB0aGlzLnN0YXR1cy5odG1sKHRoaXMucGFyYW1zLnVwbG9hZFN0YXR1c1RleHQpO1xyXG4gICAgICB0aGlzLnVwbG9hZEZpbGVzKGUub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuZmlsZXMpO1xyXG4gICAgfTtcclxuICAgXHJcbiAgICBNT0pGcm9udGVuZC5NdWx0aUZpbGVVcGxvYWQucHJvdG90eXBlLnVwbG9hZEZpbGVzID0gZnVuY3Rpb24oZmlsZXMpIHtcclxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy51cGxvYWRGaWxlKGZpbGVzW2ldKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgXHJcbiAgICBNT0pGcm9udGVuZC5NdWx0aUZpbGVVcGxvYWQucHJvdG90eXBlLm9uRmlsZUNoYW5nZSA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgdGhpcy5mZWVkYmFja0NvbnRhaW5lci5yZW1vdmVDbGFzcygnbW9qLWhpZGRlbicpO1xyXG4gICAgICB0aGlzLnN0YXR1cy5odG1sKHRoaXMucGFyYW1zLnVwbG9hZFN0YXR1c1RleHQpO1xyXG4gICAgICB0aGlzLnVwbG9hZEZpbGVzKGUuY3VycmVudFRhcmdldC5maWxlcyk7XHJcbiAgICAgIHRoaXMuZmlsZUlucHV0LnJlcGxhY2VXaXRoKCQoZS5jdXJyZW50VGFyZ2V0KS52YWwoJycpLmNsb25lKHRydWUpKTtcclxuICAgICAgdGhpcy5zZXR1cEZpbGVJbnB1dCgpO1xyXG4gICAgICB0aGlzLmZpbGVJbnB1dC5mb2N1cygpO1xyXG4gICAgfTtcclxuICAgXHJcbiAgICBNT0pGcm9udGVuZC5NdWx0aUZpbGVVcGxvYWQucHJvdG90eXBlLm9uRmlsZUZvY3VzID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICB0aGlzLmxhYmVsLmFkZENsYXNzKCdtb2otbXVsdGktZmlsZS11cGxvYWQtLWZvY3VzZWQnKTtcclxuICAgIH07XHJcbiAgIFxyXG4gICAgTU9KRnJvbnRlbmQuTXVsdGlGaWxlVXBsb2FkLnByb3RvdHlwZS5vbkZpbGVCbHVyID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICB0aGlzLmxhYmVsLnJlbW92ZUNsYXNzKCdtb2otbXVsdGktZmlsZS11cGxvYWQtLWZvY3VzZWQnKTtcclxuICAgIH07XHJcbiAgIFxyXG4gICAgTU9KRnJvbnRlbmQuTXVsdGlGaWxlVXBsb2FkLnByb3RvdHlwZS5nZXRTdWNjZXNzSHRtbCA9IGZ1bmN0aW9uKHN1Y2Nlc3MpIHtcclxuICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIm1vai1tdWx0aS1maWxlLXVwbG9hZF9fc3VjY2Vzc1wiPiA8c3ZnIGNsYXNzPVwibW9qLWJhbm5lcl9faWNvblwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiByb2xlPVwicHJlc2VudGF0aW9uXCIgZm9jdXNhYmxlPVwiZmFsc2VcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNSAyNVwiIGhlaWdodD1cIjI1XCIgd2lkdGg9XCIyNVwiPjxwYXRoIGQ9XCJNMjUsNi4yTDguNywyMy4yTDAsMTQuMWw0LTQuMmw0LjcsNC45TDIxLDJMMjUsNi4yelwiLz48L3N2Zz4gJyArIHN1Y2Nlc3MubWVzc2FnZUh0bWwgKyAnPC9zcGFuPic7XHJcbiAgICB9O1xyXG4gICBcclxuICAgIE1PSkZyb250ZW5kLk11bHRpRmlsZVVwbG9hZC5wcm90b3R5cGUuZ2V0RXJyb3JIdG1sID0gZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIm1vai1tdWx0aS1maWxlLXVwbG9hZF9fZXJyb3JcIj4gPHN2ZyBjbGFzcz1cIm1vai1iYW5uZXJfX2ljb25cIiBmaWxsPVwiY3VycmVudENvbG9yXCIgcm9sZT1cInByZXNlbnRhdGlvblwiIGZvY3VzYWJsZT1cImZhbHNlXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHZpZXdCb3g9XCIwIDAgMjUgMjVcIiBoZWlnaHQ9XCIyNVwiIHdpZHRoPVwiMjVcIj48cGF0aCBkPVwiTTEzLjYsMTUuNGgtMi4zdi00LjVoMi4zVjE1LjR6IE0xMy42LDE5LjhoLTIuM3YtMi4yaDIuM1YxOS44eiBNMCwyMy4yaDI1TDEyLjUsMkwwLDIzLjJ6XCIvPjwvc3ZnPiAnKyBlcnJvci5tZXNzYWdlICsnPC9zcGFuPic7XHJcbiAgICB9O1xyXG4gICBcclxuICAgIE1PSkZyb250ZW5kLk11bHRpRmlsZVVwbG9hZC5wcm90b3R5cGUuZ2V0RmlsZVJvd0h0bWwgPSBmdW5jdGlvbihmaWxlKSB7XHJcbiAgICAgIHZhciBodG1sID0gJyc7XHJcbiAgICAgIGh0bWwgKz0gJzxkaXYgY2xhc3M9XCJnb3Z1ay1zdW1tYXJ5LWxpc3RfX3JvdyBtb2otbXVsdGktZmlsZS11cGxvYWRfX3Jvd1wiPic7XHJcbiAgICAgIGh0bWwgKz0gJyAgPGRpdiBjbGFzcz1cImdvdnVrLXN1bW1hcnktbGlzdF9fdmFsdWUgbW9qLW11bHRpLWZpbGUtdXBsb2FkX19tZXNzYWdlXCI+JztcclxuICAgICAgaHRtbCArPSAgICAgICAnPHNwYW4gY2xhc3M9XCJtb2otbXVsdGktZmlsZS11cGxvYWRfX2ZpbGVuYW1lXCI+JytmaWxlLm5hbWUrJzwvc3Bhbj4nO1xyXG4gICAgICBodG1sICs9ICAgICAgICc8c3BhbiBjbGFzcz1cIm1vai1tdWx0aS1maWxlLXVwbG9hZF9fcHJvZ3Jlc3NcIj4wJTwvc3Bhbj4nO1xyXG4gICAgICBodG1sICs9ICcgIDwvZGl2Pic7XHJcbiAgICAgIGh0bWwgKz0gJyAgPGRpdiBjbGFzcz1cImdvdnVrLXN1bW1hcnktbGlzdF9fYWN0aW9ucyBtb2otbXVsdGktZmlsZS11cGxvYWRfX2FjdGlvbnNcIj48L2Rpdj4nO1xyXG4gICAgICBodG1sICs9ICc8L2Rpdj4nO1xyXG4gICAgICByZXR1cm4gaHRtbDtcclxuICAgIH07XHJcbiAgIFxyXG4gICAgTU9KRnJvbnRlbmQuTXVsdGlGaWxlVXBsb2FkLnByb3RvdHlwZS5nZXREZWxldGVCdXR0b25IdG1sID0gZnVuY3Rpb24oZmlsZSkge1xyXG4gICAgICB2YXIgaHRtbCA9ICc8YnV0dG9uIGNsYXNzPVwibW9qLW11bHRpLWZpbGUtdXBsb2FkX19kZWxldGUgZ292dWstYnV0dG9uIGdvdnVrLWJ1dHRvbi0tc2Vjb25kYXJ5IGdvdnVrLSEtbWFyZ2luLWJvdHRvbS0wXCIgdHlwZT1cImJ1dHRvblwiIG5hbWU9XCJkZWxldGVcIiB2YWx1ZT1cIicgKyBmaWxlLmZpbGVuYW1lICsgJ1wiPic7XHJcbiAgICAgIGh0bWwgKz0gJ0RlbGV0ZSA8c3BhbiBjbGFzcz1cImdvdnVrLXZpc3VhbGx5LWhpZGRlblwiPicgKyBmaWxlLm9yaWdpbmFsbmFtZSArICc8L3NwYW4+JztcclxuICAgICAgaHRtbCArPSAnPC9idXR0b24+JztcclxuICAgICAgcmV0dXJuIGh0bWw7XHJcbiAgICB9O1xyXG4gICBcclxuICAgIE1PSkZyb250ZW5kLk11bHRpRmlsZVVwbG9hZC5wcm90b3R5cGUudXBsb2FkRmlsZSA9IGZ1bmN0aW9uKGZpbGUpIHtcclxuICAgICAgdGhpcy5wYXJhbXMudXBsb2FkRmlsZUVudHJ5SG9vayh0aGlzLCBmaWxlKTtcclxuICAgICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZG9jdW1lbnRzJywgZmlsZSk7XHJcbiAgICAgIHZhciBpdGVtID0gJCh0aGlzLmdldEZpbGVSb3dIdG1sKGZpbGUpKTtcclxuICAgICAgdGhpcy5mZWVkYmFja0NvbnRhaW5lci5maW5kKCcubW9qLW11bHRpLWZpbGUtdXBsb2FkX19saXN0JykuYXBwZW5kKGl0ZW0pO1xyXG4gICBcclxuICAgICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IHRoaXMucGFyYW1zLnVwbG9hZFVybCxcclxuICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgZGF0YTogZm9ybURhdGEsXHJcbiAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuICAgICAgICBzdWNjZXNzOiAkLnByb3h5KGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAgIGl0ZW0uZmluZCgnLm1vai1tdWx0aS1maWxlLXVwbG9hZF9fbWVzc2FnZScpLmh0bWwodGhpcy5nZXRFcnJvckh0bWwocmVzcG9uc2UuZXJyb3IpKTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0dXMuaHRtbChyZXNwb25zZS5lcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGl0ZW0uZmluZCgnLm1vai1tdWx0aS1maWxlLXVwbG9hZF9fbWVzc2FnZScpLmh0bWwodGhpcy5nZXRTdWNjZXNzSHRtbChyZXNwb25zZS5zdWNjZXNzKSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzLmh0bWwocmVzcG9uc2Uuc3VjY2Vzcy5tZXNzYWdlVGV4dCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpdGVtLmZpbmQoJy5tb2otbXVsdGktZmlsZS11cGxvYWRfX2FjdGlvbnMnKS5hcHBlbmQodGhpcy5nZXREZWxldGVCdXR0b25IdG1sKHJlc3BvbnNlLmZpbGUpKTtcclxuICAgICAgICAgIHRoaXMucGFyYW1zLnVwbG9hZEZpbGVFeGl0SG9vayh0aGlzLCBmaWxlLCByZXNwb25zZSk7XHJcbiAgICAgICAgfSwgdGhpcyksXHJcbiAgICAgICAgZXJyb3I6ICQucHJveHkoZnVuY3Rpb24oanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XHJcbiAgICAgICAgICB0aGlzLnBhcmFtcy51cGxvYWRGaWxlRXJyb3JIb29rKHRoaXMsIGZpbGUsIGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bik7XHJcbiAgICAgICAgfSwgdGhpcyksXHJcbiAgICAgICAgeGhyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgIHhoci51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmxlbmd0aENvbXB1dGFibGUpIHtcclxuICAgICAgICAgICAgICB2YXIgcGVyY2VudENvbXBsZXRlID0gZS5sb2FkZWQgLyBlLnRvdGFsO1xyXG4gICAgICAgICAgICAgIHBlcmNlbnRDb21wbGV0ZSA9IHBhcnNlSW50KHBlcmNlbnRDb21wbGV0ZSAqIDEwMCwgMTApO1xyXG4gICAgICAgICAgICAgIGl0ZW0uZmluZCgnLm1vai1tdWx0aS1maWxlLXVwbG9hZF9fcHJvZ3Jlc3MnKS50ZXh0KCcgJyArIHBlcmNlbnRDb21wbGV0ZSArICclJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIGZhbHNlKTtcclxuICAgICAgICAgIHJldHVybiB4aHI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcbiAgIFxyXG4gICAgTU9KRnJvbnRlbmQuTXVsdGlGaWxlVXBsb2FkLnByb3RvdHlwZS5vbkZpbGVEZWxldGVDbGljayA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBpZiB1c2VyIHJlZnJlc2hlcyBwYWdlIGFuZCB0aGVuIGRlbGV0ZXNcclxuICAgICAgdmFyIGJ1dHRvbiA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgdmFyIGRhdGEgPSB7fTtcclxuICAgICAgZGF0YVtidXR0b25bMF0ubmFtZV0gPSBidXR0b25bMF0udmFsdWU7XHJcbiAgICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsOiB0aGlzLnBhcmFtcy5kZWxldGVVcmwsXHJcbiAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICBzdWNjZXNzOiAkLnByb3h5KGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAgIC8vIGhhbmRsZSBlcnJvclxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYnV0dG9uLnBhcmVudHMoJy5tb2otbXVsdGktZmlsZS11cGxvYWRfX3JvdycpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICBpZih0aGlzLmZlZWRiYWNrQ29udGFpbmVyLmZpbmQoJy5tb2otbXVsdGktZmlsZS11cGxvYWRfX3JvdycpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tDb250YWluZXIuYWRkQ2xhc3MoJ21vai1oaWRkZW4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5wYXJhbXMuZmlsZURlbGV0ZUhvb2sodGhpcywgcmVzcG9uc2UpO1xyXG4gICAgICAg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
