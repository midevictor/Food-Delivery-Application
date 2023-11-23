const allUserReducer = (state = null, action) => {
    switch(action.type){
        case "SET_ALL_USERS":
            return action.allUsers;

        case "GET_ALL_USERS":
            return action.allUsers;

        default:
            return state
    }

}
export default allUserReducer