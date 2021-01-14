'use strict';

// Safari datepicker
if (document.getElementById("birth_date")) {
  if (document.getElementById("birth_date").type != "date") { //if browser doesn't support input type="date", load files for jQuery UI Date Picker
    document.write('<link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.css" rel="stylesheet" type="text/css" />\n')
    document.write('<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"><\/script>\n')
  }
}

$(document).ready(function () {
  //disable context
  $(document).bind("contextmenu", function (e) {
    return false;
  });

  // form-input
  $('input').focus(function () {
    $(this).parents('.form-group').addClass('focused');
  });

  $('input').blur(function () {
    var inputValue = $(this).val();
    if (inputValue == "") {
      $(this).removeClass('filled');
      $(this).parents('.form-group').removeClass('focused');
    } else {
      $(this).addClass('filled');
    }
  });

  // Custom select
  var x, i, j, selElmnt, a, b, c;
  x = document.getElementsByClassName("custom-select");
  for (i = 0; i < x.length; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected default");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < selElmnt.length; j++) {
      c = document.createElement("DIV");
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener("click", function (e) {
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }

        // trigger event
        $(s).trigger('change');

        h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
  }
  function closeAllSelect(elmnt) {
    var x, y, i, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    for (i = 0; i < y.length; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i)
      } else {
        y[i].classList.remove("select-arrow-active");
      }
    }
    for (i = 0; i < x.length; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add("select-hide");
      }
    }
  }
  document.addEventListener("click", closeAllSelect);
  // end custom select

  //validate email
  function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,6})+$/;
    return regex.test(email);
  };


  // validate form
  var email = $('#email');
  var customerSubmitLabel = $('#customer_form_label');
  var customerSubmit = $('#customer_form_submit');
  var text_inputs = $('.user-form input[type=text]:not([name=address2])');
  var gender_select = $('select[name=gender]');
  var birth_date = $('#birth_date');
  var country_select = $('select[name=country]');
  var confirm_email = $('input[name=confirm_email]');

  var form_validation = function () {
    var text_inputs_filled_arr = [];
    var text_inputs_filled = false;

    // text inputs require validation
    text_inputs.each(function () {
      if ($(this).val() === '') {
        text_inputs_filled_arr.push(false)
        $(this).closest('.form-group').addClass('required');
      } else {
        text_inputs_filled_arr.push(true)
        $(this).closest('.form-group').removeClass('required');
      }
    })

    // check if all text inputs are filled
    text_inputs_filled = !text_inputs_filled_arr.includes(false);

    // gender validation
    if (gender_select.val() === "") {
      gender_select.closest('div').addClass('required');
    } else {
      gender_select.closest('div').removeClass('required');
    }

    // birth_date validation
    if (birth_date.val() === "") {
      birth_date.closest('div').addClass('required');
    } else {
      birth_date.closest('div').removeClass('required');
    }

    // country validation
    if (country_select.val() === "") {
      country_select.closest('div').addClass('required');
    } else {
      country_select.closest('div').removeClass('required');
    }

    // email validation
    if (!isEmail(email.val()) && !email.hasClass('required')) {
      email.closest('div').addClass('invalid-email');
    } else {
      email.closest('div').removeClass('invalid-email');
    }

    // confirm email validation
    if (confirm_email.val() !== email.val()) {
      confirm_email.closest('div').addClass('invalid-confirm-email');
    } else {
      confirm_email.closest('div').removeClass('invalid-confirm-email');
    }

    // form validation
    if (isEmail(email.val()) &&
      text_inputs_filled === true &&
      gender_select.val() !== "" &&
      birth_date.val() !== "" &&
      country_select.val() !== "" &&
      confirm_email.val() === email.val()
    ) {
      customerSubmit.removeAttr('disabled');
      customerSubmitLabel.removeClass('disabled');
    } else {
      customerSubmit.attr('disabled', 'disabled');
      customerSubmitLabel.addClass('disabled');
    }
  };

  email.change(function () {
    form_validation()
  });

  email.keyup(function () {
    form_validation()
  });

  text_inputs.keyup(function () {
    form_validation()
  });

  gender_select.change(function () {
    form_validation()
  });

  birth_date.change(function () {
    form_validation()
  });

  country_select.change(function () {
    form_validation()
  });

  confirm_email.keyup(function () {
    form_validation()
  });

  // terms validation
  var terms = $('#terms');
  var termsSubmitLabel = $('#terms_form_label');
  var termsSubmit = $('#terms_form_submit');

  function termsValidation() {
    if ($(terms).is(':checked')
    ) {
      termsSubmit.removeAttr('disabled');
      termsSubmitLabel.removeClass('disabled');
    } else {
      termsSubmit.attr('disabled', 'disabled');
      termsSubmitLabel.addClass('disabled');
    }
  }


  terms.click(termsValidation);

  /* setup modal */
  var termsBtn = $('.terms-btn');
  var policyBtn = $('.policy-btn');
  var informationProvided = $('.information-provided');
  var termsModal = $('#modal-terms');
  var policyModal = $('#modal-policy');
  var modalInformation = $('#modal-information');
  var closeBtn = $('.ui-close-modal');

  termsBtn.on('click', function () {
    termsModal.addClass('show');
  });

  policyBtn.on('click', function () {
    policyModal.addClass('show');
  });

  informationProvided.on('click', function () {
    modalInformation.addClass('show');
  });

  closeBtn.on('click', function () {
    termsModal.removeClass('show');
    policyModal.removeClass('show');
    modalInformation.removeClass('show');
  });

  // close modal by clicking outside the modal window
  $('.modal-wrap').click(function (e) {
    if (e.target === $('.modal-wrap.show')[0]) {
      $('.modal-wrap').removeClass('show');
    }
  })

  // Date of birth
  $("#birth_date").on("change", function () {
    if ($(this).val() === '') {
      $("#birth_date").addClass('change');
    } else {
      $("#birth_date").removeClass('change');
    }
    this.setAttribute(
      "data-date",
      moment(this.value, "YYYY-MM-DD")
        .format(this.getAttribute("data-date-format"))
    )
  })

  // date - set max date
  if (document.getElementById("birth_date")) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("birth_date").setAttribute("max", today);

    // Safari datepicker
    if (document.getElementById("birth_date").type != "date") { //if browser doesn't support input type="date", initialize date picker widget:
      $('#birth_date').datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm-dd'
      });
    }
  }


  /* end modal */
});
