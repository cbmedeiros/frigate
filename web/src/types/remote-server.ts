export type RemoteServer = {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
};

export type RemoteServerConfig = {
  servers: RemoteServer[];
};
