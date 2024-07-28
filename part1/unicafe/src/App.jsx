import { useState } from 'react'

// eslint-disable-next-line react/prop-types
const StatisticLine = ({text, value}) => {
    return (
        <tr>
            <td>{text}</td>
            <td>{value}</td>
        </tr>
    )
}

// eslint-disable-next-line react/prop-types
const Statistics = ({good, neutral, bad}) => {
    if (good === 0 && bad === 0 && neutral === 0) {
        return (
            <div>
                <p>No feedback given</p>
            </div>
        )
    }
    const all = good + bad + neutral
    return (
        <table>
            <tbody>
            <StatisticLine text='good' value={good} />
            <StatisticLine text='neutral' value={neutral} />
            <StatisticLine text='bad' value={bad} />
            <StatisticLine text='all' value={all} />
            <StatisticLine text='average' value={(good - bad)/ all}/>
            <StatisticLine text='positive' value={((good / all)*100).toString().concat('%')}/>
            </tbody>
        </table>
    )
}

// eslint-disable-next-line react/prop-types
const Button = ({text, handleClick}) => {
    return (
        <button onClick={handleClick}>{text}</button>
    )
}

const App = () => {
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const handleGoodClick = () => {
        setGood(good +1)
    }
    const handleBadClick = () => {
        setBad(bad + 1)
    }
    const handleNeutralClick = () => {
        setNeutral(neutral + 1)
    }

    return (
        <div>

            <h1>give feedback</h1>
            <Button handleClick={handleGoodClick} text='good'/>
            <Button handleClick={handleNeutralClick} text='neutral'/>
            <Button handleClick={handleBadClick} text='bad'/>
            <h1>Statistics</h1>
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    )
}

export default App