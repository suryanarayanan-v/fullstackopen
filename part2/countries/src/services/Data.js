import axios from 'axios';

const GetData = (url) => {
    return axios
        .get(url)
        .then(res => res.data)
}

export default {GetData}