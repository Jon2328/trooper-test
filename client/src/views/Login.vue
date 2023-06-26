<template lang="pug">
main.login-wrapper
  .login-container
    img.logo(src="@/assets/images/logo.png")
    .form-container.standard
      .input-group
        label(for="email") Email
        input#email(type="text" v-model="state.email")
        p.error(:class="{'show': state.emailErr}") {{ state.emailErr }}
      .input-group
        label(for="password") Password
        input#password(type="password" v-model="state.password")
        p.error(:class="{'show': state.passwordErr}") {{ state.passwordErr }}
      button.submit-btn(@click="login") Login
      p.status(:class="{'show': state.status}") {{ state.status }}
</template>

<script setup lang="ts">
import router from '@/router';
import { getCurrentInstance, reactive } from 'vue'
const { proxy } = getCurrentInstance() as any
const state = reactive({
  email: '',
  password: '',
  emailErr: '',
  passwordErr: '',
  status: ''
})

async function login() {
  // Debounce
  if (state.status === 'Loading...') {
    return
  }
  let haveErr = false
  state.emailErr = ''
  state.passwordErr = ''
  state.status = 'Loading...'
  if (!state.email) {
    state.emailErr = 'Email is required'
    haveErr = true
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(state.email)) {
      // Email validation
    state.emailErr = 'Invalid email address'
    haveErr = true
  }

  if (!state.password) {
    state.passwordErr = 'Password is required'
    haveErr = true
  }

  if (haveErr) {
    state.status = ''
    return
  }
  
  try {
    await proxy.$axios.post('/user/login', {
      email: state.email,
      password: state.password
    })
    state.status = ''
    router.push('/profile')
  } catch (err: any) {
    console.log(err)
    state.status = ''
    if (err?.response?.data?.err === 'Credential is incorrect') {
      state.status = err.response.data.err
    }
  }

}
</script>

<style scoped lang="sass">
@import @/assets/sass/variable.sass
.login-wrapper
  height: 100vh
  position: relative
.login-container
  max-width: 800px
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  width: 100%
  .logo
    margin: 0rem auto 5rem
    display: block


</style>
  