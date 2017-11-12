import auth from './auth'

var IS_HEROKU = false

var URL_ORIGIN_HEROKU = "https://murmuring-fjord-85655.herokuapp.com"
var URL_ORIGIN_LOCAL = "http://127.0.0.1:5000"
var URL_ORIGIN = (IS_HEROKU ? URL_ORIGIN_HEROKU : URL_ORIGIN_LOCAL)

var URL_API_VERSION = "/api/v1"

var ENTRYPOINT_USER_LOGIN = "/users/login"

var ENTRYPOINT_USER_INFO = "/user"

var ENTRYPOINT_GUIDE = "/guide"

var ENTRYPOINT_GUIDES = "/guides"

var ENTRYPOINT_GUIDES_PUBLIC = "/guides/public"

var ENTRYPOINT_PHOTO_SELECTED = "/photos/selected"

var ENTRYPOINT_PHOTO_SEARCH = "/photos/search"

function Get(context, entrypoint, success, failure, headers, args) {
    let url =  URL_ORIGIN + URL_API_VERSION + entrypoint

    if(args){
        var argsString = []
        Object.keys(args).map(function(key, index) {
            if(args[key] instanceof Array) {
                argsString.push(key + "=" + args[key].join("+"))
            }
            else {
                argsString.push(key + "=" + args[key])
            }
        })
        url += "?" + argsString.join("&")
    }

    context.$http.get(url, {
        headers: headers
    }).then(
        data => { success(data) },
        response => { failure(response) }
    )
}

function Post(context, entrypoint, success, failure, headers, body) {
    context.$http.post( URL_ORIGIN + URL_API_VERSION + entrypoint, body, {
        headers: headers
    }).then(
        data => { success(data) },
        response => { failure(response) }
    )
}

function Put(context, entrypoint, success, failure, headers, body) {
    context.$http.put( URL_ORIGIN + URL_API_VERSION + entrypoint, body, {
        headers: headers
    }).then(
        data => { success(data) },
        response => { failure(response) }
    )
}

function Delete(context, entrypoint, success, failure, headers, body) {
    context.$http.delete( URL_ORIGIN + URL_API_VERSION + entrypoint, {
        headers: headers,
        body: body
    }).then(
        data => { success(data) },
        response => { failure(response) }
    )
}

export default {
    // User related API
    LoginUser(context, creds, success, failure) {
        Get(context, ENTRYPOINT_USER_LOGIN, success, failure, {
            "Authorization": "Basic " + btoa(creds.username + ":" + creds.password)
        })
    },
    GetUserInfo(context, success, failure) {
        Get(context, ENTRYPOINT_USER_INFO, success, failure, auth.getAuthHeader())
    },
    UpdateUserInfo(context, success, failure, data) {
        Put(context, ENTRYPOINT_USER_INFO, success, failure, auth.getAuthHeader(), data)
    },

    // Guide related API
    ListGuides(context, success, failure) {
        Get(context, ENTRYPOINT_GUIDES, success, failure, auth.getAuthHeader())
    },

    CreateGuide(context, success, failure, data) {
        Post(context, ENTRYPOINT_GUIDES, success, failure, auth.getAuthHeader(), data)
    },

    DeleteGuide(context, success, failure, data) {
        Delete(context, ENTRYPOINT_GUIDE, success, failure, auth.getAuthHeader(), data)
    },

    UpdateGuide(context, success, failure, data) {
        Put(context, ENTRYPOINT_GUIDE, success, failure, auth.getAuthHeader(), data)
    },

    GetPublicGuides(context, success, failure) {
        Get(context, ENTRYPOINT_GUIDES_PUBLIC, success, failure, {})
    },

    GetGuidePhoto(context, success, failure, data) {
        Get(context, ENTRYPOINT_GUIDE, success, failure, auth.getAuthHeader(), data)
    },


    SearchPhoto(context, success, failure, data) {
        Get(context, ENTRYPOINT_PHOTO_SEARCH, success, failure, auth.getAuthHeader(), data)
    },

    // Photo related API
    AddPhoto(context, success, failure, data) {
        Put(context, ENTRYPOINT_PHOTO_SELECTED, success, failure, auth.getAuthHeader(), data)
    },
    RemovePhoto(context, success, failure, data) {
        Delete(context, ENTRYPOINT_PHOTO_SELECTED, success, failure, auth.getAuthHeader(), data)
    }
}