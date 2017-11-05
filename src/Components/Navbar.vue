<template>
    <nav id="navigation-panel">
        <span class="logo">
            <h1>
                <router-link to="/">Photo Scout</router-link>
            </h1>
        </span>
        <ul class="links">
            <li>Explore</li>
            <li v-if="authenticated">
                <router-link to="/travel">Travel</router-link>
            </li>
            <li v-if="authenticated">Achievements</li>
        </ul>
        <ul class="user">
            <li v-if="!authenticated">Sign in</li>
            <li v-if="!authenticated">Sign up</li>
            <li v-if="authenticated">Account</li>
        </ul>
    </nav>
</template>

<script>
import auth from '../auth'

export default {
  name: 'navbar',
  data () {
      return {
        authenticated: auth.user.authenticated
      }
  },
  components:{
  },
}
</script>

<style lang="scss">
#navigation-panel {
    width: 80vw;
    height: 3.5em;
    background-color: white;
    position: fixed;
    margin: 1em 10vw;
    border-radius: 2em;
    padding: 0 3em;
    display: flex;
    align-items: center;
    color: #333;

    z-index: 999;

    .logo {
        font-size: 1.5em;
        display: flex;
        align-items: center;

        h1 {
            font-size: 0.8em;
            margin-left: 1em;
            font-weight: lighter;

            a {
                color: #333;
            }
        }
    }

    .links, .user {
        list-style: none;

        li {
            float: left;
            margin-left: 1em;

            a {
                color: #333;

                &:hover {
                    color: #8E44AD;
                }
            }

            &:not(:first-child ) {
                &:before {
                    content: " ";
                    border-left: 1px solid #ddd;
                    margin-right: 1em;
                }
            }
        }
    }

    .user {
        order: 2;
        margin-left: auto;
        color: #8E44AD;
    }
}
</style>
