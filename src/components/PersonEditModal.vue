<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePersons, type Person } from '../stores/persons';

const props = defineProps({
  id: {
    type: Number,
    default: 0
  }
});

const { editPerson, handleModal, getPerson } = usePersons();

const person = ref<Person>({ name: '', email: '', id: 0, person_id: null });

onMounted(async () => {
  person.value = await getPerson(props.id);
});

const isFormValid = computed(() => {
  const { name, email } = person.value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return name.trim() !== '' && email.trim() !== '' && emailRegex.test(email);
});
</script>

<template>
  <div>
    <div class="fixed z-10 inset-0 overflow-y-auto">
      <form @submit.prevent="() => editPerson(person, id)">
        <div
          class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
            >&#8203;</span
          >
          <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div
                  class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10"
                >
                  <svg
                    class="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                    Edit Person
                  </h3>
                  <div class="mt-2">
                    <div class="mb-4">
                      <label class="block text-gray-700 font-bold mb-2" for="name"> Name </label>
                      <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        required
                        v-model="person.name"
                      />
                    </div>
                    <div class="mb-4">
                      <label class="block text-gray-700 font-bold mb-2" for="email"> Email </label>
                      <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        required
                        v-model="person.email"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                :disabled="!isFormValid"
              >
                Atualizar
              </button>
              <button
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                @click.prevent="() => handleModal('')"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
