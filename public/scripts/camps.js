/**
 * GLOBALS
 */
$(document).ajaxStart(function() {
    $('#ajax_indicator').removeClass('done').removeClass('hide').fadeIn('fast');
});
$(document).ajaxComplete(function() {
    $('#ajax_indicator').addClass('done').fadeOut('slow');
});
$(function() {
    // tooltips
    $('[data-toggle="tooltip"]').tooltip()
});

/**
 * Scroll to top - footer button
 */
$('#scroll_top').click(function() {
    $("html, body").stop().animate({
        scrollTop: 0
    }, '250', 'swing');
});
/**
 * Camps reveal name chooser
 */
$('.camps .reveal_create_camp_btn').click(function() {
    $('.camps .choose_name').toggleClass('hidden');
});
/**
 * evalute & validate camp name (English) must be > 3 letters
 * listen to change with timer, to prevent redundant http requests
 */
var interval = 1200,
    typingTimer,
    $input = $(".camps.camp_index input[name='camp_name_en']");

$input.keyup(function() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, interval);
});

$input.keydown(function() {
    clearTimeout(typingTimer);
});

function doneTyping() {
    var val = $input.val(),
        lang = $('body').attr('lang'),
        status = $(".choose_name span.indicator span.glyphicon"),
        input = $input,
        btn = $('#check_camp_name');
    if (val.length > 3) {
        var data = $.get('../camps/' + val);
        data.done(function() {
            if (data.status === 204) {
                input.removeClass('error');
                status.removeClass('glyphicon-remove').addClass('glyphicon-ok');
                btn.removeClass('hidden').attr('href', '/' + lang + '/camps/new?c=' + val);
            } else {
                input.addClass('error');
                status.removeClass('glyphicon-ok').addClass('glyphicon-remove');
                btn.addClass('hidden').removeAttr('href');
            }
        });
    } else {
        btn.addClass('hidden').removeAttr('href');
        status.removeClass('glyphicon-ok')
    }
}

/**
 * getting user list from API
 */
var fetched = false;

function fetchUsersOnce(elm) {
    if (!fetched) {
        $.getJSON('/users', function(data) {
            users = data.users;
            for (var i = 0; i < users.length; i++) {
                elm.append(template(users[i]));
            }
        });

        function template(data) {
            return "<option value='" + data.user_id + "'>" + data.fullName + "</option>"
        }
        fetched = true;
    }
}
$("select[name='camp_main_contact'], #edit_camp_main_contact").focus(function() {
    fetchUsersOnce($(this));
});
/**
 * getting camp list from API
 */
var fetched = false,
    $stats_table = $('.camps.stats .table');

function fetchCampsOnce() {
    if (!fetched) {
        var data, tbody = $stats_table.find('tbody');
        tbody.html('');
        $.get('/camps', function(data) {
            camps = data.camps;
            for (var i = 0; i < camps.length; i++) {
                tbody.append(template(camps[i]));
            }
            data = camps;
        });

        function template(data) {
            return "<tr><td>" + data.id + "</td><td><a href='camps/" + data.id + "'>" + data.camp_name_en + "</a></td><td>" + data.camp_name_he + "</td><td class='hidden-xs'>" + data.updated_at + "</td><td class='hidden-xs'>" + data.created_at + "</td><td><a href='camps/" + data.id + "/edit'><span class='glyphicon glyphicon-pencil'></span><span class='sr-only' aria-hidden='true'>Edit Camp</span></a></td><td><a href='camps/" + data.id + "/remove'><span class='glyphicon glyphicon-trash'></span><span class='sr-only' aria-hidden='true'>Remove Camp</span></a></td></tr>";
        }
        fetched = true;
    }
}
$stats_table.load(fetchCampsOnce());

// TODO: fix inner height for dynamic width size changing
function innerHeightChange() {
    var card_height = $('.cards--wrapper .card').not('.card-hide').outerHeight();
    $('.camps.camp_editing .cards--wrapper').css({
        'min-height': card_height + 'px'
    });
}
innerHeightChange();
// Camp details card transition
$('.card-switcher--card2').click(function() {
    $('.card-second').removeClass('card-hide');
    $('.card-first').addClass('card-hide');
    $('.card-switcher--card1').removeClass('Btn--default');
    $('.card-switcher--card1').addClass('Btn--transparent');
    $('.card-switcher--card2').removeClass('Btn--transparent');
    $('.card-switcher--card2').addClass('Btn--default');
    innerHeightChange();
});
$('.card-switcher--card1').click(function() {
    $('.card-second').addClass('card-hide');
    $('.card-first').removeClass('card-hide');
    $('.card-switcher--card1').removeClass('Btn--transparent');
    $('.card-switcher--card2').removeClass('Btn--default');
    $('.card-switcher--card2').addClass('Btn--transparent');
    $('.card-switcher--card1').addClass('Btn--default');
    innerHeightChange();
});
