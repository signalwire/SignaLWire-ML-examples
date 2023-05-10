<?php

class SignalWireML {

    private $_content;
    private $_voice;
    private $_SWAIG;
    private $_params;
    private $_hints;
    private $_languages;
    private $_postPrompt;
    private $_prompt;

    public function __construct($args = []) {
        $this->_content['version'] = $args['version'] ?? '1.0.0';
        $this->_content['engine'] = $args['engine'] ?? 'gcloud';
        $this->_voice = $args['voice'] ?? null;
        $this->_SWAIG['functions'] = [];
        $this->_SWAIG['defaults'] = [];
        $this->_params = [];
        $this->_hints = [];
        $this->_languages = [];
        $this->_postPrompt = [];
        $this->_prompt = [];
    }

    public function addAIApplication($section) {
        $app = "ai";
        $args = [];

        foreach (['postPrompt', 'voice', 'engine', 'postPromptURL', 'postPromptAuthUser', 'postPromptAuthPassword', 'languages', 'hints', 'params', 'prompt', 'SWAIG'] as $data) {
            if (isset($this->{"_$data"})) {
                $args[$data] = $this->{"_$data"};
            }
        }

        $this->_content['sections'][$section][] = [$app => $args];
    }

    public function addApplication($section, $app, $args) {
        $this->_content['sections'][$section][] = [$app => $args];
    }

    public function setAIpostPromptURL($postprompt) {
        foreach ($postprompt as $k => $v) {
            $this->{"_$k"} = $v;
        }
    }

    public function setAIparams($params) {
        $this->_params = $params;
    }

    public function addAIparams($params) {
        foreach ($params as $k => $v) {
            $this->_params[$k] = $v;
        }
    }

    public function setAIhints(...$hints) {
        $this->_hints = is_array($hints[0]) ? $hints[0] : $hints;
    }

    public function addAIhints(...$hints) {
        $this->_hints = array_unique(array_merge($this->_hints, $hints));
    }

    public function addAISWAIGdefaults($SWAIG) {
        foreach ($SWAIG as $k => $v) {
            $this->_SWAIG['defaults'][$k] = $v;
        }
    }

    public function addAISWAIGfunction($SWAIG) {
        $this->_SWAIG['functions'][] = $SWAIG;
    }

    public function addAIlanguage($language) {
        $this->_languages[] = $language;
    }

    public function setAIlanguage($language) {
        $this->_languages = $language;
    }

    public function setAIpostPrompt($postprompt) {
        foreach ($postprompt as $k => $v) {
            $this->_postPrompt[$k] = $v;
        }
    }

    public function setAIprompt($prompt) {
        foreach ($prompt as $k => $v) {
            $this->_prompt[$k] = $v;
        }
    }

    public function renderJSON() {
        return json_encode($this->_content, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    public function renderYAML() {
        return yaml_emit($this->_content, YAML_UTF8_ENCODING);
    }
}


