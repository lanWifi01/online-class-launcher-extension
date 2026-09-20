document.addEventListener('DOMContentLoaded', () => {
    const savedSched = document.getElementById('scheduleList');
    const saveBtn = document.getElementById('saveBtn');
    const subject = document.getElementById('subject');
    const classTime = document.getElementById('classTime');
    const classDay = document.getElementById('classDay');
    const classLink = document.getElementById('classLink');

    let editIndex = null

    displaySchedules()

    function resetForm() {
        subject.value = ''
        classTime.value = ''
        classDay.value = ''
        classLink.value = ''
        editIndex = null
        saveBtn.textContent = 'Save Schedule'
    }

    saveBtn.addEventListener('click', () => {
        const subjectVal = subject.value
        const timeVal = classTime.value
        const dayVal = classDay.value
        let linkVal = classLink.value

        if (!subjectVal || !timeVal || !dayVal || !linkVal) {
            alert('All fields must be loaded.')
            return
        }

        if (!linkVal.startsWith('http://') && !linkVal.startsWith('https://')) {
            alert('Invalid Link.')
            resetForm()
            return
        }

        

        chrome.storage.local.get(['schedules'], result => {
            const currentSchedules = result.schedules || []

            if (editIndex !== null) {
                currentSchedules[editIndex] = {
                    subject: subjectVal,
                    time: timeVal,
                    day: parseInt(dayVal),
                    link: linkVal
                }            
                alert(`${subjectVal} updated.`)
            } else {
                let newClass = {
                    subject: subjectVal,
                    time: timeVal,
                    day: parseInt(dayVal),
                    link: linkVal
                }
                currentSchedules.push(newClass)
                alert(`${subjectVal} successfully added.`)
            }

            chrome.storage.local.set({schedules: currentSchedules}, () => { 
                resetForm()
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
                    saveBtn.textContent = 'Update Content'
                })

                savedSched.appendChild(div); 
            })
        })
    }

    function deleteSchedule(index) {
        chrome.storage.local.get(['schedules'], result => {
            let schedules = result.schedules || []

            schedules.splice(index, 1)

            if (editIndex === index) {
                resetForm();
            }

            chrome.storage.local.set({schedules: schedules}, () => {
                displaySchedules()
            })
        })
    }
})