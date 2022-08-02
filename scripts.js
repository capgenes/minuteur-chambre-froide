'use strict';

(function(){
    // créer un timer en appuyant sur la barre espace
    // mettre à jour le nombre de timers dans le bloc nombre total de timer en activité
    // remettre à zéro tous les timers
    // fermer un timer
    // faire apparaître un bloc qui va se déplacer sur la timeline

    /**
     * - Faire un tableau des timer et y enregistrer leur timestamp de départ
     *
     * - Quand on clique sur la barre espace on ajoute un nouveau timer dans le
     *   tableau avec le timestamp du moment où on a appuyé sur la barre espace
     *
     * - afficher le nombre de timer actifs dans un bloc
     *
     * - Quand on appuie sur SUPPR, sur ESC ou sur BACKSPACE on détruit le
     *   timer le plus ancien
     *
     * - Sur une ligne, on voit apparaître tous les timer se déplaçant de
     *   gauche à droite avec le nombre de min+sec restantes et une croix
     *   pour fermer
     *
     * - Les timers se déplacent sur la ligne grâce à la comparaison entre le
     *   timestamp du début du timer et le timestamp actuel
     *
     * - Les blocs timer affichent le nombre de minutes restantes par
     *   comparaison entre le timestamp de départ et le timestamp actuel
     */

    const timers = [];
    const timer_duration_in_seconds = 10;
    let activeTimers = 0;

    function startNewTimer() {
        const time = new Date();
        const startTimeInSeconds = Math.floor(time/1000);

        timers.push({'startTime' : startTimeInSeconds, 'remainingTime' : ''});
    }

    function removeLastTimer() {
        timers.shift();
    }

    function build_timers_count(activeTimers) {
        const timersCountBlock = document.querySelector("#timersCountBlock");
        timersCountBlock.innerHTML = "<span>" + activeTimers + "</span>";
    }

    function build_timer_bloc(timers) {
        const timersCountBlock = document.querySelector("#timersBlockWrapper");
        timersCountBlock.innerHTML = "";
        return timers.map(obj => {
            const remainingTimeInSeconds = obj.remainingTime;
            timersCountBlock.innerHTML += "<span>" + remainingTimeInSeconds + "</span>";
        });
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
        console.log(updatedTimers);
    }

    window.onload = function() {
        document.body.onkeyup = function(e) {
            if (e.key === " " || e.code === "Space") {
                startNewTimer();
            }
            if (e.key === "Escape" || e.code === "Backspace" || e.code === "Delete") {
                removeLastTimer();
            }
        }
        setInterval(update_timers, 1000);
    }
})();