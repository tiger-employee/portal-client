import React from 'react'
import './quote.styles.scss'
import quoteLibrary from './quoteLibrary'

const Quote = () => {
  const randomQuoteIndex = Math.floor(Math.random() * quoteLibrary.length)
  return (
    <div className='quote-container'>{quoteLibrary[randomQuoteIndex]}</div>
  )
}

export default Quote
