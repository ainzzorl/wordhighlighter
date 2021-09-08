///<reference path="common/dao.ts" />
///<reference path="common/logger.ts" />
///<reference path="common/group.ts" />

/**
 * Implements background logic: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Anatomy_of_a_WebExtension#Background_scripts
 */
class Background {
  dao: DAO;

  constructor(dao: DAO) {
    this.dao = dao;
  }

  start(): void {
    this.dao.init();
  }

  async getMenuItems(): Promise<Array<chrome.contextMenus.CreateProperties>> {
    return this.dao.getGroups().then((groups: Array<Group>) => {
      if (groups.length === 1) {
        // If there's only one group, there's no point in nesting menu items.
        // Just have one items adding the word to the group.
        let menuItem = {
          id: 'add-word',
          title: 'Add word',
          parentId: null as string,
          contexts: ['selection'],
          onclick: (info: chrome.contextMenus.OnClickData) => {
            this.addWord(info.selectionText, groups[0].id);
          },
        };
        return [menuItem];
      } else {
        // Multiple groups.
        // Create one root items and nest groups under it.

        let rootItem = {
          id: 'add-word-root',
          title: 'Add word',
          parentId: null as string,
          contexts: ['selection'],
        };

        let groupItems = groups.map((group: Group) => {
          return {
            id: `add-word-${group.id}`,
            title: group.name,
            parentId: 'add-word-root' as string,
            contexts: ['selection'],
            onclick: (info: chrome.contextMenus.OnClickData) => {
              this.addWord(info.selectionText, group.id);
            },
          };
        });

        return [rootItem].concat(groupItems);
      }
    });
  }

  // TODO: use utility method to check for dupes
  async addWord(value: string, groupId: number): Promise<void> {
    let dao = this.dao;
    dao.getDictionary().then(async (dictionary: Array<DictionaryEntry>) => {
      let isDupe: boolean =
        dictionary.filter(function (entry) {
          return entry.value === value;
        }).length > 0;
      if (!isDupe) {
        await dao.addEntry(value, '', false, groupId);
        WHLogger.log(
          'Word ' +
            value +
            ' has been added to the dictionary through the context menu'
        );
      }
    });
  }
}
