export { split_hash, top_ten };
// split_hash - given a hash path like "#!/observations/2" 
//   return an object with properties `path` ("observations") and `id` (2)
function split_hash(hash) {

    const regex = "#!/([^/]*)/?(.*)?";
    const match = hash.match(regex);
    if (match) {
        return {
            path: match[1],
            id: match[2]
        };
    } else {
        return { path: "" };
    }
}

function top_ten(obs, users) {
    let c = {};
    for (let i = 0; i < obs.length; i++) {
        let o = obs[i];
        if (c[o.participant]) ++c[o.participant];
        else c[o.participant] = 1;
    }

    let u = [];
    let keys = Object.keys(c);

    for (let i = 0; i < keys.length; i++) {
        if (keys[i] != '7')
            u.push({ id: parseInt(keys[i]), count: c[keys[i]] });
    }


    u = u.sort((a, b) => b.count - a.count);
    u = u.slice(0, 10);

    let topUsers = [];
    for (let i = 0; i < u.length; i++) topUsers.push(users.find(user => user.id === u[i].id));

    // console.log(JSON.stringify(topUsers));

    return topUsers;


}
