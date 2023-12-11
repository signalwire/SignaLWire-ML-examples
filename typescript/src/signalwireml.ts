interface SignalWireMLContent {
  version: string;
  sections: { [section: string]: any[] };
}

interface SWAIGData {
  includes: any[];
  functions: any[];
  native_functions: any[];
  defaults: { [key: string]: any };
}

interface PromptData {
  text?: string;
  temperature?: number;
  top_p?: number;
  confidence?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
}

interface PostPromptData {
  text?: string;
  temperature?: number;
  top_p?: number;
  confidence?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
}

interface LanguageData {
  name?: string;
  code?: string;
  voice?: string
  fillers?: string[];
  engine?: string;
}

interface AIApplicationArgs {
  prompt?: PromptData;
  post_prompt?: PostPromptData;
  voice?: any;
  engine?: any;
  post_prompt_url?: string;
  post_prompt_auth_user?: string;
  post_prompt_auth_password?: string;
  params?: any;
  SWAIG?: SWAIGData;
  languages?: Array<LanguageData>;
  hints?: any;
  pronounce?: any;
}

class SignalWireML {
  private _content: SignalWireMLContent;
  private _voice: any;
  private _languages: Array<LanguageData>;
  private _pronounce: any[];
  private _SWAIG: SWAIGData;
  private _params: any;
  private _prompt: PromptData;
  private _post_prompt: PostPromptData;
  private _post_prompt_url!: string;
  private _post_prompt_auth_user!: string;
  private _post_prompt_auth_password!: string;
  private _hints: any[];

  constructor(args: { version?: string; voice?: any }) {
    this._content = {
      version: args.version || '1.0.0',
      sections: {},
    };
    this._voice = args.voice || null;
    this._languages = [];
    this._pronounce = [];
    this._SWAIG = {
      includes: [],
      functions: [],
      native_functions: [],
      defaults: {},
    };
    this._params = {};
    this._prompt = {
      temperature: 1.0,
      top_p: 1.0,
      confidence: 0.6,
      presence_penalty: 0.0,
      frequency_penalty: 0.0
    };
    this._post_prompt = {
      temperature: 1.0,
      top_p: 1.0,
      confidence: 0.6,
      presence_penalty: 0.0,
      frequency_penalty: 0.0
    };
    this._hints = [];
  }

  private table_find(tbl: any[], value: any): boolean {
    for (const v of tbl) {
      if (v === value) {
        return true;
      }
    }
    return false;
  }

  public add_aiapplication(section: string): void {
    const app = 'ai';
    const args: AIApplicationArgs = {};
   
    if (this['_post_prompt']) args['post_prompt'] = this['_post_prompt'];
    if (this['_voice']) args['voice'] = this['_voice'];
    if (this['_post_prompt_url']) args['post_prompt_url'] = this['_post_prompt_url'];
    if (this['_post_prompt_auth_user']) args['post_prompt_auth_user'] = this['_post_prompt_auth_user'];
    if (this['_post_prompt_auth_password']) args['post_prompt_auth_password'] = this['_post_prompt_auth_password'];
    if (this['_languages']) args['languages'] = this['_languages'];
    if (this['_hints']) args['hints'] = this['_hints'];
    if (this['_params']) args['params'] = this['_params'];
    if (this['_prompt']) args['prompt'] = this['_prompt'];
    if (this['_SWAIG']) args['SWAIG'] = this['_SWAIG'];
    if (this['_pronounce']) args['pronounce'] = this['_pronounce'];

    this._content.sections[section] = this._content.sections[section] || [];
    this._content.sections[section].push({ [app]: args });
  }

  public add_application(section: string, app: string, args: any): void {
    this._content.sections[section] = this._content.sections[section] || [];
    this._content.sections[section].push({ [app]: args });
  }

  public set_aipost_prompt_url(postprompturl: string): void {
    this._post_prompt_url = postprompturl;
  }

  public set_aipost_prompt_auth_user(postpromptauthuser: any): void {
    this._post_prompt_auth_user = postpromptauthuser;
  }

  public set_aipost_prompt_auth_password(postpromptauthpassword: any): void {
    this._post_prompt_auth_password = postpromptauthpassword;
  }

  public set_aiparams(params: any): void {
    this._params = params;
  }

  public add_aiparams(params: any): void {
    for (const k in params) {
      if (k == 'direction') this._params['direction'] = params['direction'];
      if (k == 'wait_for_user') this._params['wait_for_user'] = Boolean(params['wait_for_user']);
      if (k == 'end_of_speech_timeout') this._params['end_of_speech_timeout'] = parseInt(params['end_of_speech_timeout']);
      if (k == 'attention_timeout') this._params['attention_timeout'] = parseInt(params['attention_timeout']);
      if (k == 'inactivity_timeout') this._params['inactivity_timeout'] = parseInt(params['inactivity_timeout']);
      if (k == 'background_file') this._params['background_file'] = params['background_file'];
      if (k == 'background_file_loops') this._params['background_file_loops'] = parseInt(params['background_file_loops']);
      if (k == 'background_file_volume') this._params['background_file_volume'] = parseInt(params['background_file_volume']);
      if (k == 'ai_volume') this._params['ai_volume'] = parseInt(params['ai_volume']);
      if (k == 'local_tz') this._params['local_tz'] = params['local_tz'];
      if (k == 'conscience') this._params['conscience'] = Boolean(params['conscience']);
      if (k == 'save_conversation') this._params['save_conversation'] = Boolean(params['save_conversation']);
      if (k == 'conversation_id') this._params['conversation_id'] = params['conversation_id'];
      if (k == 'digit_timeout') this._params['digit_timeout'] = parseInt(params['digit_timeout']);
      if (k == 'digit_terminatiors') this._params['digit_terminators'] = params['digit_terminators'];
      if (k == 'energy_level') this._params['energy_level'] = parseFloat(params['energy_level']);
      if (k == 'swaig_allow_swml') this._params['swaig_allow_swml'] = Boolean(params['swaig_allow_swml']);
    }
  }

  public set_aihints(...hints: any[]): void {
    this._hints = hints;
  }

  public add_aihints(...hints: any[]): void {
    const seen: { [hint: string]: boolean } = {};
    for (const hint of this._hints || []) {
      seen[hint] = true;
    }
    for (const hint of hints) {
      if (!seen[hint]) {
        this._hints.push(hint);
        seen[hint] = true;
      }
    }
  }

  public add_aiswaigdefaults(SWAIG: any): void {
    for (const k in SWAIG) {
      this._SWAIG.defaults[k] = SWAIG[k];
    }
  }

  public add_aiswaigfunction(SWAIG: any): void {
    this._SWAIG.functions.push(SWAIG);
  }

  public set_aipronounce(pronounce: any): void {
    this._pronounce = pronounce;
  }

  public add_aipronounce(pronounce: any): void {
    this._pronounce.push(pronounce);
  }

  public set_ailanguage(language: any): void {
    this._languages = language;
  }

  public add_ailanguage(language: any): void {
    this._languages.push(language);
  }

  public add_aiinclude(include: any): void {
    this._SWAIG.includes.push(include);
  }

  public add_ainativefunction(native: any): void {
    this._SWAIG.native_functions.push(native);
  }

  public set_aipost_prompt(postprompt: any): void {
    for (const k in postprompt) {
      if (k == 'text') this._post_prompt['text'] = postprompt[k];
      if (k == 'temperature') this._post_prompt['temperature'] = parseFloat(postprompt[k]);
      if (k == 'top_p') this._post_prompt['top_p'] = parseFloat(postprompt[k]);
      if (k == 'confidence') this._post_prompt['confidence'] = parseFloat(postprompt[k]);
      if (k == 'presence_penalty') this._post_prompt['presence_penalty'] = parseFloat(postprompt[k]);
      if (k == 'frequency_penalty') this._post_prompt['frequency_penalty'] = parseFloat(postprompt[k]);
    }
  }

  public set_aiprompt(prompt: any): void {
    for (const k in prompt) {
      if (k == 'text') this._prompt['text'] = prompt[k];
      if (k == 'temperature') this._prompt['temperature'] = parseFloat(prompt[k]);
      if (k == 'top_p') this._prompt['top_p'] = parseFloat(prompt[k]);
      if (k == 'confidence') this._prompt['confidence'] = parseFloat(prompt[k]);
      if (k == 'presence_penalty') this._prompt['presence_penalty'] = parseFloat(prompt[k]);
      if (k == 'frequency_penalty') this._prompt['frequency_penalty'] = parseFloat(prompt[k]);
    }
  }

  public swaig_response(response: any): any {
    return response;
  }

  public swaig_response_json(response: any): string {
    const json_str = JSON.stringify(response, null, 2);
    return json_str;
  }

  public render(): SignalWireMLContent {
    return this._content;
  }

  public render_json(): string {
    const json_str = JSON.stringify(this._content, null, 2);
    return json_str;
  }

  public render_yaml(): string {
    // Implement the function to convert the content to YAML format
    // You can use libraries like 'js-yaml' to achieve this.
    return 'Implement render_yaml() function to convert content to YAML';
  }
}

export default SignalWireML;
