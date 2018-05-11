jQuery.cookie = function (name, value, options) {
  if (typeof value != 'undefined') { // name and value given, set cookie
    options = options || {};
    if (value === null) {
      value = '';
      options.expires = -1;
    }
    var expires = '';
    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
      var date;
      if (typeof options.expires == 'number') {
        date = new Date();
        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
      } else {
        date = options.expires;
      }
      expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
    }
    // CAUTION: Needed to parenthesize options.path and options.domain
    // in the following expressions, otherwise they evaluate to undefined
    // in the packed version for some reason...
    var path = options.path ? '; path=' + (options.path) : '';
    var domain = options.domain ? '; domain=' + (options.domain) : '';
    var secure = options.secure ? '; secure' : '';
    document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
  } else { // only name given, get cookie
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
};

/**
 * @name		jQuery Countdown Plugin
 * @author		Martin Angelov
 * @version 	1.0
 * @url			http://tutorialzine.com/2011/12/countdown-jquery/
 * @license		MIT License
 */

(function ($) {

  // Количество секунд в каждом временном отрезке
  var days = 24 * 60 * 60,
    hours = 60 * 60,
    minutes = 60;

  // Создаем плагин
  $.fn.countdown = function (prop) {

    var options = $.extend({
      callback: function () {},
      timestamp: 0
    }, prop);

    var left, d, h, m, s, positions;

    // инициализируем плагин
    init(this, options);

    positions = this.find('.position');

    (function tick() {

      // Осталось времени
      left = Math.floor((options.timestamp - (new Date())) / 1000);

      if (left < 0) {
        left = 0;
      }

      // Осталось дней
      d = Math.floor(left / days);
      updateDuo(0, 1, d);
      left -= d * days;

      // Осталось часов
      h = Math.floor(left / hours);
      updateDuo(2, 3, h);
      left -= h * hours;

      // Осталось минут
      m = Math.floor(left / minutes);
      updateDuo(4, 5, m);
      left -= m * minutes;

      // Осталось секунд
      s = left;
      updateDuo(6, 7, s);

      // Вызываем возвратную функцию пользователя
      options.callback(d, h, m, s);

      // Планируем следующий вызов данной функции через 1 секунду
      setTimeout(tick, 1000);
    })();

    // Данная функция обновляет две цифоровые позиции за один раз
    function updateDuo(minor, major, value) {
      switchDigit(positions.eq(minor), Math.floor(value / 10) % 10);
      switchDigit(positions.eq(major), value % 10);
    }

    return this;
  };


  function init(elem, options) {
    elem.addClass('countdownHolder');

    // Создаем разметку внутри контейнера
    $.each(['Days', 'Hours', 'Minutes', 'Seconds'], function (i) {
      $('<span class="count' + this + '">').html(
        '<span class="position">\
					<span class="digit static">0</span>\
				</span>\
				<span class="position">\
					<span class="digit static">0</span>\
				</span>'
      ).appendTo(elem);

      if (this != "Seconds") {
        elem.append('<span class="countDiv countDiv' + i + '"></span>');
      }
    });

  }

  // Создаем анимированный переход между двумя цифрами
  function switchDigit(position, number) {

    var digit = position.find('.digit')

    if (digit.is(':animated')) {
      return false;
    }

    if (position.data('digit') == number) {
      // Мы уже вывели данную цифру
      return false;
    }

    position.data('digit', number);

    var replacement = $('<span>', {
      'class': 'digit',
      css: {
        top: '-2.1em',
        opacity: 0
      },
      html: number
    });

    // Класс .static добавляется, когда завершается анимация.
    // Выполнение идет более плавно.

    digit
      .before(replacement)
      .removeClass('static')
      .animate({
        top: '2.5em',
        opacity: 0
      }, 'fast', function () {
        digit.remove();
      })

    replacement
      .delay(100)
      .animate({
        top: 0,
        opacity: 1
      }, 'fast', function () {
        replacement.addClass('static');
      });
  }
})(jQuery);

$(function () {
  var myDate = new Date();

  function returnEndDate(d, h, m) {
    myDate.setDate(myDate.getDate() + d);
    myDate.setHours(myDate.getHours() + h);
    myDate.setMinutes(myDate.getMinutes() + m);
    return myDate;
  }
  if ($.cookie("timer")) {
    var dateEnd = $.cookie("timer");
  } else {
    var dateEnd = returnEndDate(20, 0, 0);
    $.cookie("timer", dateEnd, {
      expires: 20
    });
  }


  var note = $('#note'),
    ts = new Date(dateEnd),
    // ts =dateEnd,
    //    ts = new Date(2018, 02, 11),
    newYear = true;

  if ((new Date()) > ts) {
    // Задаем точку отсчета для примера. Пусть будет очередной Новый год или дата через 10 дней.
    // Обратите внимание на *1000 в конце - время должно задаваться в миллисекундах
    ts = (new Date()).getTime() + 10 * 24 * 60 * 60 * 1000;
    newYear = false;
  }

  $('#countdown').countdown({
    timestamp: ts,
    callback: function (days, hours, minutes, seconds) {

    }
  });
  $('#countdown_1').countdown({
    timestamp: ts,
    callback: function (days, hours, minutes, seconds) {

    }
  });
  $('#countdown_2').countdown({
    timestamp: ts,
    callback: function (days, hours, minutes, seconds) {

    }
  });
  $('#countdown_3').countdown({
    timestamp: ts,
    callback: function (days, hours, minutes, seconds) {

    }
  });
  $('.countDays').append('<span class="title">днів</span>');
  $('.countHours').append('<span class="title">годин</span>');
  $('.countMinutes').append('<span class="title">хвилин</span>');
  $('.countSeconds').append('<span class="title">секунд</span>');

  function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
      vars[key] = value;
    });
    return vars;
  }
  $('input[name="utm_source"]').val(getUrlVars()["utm_source"]);
  $('input[name="utm_campaign"]').val(getUrlVars()["utm_campaign"]);
  $('input[name="utm_medium"]').val(getUrlVars()["utm_medium"]);
  $('input[name="utm_term"]').val(getUrlVars()["utm_term"]);
  $('input[name="utm_content"]').val(getUrlVars()["utm_content"]);
  $('input[name="click_id"]').val(getUrlVars()["aff_sub"]);
  $('input[name="affiliate_id"]').val(getUrlVars()["aff_id"]);
  //     $('input[name="page_url"]').val(window.location.hostname);
  $('input[name="ref"]').val(document.referrer);

  $.get("https://ipinfo.io", function (response) {
    $('input[name="ip_address"]').val(response.ip);
    $('input[name="city"]').val(response.city);
    $('input[name="country"]').val(response.country);
    $('input[name="region"]').val(response.region);
  }, "jsonp");

  $('form').on('submit', function (e) {

    e.preventDefault();

    var $form = $(this);
    var msg = $form.find('input, textarea, select');
    $form.find('.submit').addClass('inactive');
    $form.find('.submit').prop('disabled', true);

    $.ajax({
      type: 'POST',
      url: 'https://app.getresponse.com/add_subscriber.html',
      dataType: 'json',
      data: msg,
      success: function (response) {}
    });

    $.ajax({
      type: 'POST',
      url: 'db/registration.php',
      data: msg,
      success: function (response) {}
    });

    setTimeout(function () {
      window.location.href = 'success.html';
    }, 1000);
  });


  function readCookie(name) {
    var n = name + "=";
    var cookie = document.cookie.split(';');
    for (var i = 0; i < cookie.length; i++) {
      var c = cookie[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(n) == 0) {
        return c.substring(n.length, c.length);
      }
    }
    return null;
  }
  setTimeout(function () {
    $('.gclid_field').val(readCookie('gclid'));
    if ($('.gclid_field').val() == '') {
      $('.gclid_field').val(readCookie('_gid'));
    }
  }, 2000);



  // Scroll BAR

  $(window).scroll(function () {
    // calculate the percentage the user has scrolled down the page
    var scrollPercent = 100 * $(window).scrollTop() / ($(document).height() - $(window).height());

    $('.bar-long').css('width', scrollPercent + "%");

  });
});

$(document).ready(function () {
  $('#scrollup img').mouseover(function () {
    $(this).animate({
      opacity: 0.65
    }, 100);
  }).mouseout(function () {
    $(this).animate({
      opacity: 1
    }, 100);
  });

  $(window).scroll(function () {
    if ($(document).scrollTop() > 0) {
      $('#scrollup').fadeIn('slow');
    } else {
      $('#scrollup').fadeOut('slow');
    }
  });

  $('#scrollup').click(function () {
    $('body,html').animate({
      scrollTop: 0
    }, 1000);
  });


  //  var vid = document.getElementById($(this).parents('.carousel-block').find('.active video').attr('id'));
  /*  var vid = document.getElementById('kiev');

       function pauseVid() {
          vid.pause();
        }
        pauseVid();
     function playVid() {
        vid.play();
      }
      playVid();*/
  $('.video-play').click(function () {
    $(this).hide();
    var vid = document.getElementById($(this).parent().find('video').attr('id'));

    function playVid() {
      vid.play();
    }
    playVid();
  })


  var $stage = $('.stage-carousel');
  $stage.owlCarousel({
    loop: true,
    margin: 0,
    nav: false,
    animateOut: 'slideOutDown',
    animateIn: 'fadeIn',
    autoplay: 'true',
    autoplaySpeed: 1000,
    autoplayTimeout: '5000',
    items: 1
  })
  $stage.on('changed.owl.carousel', function (event) {
    var index = event.item.index;
    if (index == 5) {
      index = event.item.count + 5;
    }


    if ((index - 5) < 10) {
      var pefix = '0';
    } else {
      var pefix = '';

    }

    $('.stage-count .no-active').text(event.item.count);
    $('.stage-count .active').text(pefix + (index - 5));
  });
  $('.stage-next').click(function () {
    $stage.trigger('next.owl.carousel');

  });
  $('.stage-prev').click(function () {
    $stage.trigger('prev.owl.carousel');
  });

  $('.show-carousel').owlCarousel({
    center: true,
    items: 1,
    loop: true,
    margin: 0,
    autoplay: 'true',
    autoplayTimeout: '5000',
    autoplayHoverPause: true,
    responsive: {
      600: {
        items: 3
      }
    }
  });

  if ($(window).width() < 736) {
    $('.show-carousel .owl-item').css({
      'max-width': $(window).width(),
    })
    $('.show-carousel').css({
      'max-height': '480px',
    })
  }
  $('.faq-item ').click(function () {
    $(this).toggleClass('active');
    $(this).find('.more').slideToggle(200);
  });

  $('.mob-btn').click(function () {
    $('.menu').slideToggle('200');
  })

});