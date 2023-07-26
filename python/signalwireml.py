import json
import yaml


def table_find(tbl, value):
    return value in tbl


class SignalWireML:
    def __init__(self, args):
        self._content = {
            'version': args.get('version', '1.0.0'),
            'sections': {},
            'engine': args.get('engine', 'gcloud'),
        }
        self._voice = args.get('voice', None)
        self._languages = []
        self._pronounce = []
        self._SWAIG = {
            'includes': [],
            'functions': [],
            'native_functions': [],
            'defaults': {}
        }
        self._params = {}
        self._prompt = {}
        self._post_prompt = {}
        self._hints = []

    def add_aiapplication(self, section):
        app = "ai"
        args = {}
        for data in ["post_prompt", "voice", "engine", "post_prompt_url", "post_prompt_auth_user",
                     "post_prompt_auth_password", "languages", "hints", "params", "prompt", "SWAIG", "pronounce"]:
            if hasattr(self, "_" + data):
                args[data] = getattr(self, "_" + data)

        self._content['sections'] = self._content.get('sections', {})
        self._content['sections'][section] = self._content['sections'].get(section, [])
        self._content['sections'][section].append({app: args})

    def add_application(self, section, app, args):
        self._content['sections'] = self._content.get('sections', {})
        self._content['sections'][section] = self._content['sections'].get(section, [])
        self._content['sections'][section].append({app: args})

    def set_aipost_prompt_url(self, postprompt):
        for k, v in postprompt.items():
            setattr(self, "_" + k, postprompt[k])

    def set_aiparams(self, params):
        self._params = params

    def add_aiparams(self, params):
        keys = ["end_of_speech_timeout", "attention_timeout", "outbound_attention_timeout", "background_file_loops",
                "background_file_volume", "digit_timeout", "energy_level"]

        for k, v in params.items():
            self._params[k] = int(v) if k in keys else v

    def set_aihints(self, *args):
        self._hints = list(args)

    def add_aihints(self, *args):
        hints = list(args)
        seen = set(self._hints)
        self._hints.extend(h for h in hints if h not in seen)

    def add_aiswaigdefaults(self, SWAIG):
        self._SWAIG['defaults'].update(SWAIG)

    def add_aiswaigfunction(self, SWAIG):
        self._SWAIG['functions'].append(SWAIG)

    def set_aipronounce(self, pronounce):
        self._pronounce = pronounce

    def add_aipronounce(self, pronounce):
        self._pronounce.append(pronounce)

    def set_ailanguage(self, language):
        self._languages = language

    def add_ailanguage(self, language):
        self._languages.append(language)

    def add_aiinclude(self, include):
        self._SWAIG['includes'].append(include)

    def add_ainativefunction(self, native):
        self._SWAIG['native_functions'].append(native)

    def set_aipost_prompt(self, postprompt):
        keys = ["confidence", "barge_confidence", "top_p", "temperature", "frequency_penalty", "presence_penalty"]

        for k, v in postprompt.items():
            self._post_prompt[k] = float(v) if k in keys else v

    def set_aiprompt(self, prompt):
        keys = ["confidence", "barge_confidence", "top_p", "temperature", "frequency_penalty", "presence_penalty"]

        for k, v in prompt.items():
            self._prompt[k] = float(v) if k in keys else v

    def swaig_response(self, response):
        return response

    def swaig_response_json(self, response):
        return json.dumps(response, indent=4)

    def render(self):
        return self._content

    def render_json(self):
        return json.dumps(self._content, indent=4)

    def render_yaml(self):
        return yaml.dump(self._content)
