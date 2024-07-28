const Header = (props) => {
    return (
        <div>
            <h1>{props.course}</h1>
        </div>
    )
}

const Part = (props) => {
    return (
        <div>
            {props.part} {props.exercise}
        </div>
    )
}

const Content = (props) => {
    return (
        <div>
            <Part part={props.parts[0].name} exercise={props.parts[0].exercises} />
            <Part part={props.parts[1].name} exercise={props.parts[1].exercises} />
            <Part part={props.parts[2].name} exercise={props.parts[2].exercises} />
        </div>
    )
}

const Total = (props) => {
    return (
        <div>
            Number of exercises {props.exercises[0].exercises + props.exercises[1].exercises +
            props.exercises[2].exercises}
        </div>
    )
}

const App = () => {
    const course = {
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10
            },
            {
                name: 'Using props to pass data',
                exercises: 7
            },
            {
                name: 'State of a component',
                exercises: 14
            }
        ]
    }

    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total exercises={course.parts} />
        </div>
    )
}

export default App