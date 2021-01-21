import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import apiUrl from './../../apiConfig.js'
import axios from 'axios'
import './meditation.styles.scss'

const Meditation = ({ user }) => {
  const [meditation, setMeditation] = useState({})
  const [meditationId, setMeditationId] = useState('')

  const handleChange = (event) => {
    event.persist()
    setMeditation((prevMeditation) => {
      const updatedMeditation = { [event.target.name]: event.target.value }
      const editedMeditation = Object.assign({}, prevMeditation, updatedMeditation)
      return editedMeditation
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    axios({
      url: `${apiUrl}/meditations/`,
      method: 'POST',
      headers: {
        Authorization: `Token token=${user.token}`
      },
      data: { meditation }
    })
      .then((res) => setMeditationId(res.data.meditation._id))
      .then(() => setMeditation({}))
      .then(() => console.log(meditationId + ' created succesfully'))
  }

  return (
    <div className='meditation-container'>Did you meditate today?
      <form id='new-meditation' onSubmit={handleSubmit}>
        <label className='form-label'>Date:</label>
        <input type='date' name='date' className='form-input' onChange={handleChange} ></input>
        <label className='form-label'>Duration in minutes:</label>
        <input type='number' name='duration' className='form-input' onChange={handleChange} ></input>
        <label className='form-label'>Style of meditation:</label>
        <input type='text' name='style' className='form-input' size={30} onChange={handleChange} ></input>
        <label className='form-label'>Anxiety levels before:</label>
        <input type='number' name='anxietyBefore' className='form-input' onChange={handleChange} ></input>
        <label className='form-label'>Anxiety levels after:</label>
        <input type='number' name='anxietyAfter' className='form-input' onChange={handleChange} ></input>
        <label className='form-label'>Comments:</label>
        <textarea className='form-input' name='comments' cols={30} onChange={handleChange} ></textarea>
        <Button type='submit' className='add-meditation-button'>Add</Button>
      </form>
    </div>
  )
}

export default Meditation
