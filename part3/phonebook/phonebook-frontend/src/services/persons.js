import axios from 'axios';
const baseUrl = '/api/persons'

const getAll = () => {
    return axios.get(baseUrl).then(response => {
        return response.data
    })
}

const createPerson = newPerson => {
    return axios.post(baseUrl, newPerson).then(response => {
        return response.data
    })
}

const replacePerson = (newPerson, id) => {
    return axios.put(`${baseUrl}/${id}`, newPerson).then(response => {
        return response.data
    })
}

const deletePerson = id => {
    return axios.delete(`${baseUrl}/${id}`).then(response => {
        return response.data
    })
}

export default { getAll, createPerson, deletePerson, replacePerson }