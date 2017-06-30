var GitRevisionPlugin = require('git-revision-webpack-plugin');
var gitRevisionPlugin = new GitRevisionPlugin();

function extendEnvironment(environmentVars) {
  environmentVars["applicationBuildConfig.version"] = JSON.stringify(gitRevisionPlugin.version());
  environmentVars["applicationBuildConfig.commitHash"] = JSON.stringify(gitRevisionPlugin.commithash());
  return environmentVars;
}

module.exports = {
  extendEnvironment: extendEnvironment,
  gitRevisionPlugin: gitRevisionPlugin
};
