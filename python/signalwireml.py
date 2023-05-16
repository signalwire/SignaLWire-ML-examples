import json
import yaml

class SignalWireML:

    def __init__(self, args=None):
        if args is None:
            args = {}
        self._content = {
            'version': args.get('version', '1.0.0')
        }
        self._voice = args.get('voice')
        self._SWAIG = {
            'functions': [],
            'defaults': {}
        }
        self._params = {}
        self._hints = {}
        self._prompt = {}
        self._languages = []
        self._postPrompt = {}

    def add_aiapplication(self, section):
        app = 'ai'
        args = {}

        for data in ['post_prompt', 'voice', 'engine', 'post_prompt_url', 'post_prompt_auth_user',
                     'post_prompt_auth_password', 'languages', 'hints', 'params', 'prompt', 'SWAIG']:
            if hasattr(self, f'_{data}'):
                args[data] = getattr(self, f'_{data}')

        self._content.setdefault('sections', {}).setdefault(section, []).append({app: args})

    def add_application(self, section, app, args):
        self._content.setdefault('sections', {}).setdefault(section, []).append({app: args})

    def set_aipost_prompt_url(self, post_prompt):
        for k, v in post_prompt.items():
            setattr(self, f'_{k}', v)

    def set_aiparams(self, params):
        self._params = params

    def add_aiparams(self, params):
        for k, v in params.items():
            self._params[k] = v

    def set_aihints(self, *hints):
        self._hints = hints

    def add_aihints(self, *hints):
        self._hints = tuple(set(self._hints).union(hints))

    def add_aiswaigdefaults(self, SWAIG):
        for k, v in SWAIG.items():
            self._SWAIG['defaults'][k] = v

    def add_aiswaigfunction(self, SWAIG):
        self._SWAIG['functions'].append(SWAIG)

    def add_ailanguage(self, language):
        self._languages = tuple(set(self._languages).union({language}))

    def set_ailanguage(self, language):
        self._languages = language

    def set_aipost_prompt(self, post_prompt):
        for k, v in post_prompt.items():
            self._postPrompt[k] = v

    def set_aiprompt(self, prompt):
        for k, v in prompt.items():
            self._prompt[k] = v

    def render_json(self):
        return json.dumps(self._content, indent=2)

    def render_yaml(self):
        return yaml.dump(self._content)
