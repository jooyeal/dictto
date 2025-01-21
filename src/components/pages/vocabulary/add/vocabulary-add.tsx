import { Card } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { VocabularyAddForm } from "./vocabulary-add-form";
import { VocabularyList } from "./vocabulary-list";
import { getVocabularies } from "@/db/vocabulary";

export async function VocabularyAdd() {
  const session = await getServerSession(authOptions);
  const vocabularies = await getVocabularies();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card className="w-full rounded-xl p-2">
        <VocabularyAddForm userId={session?.user.id} />
      </Card>
      <Card className="min-h-[100vh] flex-1 rounded-xl md:min-h-min p-2">
        <VocabularyList data={vocabularies} />
      </Card>
    </div>
  );
}
