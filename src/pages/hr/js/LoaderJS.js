import $ from 'jquery'
import { findAllInRenderedTree } from 'react-dom/test-utils';


export function LoadImages() {
    $(document).on('click', '.loadVideo', function () {
        var modalId = $(this).data('id');
        var VideoIframe = $("#" + modalId).find('div .videoWrapper').html();
        var target = $(this);
        $(".loadVideo").parent().parent().each(function () {
            var viewId = $(this).data('id');
            var source = "";
            var AltSource = "";
            const mobile = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)
            if (modalId == viewId) {
                var source = $(this).find('iframe').attr('src');
                if ((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)) {
                    source = source + "&autoplay=0";

                }
                else {
                    source = source + "&autoplay=1&muted=1";

                }
                $(this).find('.VideoImg').hide();
                $(this).find('iframe').attr('src', source);
                // $(this).find('.VideoImg').hide();
            }
            else {
                // AltSource = $(this).parent().find('iframe').attr('src');
                // AltSource = AltSource.replace('&autoplay=1','');
                $(this).find('.VideoImg').show();

                var videos = document.querySelectorAll('iframe, video');
                Array.prototype.forEach.call(videos, function (video) {
                    if (video.tagName.toLowerCase() === 'video') {
                        video.pause();
                    }
                    else {

                        var src = video.src;
                        var src = mobile ? video.src + '&muted=0&mute=0&autoplay=0' : video.src + '&muted=1&mute=1';
                        video.src = src;

                    }
                });
                // $(this).find('iframe').attr('src', AltSource);
            }
        });
        // $(this).parent().append(VideoIframe);
    });
}

export function intro() {
    $('.navbar-menu-icon').click(function () {
        $('#sidebar').addClass('intro');
    });
    $('.close_Side_menu').click(function () {
        $('#sidebar').removeClass('intro');
    });
    // $('.nav-item').click(function () {
    //     $('#sidebar').removeClass('intro');
    // });
}

export function whyBuilders() {
    $(document).on('click', '.loadVideo', function () {
        var modalId = $(this).data('id');
        $(this).hide();
        var source = $(this).next('div').find('iframe').attr('src');
        source = source + "&autoplay=1";
        $(this).next('div').find('iframe').attr('src', source);
        $(this).next('div').show();

        // $(this).parent().append(VideoIframe);
    });
}

export function Youtube() {

    $(document).on('click', '.loadVideo', function () {
        var modalId = $(this).data('id');
        $(this).hide();
        var source = $(this).next('div').find('iframe').attr('src');
        source = source + "?autoplay=1";
        $(this).next('div').find('iframe').attr('src', source);
        $(this).next('div').show();

        // $(this).parent().append(VideoIframe);
    });

}