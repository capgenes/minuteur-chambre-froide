'use strict';

(function(){
    const timers = [];
    const timer_duration_in_seconds = 1800; /*1800 pour 30 min - 900 pour 15 min*/
    const timer_max_instances_count = 15; /*15 pour le labo*/
    const sound = new Audio('./fanfare.mp3');
    const jours_fr = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
    const mois_fr = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
    let activeTimers = 0;

    /**
     * Cette fonction sert à démarrer un timer, l'enregistre dans le tableau
     * timers et lui ajoute le timestamp du moment où il démarre.
     */
    function startNewTimer() {
        const time = new Date();
        const startTimeInSeconds = Math.floor(time/1000);

        timers.push({'startTime' : startTimeInSeconds, 'remainingTime' : ''});
    }

    /**
     * Cette fonction supprime du tableau timers le plus ancien timer
     */
    function removeFirstTimer() {
        timers.shift();
    }

    /**
     * Cette fonction créé une horloge et l'affiche dans un bloc HTML
     */
    function build_a_clock() {
        function checkTime(i) {
            if (i < 10) {i = "0" + i}  // add zero in front of numbers < 10
            return i;
        }
        const today = new Date();
        let h = today.getHours();
        let m = checkTime(today.getMinutes());
        let s = checkTime(today.getSeconds());
        let day = jours_fr[today.getDay()];
        let date = today.getDate();
        let month = today.getMonth();
        let literal_month = mois_fr[month];
        let y = today.getFullYear();
        let q = (Date.UTC(y, month, date) - Date.UTC(y, 0, 0)) / 24 / 60 / 60 / 1000;

        document.querySelector("#date").innerHTML =  "<span>" + day + " " + date + " " + literal_month + " - " + q + "</span>";
        document.querySelector("#clock").innerHTML =  "<span>" + h + ":" + m + ":" + s + "</span>";
    }

    /**
     * Cette fonction prend un tableau de timers en paramètre et met le nombre
     * de timers démarrés dans un bloc HTML
     * @param activeTimers
     */
    function build_timers_count(activeTimers) {
        const timersCountBlock = document.querySelector("#timersCountBlock");
        timersCountBlock.innerHTML = "<span>" + activeTimers + "</span>";
    }

    /**
     * Cette fonction qui prend en paramètre la durée des
     * timer prédéfinie renseigne les curseurs début et fin
     * de timeline avec les durées appropriées.
     * @param timer_duration_in_seconds
     */
    function build_timeline_steps(timer_duration_in_seconds) {
        const remainingMinutes = Math.floor(timer_duration_in_seconds / 60);
        const halfRemainingMinutes = remainingMinutes / 2;

        const timelineMidBlock = document.querySelector("#timelineMid");
        const timelineMaxBlock = document.querySelector("#timelineMax");

        timelineMidBlock.innerHTML = "" + halfRemainingMinutes + " min";
        timelineMaxBlock.innerHTML = "" + remainingMinutes + " min";
    }

    /**
     * Cette fonction créée un bloc par timer que compte le tableau des timers
     * passé en paramètre
     * @param timers
     * @returns {*}
     */
    function build_timer_bloc(timers) {
        const timersCountBlock = document.querySelector("#timersBlockWrapper");
        timersCountBlock.innerHTML = "";
        let remainingMinutes = "";
        return timers.map((obj, index) => {
            const remainingTimeInSeconds = obj.remainingTime;

            if (remainingTimeInSeconds > 59) {
                remainingMinutes = Math.floor(remainingTimeInSeconds / 60);
            } else {
                remainingMinutes = "<span>0</span>";
            }

            if (remainingTimeInSeconds > 0) {
                timersCountBlock.innerHTML += "<span id='timer_" + index + "'><a href='#' class='close-button'>&#10006;</a>" + remainingMinutes + "</span>";
            } else {
                sound.play();
                timersCountBlock.innerHTML += "<span>0</span>";
            }
        });
    }

    function animate_timers_blocs(timers) {
        const timersBlockWrapper = document.querySelector("#timersBlockWrapper");
        const timersBlockWrapperWidth = timersBlockWrapper.offsetWidth;
        const timersBlockWrapperFinalWidth = timersBlockWrapperWidth-40;

        return timers.map((obj, index) => {
            const timerId = "#timer_" + index;
            const timersCountBlockToAnimate = document.querySelector(timerId);
            const remainingTimeInSeconds = obj.remainingTime;
            const resteEnPourcent = (remainingTimeInSeconds*100)/timer_duration_in_seconds;
            const timersBlockWrapperRemainingWidth = (timersBlockWrapperFinalWidth*resteEnPourcent)/100;
            const translateXMax = "translateX(" + timersBlockWrapperRemainingWidth + "px)";
            const translateXMin = "translateX(0px)";

            if (timersCountBlockToAnimate !== null) {
                timersCountBlockToAnimate.animate([
                    { transform: translateXMax },
                    { transform: translateXMin }
                ], {
                    duration: remainingTimeInSeconds*1000,
                    iterations: 1
                })
            }
        });
    }

    /**
     * Cette fonction supprime une entrée du tableau timers
     * au clic sur la croix du bloc correspondant
     */
    function delete_a_timer_block() {
        const timerBlockCloseButton = document.querySelectorAll(".close-button");
        for (let i = 0; i < timerBlockCloseButton.length; i++) {
            const timerBlockCloseButtonParentNode = timerBlockCloseButton[i].parentNode;
            timerBlockCloseButtonParentNode.addEventListener('click', event => {
                const timerBlockCloseButtonParentNodeIdNumber = timerBlockCloseButtonParentNode.id.slice(-1);
                timers.splice(timerBlockCloseButtonParentNodeIdNumber, 1);
                event.stopPropagation();
            });
        }
    }

    function update_timers() {
        const now = new Date();
        const currentTimeInSeconds = Math.floor(now/1000);

        const updatedTimers = timers.map(obj => {
            const startTimeFromTimersArray = obj.startTime;
            const elapsedTimeInSecond = currentTimeInSeconds-startTimeFromTimersArray;
            const remainingTimeInSeconds = timer_duration_in_seconds-elapsedTimeInSecond;
            return {...obj, remainingTime: remainingTimeInSeconds}
        });

        activeTimers = timers.length;
        build_timers_count(activeTimers);
        build_timer_bloc(updatedTimers);
        animate_timers_blocs(updatedTimers);
        delete_a_timer_block();
    }

    window.onload = function() {
        setInterval(build_a_clock, 1000);
        build_timeline_steps(timer_duration_in_seconds);

        document.body.onkeyup = function(e) {

            if (e.key === " " || e.code === "Space") {
                if (timers.length < timer_max_instances_count) {
                    startNewTimer();
                }
            }

            if (e.key === "Escape" || e.code === "Backspace" || e.code === "Delete") {
                removeFirstTimer();
                sound.pause();
                sound.currentTime = 0;
            }
        }
        setInterval(update_timers, 1000);
    }
})();
