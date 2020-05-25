import { Model } from './model.js';
import * as views from './views.js';
import { split_hash, top_ten } from './util.js';

// Track the url change 
window.onhashchange = function () {
    refreshPage(split_hash(window.location.hash));
};

function refreshPage(url) {
    if (!url.id) {
        if (url.path === '') {
            let recentObservations = Model.get_recent_observations(10);
            let topTenUsers = top_ten(Model.get_observations(), Model.get_users());
            // Views.home(recentObservations, topTenUsers);
            views.homeView('target', recentObservations, topTenUsers);
        } //Load home view 

        if (url.path === 'users') views.listUsersView('target', Model.get_users()); //Load Users view
        if (url.path === 'observations') views.listObservationsView('target', Model.get_observations()); //Load Observations view
        if (url.path === 'submit') {
            views.formView('target');
            var form = document.querySelector("form");
            form.onsubmit = myFormSubmit.bind(form);
        }
    } else {
        let id = parseInt(url.id);
        if (url.path === 'users') views.userView('target', Model.get_user(id), Model.get_user_observations(id)); //Load Single User view
        if (url.path === 'observations') views.observationView('target', Model.get_observation(id)); //Load Single Observations view
    }
}

async function myFormSubmit(e) {
    e.preventDefault();
    let fd = new FormData();
    fd.append('participant', document.getElementById("participant").value);
    fd.append('temperature', document.getElementById("temperature").value);
    fd.append('height', document.getElementById("height").value);
    fd.append('girth', document.getElementById("girth").value);
    fd.append('location', document.getElementById("location").value);
    fd.append('weather', document.getElementById("weather").value);
    fd.append('wind', document.getElementById("wind").value);
    fd.append('leaf_size', document.getElementById("leaf_size").value);
    fd.append('leaf_shape', document.getElementById("leaf_shape").value);
    fd.append('bark_colour', document.getElementById("bark_colour").value);
    fd.append('bark_texture', document.getElementById("bark_texture").value);
    // console.log('adsfdsf');
    Model.add_observation(fd);


    window.addEventListener('observationAdded', observationAdded);
    return false;
}

function observationAdded(data) {
    if (data.detail.status === 'success') {
        Model.update_observations();
        // Model.get_observations().push(data.detail.observation);
        sleep(250).then(() => { window.location.hash = "#!/users/0"; });

    } else {
        views.errorsView(data.detail.errors);
    }
    window.removeEventListener("observationAdded", observationAdded);
}


// function start() {
//     refreshPage(split_hash(window.location.hash));
//     window.removeEventListener("modelUpdated", start);
// }
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
window.onload = function () {
    Model.update_observations();
    Model.update_users();
    sleep(250).then(() => { refreshPage(split_hash(window.location.hash)); });

    // window.addEventListener('modelUpdated', start);

};


