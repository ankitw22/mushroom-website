export interface App {
  rowid: string;
  name: string;
  description: string;
  appslugname: string;
  iconurl: string;
  category: string[];
  domain: string;
  brandcolor: string | null;
  autonumber: number;
}

export const APPS_API = 'https://plug-service.viasocket.com/api/v1/plugins/all?limit=200';
