import { useEffect, useState } from 'react'
import PersonsService from './services/PersonsService'

const SuccessNotification = (message) => {
    if (!message) {
        return <div></div>
    }
    return <div className="success">{message.message}</div>
}

const ErrorNotification = (message) => {
    if (!message) {
        return <div></div>
    }
    return <div className="error">{message.message}</div>
}

const Filter = ({ search, setSearch }) => {
    return (
        <div className="main">
            <h2>Filter:</h2>
            <form>
                <div>
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="form"
                    />
                </div>
            </form>
        </div>
    )
}

const AddContact = ({ persons, setPersons, setSuccessNotification, setErrorNotification }) => {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const addPerson = (event) => {
        event.preventDefault()
        const personExists = persons.some(
            (person) => person.name.toLowerCase() === newName.toLowerCase()
        )

        if (personExists) {
            updatePerson({
                person: persons.filter(
                    (person) => person.name.toLowerCase() === newName.toLowerCase()
                ),
            })
        } else {
            PersonsService.addPerson({ name: newName, number: newNumber })
                .then((response) => {
                    setPersons((prevPersons) => [...prevPersons, response.data])
                    setSuccessNotification(`${newName} has been added`)
                    setTimeout(() => setSuccessNotification(null), 1500)
                })
                .catch((error) => {
                    console.error('Error adding person:', error)
                    setErrorNotification('An error occurred while adding the person.')
                    setTimeout(() => setErrorNotification(null), 1500)
                })
        }

        setNewName('')
        setNewNumber('')
    }

    const updatePerson = ({ person }) => {
        if (
            window.confirm(
                `${newName} is already added to phonebook, replace the old number with a new one?`
            )
        ) {
            PersonsService.updatePerson(person[0].id, {
                name: newName,
                number: newNumber,
            })
                .then((response) => {
                    setPersons(
                        persons.map((person) =>
                            person.id !== response.data.id ? person : response.data
                        )
                    )
                    setSuccessNotification(`${newName} has been updated`)
                    setTimeout(() => {
                        setSuccessNotification(null)
                    }, 1500)
                })
                .catch((error) => {
                    console.error('Error updating person:', error)
                    setErrorNotification('An error occurred while updating.')
                    setTimeout(() => {
                        setErrorNotification(null)
                    }, 1500)
                })
        }
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
            <h2 className="main">Add</h2>
            <form onSubmit={addPerson}>
                <div className="main">
                    &nbsp;&nbsp;&nbsp;Name:&nbsp;
                    <input
                        value={newName}
                        onChange={handleNameChange}
                        className="form"
                    />
                </div>
                <div className="main">
                    Number:&nbsp;
                    <input
                        value={newNumber}
                        onChange={handleNumberChange}
                        className="form"
                    />
                </div>
                <div className="main">
                    <button type="submit">Add</button>
                </div>
            </form>
        </div>
    )
}

const DisplayContacts = ({ person, handleDelete }) => (
    <li className="main">
        {person.name}: {person.number}&nbsp;&nbsp;
        <button onClick={() => handleDelete({ person })}>Delete</button>
    </li>
)

const FilterContacts = ({
    search,
    persons,
    setPersons,
    setSuccessNotification,
    setErrorNotification,
}) => {
    const results = persons.filter((person) =>
        person.name.toLowerCase().includes(search.toLowerCase())
    )

    if (search !== '' && results.length === 0) {
        setErrorNotification('No results found')
    }

    const handleDelete = ({ person }) => {
        if (window.confirm(`Delete ${person.name}?`)) {
            PersonsService.deletePerson(person.id)
                .then(() => {
                    setSuccessNotification(`${person.name} has been deleted`)
                    setTimeout(() => {
                        setSuccessNotification(null)
                    }, 1500)
                    return PersonsService.getAll()
                })
                .catch((error) => {
                    console.error('Error deleting person:', error)
                    setErrorNotification('An error occurred while deleting.')
                    setTimeout(() => {
                        setErrorNotification(null)
                    }, 1500)
                    return PersonsService.getAll()
                })
                .then((response) => {
                    setPersons(response.data)
                })
        }
    }

    return (
        <div>
            <div className="main">
                <h2>Contacts</h2>
            </div>
            <ul>
                {results.length > 0
                    ? results.map((person) => (
                          <DisplayContacts
                              key={person.id}
                              person={person}
                              handleDelete={handleDelete}
                          />
                      ))
                    : persons.map((person) => (
                          <DisplayContacts
                              key={person.id}
                              person={person}
                              handleDelete={handleDelete}
                          />
                      ))}
            </ul>
        </div>
    )
}

const App = () => {
    const [search, setSearch] = useState('')
    const [persons, setPersons] = useState([])
    const [successNotification, setSuccessNotification] = useState(null)
    const [errorNotification, setErrorNotification] = useState(null)

    useEffect(() => {
        PersonsService.getAll().then((response) => {
            setPersons(response.data)
        })
    }, [])

    return (
        <div>
            <div className="notifidiv">
                {errorNotification ? <ErrorNotification message={errorNotification} /> : null}
                {successNotification ? <SuccessNotification message={successNotification} /> : null}
            </div>
            <div className="main">
                <h1>Phonebook</h1>
            </div>
            <h1 className="mainheading">Phonebook</h1>
            <Filter
                search={search}
                setSearch={setSearch}
            />
            <AddContact
                persons={persons}
                setPersons={setPersons}
                setSuccessNotification={setSuccessNotification}
                setErrorNotification={setErrorNotification}
            />
            <FilterContacts
                search={search}
                persons={persons}
                setPersons={setPersons}
                setSuccessNotification={setSuccessNotification}
                setErrorNotification={setErrorNotification}
            />
        </div>
    )
}

export default App
