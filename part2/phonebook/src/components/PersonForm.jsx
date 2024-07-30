export const PersonForm = ({addContact, newName, handleNewName, newNumber, handleNewNumber}) => {
    return (
        <div>
            <form onSubmit={addContact}>
                <div>
                    name: <input
                    value={newName}
                    onChange={handleNewName}/>
                </div>
                <div>
                    number: <input
                    value={newNumber}
                    onChange={handleNewNumber}/>
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
        </div>
    )
}