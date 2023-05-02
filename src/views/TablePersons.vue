<script setup lang="ts">
import { watch, ref } from 'vue';
import Swal from 'sweetalert2';

import PersonCreateModal from '@/components/PersonCreateModal.vue';
import PersonEditModal from '@/components/PersonEditModal.vue';
import { usePersons } from '../stores/persons';

const { state: personState, getPersons, deletePerson, handleModal, searchPersons } = usePersons();

getPersons();

const searchTerm = ref('');
const id = ref(0);

watch(searchTerm, () => {
  searchPersons(searchTerm.value);
});

function confirmationDeletePerson(id: number) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      deletePerson(id);
    }
  });
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Persons List</h1>
      <div>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="() => handleModal('create')"
        >
          Create
        </button>
      </div>
    </div>

    <div class="flex mb-4 items-center">
      <label class="mr-4 text-gray-700">Search:</label>
      <div class="relative">
        <input
          type="text"
          v-model="searchTerm"
          class="form-input pl-4 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:shadow-outline-blue"
          placeholder="Search persons..."
        />
      </div>
    </div>
    <div class="-mx-4">
      <div class="w-full overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="px-4 py-2">ID</th>
              <th class="px-4 py-2">Name</th>
              <th class="px-4 py-2">Email</th>
              <th class="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="person in personState.filteredPersons" :key="person.id">
              <td class="border px-4 py-2">{{ person.id }}</td>
              <td class="border px-4 py-2">{{ person.name }}</td>
              <td class="border px-4 py-2">{{ person.email }}</td>
              <td class="border px-4 py-2">
                <button
                  class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  @click="
                    () => {
                      handleModal('edit');
                      id = person.id;
                    }
                  "
                >
                  Edit
                </button>
                <button
                  class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  @click="
                    () => {
                      confirmationDeletePerson(person.id);
                    }
                  "
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <PersonCreateModal
      v-if="personState.modal.open == true && personState.modal.action == 'create'"
    />

    <PersonEditModal
      v-if="personState.modal.open == true && personState.modal.action == 'edit'"
      :id="id"
    />
  </div>
</template>
