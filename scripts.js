'use strict';

(function(){

    /**
     * - Sur une ligne, on voit apparaître tous les timer se déplaçant de
     *   droite à gauche avec le nombre de min+sec restantes et une croix
     *   pour fermer
     *
     * - Les timers se déplacent sur la ligne grâce à la comparaison entre le
     *   timestamp du début du timer et le timestamp actuel
     */

    const timers = [];
    const timer_duration_in_seconds = 1800; /*1800 pour 30 min - 900 pour 15 min*/
    const timer_max_instances_count = 15;
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
        return timers.map(obj => {
            const remainingTimeInSeconds = obj.remainingTime;
            if (remainingTimeInSeconds > 59) {
                remainingMinutes = Math.floor(remainingTimeInSeconds / 60);
            } else {
                remainingMinutes = "";
            }
            const remainingSeconds = remainingTimeInSeconds - remainingMinutes * 60;
            if (remainingTimeInSeconds > 0) {
                timersCountBlock.innerHTML += "<span>" + remainingMinutes + ":" + remainingSeconds + "</span>";
            } else {
                /* here, play a sound once */
                timersCountBlock.innerHTML += "<span>0</span>";
            }
        });
    }

    function animate_timers_blocs(timers) {

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
    }

    window.onload = function() {
        build_timeline_steps(timer_duration_in_seconds);
        document.body.onkeyup = function(e) {
            if (e.key === " " || e.code === "Space") {
                if (timers.length < timer_max_instances_count) {
                    startNewTimer();
                }
            }
            if (e.key === "Escape" || e.code === "Backspace" || e.code === "Delete") {
                removeFirstTimer();
            }
        }
        setInterval(update_timers, 10);
    }
})();