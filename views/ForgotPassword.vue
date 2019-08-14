<template>
<div class="section">
  <div class="container">
    <form class="signup column is-4 is-offset-4" @submit.prevent="forgot">
      <div class=" has-text-centered">
        <h1 class="title">
          Forgot Password
        </h1>
        <h2 class="subtitle">
          Enter your email to receive instructions
        </h2>
      </div>
      <hr>
      <b-field label="Email" :message="errors.first('email')">
        <b-input
          v-model="email"
          type="email"
          name="email"
          placeholder="Your email"
          v-validate="'required|email'"
          required
        ></b-input>
      </b-field>
      <hr>
      <div class="field">
        <div class="control">
          <button
            :disabled="errors.any()"
            class="button is-primary is-medium is-fullwidth"
            type="submit"
            >
            Confirm
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
    }
  },
  methods: {
    forgot: function() {
      let data = {
        email: this.email,
      }
      if (this.errors.any()) {
        this.$toast.open({
          type: 'is-danger',
          message: 'Please enter a valid email!',
        })
        return
      }
      this.$store
        .dispatch('forgot', data)
        .then(() => {
          this.$toast.open({
            message: 'Please check your Email for instructions on how to reset your password!',
            type: 'is-success',
            duration: 4000,
          })
        })
        .then(() => this.$router.push({ name: 'login' }))
        .catch(err => {
          this.$toast.open({
            message: err,
            position: 'is-top',
            type: 'is-danger',
          })
          console.log(err)
        })
    },
  },
}
</script>
