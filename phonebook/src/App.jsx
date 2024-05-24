import { useState } from 'react'

const Filter = ({ search, setSearch }) => {
  return (
    <div>
      <h2>Filter</h2>
      <form>
        <div> 
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </form>
    </div>
  )
}

const AddContact = ({ newName, setNewName, newNumber, setNewNumber, persons, setPersons  }) => {
    const addPerson = (event) => {
      event.preventDefault()
      const tempPersons = [...persons]
      tempPersons.map((person) => person.name)
      tempPersons.filter((person) => person.name === newName).length > 0
        ? alert(`${newName} is already added to phonebook`)
        : tempPersons.push({ name: newName, number: newNumber})
      setPersons(tempPersons)
      setNewName('')
      setNewNumber('')
    }

  const handleNameChange = (event) => {
    event.preventDefault()
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    event.preventDefault()
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Add</h2>
      <form onSubmit={addPerson}>
        <div>
          name: 
          <input
            value={newName}
            onChange={handleNameChange}
            />
        </div>
        <div>
            number: 
            <input
              value={newNumber}
              onChange={handleNumberChange}
            />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      </div>
  )}


const DisplayContacts = ({ person }) => <li>{person.name}: {person.number}</li>

const FilterContacts = ({ search, persons }) => {
  const results = persons.filter((person) => person.name.toLowerCase().includes(search.toLowerCase()))
  if (search !== '' && results.length === 0) {
    alert('No results found')
  }

  return (
    <div>
      <h2>Contacts</h2>
      <ul>
        {results.length > 0
          ? results.map((person) => <DisplayContacts key={person.id} person={person} />)
          : persons.map((person) => <DisplayContacts key={person.id} person={person} />)}
      </ul>
      </div>
  )
}

const App = () => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter search={search} setSearch={setSearch} />
      <AddContact
        newName={newName} setNewName={setNewName}
        newNumber={newNumber} setNewNumber={setNewNumber}
        persons={persons} setPersons={setPersons}
        />
      <FilterContacts search={search} persons={persons} />
    </div>
  )
}

export default App