var GitRevisionPlugin = require('git-revision-webpack-plugin');
var gitRevisionPlugin = new GitRevisionPlugin();

function extendEnvironment(environmentVars) {
	environmentVars["application.version"] = JSON.stringify(gitRevisionPlugin.version());
	environmentVars["application.commitHash"] = JSON.stringify(gitRevisionPlugin.commithash());
	return environmentVars;
}

module.exports = {
	extendEnvironment: extendEnvironment,
	gitRevisionPlugin: gitRevisionPlugin
};
