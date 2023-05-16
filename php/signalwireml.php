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

    public function add_aiapplication($section) {
        $app = "ai";
        $args = [];

        foreach (['post_prompt', 'voice', 'engine', 'post_prompt_url', 'post_prompt_auth_user', 'post_prompt_auth_password', 'languages', 'hints', 'params', 'prompt', 'SWAIG'] as $data) {
            if (isset($this->{"_$data"})) {
                $args[$data] = $this->{"_$data"};
            }
        }

        $this->_content['sections'][$section][] = [$app => $args];
    }

    public function add_application($section, $app, $args) {
        $this->_content['sections'][$section][] = [$app => $args];
    }

    public function set_aipost_prompt_url($postprompt) {
        foreach ($postprompt as $k => $v) {
            $this->{"_$k"} = $v;
        }
    }

    public function set_aiparams($params) {
        $this->_params = $params;
    }

    public function add_aiparams($params) {
        foreach ($params as $k => $v) {
            $this->_params[$k] = $v;
        }
    }

    public function set_aihints(...$hints) {
        $this->_hints = is_array($hints[0]) ? $hints[0] : $hints;
    }

    public function add_aihints(...$hints) {
        $this->_hints = array_unique(array_merge($this->_hints, $hints));
    }

    public function add_aiswaigdefaults($SWAIG) {
        foreach ($SWAIG as $k => $v) {
            $this->_SWAIG['defaults'][$k] = $v;
        }
    }

    public function add_aiswaigfunction($SWAIG) {
        $this->_SWAIG['functions'][] = $SWAIG;
    }

    public function add_ailanguage($language) {
        $this->_languages[] = $language;
    }

    public function set_ailanguage($language) {
        $this->_languages = $language;
    }

    public function set_aipost_prompt($postprompt) {
        foreach ($postprompt as $k => $v) {
            $this->_postPrompt[$k] = $v;
        }
    }

    public function swaig_response($self, $response) {

        if (isset($self['_content']['sections'])) {
            $response['SWML'] = $self['_content'];
        }

        return json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    public function set_aiprompt($prompt) {
        foreach ($prompt as $k => $v) {
            $this->_prompt[$k] = $v;
        }
    }

    public function render_json() {
        return json_encode($this->_content, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    public function render_yaml() {
        return yaml_emit($this->_content, YAML_UTF8_ENCODING);
    }
}


