const JSON = require('json-bigint'); // using 'json-bigint' module to handle large numbers

class SignalWireML {
  constructor(args) {
    this._content = {
      version: args.version || '1.0.0',
      engine: args.engine || 'gcloud',
      sections: {}
    };
    this._voice = args.voice || undefined;
    this._SWAIG = [];
    this._params ={};
    this._postPrompt={};
    this._prompt={};
  }

  addAIApplication(section) {
    const app = 'ai';
    const args = {};

    [
      'postPrompt',
      'voice',
      'engine',
      'postPromptURL',
      'postPromptAuthUser',
      'postPromptAuthPassword',
      'languages',
      'hints',
      'params',
      'prompt',
      'SWAIG'
    ].forEach((data) => {
      if (this[`_${data}`]) {
        args[data] = this[`_${data}`];
      }
    });
    (this._content.sections[section] ||= []).push({ [app]: args });
  }

  addApplication(section, app, args) {
    (this._content.sections[section] ||= []).push({ [app]: args });
  }

  setAIpostPromptURL(postprompt) {
    Object.entries(postprompt).forEach(([k, v]) => {
      this[`_${k}`] = v;
    });
  }

  setAIparams(params) {
    this._params = params;
  }

  addAIparams(params) {
    Object.entries(params).forEach(([k, v]) => {
      this._params[k] = v;
    });
  }

  setAIhints(...hints) {
    this._hints = [...hints];
  }

  addAIhints(...hints) {
    this._hints.push(...hints);
    this._hints = [...new Set(this._hints)];
  }

  addAISWAIGdefaults(SWAIG) {
    for (const [k, v] of Object.entries(SWAIG)) {
      this._SWAIG.defaults[k] = v;
    }
  }
    
  addAISWAIGfunction(SWAIG) {
    this._SWAIG.functions.push(SWAIG);
  }

  addAIlanguage(language) {
    this._languages.push(language);
  }

  setAIlanguage(language) {
    this._languages = [language];
  }

  setAIpostPrompt(postprompt) {
    Object.entries(postprompt).forEach(([k, v]) => {
      this._postPrompt[k] = v;
    });
  }

  setAIprompt(prompt) {
    Object.entries(prompt).forEach(([k, v]) => {
      this._prompt[k] = v;
    });
  }

  renderJSON() {

    console.log(this._content);
    return JSON.stringify(this._content);
  }

  renderYAML() {
    // `json-bigint` module doesn't support YAML conversion, so we'll use the native YAML library
    const YAML = require('js-yaml');
    return YAML.dump(this._content);
  }
}

module.exports = SignalWireML;
