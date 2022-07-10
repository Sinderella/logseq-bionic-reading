import '@logseq/libs';
import { textVide } from 'text-vide';

const addTextVide = async (blockId: string, recursive: boolean) => {
  const block = await logseq.Editor.getBlock(blockId, {
    includeChildren: true,
  });
  if (block === null) {
    return;
  }
  logseq.Editor.updateBlock(
    block.uuid,
    textVide(block.content, { sep: ['**', '**'] })
  );

  if (recursive && block.children !== undefined) {
    block.children.map((b) => {
      if ('uuid' in b) {
        return addTextVide(b.uuid, true);
      } else {
        for (const uuid of b) {
          addTextVide(uuid, true);
        }
        return;
      }
    });
  }
};

const main = async () => {
  console.log('testt');

  logseq.Editor.registerSlashCommand('Bionic Reading: Apply', async (e) => {
    await addTextVide(e.uuid, false);
  });

  logseq.Editor.registerSlashCommand(
    'Bionic Reading: Apply Recursively',
    async (e) => {
      await addTextVide(e.uuid, true);
    }
  );
};

logseq.ready().then(main).catch(console.error);
