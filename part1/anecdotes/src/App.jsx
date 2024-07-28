import { useState } from 'react'

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;
    console.log(typeof arr)
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
}

const Display = (props) => (
    <div>
        <h1>{props.text}</h1>
        <p>{props.anecdote}</p>
        <p>has {props.votes} votes</p>
    </div>
)

const Button = (props) => (
        <button onClick={props.onClick}>{props.text}</button>
)

const App = () => {
    const anecdotes = [
        'If it hurts, do it more often.',
        'Adding manpower to a late software project makes it later!',
        'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
        'Premature optimization is the root of all evil.',
        'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
        'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
        'The only way to go fast, is to go well.'
    ]
    const [selected, setSelected] = useState(0)
    const [votes, setVote] = useState(new Array(anecdotes.length).fill(0))
    const [indexOfMaxVote, setIndexOfMaxVote] = useState(0)

    const handleVote = () => {
        const voteCopy = [...votes]
        voteCopy[selected] += 1
        setVote(voteCopy)
        setIndexOfMaxVote(indexOfMax(voteCopy))
    }

    const handleAnecdote = () => {
        setSelected(getRandomInt(anecdotes.length))
    }

    return (
        <div>
            <Display anecdote={anecdotes[selected]} votes={votes[selected]} text='Anecdote of the day'/>
            <Button onClick={handleAnecdote} text='next anecdote'/>
            <Button onClick={handleVote} text='vote'/>
            <Display anecdote={anecdotes[indexOfMaxVote]} votes={votes[indexOfMaxVote]} text='Anecdote with most votes'/>

        </div>
    )
}

export default App