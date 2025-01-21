import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getVocabularySettings } from "@/db/vocabulary";
import React from "react";
import { VocabularySettingsForm } from "./vocabulary-settings-form";

export async function VocabularySettings() {
  const settings = await getVocabularySettings();
  return (
    <div className="p-4 pt-0">
      <Card className="w-full rounded-xl p-2">
        <Label>Settings</Label>
        <VocabularySettingsForm data={settings} />
      </Card>
    </div>
  );
}
