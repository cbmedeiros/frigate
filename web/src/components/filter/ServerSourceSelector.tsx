import { useRemoteServers } from "@/hooks/use-remote-servers";
import { usePersistence } from "@/hooks/use-persistence";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { LuServer } from "react-icons/lu";

export type ServerSource = {
  type: "local" | "remote";
  serverId?: string;
  serverUrl?: string;
  serverName?: string;
};

export function ServerSourceSelector() {
  const { t } = useTranslation(["views/events"]);
  const { servers } = useRemoteServers();
  const [selectedSource, setSelectedSource] = usePersistence<ServerSource>(
    "reviewServerSource",
    { type: "local" },
  );

  const enabledServers = servers.filter((s) => s.enabled);

  const handleValueChange = useCallback(
    (value: string) => {
      if (value === "local") {
        setSelectedSource({ type: "local" });
      } else {
        const server = enabledServers.find((s) => s.id === value);
        if (server) {
          setSelectedSource({
            type: "remote",
            serverId: server.id,
            serverUrl: server.url,
            serverName: server.name,
          });
        }
      }
    },
    [enabledServers, setSelectedSource],
  );

  const currentValue =
    selectedSource?.type === "local"
      ? "local"
      : selectedSource?.serverId || "local";

  return (
    <div className="flex items-center gap-2">
      <LuServer className="size-4 text-muted-foreground" />
      <Select value={currentValue} onValueChange={handleValueChange}>
        <SelectTrigger
          className="w-[200px]"
          aria-label={t("serverSource.aria")}
        >
          <SelectValue placeholder={t("serverSource.selectServer")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="local">{t("serverSource.local")}</SelectItem>
          {enabledServers.length > 0 && (
            <>
              {enabledServers.map((server) => (
                <SelectItem key={server.id} value={server.id}>
                  {server.name}
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

export function useServerSource(): ServerSource {
  const [selectedSource] = usePersistence<ServerSource>("reviewServerSource", {
    type: "local",
  });

  return selectedSource || { type: "local" };
}
