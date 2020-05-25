
function apply_template(targetId, templateId, data) {
	let target = document.getElementById(targetId);
	let template = Handlebars.compile(
		document.getElementById(templateId).textContent
	);
	target.innerHTML = template(data);
}

export function homeView(targetId, recentObservations, topTenUsers) {
	apply_template(targetId, "home-template", { 'recentObservations': recentObservations, 'topTenUsers': topTenUsers });
}

export function listUsersView(targetId, users) {

	apply_template(targetId, "users-list-template", { 'users': users });
}

export function userView(targetId, user, observations) {
	apply_template(targetId, "user-template", {
		'user': user, 'observations': observations
	});
}


export function listObservationsView(targetId, observations) {
	apply_template(targetId, "observations-list-template", { 'observations': observations });
}

export function observationView(targetId, observation) {
	apply_template(targetId, "observation-template", observation);
}

export function formView(targetId) {
	apply_template(targetId, "form-template", null);
}

export function errorsView(errors) {
	let content = `<h2>Observation Faild</h2><ul class="failed">`;
	for (var i = 0; i < errors.length; i++) {
		var error = errors[i];
		content += `<li><span style='color:red'>${error}</span></li>`;
	}
	content += `</ul>`;
	document.getElementById("target").innerHTML += content;
}

