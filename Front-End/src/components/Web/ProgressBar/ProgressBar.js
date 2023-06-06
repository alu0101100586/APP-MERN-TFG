import React, { useEffect, useState } from 'react'
import './ProgressBar.scss'

export function ProgressBar(props) {
  const { total, current } = props

  const [progressValue, setProgressValue] = useState(0)

  useEffect(() => {
    let percentage = (current / total) * 100
    if (percentage > 100) percentage = 100
    setProgressValue(percentage)
  }, [total, current])

  return (
    <div className="progress-bar">
      <div
        className="progress-bar__progress"
        style={{ width: `${progressValue}%` }}
      />
    </div>
  )
}
