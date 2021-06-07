import anime from 'animejs/lib/anime.es.js';
import $ from "jquery";

$(document).ready(() => {
    anime({
        targets: '.form-name',
        translateY: 200,
    });
});

const chatOpen = () => {
    var tl = anime.timeline({
        easing: 'easeOutExpo',
        duration: 750
    });

// Add children
    tl
        .add({
            targets: '.people-anime',
            duration: 1200,
            translateX: [-3000, 0],
            easing: 'spring(1, 80, 10, 0)'
        })
        .add({
            targets: '.chat-anime',
            duration: 1000,
            translateY: [-3000, 0],
            easing: 'spring(1, 80, 10, 0)'
        })
}

const sendMessageAnime = () => {

    $(document).ready(function () {
        var target = document.getElementById("chat-list");
        var config = {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        };
        //note this observe method call
        observer.observe(target, config);
    });

    var observer = new MutationObserver(function (mutationRecords, observer) {
        mutationRecords.forEach(function (mutation) {
            let lastMessage = mutation.addedNodes;
            anime({
                targets: lastMessage,
                translateX: [150, 0]
            });
        });
    });

}

export {chatOpen, sendMessageAnime};

