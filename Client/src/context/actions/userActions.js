export const setUserDetails = (user) => {
    return {
        type: "SET_USER_DETAILS",
        user: user
    }
}

export const getUserDetails = () => {
    return {
        type: "GET_USER_DETAILS"
    }
}

export const setUserNull = () => {
    return {
        type: "SET_USER_NULL",
        user: null,
    }
}