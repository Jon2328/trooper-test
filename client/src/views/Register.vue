<template lang="pug">
main.register-wrapper
  .register-container
    img.logo(src="@/assets/images/logo.png")
    .form-container
      .input-group
        label(for="email") Email
        input#email(type="text" v-model="state.email")
        p.error(:class="{'show': state.emailErr}") {{ state.emailErr }}
      .input-group
        label(for="password") Password
        input#password(type="password" v-model="state.password")
        p.error(:class="{'show': state.passwordErr}") {{ state.passwordErr }}
      button.submit-btn(@click="register") Register
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

proxy.$axios.get('/user/')

async function register() {
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
    await proxy.$axios.post('/user/register', {
      email: state.email,
      password: state.password
    })
    state.status = ''
    router.push('/profile')
  } catch (err: any) {
    console.log(err)
    state.status = ''
    if (err?.response?.data?.err === 'User already registered') {
      state.status = err.response.data.err
    }
  }

}
</script>

<style scoped lang="sass">
@import @/assets/sass/variable.sass
.register-wrapper
  height: 100vh
  position: relative
.register-container
  max-width: 800px
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  width: 100%
  .logo
    margin: 0rem auto 5rem
    display: block
  .form-container
    .input-group
      display: flex
      flex-direction: column
      width: 50%
      margin: 1.5rem auto
      +mobile
        width: 80%
      label
        font-size: 1.5rem
        color: var(--primary)
        font-weight: bold
      input
        font-size: 1rem
        padding: 0.75rem
        border: 1px solid var(--primary)
        box-shadow: 6px 4px var(--secondary)
      .error
        color: var(--error-red)
        font-size: 1rem
        visibility: hidden
        margin: 0.25rem 0px
        &.show
          visibility: visible
    .submit-btn
      width: 50%
      margin: 2.5rem auto
      display: block
      color: #ffffff
      background-color: var(--primary)
      box-shadow: 6px 4px var(--secondary)
      border: 0px
      font-size: 2rem
      border-radius: 30px
      cursor: pointer
      +mobile
        width: 80%
      &:hover
        transform: scale(1.05)
    .status
      font-size: 1rem
      margin: 0px auto
      width: 50%
      text-align: center
      visibility: hidden
      &.show
        visibility: visible


</style>
