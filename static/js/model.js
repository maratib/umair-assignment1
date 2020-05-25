export { Model };

/* 
 * Model class to support the Citizen Science application
 * this class provides an interface to the web API and a local
 * store of data that the application can refer to.
 * The API generates two different events:
 *   "modelChanged" event when new data has been retrieved from the API
 *   "observationAdded" event when a request to add a new observation returns
*/

const Model = {

    observations_url: 'http://localhost:8010/api/observations',
    users_url: 'http://localhost:8010/api/users',

    // this will hold the data stored in the model
    data: {
        observations: [],
        users: []
    },


    // update_users - retrieve the latest list of users 
    //    from the server API
    // when the request is resolved, creates a "modelUpdated" event 
    // with the model as the event detail
    update_users: function () {
        fetch(this.users_url)
            .then(res => res.json())
            .then((data) => {
                this.set_users(data);
                window.dispatchEvent(new CustomEvent('modelUpdated', { detail: this }));
            })
            .catch(err => { throw err; });
    },

    // update_observations - retrieve the latest list of observations
    //   from the server API
    // when the request is resolved, creates a "modelUpdated" event 
    // with the model as the event detail
    update_observations: function () {

        fetch(this.observations_url)
            .then(res => res.json())
            .then((data) => {
                this.set_observations(data);
                window.dispatchEvent(new CustomEvent('modelUpdated', { detail: this }));
            })
            .catch(err => { throw err; });

    },

    // get_observations - return an array of observation objects
    get_observations: function () {
        return this.data.observations;
    },

    // get_observation - return a single observation given its id
    get_observation: function (observationid) {
        return this.data.observations.find(obs => obs.id === observationid) || null;
    },

    set_observations: function (observations) {
        this.data.observations = observations;
    },

    // add_observation - add a new observation by submitting a request
    //   to the server API
    //   formdata is a FormData object containing all fields in the observation object
    // when the request is resolved, creates an "observationAdded" event
    //  with the response from the server as the detail
    add_observation: function (formdata) {
        fetch(this.observations_url, { method: 'POST', body: formdata })
            .then(res => res.json())
            .then((data) => {
                window.dispatchEvent(new CustomEvent('observationAdded', { detail: data }));
            })
            .catch(err => { throw err; });
    },

    // get_user_observations - return just the observations for
    //   one user as an array
    get_user_observations: function (userid) {

        let data = this.data.observations.filter(observations => observations.participant == userid) || null;
        data = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return data;
    },

    // get_recent_observations - return the N most recent
    //  observations, ordered by timestamp, most recent first
    get_recent_observations: function (N) {
        let data = this.data.observations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return data.slice(0, N);
    },

    /* 
    * Users
    */
    // get_users - return the array of users
    get_users: function () {
        return this.data.users;
    },

    // set_users - set the array of users
    set_users: function (users) {
        this.data.users = users;
    },

    // get_user - return the details of a single user given 
    //    the user id
    get_user: function (userid) {
        return this.data.users.find(user => user.id === userid) || null;
    }

};
