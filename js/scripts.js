$('.main__sort-link').click(function(){
    $(this).parent().find('.main__sort-list-wrap').toggleClass('open')
})

$('.main__sort-close').click(function(){
    $(this).parent().removeClass('open')
    $('.main__sort-link').removeClass('open')
})

$('.js_reset_history').click(function(){
    if($(this).hasClass('ready')){
        var type = $(this).data('type'),
            value = $(this).data('value');
        
        delete_history($(this), type, value)
        $(this).removeClass('ready')
    }else{
        $(this).parent().find('.main__sort-list-wrap').addClass('open')
        $(this).addClass('no-touch')
    }
})

$('.js_delete_close').click(function(){
    $(this).parents('.main__reset-btns-item').find('.js_reset_history').removeClass('no-touch')
    $(this).parents('.main__reset-btns-item').find('.js_reset_history').addClass('ready')
})

$('.js_delete_radio').change(function(){
    $(this).parents('.main__reset-btns-item').find('.js_reset_history').data('value', $(this).data('type'))
})

$('.js_sort_radio').click(function(){
    if(!$(this).hasClass('show')){
        $(this).addClass('show')
    }
    if($(this).data('type') === 'by_date_up'){
        $(this).data('type', 'by_date_down')
    } else if ($(this).data('type') === 'by_date_down' || $(this).data('type') === 'by_date') {
        $(this).data('type', 'by_date_up')
    } else if ($(this).data('type') === 'by_value_up') {
        $(this).data('type', 'by_value_down')
    } else if ($(this).data('type') === 'by_value_down' || $(this).data('type') === 'by_value') {
        $(this).data('type', 'by_value_up')
    }

    sort_values($(this).data('type'))
    $(this).toggleClass('up')
})

const dayOfWeeks = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

function sort_values(value){
    console.log(value)
}

function delete_history(e, type, value){
    console.log(type + " " + value)
}

function reset_sort(e){
    $(e).parent().find('.js_sort_radio').each(function(ind){
        $(this).removeClass('up')
        $(this).removeClass('show')
        $(this).prop('checked', false)
        if(ind == 0){
            $(this).data('type', 'by_date')
        }else{
            $(this).data('type', 'by_value')
        }
    })
}

function delete_history_item(e, value){
    if ($(e).parents('.main__history-day').find('.main__history-item').length <= 1) {
        $(e).parents('.main__history-day').remove()
    }
    $(e).parents('.main__history-item').remove()
    
    chrome.history.deleteUrl({
        url: value
    },function () {});
}

function render_history_list(){
    chrome.history.search({
        'text': '',
        'startTime': 262980000000,
        'maxResults': 1000
    },
    function(historyItems) {
        add_history_items(historyItems)
    })
}

function get_all_item_includes(array){
    var searchArray = []

    for(var i = 0; i < array.length; i++){
        searchArray.push(array[i])
    }

    return Object.entries(searchArray)
}

function add_history_items(array){
    var parent = $('.main__history-days'),
        newday = new Date(array[0].lastVisitTime).getDate(),
        newmonth = new Date(array[0].lastVisitTime).getMonth(),
        newyear = new Date(array[0].lastVisitTime).getFullYear(),
        newdayweek = new Date(array[0].lastVisitTime).getDay(),
        curday = new Date().getDate(),
        curmonth = new Date().getMonth(),
        curyear = new Date().getFullYear(),
        searchArray = []

    for (var i = 0; i < array.length; i++) {
        var url = array[i].url

        chrome.history.getVisits({
            url: array[i].url
        },
        function (gotVisits) {
        });
    }

    parent.find('.main__history-day').remove()

    parent.append(`
        <div class="main__history-day" data-date="${newday+"."+newmonth+"."+newyear}">
            <div class="main__heading">
                <h2 class="main__title">
                    ${newday+newmonth+newyear === curday+curmonth+curyear ? 'Сегодня - ' : ''}${dayOfWeeks[newdayweek]}, ${newday} ${months[newmonth]} ${newyear} г.
                </h2>
            </div>
            <ul class="main__history-list">
            </ul>
        </div>
    `)

    for (var i = 0; i < array.length; ++i) {
        var url = array[i],
            day = new Date(url.lastVisitTime).getDate(),
            month = new Date(url.lastVisitTime).getMonth(),
            year = new Date(url.lastVisitTime).getFullYear(),
            dayweek = new Date(url.lastVisitTime).getDay(),
            flag = false

        parent.find('.main__history-day').each(function () {
            if ($(this).data('date') !== day + "." + month + "." + year) {
                parent.append(`
                    <div class="main__history-day" data-date="${day+"."+month+"."+year}">
                        <div class="main__heading">
                            <h2 class="main__title">
                            ${dayOfWeeks[dayweek]}, ${day} ${months[month]} ${year} г.
                            </h2>
                        </div>
                        <ul class="main__history-list">
                        </ul>
                    </div>
                `)
                flag = true
            }
        })

        if(flag){
            break;
        }
    }

    for (var i = 0; i < array.length; ++i) {
        var url = array[i],
            day = new Date(url.lastVisitTime).getDate(),
            month = new Date(url.lastVisitTime).getMonth(),
            year = new Date(url.lastVisitTime).getFullYear(),
            dayweek = new Date(url.lastVisitTime).getDay(),
            hours = new Date(url.lastVisitTime).getHours(),
            minutes = String(new Date(url.lastVisitTime).getMinutes()).length < 2 && new Date(url.lastVisitTime).getMinutes() !== 0 ?
            '0' + new Date(url.lastVisitTime).getMinutes() : new Date(url.lastVisitTime).getMinutes()

        parent.find('.main__history-day').each(function(){
            if ($(this).data('date') == day + "." + month + "." + year){
                $(this).find('ul').append(`
                    <li class="main__history-item" data-url="${url.url}">
                        <a href="${url.url}" class="main__history-link">
                            <div class="main__history-item-col main__history-item-col--1">
                                <img src="img/icon.png" alt="" class="main__history-img">
                            </div>
                            <div class="main__history-item-col main__history-item-col--2">
                                <p class="main__history-item-name">
                                    <b>${url.title}</b>
                                </p>
                                <span class="main__history-item-link-name">${url.url.split('://')[1]}</span>
                            </div>
                            <div class="main__history-item-col main__history-item-col--3">
                                <span class="main__history-item-time">
                                    ${hours+":"+minutes}
                                </span>
                            </div>
                        </a>
                        <div class="main__history-item-col main__history-item-col--4">
                            <button type="button" class="main__history-item-delete js_delete_item">
                                <img src="img/close.svg" alt="" class="main__history-item-delete-icon">
                            </button>
                        </div>
                    </li>
                `)
            }
        })
    }
}

render_history_list()

$('.main__form').submit(function(e){
    e.preventDefault()
})

$('.main__form-input').keyup(function(){
    $('.main__form-wrap').find('.error').remove()
    if($(this).val().length >= 3){
        search($(this).val())
    } else if ($(this).val().length < 3 && $(this).val().length >= 1) {
        $('.main__history-item').removeClass('hidden')
        $('.main__history-day').removeClass('hidden')
        $('.main__form-wrap').prepend('<span class="error">Минимум 3 символа!</span>')
    } else if ($(this).val().length == 0) {
        render_history_list()
    }
})

function search(value){
    var elements = $('.main__history-item'),
        count = 0

    elements.addClass('hidden')

    $('.main__history-days').find('.main__history-day').each(function(){
        if ($(this).find('.main__history-item').length === $(this).find('.hidden').length){
            $(this).addClass('hidden')
        }
    })

    elements.each(function(){
        if($(this).text().trim().replace(/\s+/g,"").indexOf(value.trim().replace(/\s+/g,"")) != -1){
            count++
            $(this).removeClass('hidden')
            $(this).parents('.main__history-day').removeClass('hidden')
        }
    })

    if (count == 0) {
        $('.main__form-wrap').prepend('<span class="error">Ничего не найдено</span>')
    }else{
        $('.main__form-wrap').find('.error').remove()
    }
}

$(document).on('click', '.js_delete_item', function(){
    delete_history_item($(this), $(this).parents('.main__history-item').data('url'))
})