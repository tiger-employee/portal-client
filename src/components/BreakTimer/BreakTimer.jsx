import React, { useEffect, useState } from 'react'
import './break-timer.styles.scss'

const BreakTimer = () => {
  const [ time, setTime ] = useState('')
  const [ prompt, setPrompt ] = useState('')

  const startTimer = (duration = 10) => {
    setPrompt('')
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
        setPrompt('Take a break!')
      }
    }, 1000)
  }

  useEffect(() => {
    startTimer()
  }, [])

  return (
    <div className='break-timer'>Time until your next break... <br/>
      <div className='timer'>
        {time}
      </div>
      <div>
        {prompt}
      </div>
      <div>
        {!time || time === '00:00' ? <button onClick={() => startTimer()}>Click</button> : ''}
      </div>
    </div>
  )
}

export default BreakTimer
