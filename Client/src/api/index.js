import axios from "axios"
// from postMan
export const baseURL = "http://localhost:5001/food-delivery-app-react/us-central1/app"

export const vaidateUserJWTToken = async (token) => {
    try {
        const res = await axios.get(`${baseURL}/api/users/jwtVerification`, {
            headers : {Authorization : "Bearer " + token}
        })
        return res.data.data
    } catch(err){
        return null;
    }
}

//add  new product
export const addNewProduct = async (data) => {
    try {
        const res = await axios.post(`${baseURL}/api/products/create`, {...data});
        return res.data.data;
    } catch (err){
        return null;
    }
}

//get new product
export const getAllProduct = async () => {
    try {
        const res = await axios.get(`${baseURL}/api/products/all`);
        return res.data.data;
    } catch (err){
        return null;
    }
}

