module.exports = {
	read (doc) {
		return JSON.parse(doc.session);
	},

	save (doc) {
		return { session: JSON.stringify(doc) };
	}
};
