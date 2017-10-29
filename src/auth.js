import {router} from './index'

const API_URL = "http://127.0.0.1:5000/api/v1"
const LOGIN_URL = API_URL + "/users/login"

export default {
    user: {
        authenticated: false
    },

    // Send a request to the login URL and save the returned JWT
    login(context, creds) {
        // console.log(context);
        context.$http.get(LOGIN_URL, {
            headers: {
                "Authorization": "Basic " + btoa(creds.username + ":" + creds.password)
            }
        }).then( data => {
            localStorage.setItem('token', data.body.token)
            console.log(data.body.token)
            this.user.authenticated = true
        }, response => {
            context.error = response
        })
    },

    logout() {
        localStorage.removeItem('token')
        this.user.authenticated = false
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
        return {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }
}