import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    return axios
        .get(baseUrl)
        .then((response) => response)
        .catch((error) => {
            throw error
        })
}

const addPerson = (newPerson) => {
    return axios
        .post(baseUrl, newPerson)
        .then((response) => response)
        .catch((error) => {
            throw error
        })
}

const deletePerson = (id) => {
    return axios
        .delete(`${baseUrl}/${id}`)
        .then((response) => {
            return response
        })
        .catch((error) => {
            throw error
        })
}

const updatePerson = (id, newPerson) => {
    return axios
        .put(`${baseUrl}/${id}`, newPerson)
        .then((response) => response)
        .catch((error) => {
            throw error
        })
}

export default { getAll, addPerson, deletePerson, updatePerson }
