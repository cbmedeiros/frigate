import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRemoteServers } from "@/hooks/use-remote-servers";
import { RemoteServer } from "@/types/remote-server";
import { useCallback, useState } from "react";
import { FaTrash, FaEdit, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

export default function RemoteServersSettingsView() {
  const { t } = useTranslation("views/settings");
  const { servers, addServer, updateServer, deleteServer } = useRemoteServers();
  const [editingServer, setEditingServer] = useState<RemoteServer | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    enabled: true,
  });

  const resetForm = useCallback(() => {
    setFormData({ name: "", url: "", enabled: true });
    setEditingServer(null);
    setIsAdding(false);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!formData.name || !formData.url) {
      toast.error(t("remoteServers.toast.error.fillFields"), {
        position: "top-center",
      });
      return;
    }

    // Validate URL format
    try {
      new URL(formData.url);
    } catch (e) {
      toast.error(t("remoteServers.toast.error.invalidUrl"), {
        position: "top-center",
      });
      return;
    }

    if (editingServer) {
      updateServer(editingServer.id, formData);
      toast.success(t("remoteServers.toast.success.updated"), {
        position: "top-center",
      });
    } else {
      addServer(formData);
      toast.success(t("remoteServers.toast.success.added"), {
        position: "top-center",
      });
    }

    resetForm();
  }, [formData, editingServer, addServer, updateServer, resetForm, t]);

  const handleEdit = useCallback((server: RemoteServer) => {
    setEditingServer(server);
    setFormData({
      name: server.name,
      url: server.url,
      enabled: server.enabled,
    });
    setIsAdding(true);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      deleteServer(id);
      toast.success(t("remoteServers.toast.success.deleted"), {
        position: "top-center",
      });
    },
    [deleteServer, t],
  );

  const handleToggleEnabled = useCallback(
    (id: string, enabled: boolean) => {
      updateServer(id, { enabled });
    },
    [updateServer],
  );

  return (
    <div className="flex size-full flex-col gap-4 overflow-y-auto">
      <Heading as="h3" className="my-2">
        {t("remoteServers.title")}
      </Heading>
      <p className="text-sm text-muted-foreground">
        {t("remoteServers.description")}
      </p>

      <Separator />

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <Heading as="h4">
              {editingServer
                ? t("remoteServers.form.editTitle")
                : t("remoteServers.form.addTitle")}
            </Heading>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetForm}
              aria-label={t("button.cancel", { ns: "common" })}
            >
              <FaTimes className="size-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="server-name">{t("remoteServers.form.name")}</Label>
            <Input
              id="server-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder={t("remoteServers.form.namePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="server-url">{t("remoteServers.form.url")}</Label>
            <Input
              id="server-url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="http://192.168.1.100:5000"
            />
            <p className="text-xs text-muted-foreground">
              {t("remoteServers.form.urlHelp")}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="server-enabled"
              checked={formData.enabled}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, enabled: checked })
              }
            />
            <Label htmlFor="server-enabled">
              {t("remoteServers.form.enabled")}
            </Label>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            <FaSave className="mr-2 size-4" />
            {editingServer
              ? t("button.save", { ns: "common" })
              : t("button.add", { ns: "common" })}
          </Button>
        </div>
      )}

      {/* Add Button */}
      {!isAdding && (
        <Button
          onClick={() => setIsAdding(true)}
          variant="outline"
          className="w-full"
        >
          <FaPlus className="mr-2 size-4" />
          {t("remoteServers.addButton")}
        </Button>
      )}

      {/* Server List */}
      {servers.length > 0 && (
        <div className="space-y-2">
          <Heading as="h4">{t("remoteServers.list.title")}</Heading>
          {servers.map((server) => (
            <div
              key={server.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{server.name}</span>
                  <span
                    className={`text-xs ${server.enabled ? "text-green-500" : "text-muted-foreground"}`}
                  >
                    {server.enabled
                      ? t("remoteServers.list.enabled")
                      : t("remoteServers.list.disabled")}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {server.url}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={server.enabled}
                  onCheckedChange={(checked) =>
                    handleToggleEnabled(server.id, checked)
                  }
                  aria-label={t("remoteServers.list.toggleEnabled")}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(server)}
                  aria-label={t("button.edit", { ns: "common" })}
                >
                  <FaEdit className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(server.id)}
                  aria-label={t("button.delete", { ns: "common" })}
                >
                  <FaTrash className="size-4 text-danger" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {servers.length === 0 && !isAdding && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            {t("remoteServers.list.empty")}
          </p>
        </div>
      )}
    </div>
  );
}
