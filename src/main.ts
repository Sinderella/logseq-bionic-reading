import '@logseq/libs';
import { textVide } from 'text-vide';

const addTextVide = async (
  blockId: string,
  apply: boolean,
  recursive: boolean
) => {
  const block = await logseq.Editor.getBlock(blockId, {
    includeChildren: true,
  });
  if (block === null) {
    return;
  }
  let cleanedContent = block.content.replaceAll('**', '');
  if (apply) cleanedContent = textVide(cleanedContent, { sep: ['**', '**'] });
  logseq.Editor.updateBlock(block.uuid, cleanedContent);

  if (recursive && block.children !== undefined) {
    block.children.map((b) => {
      if ('uuid' in b) {
        return addTextVide(b.uuid, apply, recursive);
      } else {
        for (const uuid of b) {
          addTextVide(uuid, apply, recursive);
        }
        return;
      }
    });
  }
};

const main = async () => {
  logseq.Editor.registerSlashCommand('Bionic Reading: Apply', async (e) => {
    await addTextVide(e.uuid, true, false);
  });

  logseq.Editor.registerSlashCommand(
    'Bionic Reading: Apply Recursively',
    async (e) => {
      await addTextVide(e.uuid, true, true);
    }
  );

  logseq.Editor.registerSlashCommand('Bionic Reading: Unapply', async (e) => {
    await addTextVide(e.uuid, false, false);
  });

  logseq.Editor.registerSlashCommand(
    'Bionic Reading: Unapply Recursively',
    async (e) => {
      await addTextVide(e.uuid, false, true);
    }
  );
};

logseq.ready().then(main).catch(console.error);
