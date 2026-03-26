// Types for the plug-service API responses

export interface PluginApp {
  rowid: string;
  name: string;
  description: string;
  appslugname: string;
  iconurl: string;
  category: string[];
  domain: string;
  brandcolor: string;
  autonumber: number;
}

export interface PluginsAllResponse {
  status: boolean;
  data: PluginApp[];
}

export interface PluginEvent {
  rowid: string;
  name: string;
  description: string;
  type: 'action' | 'trigger';
  pluginslugname: string;
  plugindescription?: string;
  pluginrecordid?: string;
  preposition?: string;
  triggertype?: string;
}

export interface PluginDetail extends PluginApp {
  events: PluginEvent[];
}

export interface IntegrationCombination {
  description: string;
  trigger: {
    name: string;
    id: string;
  };
  actions: {
    name: string;
    id: string;
  }[];
  score: number;
}

export interface PluginIntegrationsResponse {
  combinations: IntegrationCombination[];
  plugins: {
    [key: string]: PluginDetail;
  };
}
