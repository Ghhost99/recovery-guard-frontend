// utils/navigation.js
export function redirectIfIncomplete(url, conditionMet) {
    if (conditionMet) {
        window.location.href = url;
    }
}

