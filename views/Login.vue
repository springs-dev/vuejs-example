<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Log in</p>
        <button class="delete" aria-label="close" slot="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
         <div class="modal-content pt30 pb60 px65 cl-secondary">
          <form @submit.prevent="login" novalidate>
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input
                  class="input mb35"
                  type="email"
                  name="email"
                  focus
                  v-model="email"
                  @blur="$v.email.$touch()"
                  :placeholder="'E-mail address'"
                  :validations="[
                    {
                      condition: !$v.email.required && $v.email.$error,
                      text: 'Field is required.'
                    },
                    {
                      condition: !$v.email.email && $v.email.$error,
                      text: 'Please provide valid e-mail address.'
                    }
                  ]"
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  class="input mb35"
                  type="password"
                  name="password"
                  v-model="password"
                  @blur="$v.password.$touch()"
                  :placeholder="'Password'"
                  :validation="{
                    condition: !$v.password.required && $v.password.$error,
                    text: 'Field is required.'
                  }"
                />
              </div>
            </div>
            
            <div class="field is-grouped">
              <div class="control">
                <label class="checkbox">
                  <input type="checkbox" id="remember" @click="remember = !remember" v-model="remember">
                  Remember me
                </label>
              </div>
              <div class="control">
                <a href="#" @click.prevent="remindPassword">Forgot the password?</a>
              </div>
            </div>
            <div class="field is-grouped">
              <div class="control">
                <button class="button is-primary mb20" type="submit" data-testid="loginSubmit">Log in to your account</button>
              </div>
              <div class="control">
                <div class="center-xs"> or <a href="#" @click.prevent="switchElem" data-testid="registerLink"> register an account</a></div>
              </div>
            </div>
          </form>
        </div>
      </section>
      <footer class="modal-card-foot">
        
      </footer>
    </div>
   
    <button class="modal-close is-large" aria-label="close" slot="close" @click="close"></button>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'

export default {
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
  },
  methods: {
    close() {
      this.$bus.$emit('modal-hide', 'modal-signup')
    },
    login() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        this.$bus.$emit('notification', {
          type: 'error',
          message: 'Please fix the validation errors',
          action1: { label: 'OK', action: 'close' },
        })
        return
      }

      this.$bus.$emit('notification-progress-start', 'Authorization in progress ...')
      this.$store
        .dispatch('user/login', { username: this.email, password: this.password })
        .then(result => {
          this.$bus.$emit('notification-progress-stop', {})

          if (result.code !== 200) {
            this.$bus.$emit('notification', {
              type: 'error',
              message: result.result,
              action1: { label: 'OK', action: 'close' },
            })
          } else {
            this.$bus.$emit('notification', {
              type: 'success',
              message: 'You are logged in!',
              action1: { label: 'OK', action: 'close' },
            })
            this.close()
          }
        })
        .catch(err => {
          console.error(err)
          this.$bus.$emit('notification-progress-stop')
        })
    },
  },
}
</script>
