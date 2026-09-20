document.addEventListener('DOMContentLoaded', () => {
    const savedSched = document.getElementById('scheduleList');
    const saveBtn = document.getElementById('saveBtn');
    const subject = document.getElementById('subject');
    const classTime = document.getElementById('classTime');
    const classDay = document.getElementById('classDay');
    const classLink = document.getElementById('classLink');
    let alertMessage = 'New Class Saved'

    displaySchedules()

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
                alert(alertMessage)
                subject.value = ''
                classTime.value = ''
                classDay.value = ''
                classLink.value = ''
                displaySchedules()
            })
        })
    })

    function displaySchedules() {
        chrome.storage.local.get(['schedules'], result => {
            const schedules = result.schedules || []

            savedSched.innerHTML = ''

            if (schedules.length === 0) {
                savedSched.innerHTML = '<p>No saved schedules.</p>'
                return
            }

            let editIndex = null

            schedules.forEach((item, index) => {
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

                const div = document.createElement('div');
                div.innerHTML = `
                    <strong>${item.subject}</strong><br>
                    Day: ${days[item.day]} | Time: ${item.time}<br>
                    <a href="${item.link}" target="_blank">Join Class</a>
                    <button class='deleteBtn'>Delete</button><a class='editBtn' href='#popup-header'>Edit</a>
                `;

                const deleteBtn = div.querySelector('.deleteBtn')
                deleteBtn.addEventListener('click', () => {
                    deleteSchedule(index)
                })

                const editBtn = div.querySelector('.editBtn')
                editBtn.addEventListener('click', () => {
                    const subject = document.getElementById('subject')
                    const classTime = document.getElementById('classTime')
                    const classDay = document.getElementById('classDay')
                    const classLink = document.getElementById('classLink')

                    subject.value = item.subject
                    classTime.value = item.time
                    classDay.value = item.day
                    classLink.value = item.link

                    editIndex = index
                    const updateBtn = document.querySelector('#saveBtn')
                    updateBtn.textContent = 'Update Content'
                    

                    updateBtn.addEventListener('click', () => {
                        alertMessage = `${subject.value} successfully updated.`
                        editContent(index, subject.value, classTime.value, classDay.value, classLink.value)
                    })
                })

                savedSched.appendChild(div); 
            })
        })
    }

    function deleteSchedule(index) {
        chrome.storage.local.get(['schedules'], result => {
            let schedules = result.schedules || []

            schedules.splice(index, 1)

            chrome.storage.local.set({schedules: schedules}, () => {
                displaySchedules()
            })
        })
    }

    function editContent(index, subject, time, day, link) {
        chrome.storage.local.get(['schedules'], result => {
            let schedules = result.schedules || []

            schedules[index].subject = subject
            schedules[index].time = time
            schedules[index].day = day
            schedules[index].link = link
            
            chrome.storage.local.set({schedules: schedules}, () => {
                displaySchedules()
            })
        })
    }
})