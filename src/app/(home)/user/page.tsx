import React from "react";

import { getNotificationPreferences } from "@/actions/notification-actions";

import { NotificationPreferencesForm } from "./components/notification-preferences-form";

const page = async () => {
  const preferences = await getNotificationPreferences();
  return (
    <div>
      <NotificationPreferencesForm defaultValues={preferences}/>
    </div>
  );
};

export default page;
