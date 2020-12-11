import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'


Vue.component('loader', {
    template: `
        <div style="display: flex; justify-content: center; align-items: center"> 
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    `
})


new Vue({
    el: '#app',
    data: {
        loading: false,
        visible: false,
        addUserLogo: "Добавить",
        search: { email: '', phone: '', status: '' },
        selected: '',
        columnNames: ['email', 'password', 'phone', 'name', 'status', 'created', 'lastChange'],
        newUserValid: true,
        newUser: {
            name: '',
            email: '',
            password: '',
            phone: '',
            status: '',
            created: null,
            lastChange: null,
            id: null
        },
        users: [{
            name: 'Default User',
            email: 'example@mail.ru',
            password: 'ahskdhaskjh',
            phone: '+7(499)9999999',
            status: 'Admin',
            created: Date('2020, 0, 1'),
            lastChange: Date('2020, 5, 1, 0, 0, 0, 0'),
            id: 1
        }]
    },
    computed: {
        users_f: function() {
            let result = this.users
            if (this.search.email) result = this.emailFilter(result, (this.search.email))
            if (this.search.phone) result = this.phoneFilter(result, (this.search.phone))
            if (this.search.status) result = this.statusFilter(result, (this.search.status))

            return result

            // const filteredLength = filtered.length
            // return { shortList: (filteredLength > 10) ? filtered.slice(0, 10) : filtered, filteredLength: filteredLength }
        },
        liveValidation: function() {
            this.newUser.name = toTitleCase(this.newUser.name)
            const validation = {
                email: emailCheck(this.newUser.email),
                password: passwordCheck(this.newUser.password),
                phone: phoneCheck(this.newUser.phone),
                name: nameCheck(this.newUser.name),
                status: statusCheck(this.newUser.status)
            }
            this.newUserValid = Object.values(validation).every(x => x === true)
            return this.validationText(validation)
        }
    },
    mounted() {
        if (localStorage.getItem('users')) {
            try {
                this.users = JSON.parse(localStorage.getItem('users'));
            } catch (e) {
                localStorage.removeItem('users');
            }
        }
    },
    methods: {
        editUser(id) {
            this.addUserLogo = 'Редактировать'
            const oldData = this.users.find(item => item.id === id)
            this.newUser = oldData
            document.getElementById("addUser").scrollIntoView({ block: "nearest", behavior: "smooth" })
        },
        submitUser() {
            if (!this.newUser.id) {
                this.newUser.id = Date.now()
                this.newUser.created = this.newUser.lastChange = Date(this.newUser.id)
                this.users.push(this.newUser)
            } else {
                let index = this.users.findIndex(el => el.id === this.newUser.id)
                this.newUser.lastChange = Date(Date.now())
                this.users.splice(index, 1, this.newUser)
            }
            this.newUser = { name: '', email: '', password: '', phone: '', status: '', created: null, lastChange: null }
            this.addUserLogo = "Добавить"
            this.saveUsers()
        },
        saveUsers() {
            const parsed = JSON.stringify(this.users)
            localStorage.setItem('users', parsed)
        },
        deleteUser(id) {
            this.modalDeleteUser = true
            this.users = this.users.filter(user => user.id !== id)
            localStorage.setItem('users', this.users)
        },
        emailFilter(arrayOfUsers, search) {
            return arrayOfUsers.filter(user => user.email.toLowerCase().indexOf(search.toLowerCase()) !== -1)
        },
        phoneFilter(arrayOfUsers, search) {
            return arrayOfUsers.filter(user => user.phone.toLowerCase().indexOf(search.toLowerCase()) !== -1)
        },
        statusFilter(arrayOfUsers, search) {
            return arrayOfUsers.filter(user => user.status.toLowerCase().indexOf(search.toLowerCase()) !== -1)
        },
        validationText(validation) {
            let text = { email: '', password: '', phone: '', name: '' }
            text.email = (validation.email) ? 'Корректный e-mail' : 'Введите корректный e-mail'
            text.password = (validation.password) ? 'Корректный пароль' : 'Пароль должен состоять из 6 - 16 символов: залавных и строчных букв латинского алфавита (A-z), арабских цифр (0-9) и специальных символов'
            text.phone = (validation.phone) ? 'Корректный телефон' : 'Введите корректный номер телефона'
            text.name = (validation.name) ? 'Корректное имя' : 'Введите корректное имя'
            return text
        },
        clear() {
            this.newUser = { name: '', email: '', password: '', phone: '', status: '', created: null, lastChange: null, id: null }
            this.addUserLogo = "Добавить"
        }
    },
})

function emailCheck(email) {
    return (email.indexOf('.') > email.indexOf('@') + 1 && email.indexOf('@') > 0 && email.indexOf('.') < email.length - 1) ? true : false
}

function passwordCheck(password) {
    const regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
    return password.search(regularExpression) ? false : true
}

function nameCheck(name) {
    return name.length ? true : false
}

function phoneCheck(phone) {
    const regularExpression = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
    return phone.search(regularExpression) ? false : true
}

function statusCheck(status) {
    return status.length ? true : false
}

function toTitleCase(phrase) {
    return phrase
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};