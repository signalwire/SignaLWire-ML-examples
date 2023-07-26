interface SignalWireMLContent {
  version: string;
  sections: { [section: string]: any[] };
  engine: string;
}

interface SWAIGData {
  includes: any[];
  functions: any[];
  native_functions: any[];
  defaults: { [key: string]: any };
}

interface AIApplicationArgs {
  post_prompt?: any;
  voice?: any;
  engine?: any;
  post_prompt_url?: any;
  post_prompt_auth_user?: any;
  post_prompt_auth_password?: any;
  languages?: any;
  hints?: any;
  params?: any;
  prompt?: any;
  SWAIG?: SWAIGData;
  pronounce?: any;
}

class SignalWireML {
  private _content: SignalWireMLContent;
  private _voice: any;
  private _languages: any[];
  private _pronounce: any[];
  private _SWAIG: SWAIGData;
  private _params: any;
  private _prompt: any;
  private _post_prompt: any;
  private _hints: any[];

  constructor(args: { version?: string; engine?: string; voice?: any }) {
    this._content = {
      version: args.version || '1.0.0',
      sections: {},
      engine: args.engine || 'gcloud',
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
    this._prompt = {};
    this._post_prompt = {};
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

    for (const data of [
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
      'SWAIG',
      'pronounce',
    ]) {
      if (this[`_${data}`]) {
        args[data] = this[`_${data}`];
      }
    }

    this._content.sections[section] = this._content.sections[section] || [];
    this._content.sections[section].push({ [app]: args });
  }

  public add_application(section: string, app: string, args: any): void {
    this._content.sections[section] = this._content.sections[section] || [];
    this._content.sections[section].push({ [app]: args });
  }

  public set_aipost_prompt_url(postprompt: any): void {
    for (const k in postprompt) {
      this[`_${k}`] = postprompt[k];
    }
  }

  public set_aiparams(params: any): void {
    this._params = params;
  }

  public add_aiparams(params: any): void {
    const keys = [
      'end_of_speech_timeout',
      'attention_timeout',
      'outbound_attention_timeout',
      'background_file_loops',
      'background_file_volume',
      'digit_timeout',
      'energy_level',
    ];

    for (const k in params) {
      if (this.table_find(keys, k)) {
        this._params[k] = parseInt(params[k]) || 0;
      } else {
        this._params[k] = params[k];
      }
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
    const keys = [
      'confidence',
      'barge_confidence',
      'top_p',
      'temperature',
      'frequency_penalty',
      'presence_penalty',
    ];

    for (const k in postprompt) {
      if (this.table_find(keys, k)) {
        this._post_prompt[k] = parseFloat(postprompt[k]) || 0;
      } else {
        this._post_prompt[k] = postprompt[k];
      }
    }
  }

  public set_aiprompt(prompt: any): void {
    const keys = [
      'confidence',
      'barge_confidence',
      'top_p',
      'temperature',
      'frequency_penalty',
      'presence_penalty',
    ];

    for (const k in prompt) {
      if (this.table_find(keys, k)) {
        this._prompt[k] = parseFloat(prompt[k]) || 0;
      } else {
        this._prompt[k] = prompt[k];
      }
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
