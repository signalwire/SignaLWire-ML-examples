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

    def addAIApplication(self, section):
        app = 'ai'
        args = {}

        for data in ['postPrompt', 'voice', 'engine', 'postPromptURL', 'postPromptAuthUser',
                     'postPromptAuthPassword', 'languages', 'hints', 'params', 'prompt', 'SWAIG']:
            if hasattr(self, f'_{data}'):
                args[data] = getattr(self, f'_{data}')

        self._content.setdefault('sections', {}).setdefault(section, []).append({app: args})

    def addApplication(self, section, app, args):
        self._content.setdefault('sections', {}).setdefault(section, []).append({app: args})

    def setAIpostPromptURL(self, post_prompt):
        for k, v in post_prompt.items():
            setattr(self, f'_{k}', v)

    def setAIparams(self, params):
        self._params = params

    def addAIparams(self, params):
        for k, v in params.items():
            self._params[k] = v

    def setAIhints(self, *hints):
        self._hints = hints

    def addAIhints(self, *hints):
        self._hints = tuple(set(self._hints).union(hints))

    def addAISWAIGdefaults(self, SWAIG):
        for k, v in SWAIG.items():
            self._SWAIG['defaults'][k] = v

    def addAISWAIGfunction(self, SWAIG):
        self._SWAIG['functions'].append(SWAIG)

    def addAIlanguage(self, language):
        self._languages = tuple(set(self._languages).union({language}))

    def setAIlanguage(self, language):
        self._languages = language

    def setAIpostPrompt(self, post_prompt):
        for k, v in post_prompt.items():
            self._postPrompt[k] = v

    def setAIprompt(self, prompt):
        for k, v in prompt.items():
            self._prompt[k] = v

    def renderJSON(self):
        return json.dumps(self._content, indent=2)

    def renderYAML(self):
        return yaml.dump(self._content)
