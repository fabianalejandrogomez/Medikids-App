const initialState = {
    snackbar: {
        visible: false,
        message: '',
    },
    title: 'Medikids',
    variables: { },
};

const AppReducer = (state = initialState, action) => { 
    switch (action.type) {
        case 'SNACKBAR_SHOW':
            return { ...state, snackbar: { visible: true, message: action.message } };
        case 'SNACKBAR_HIDE':
            return { ...state, snackbar: { visible: false, message: '' } };
        case 'NOOP':
            return { ...state };
        case 'SET_TITLE':
            return { ...state, title: action.title };
        case 'SET_VARIABLE': 
            return { ...state, variables: { ...state.variables, [action.name]: action.value } };
        default:
            return state;
    }
};

export default AppReducer;