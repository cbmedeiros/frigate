import { usePersistence } from "@/hooks/use-persistence";
import { RemoteServer, RemoteServerConfig } from "@/types/remote-server";
import { useCallback } from "react";

const DEFAULT_CONFIG: RemoteServerConfig = {
  servers: [],
};

export function useRemoteServers() {
  const [config, setConfig, loaded] = usePersistence<RemoteServerConfig>(
    "remoteServers",
    DEFAULT_CONFIG,
  );

  const addServer = useCallback(
    (server: Omit<RemoteServer, "id">) => {
      const newServer: RemoteServer = {
        ...server,
        id: crypto.randomUUID(),
      };

      setConfig({
        servers: [...(config?.servers || []), newServer],
      });
    },
    [config, setConfig],
  );

  const updateServer = useCallback(
    (id: string, updates: Partial<RemoteServer>) => {
      if (!config) return;

      setConfig({
        servers: config.servers.map((server) =>
          server.id === id ? { ...server, ...updates } : server,
        ),
      });
    },
    [config, setConfig],
  );

  const deleteServer = useCallback(
    (id: string) => {
      if (!config) return;

      setConfig({
        servers: config.servers.filter((server) => server.id !== id),
      });
    },
    [config, setConfig],
  );

  return {
    servers: config?.servers || [],
    addServer,
    updateServer,
    deleteServer,
    loaded,
  };
}
