import axios from 'axios'

  const api = axios.create({
    baseURL: 'https://cal-ai-75fj.onrender.com/api' ,
    withCredentials:true

})
export default api