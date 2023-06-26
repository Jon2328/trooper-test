<template lang="pug">
main.profile-creation-wrapper
  .profile-creation-container
    p.title Profile Creation
    .form-container.standard
      .input-group
        label(for="name") Name
        input#name(type="text" v-model="state.name")
        p.error(:class="{'show': state.nameErr}") {{ state.nameErr }}
      .input-group
        label(for="dobDay") Date Of Birth
        .row
          input.small#dobDay(type="text" @keyup="dobDayInsert" v-model="state.dobDay" placeholder="31")
          input.small#dobMonth(type="text" @keyup="dobMonthInsert" v-model="state.dobMonth" placeholder="12")
          input.big#dobYear(type="text" @keyup="dobYearInsert" v-model="state.dobYear" placeholder="1990")
        p.error(:class="{'show': state.dobErr}") {{ state.dobErr }}
      .input-group
        label(for="phone") Phone
        input#phone(type="text" @keyup="phoneInsert" v-model="state.phone")
        p.error(:class="{'show': state.phoneErr}") {{ state.phoneErr }}
      .input-group
        label(for="address") Address
        textarea#address(type="number" v-model="state.address" rows=3)
        p.error(:class="{'show': state.addressErr}") {{ state.addressErr }}
      button.submit-btn(@click="submit") Save
      p.status(:class="{'show': state.status}") {{ state.status }}
</template>

<script setup lang="ts">
import router from '@/router';
import { getCurrentInstance, reactive } from 'vue'
const { proxy } = getCurrentInstance() as any
const state = reactive({
  name: '',
  dobDay: '',
  dobMonth: '',
  dobYear: '',
  phone: '',
  address: '',
  nameErr: '',
  dobErr: '',
  phoneErr: '',
  addressErr: '',
  status: ''
})

function dobDayInsert() {
  const characterLimit = 2
  const characterTypeRegex = /\d+/g
  const maxNumber = 31

  if (state.dobDay.length > characterLimit) {
    state.dobDay = state.dobDay.slice(0, -1)
  }

  if (!characterTypeRegex.test(state.dobDay)) {
    state.dobDay = state.dobDay.slice(0, -1)
  }
  
  if (Number(state.dobDay) > maxNumber) {
    state.dobDay = ''
    state.dobErr = `Day cannot exceed ${maxNumber}`
  }
}

function dobMonthInsert() {
  const characterLimit = 2
  // Only digit
  const characterTypeRegex = /^\d+$/g
  const maxNumber = 12

  if (state.dobMonth.length > characterLimit) {
    state.dobMonth = state.dobMonth.slice(0, -1)
  }

  if (!characterTypeRegex.test(state.dobMonth)) {
    state.dobMonth = state.dobMonth.slice(0, -1)
  }
  
  if (Number(state.dobMonth) > maxNumber) {
    state.dobMonth = ''
    state.dobErr = `Month cannot exceed ${maxNumber}`
  }
}

function dobYearInsert() {
  const characterLimit = 4
  const characterTypeRegex = /^\d+$/g
  const maxNumber = 2100

  if (state.dobYear.length > characterLimit) {
    state.dobYear = state.dobYear.slice(0, -1)
  }

  if (!characterTypeRegex.test(state.dobYear)) {
    state.dobYear = state.dobYear.slice(0, -1)
  }
  
  if (Number(state.dobYear) > maxNumber) {
    state.dobYear = ''
    state.dobErr = `Invalid Year`
  }
}

function phoneInsert() {
  const characterLimit = 11
  const characterTypeRegex = /^\d+$/g
  
  if (state.phone.length > characterLimit) {
    state.phone = state.phone.slice(0, -1)
  }
  
  if (!characterTypeRegex.test(state.phone)) {
    state.phone = state.phone.slice(0, -1)
  }
}

async function submit() {
// Debounce
  if (state.status === 'Loading...') {
    return
  }
  let haveErr = false
  state.nameErr = ''
  state.dobErr = ''
  state.phoneErr = ''
  state.addressErr = ''
  state.status = 'Loading...'
  if (!state.name) {
    state.nameErr = 'Name is required'
    haveErr = true
  }

  if (!state.dobDay || !state.dobMonth || !state.dobYear) {
    state.dobErr = 'Date of birth is required'
    haveErr = true
  }

  if (!state.phone) {
    state.phoneErr = 'Phone is required'
    haveErr = true
  }

  if (!state.address) {
    state.addressErr = 'Address is required'
    haveErr = true
  }

  if (haveErr) {
    state.status = ''
    return
  }
  
  try {
    await proxy.$axios.post('/user/profile-creation', {
      name: state.name,
      dob: `${state.dobYear}-${state.dobMonth}-${state.dobDay}`,
      phone: state.phone,
      address: state.address
    })
    state.status = ''
    router.push('/profile')
  } catch (err: any) {
    console.log(err)
    state.status = ''
  }
}
</script>

<style scoped lang="sass">
@import @/assets/sass/variable.sass
.profile-creation-wrapper
  height: 100vh
  position: relative
.profile-creation-container
  max-width: 800px
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  width: 100%
  .title
    font-size: 3rem
    text-align: center
</style>
