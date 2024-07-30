const Header = ({text}) => {
    return (
        <h1>{text}</h1>
    )
}
const Content = ({name, exercises}) => <p>{name} {exercises}</p>


const Total = ({total}) => <h4>total of {total} exercises</h4>

export const Course = ({course}) => {
    const totalExercises = course.parts.reduce((acc, cur) => acc + cur.exercises, 0)
    return (
        <div>
            <Header text={course.name}/>
            {course.parts.map(part =>
                <Content key={part.id} name={part.name} exercises={part.exercises}/>
            )}
            <Total total={totalExercises}/>
        </div>
    )
}