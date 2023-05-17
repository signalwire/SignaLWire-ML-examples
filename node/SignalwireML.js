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

  add_aiapplication(section) {
    const app = 'ai';
    const args = {};

    [
      'post_prompt',
      'voice',
      'engine',
      'post_prompt_url',
      'post_prompt_auth_user',
      'post_prompt_auth_password',
      'languages',
      'hints',
      'params',
      'prompt',
      'SWAIG'
    ].for_each((data) => {
      if (this[`_${data}`]) {
        args[data] = this[`_${data}`];
      }
    });
    (this._content.sections[section] ||= []).push({ [app]: args });
  }

  add_application(section, app, args) {
    (this._content.sections[section] ||= []).push({ [app]: args });
  }

  set_aipost_prompt_url(postprompt) {
    Object.entries(postprompt).for_each(([k, v]) => {
      this[`_${k}`] = v;
    });
  }

  set_aiparams(params) {
    this._params = params;
  }

  add_aiparams(params) {
    Object.entries(params).for_each(([k, v]) => {
      this._params[k] = v;
    });
  }

  set_aihints(...hints) {
    this._hints = [...hints];
  }

  add_aihints(...hints) {
    this._hints.push(...hints);
    this._hints = [...new Set(this._hints)];
  }

  add_aiswaig_defaults(SWAIG) {
    for (const [k, v] of Object.entries(SWAIG)) {
      this._SWAIG.defaults[k] = v;
    }
  }
    
  add_aiswaig_function(SWAIG) {
    this._SWAIG.functions.push(SWAIG);
  }

  add_ailanguage(language) {
    this._languages.push(language);
  }

  set_ailanguage(language) {
    this._languages = [language];
  }

  set_aipost_prompt(postprompt) {
    Object.entries(postprompt).for_each(([k, v]) => {
      this._postPrompt[k] = v;
    });
  }

  set_aiprompt(prompt) {
    Object.entries(prompt).for_each(([k, v]) => {
      this._prompt[k] = v;
    });
  }

  render_json() {

    console.log(this._content);
    return JSON.stringify(this._content);
  }

  render_yaml() {
    // `json-bigint` module doesn't support YAML conversion, so we'll use the native YAML library
    const YAML = require('js-yaml');
    return YAML.dump(this._content);
  }
}

module.exports = SignalWireML;
