const filterHTML = function(html, query = "") {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");
	let filteredDoc = collection(doc.body.children);
	let error = null;

	if (query != "") {
		try {
			filteredDoc = collection(doc.querySelectorAll(query));
		}
		catch (e) {
			error = e.message.replace("Failed to execute 'querySelectorAll' on 'Document': ", "");
		}
	}

	return {
		html: renderCollection(filteredDoc),
		error
	}
}

const collection = (HTMLCollection) => {
	return Array.from(HTMLCollection);
}

const renderCollection = (collection) => {
	return collection.map(e => e.outerHTML).join("\n");
}

export default filterHTML;