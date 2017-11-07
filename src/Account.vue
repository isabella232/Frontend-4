<template>
  <div id="account-page">
    <navbar></navbar>
    <div class="hero">
    </div>
    <div id="account-data">
        <h2 v-if="user.fullname">Hi {{user.fullname}}!</h2>
        <h2 v-else>Hi {{user.username}}!</h2>
        <div class="info">
          <span class="label">Username</span><input disabled="" type="text" class="data" v-model="user.username">
        </div>

        <div class="info">
          <span class="label">Full name</span><input type="text" class="data" v-model="user.fullname">
        </div>

        <p class="section">Change password</p>



        <div class="info">
          <span class="label">Old password</span><input type="password" class="data" placeholder="*******" v-model="passwords[0]">
        </div>
        <div class="info">
          <span class="label">New password</span><input type="password" class="data" v-model="passwords[1]">
        </div>
        <div class="info">
          <span class="label">Repeat new password</span><input type="password" class="data" v-model="passwords[2]">
        </div>

        <input class="button" type="submit" value="Submit changes" v-on:click="submitInfo">
    </div>
  </div>
</template>

<script>
import navbar from './Components/Navbar.vue'
import auth from './auth'

export default {
  name: 'account',
  components:{
    navbar
  },
  data () {
    return {
      user: {},
      original: {},
      passwords: [
        "", // Previous
        "", // New
        ""  // New bis
      ]
    }
  },
  mounted: function () {
      this.$http.get('http://127.0.0.1:5000/api/v1/user', {
        headers: auth.getAuthHeader()
      }).then(response => {

          // get body data
          this.user =  response.body;
          this.original = Object.assign({}, response.body)

      }, response => {
          // error callback
      });
  },

  methods: {
    submitInfo: function() {
      console.log(this.user.fullname +"!="+ this.original.fullname)

      if( this.user.fullname != this.original.fullname) {
        this.$http.put('http://127.0.0.1:5000/api/v1/user', {
            "label": "fullname",
            "data": this.user.fullname
          }, {
          headers: auth.getAuthHeader()
        }).then(response => {
        }, response => {
            // error callback
        });
      }

      if( this.passwords[0] != "" && this.passwords[1] != 0 && this.passwords[1] == this.passwords[2]) {
        this.$http.put('http://127.0.0.1:5000/api/v1/user', {
            "label": "password",
            "data": this.passwords[1],
            "oldpass": this.passwords[0]
          }, {
          headers: auth.getAuthHeader()
        }).then(response => {
        }, response => {
            // error callback
        });
      }
    }
  }
}
</script>

<style lang="scss">
@import "styles/global.scss";

#account-page {
  .hero {
    background: url('assets/account.jpg') no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    background-position-y: -25em;
    height: 25em;

    display: flex;
    align-items: center;
    overflow: hidden;
    position: relative;

    h2 {
      text-align: center;
      width: 100%;
      font-size: 3em;
    }

    &:after {
      content: " ";
      transform: rotate(-3deg);
    background-color: #FCFCFC;
      width: 150%;
      height: 100px;
      position: absolute;
      left: -25%;
      bottom: -50px;
    }
  }

  #account-data {
    color: #333;
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    width: 50%;
    margin: auto;

    .info {
      display: block;
      width: 100%;
      margin-bottom: 1em;

      >* {
        display: inline-block;
        padding: 1em;
        margin: 0;
        font-size: 1em;
      }

      .label {
        width: 20%;
        border-radius: 1em 0 0 1em;
        background-color: #eee;
        border: 1px solid #DADFE1;
        border-right: none;
        font-weight: 300;

      }
      .data {
        width: 80%;
        border-radius: 0 1em 1em 0;
        background-color: white;
        border: 1px solid #DADFE1;
        border-left: none;
        text-align: left;
      }
    }

    .section {
      width: 100%;
      text-align: center;
      font-weight: 300;
      position: relative;

      &:before {
        content: " ";
        position: absolute;
        width: 100%;
        left: 0;
        top: 50%;
        border-top: 1px solid #DADFE1;
      }
    }

    .button {
      width: 15%;
      margin: 1em auto;
      border: none;
      padding: 1em;
      font-size: 1em;
      font-weight: 300;

        &:hover {
          background-color: #DADFE1;
        }
    }
  }
}
</style>
