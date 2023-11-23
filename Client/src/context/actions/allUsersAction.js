export const setAllUserDetails = (data) => {
    return {
        type: "SET_ALL_USERS",
        allUsers: data
    };
};

export const getAllUsers = (data) => {
    return {
        type: "GET_ALL_USERS",
    };
};