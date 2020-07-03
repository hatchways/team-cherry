import React from 'react'
import SubmitButton from '../components/SubmitButton'
import Axios from 'axios'

export default function Main() {
  //temp to test 401 fail
  const clickToFail = async () => {
    await Axios.get('/fail')
  }
  return (
    <div>
      <SubmitButton
        onClick={clickToFail}
      >authorized request</SubmitButton>
    </div>
  )
}

