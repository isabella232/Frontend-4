<template>
    <div>
        <div id="form-select" v-if="!signin && !signup">
            <span class="button" v-on:click="signin=true">Sign in</span>
        </div>

        <div id="sigin-form" v-if="signin">
            <label class="label" for="username">Username</label>
            <input class="input-text" type="text" id="username" v-model="credentials.username"/>
            <label class="label" for="password">Password</label>
            <input class="input-text" type="password" id="password" v-model="credentials.password"/>
        </div>

        <span class="button" id="back" v-if="signin || signup" v-on:click="signin = signup = false">Back</span>

        <span class="button" id="signin" v-if="signin" v-on:click="submit">Sign in</span>
    </div>
</template>

<script>
import auth from '../auth'

export default {
    name: 'loginform',
    components:{
    },
    data () {
        return {
            signin: false,
            signup: false,

            credentials: {
                username: "",
                password: ""
            }
        }
    },
    methods: {
        submit() {
            var credentials = {
                username: this.credentials.username,
                password: this.credentials.password
            }

            auth.login(this, credentials)
        }
    }
}
</script>

<style lang="scss">
#form-select {
}

#sigin-form {
    width: 50%;
    margin: auto;
}

#back {
    margin-top: 2em;
}

span.button {
    background-color: rgba(221,221,221,0.6);
    padding: 1em;
    margin: 1em;
    border-radius: 1.6em;
    color: #333;
    font-weight: bold;
    font-size: 1.2em;
    width: 200px;
    display: inline-block;

    &:hover {
        background-color: #dddddd;
    }
}

.input-text {
    background: none;
    border: none;
    border-bottom: solid 2px #ddd;
    width: 100%;
    font-size: 1.5em;
    color: white;
    padding: 0.4em;
    padding-left: 1.1em;
    font-weight: 300;
}

.label {
    display: inline-block;
    width: 100%;
    text-align: left;
    color: rgba(204,204,204,0.6);
    font-size: 1.5em;
    margin-left: 1.1em;
    margin-top: 2em;
}
</style>
