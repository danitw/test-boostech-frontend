import { reactive } from 'vue';
import { defineStore } from 'pinia';

import Swal from 'sweetalert2';

import api from '../services/api';

export interface Person {
  id: null | number;
  name: string;
  email: string;
  person_id: null | number;
}

export interface PersonUpdate {
  name: string;
  email?: string;
}

export const usePersons = defineStore('persons', () => {
  const state = reactive({
    persons: [] as Person[],
    modal: { open: false, action: '' },
    filteredPersons: [] as Person[]
  });

  let email = '';

  function getPersons() {
    api
      .get('/person/list')
      .then(({ data }) => {
        state.persons = data.persons;
        state.filteredPersons = data.persons;
      })
      .catch(({ response }) => {
        Swal.fire(response.data.message);
      });
  }

  async function getPerson(id: number) {
    const response = await api.get('/person/read/' + id);

    email = response.data.person.email;

    return response.data.person;
  }

  function createPerson(person: Person) {
    const payload = { name: person.name, email: person.email };

    api
      .post('/person/create', payload)
      .then(() => {
        console.log('Swal.fire sucess like');
        getPersons();
        state.modal = { open: false, action: '' };
        Swal.fire('Successfully created person');
      })
      .catch(({ response }) => {
        Swal.fire(response.data.message);
      });
  }

  function editPerson(person: Person, id: number) {
    const payload: PersonUpdate = { name: person.name };

    if (person.email !== email) {
      payload.email = person.email;
    }

    api
      .put('/person/update/' + id, payload)
      .then(() => {
        getPersons();
        state.modal = { open: false, action: '' };
        Swal.fire('Successfully updated person');
      })
      .catch(({ response }) => {
        Swal.fire(response.data.message);
      });
  }

  function deletePerson(id: number) {
    api
      .delete('/person/delete/' + id)
      .then(() => {
        getPersons();
        state.modal = { open: false, action: '' };
        Swal.fire('Successfully deleted person');
      })
      .catch(() => {
        Swal.fire(response.data.message);
      });
  }

  function handleModal(action: string) {
    state.modal = { open: !state.modal.open, action: action };
  }

  function getFilteredPersons(searchQuery: string) {
    return state.persons.filter(
      (person) =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  function searchPersons(searchQuery: string) {
    if (searchQuery) {
      state.filteredPersons = getFilteredPersons(searchQuery);
    } else {
      state.filteredPersons = state.persons;
    }
  }

  return {
    state,
    getPersons,
    getPerson,
    createPerson,
    editPerson,
    deletePerson,
    handleModal,
    searchPersons
  };
});
