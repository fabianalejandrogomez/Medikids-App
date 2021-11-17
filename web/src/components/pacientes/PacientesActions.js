import api from '../../api';
import { API_ROOT } from '../../constants';

const endpoint = API_ROOT + '/pacientes';

const pacientesGet = (pacientes) => ({
    type: 'PACIENTES_GET',
    pacientes: pacientes,
});

const pacientesPost = (paciente) => ({
    type: 'PACIENTES_POST',
    paciente: paciente,
});

const pacientesPut = (paciente) => ({
    type: 'PACIENTES_PUT',
    paciente: paciente,
});

const pacientesDelete = (id) => ({
    type: 'PACIENTES_DELETE',
    _id: id,
});

export const fetchPacientes = () => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        api.get(endpoint)
        .then(response => { 
            dispatch(pacientesGet(response.data));
            resolve(response);
        }, error => {
            reject(error.response.message);
        });
    });
};

export const addPaciente = (paciente) => (dispatch, getState) => {
    if (!paciente.url.toLowerCase().startsWith('http')) {
        paciente.url = 'https://www.stamboulian.com.ar' + paciente.url;
    }

    return new Promise((resolve, reject) => { 
        api.post(endpoint, paciente)
        .then(response => {
            if (response.status === 201) {
                dispatch(pacientesPost(response.data));
                resolve(response);
            }
            else {
                reject('Unknown POST response code (expected 201, received ' + response.status + ').');
            }
        }, error => {
            reject(error);
        });
    });
};

export const updatePaciente = (paciente) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        api.put(endpoint + '/' + paciente._id, paciente)
        .then(response => {
            if (response.status === 200) {
                dispatch(pacientesPut(response.data));
                resolve(response);
                window.location.reload(false);
            }
            else {
                reject('Unknown PUT response code (expected 200, received ' + response.status + ').');
            }
        }, error => {
            reject(error);
        });
    });
};

export const deletePaciente = (id) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        api.delete(endpoint + '/' + id)
        .then(response => {
            if (response.status === 204) {
                dispatch(pacientesDelete(id));
                resolve(response);
                window.location.reload(false);
            }
            else {
                reject('Unknown DELETE response code (expected 204, received ' + response.status + ').');
            }
        }, error => {
            reject(error);
        });
    });
};