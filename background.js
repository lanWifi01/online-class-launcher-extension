chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create('checkSchedule', {periodInMinutes: 1})
})

chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === 'checkSchedule') {
        openClass()
    }
})

function openClass() {
    const now = new Date()
    const currentDay = now.getDay()

    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const currentTime = `${hours}:${minutes}`

    chrome.storage.local.get(['schedules'], result => {
        const schedules = result.schedules || []

        schedules.forEach(item => {
            if (item.day === currentDay && item.time === currentTime) {
                chrome.tabs.create({url: item.link})
            }
        })
    })
}