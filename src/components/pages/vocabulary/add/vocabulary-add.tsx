import { Card } from "@/components/ui/card";
import React from "react";
import { VocabularyAddForm } from "./vocabulary-add-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function VocabularyAdd() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        <Card className="aspect-video rounded-xl p-2">
          <VocabularyAddForm userId={session?.user.id} />
        </Card>
        <div className="aspect-video rounded-xl bg-sidebar-accent" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-sidebar-accent md:min-h-min" />
    </div>
  );
}
