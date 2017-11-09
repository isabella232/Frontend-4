import {router} from './index'
import api from './api'

export default {
    user: {
        authenticated: false
    },

    // Send a request to the login URL and save the returned JWT
    login(context, creds) {
        api.LoginUser(context, creds, data => {
            localStorage.setItem('token', data.body.token)
            this.user.authenticated = true
            router.push('/travel')
        }, response => {
            context.error = response
        })
    },

    logout() {
        localStorage.removeItem('token')
        this.user.authenticated = false
        router.push('/')
    },

    checkAuth() {
        var jwt = localStorage.getItem('token')
        if(jwt) {
            this.user.authenticated = true
        }
        else {
            this.user.authenticated = false
        }
    },

    // The object to be passed as a header for authenticated requests
    getAuthHeader() {
        var jwt = localStorage.getItem('token')
        return {
            "Authorization": "Basic " + btoa(jwt + ":*")
        }
    }
}