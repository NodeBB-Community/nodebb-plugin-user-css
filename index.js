const db = require.main.require('./src/database');
const validator = require('validator');

const plugin = module.exports;

async function getCustomCSS(uid) {
	if (!uid) {
		return '';
	}
	return await db.getObjectField('user:' + uid + ':settings', 'customCSS') || '';
}

plugin.addCustomSetting = function (data) {
	const customCSS = data.settings.customCSS || '';

	data.customSettings.push({
		'title': 'Custom CSS',
		'content': '<textarea data-property="customCSS" class="form-control" type="textarea" rows="10">' + validator.escape(String(customCSS)) + '</textarea><p class="form-text">Requires a refresh to take effect.</p>'
	});

	return data;
};

plugin.filterUserSaveSettings = async function (hookData) {
	if (hookData.data.customCSS.length > 65535) {
		throw new Error('Custom CSS is too long. Maximum length is 65535 characters.');
	}
	hookData.settings.customCSS = hookData.data.customCSS || '';
	return hookData;
};

plugin.renderHeader = async function(data) {
	if (!data.req.uid) {
		return data;
	}
	const customCSS = await getCustomCSS(data.req.uid);
	if (customCSS) {
		data.templateValues.useCustomCSS = true;
		data.templateValues.customCSS += customCSS;
	}
	return data;
};

