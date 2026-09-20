document.addEventListener('DOMContentLoaded', () => {
    const savedSched = document.getElementById('scheduleList');
    const saveBtn = document.getElementById('saveBtn');
    const subject = document.getElementById('subject');
    const classTime = document.getElementById('classTime');
    const classDay = document.getElementById('classDay');
    const classLink = document.getElementById('classLink');

    saveBtn.addEventListener('click', () => {
        const subjectVal = subject.value
        const timeVal = classTime.value
        const dayVal = classDay.value
        const linkVal = classLink.value

        if (!subjectVal || !timeVal || !dayVal || !linkVal) {
            alert('All fields must be loaded.')
            return
        }

        let newClass = {
            subject: subjectVal,
            time: timeVal,
            day: parseInt(dayVal),
            link: linkVal
        }

        chrome.storage.local.get(['schedules'], result => {
            const currentSchedules = result.schedules || []

            currentSchedules.push(newClass)

            chrome.storage.local.set({schedules: currentSchedules}, () => {
                alert('New Class Saved')
                subject.value = ''
                classTime.value = ''
                classDay.value = ''
                classLink.value = ''
            })
        })
    })
})