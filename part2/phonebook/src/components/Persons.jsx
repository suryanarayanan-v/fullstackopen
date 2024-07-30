export const Persons = ({persons, filter, deletePerson}) => {
    return (
        <div>
            {persons.map((person) => {
                if (person.name.toLowerCase().includes(filter.toLowerCase())) {
                    return (
                        <div key={person.id}>
                            {person.name} {person.number}
                            <button onClick={() => deletePerson(person.id)}>delete</button>
                        </div>
                    )
                }
            })}
        </div>
    )
}