const initialState = [];

const PacientesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'PACIENTES_GET':
            return action.pacientes;
        case 'PACIENTES_POST':
            return state.concat(action.paciente);
        case 'PACIENTES_PUT':
            return state.map(e => { 
                    return e.id === action.paciente.id ? action.paciente : e;
                });
        case 'PACIENTES_DELETE':
            return state.filter(e => e.id !== action.id);
        default:
            return state;
    }
};

export default PacientesReducer;