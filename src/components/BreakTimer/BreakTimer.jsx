import React, { useState } from 'react'
import './break-timer.styles.scss'

const BreakTimer = () => {
  const [ time, setTime ] = useState('')
  const startTimer = (duration) => {
    let timer = duration
    let minutes
    let seconds
    const countdown = setInterval(function () {
      minutes = parseInt(timer / 60, 10)
      seconds = parseInt(timer % 60, 10)
      minutes = minutes < 10 ? '0' + minutes : minutes
      seconds = seconds < 10 ? '0' + seconds : seconds
      setTime(minutes + ':' + seconds)

      if (--timer < 0) {
        clearInterval(countdown)
        setTime('Take a break!')
      }
    }, 1000)
  }

  return (
    <div className='break-timer'>This is the break timer: {time}
      <button onClick={() => startTimer(10)}>Click</button>
    </div>
  )
}

export default BreakTimer
