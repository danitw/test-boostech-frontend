import { reactive } from 'vue';
import { defineStore } from 'pinia';

import Swal from 'sweetalert2';

import api from '../services/api';
import router from '@/router';

export interface Person {
  id: number;
  name: string;
  email: string;
  person_id: null | number;
}
export interface newPerson {
  name: string;
  email: string;
}

export interface PersonUpdate {
  name: string;
  email?: string;
}

interface RaffleResult {
  person1: {
    id: number;
    name: string;
    email: string;
  };
  person2: {
    id: number;
    name: string;
    email: string;
  };
}

export const usePersons = defineStore('persons', () => {
  const state = reactive({
    persons: [] as Person[],
    modal: { open: false, action: '' },
    raffleResult: [] as RaffleResult[],
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

  function createPerson(person: newPerson) {
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
      .catch(({ response }) => {
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

  function makeRaffle() {
    api
      .get('/person/makeRaffle')
      .then(({ data }) => {
        state.raffleResult = data;
        Swal.fire('Draw made successfully');
        router.push('/raffle-result');
      })
      .catch(({ response }) => {
        Swal.fire(response.data.message);
      });
  }

  function getRaffleResult() {
    api
      .get('/person/raffleResult')
      .then(({ data }) => {
        state.raffleResult = data;
      })
      .catch(({ response }) => {
        Swal.fire(response.data.message);
      });
  }

  return {
    state,
    getPersons,
    getPerson,
    createPerson,
    editPerson,
    deletePerson,
    handleModal,
    searchPersons,
    makeRaffle,
    getRaffleResult
  };
});
