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
		'content': '<textarea data-property="customCSS" class="form-control" type="textarea">' + validator.escape(customCSS) + '</textarea><p class="help-block">Requires a refresh to take effect.</p>'
	});

	return data;
};

plugin.filterUserSaveSettings = async function (hookData) {
	hookData.settings.customCSS = hookData.data.customCSS || '';
	return hookData;
};

plugin.filterUserGetSettings = function(hookData) {
	hookData.settings.customCSS = hookData.settings.customCSS || '';
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

