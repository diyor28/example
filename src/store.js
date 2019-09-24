import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const baseUrl = "http://127.0.0.1:8008/api/";

function errorHandler(error) {
    if (error.response.status === 403) {
        const url = baseUrl + "token/refresh/";
        let user = JSON.parse(localStorage.getItem("user"));
        axios.post(url, {"refresh": user.refresh}).then((resp) => {
            user.access = resp.data.access;
            localStorage.setItem("user", JSON.stringify(user));
        });
    }
}

function loggedIn() {
    const token = JSON.parse(localStorage.getItem("user"));
    if (token) {
        return token.access;
    }
}

function getHeader() {
    const token = JSON.parse(localStorage.getItem("user")).access;
    return {"Authorization": "Bearer " + token};
}


function emptyObject(obj) {
    return Object.entries(obj).length === 0 && obj.constructor === Object;
}

function findByID(items, id) {
    for (let i = 0; i <= items.length; i++) {
        if (items[i].id === id) {
            return i
        }
    }
}

function sortBy(items, field, reverse = false) {
    items.sort((a, b) => {
        if (a[field] > b[field]) {
            return reverse ? -1 : 1
        } else if (a.name < b.name) {
            return reverse ? 1 : -1
        } else {
            return 0
        }
    });
    return items
}

function indexItems(items) {
    items.forEach((item, idx) => {
        item.index = idx
    });
    return items
}
