"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateNotificationPreferences } from "@/actions/notification-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Channel = "EMAIL" | "SMS" | "IN_APP";

const ALL_CHANNELS: Channel[] = ["EMAIL", "SMS", "IN_APP"];

export function NotificationPreferencesForm({
  defaultValues,
}: {
  defaultValues: Record<Channel, boolean>;
}) {
  const [pending, startTransition] = useTransition();

  const { watch, setValue } = useForm({
    defaultValues,
  });

  const values = watch();

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateNotificationPreferences(values);
        toast.success("Preferences saved.");
      } catch (e) {
        toast.error("Something went wrong.");
        console.log(e);
      }
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Notification Preferences</h3>

      {ALL_CHANNELS.map((channel) => (
        <div key={channel} className="flex items-center justify-between">
          <Label htmlFor={channel}>{channel.replace("_", " ")}</Label>
          <Switch
            id={channel}
            checked={values[channel]}
            onCheckedChange={(v) => setValue(channel, v)}
          />
        </div>
      ))}

      <Button onClick={handleSave} disabled={pending}>
        {pending ? "Saving..." : "Save Preferences"}
      </Button>
    </div>
  );
}
