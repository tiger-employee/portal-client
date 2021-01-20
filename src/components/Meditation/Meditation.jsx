import React from 'react'
import './meditation.styles.scss'

const Meditation = () => {
  return (
    <div className='meditation-container'>This is the meditation app
      <form>
        <label className='form-label'>Date:</label>
        <input type='date' className='form-input'></input>
        <label className='form-label'>Duration in minutes:</label>
        <input type='text' className='form-input'></input>
        <label className='form-label'>Style of meditation:</label>
        <input type='text' className='form-input' size={30}></input>
        <label className='form-label'>Anxiety levels before:</label>
        <input type='number' className='form-input'></input>
        <label className='form-label'>Anxiety levels after:</label>
        <input type='number' className='form-input'></input>
        <label className='form-label'>Comments:</label>
        <textarea className='form-input' cols={30}></textarea>
      </form>
    </div>
  )
}

export default Meditation
