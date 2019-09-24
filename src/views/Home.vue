<template>
    <v-app>
        <v-dialog v-model="newPatientModal" width="400">
            <v-card class="pa-5">
                <v-row justify="center">
                    <v-avatar width="250" height="250">
                        <img alt="Couldn't load the image" :src="patientData.image" width="250" height="250">
                    </v-avatar>
                </v-row>
                <v-row justify="center">
                    <v-form class="px-12">
                        <v-text-field v-model="patientData.name" label="Name"></v-text-field>
                        <v-text-field v-model="patientData.surname" label="Surname"></v-text-field>
                        <v-text-field v-model="patientData.age" label="Age"></v-text-field>
                    </v-form>
                </v-row>
                <v-row align="center" justify="center">
                    <v-btn class="mr-1" @click="hideSaveForm" width="40">Skip</v-btn>
                    <v-btn class="ml-1" @click="confirmSave" width="40" color="success">Save</v-btn>
                </v-row>
            </v-card>
        </v-dialog>

        <v-content>
            <v-container class="mt-10">
                <v-row align="center" justify="center">
                    <v-card class="pa-5" width="900">
                        <div class="title">Visits over the last 24 hours</div>
                        <v-card-text>
                            <div v-for="patient in patients" :key="patient.id">
                                <v-container>
                                    <v-row>
                                        <v-avatar width="250" height="250">
                                            <img alt="Couldn't load the image" :src="patient.image" width="250"
                                                 height="250">
                                        </v-avatar>
                                        <div class="ml-12 mt-4">
                                            Name: {{patient.name}}<br>
                                            Surname: {{patient.surname}}<br>
                                            Gender: {{patient.gender}}<br>
                                            Age: {{patient.age}}<br>
                                            Last visit: {{patient.lastVisit}}
                                        </div>
                                    </v-row>
                                </v-container>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    export default {
        name: 'Home',
        components: {},
        data() {
            return {
                patients: [],
                newPatientModal: false,
                toBeProcessed: [],
                patientData: {
                    id: null,
                    image: null,
                    name: null,
                    surname: null,
                    gender: null,
                    age: null,
                    match: false,
                    lastVisit: ''
                }
            }
        },

        mounted() {
            let channel = this.$pusher.subscribe('face-recognition');
            channel.bind('face-found', (data) => {
                this.patientData.image = 'http://127.0.0.1:8008' + data.image;
                this.patientData.gender = data.gender;
                if (data.users.length >= 1) {
                    this.patientData.id = data.users[0].id;
                    const patientIndex = this.findById(this.patientData.id);
                    if (patientIndex === undefined) {
                        this.newPatientModal = true;
                    } else {
                        let patient = this.patients[patientIndex];
                        patient.lastVisit = this.getDate();
                        this.$set(this.patients, patientIndex, patient)
                    }
                } else {
                    this.newPatientModal = true;
                }
            });
        },
        methods: {
            clearForm() {
                Object.keys(this.patientData).forEach((key) => {
                    this.patientData[key] = null
                });
            },

            findById(id) {
                if (this.patients.length >= 1) {
                    for (let i = 0; i <= this.patients.length; i++) {
                        if (this.patients[i].id === id) {
                            return i
                        }
                    }
                }
            },

            getDate() {
                let date = new Date();
                return date.toLocaleTimeString();
            },

            createUser(data) {
                const header = {"Authorization": "Token 7de026a1898e0b006002116267651a2d71567681"};
                const baseUrl = 'http://127.0.0.1:8008/api/';
                const userData = new FormData;
                fetch(data.image)
                    .then((response) => {
                        return response.blob()
                    })
                    .then((blob) => {
                        userData.append('gender', data.gender);
                        userData.append('cropped', true);
                        userData.append('images', blob, 'image.jpg');
                        this.axios.post(baseUrl + 'users/', userData, {headers: header}).then((response) => {
                            data.id = response.data.id;
                            data.lastVisit = this.getDate();
                            this.patients.push(data);
                        })
                    });
            },

            confirmSave() {
                const data = JSON.parse(JSON.stringify(this.patientData));
                if (!data.id) {
                    this.createUser(data)
                } else {
                    data.lastVisit = this.getDate();
                    this.patients.push(data)
                }
                this.hideSaveForm()
            },

            hideSaveForm() {
                this.newPatientModal = false;
                this.clearForm()
            }
        },
        computed: {}
    };
</script>
