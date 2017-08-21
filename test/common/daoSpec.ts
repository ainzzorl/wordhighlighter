///<reference path="../../node_modules/@types/jasmine/index.d.ts" />
///<reference path="../../src/lib/dom/domTraversal.ts" />

describe('DAO', function() {
    let dao: DAO;
    let store: any = {};

    beforeEach(function() {
        dao = new DAO(<chrome.storage.StorageArea> store);
        stubStore();
    });

    describe('dictionary', function() {
        it('creates, reads and updates the dictionary', () => {
            dao.init();
            dao.addEntry('value1', 'description1', true, () => {});
            let received = false;
            let dictionary: Array<DictionaryEntry>;
            dao.getDictionary((_dictionary: Array<DictionaryEntry>) => {
                dictionary = _dictionary;
                received = true;
                expect(dictionary.length).toEqual(1);
                expect(dictionary[0].value).toEqual('value1');
                expect(dictionary[0].description).toEqual('description1');
                expect(dictionary[0].strictMatch).toEqual(true);
                expect(dictionary[0].createdAt).not.toBeNull();
                expect(dictionary[0].updatedAt).not.toBeNull();
                expect(dictionary[0].id).not.toBeNull();
            });
            if (!received) {
                fail('Did not receive the dictionary');
            }
            dictionary.push(new DictionaryEntry(null, 'value2', 'description2', null, null, false));
            received = false;
            dao.saveDictionary(dictionary, () => {
                received = true;
            });
            dao.getDictionary((_dictionary: Array<DictionaryEntry>) => {
                dictionary = _dictionary;
                received = true;
                expect(dictionary.length).toEqual(2);
                expect(dictionary[1].value).toEqual('value2');
                expect(dictionary[1].description).toEqual('description2');
                expect(dictionary[1].strictMatch).toEqual(false);
                expect(dictionary[1].id).not.toBeNull();
            });
            if (!received) {
                fail('Did not receive the dictionary');
            }
        });
    });

    describe('settings', function() {
        it('creates, reads and updates settings', () => {
            dao.init();
            let received = false;
            dao.getSettings((settings: Settings) => {
                received = true;
                expect(settings).not.toBeNull();
                expect(settings).toEqual(Settings.DEFAULT);
            });
            if (!received) {
                fail('Did not receive the settings');
            }
            received = false;
            let settings: Settings = new Settings();
            settings.enableHighlighting = false;
            settings.enablePageStats = false;
            settings.timeout = 123;
            dao.saveSettings(settings, () => {});
            dao.getSettings((receivedSettings: Settings) => {
                received = true;
                expect(receivedSettings).toEqual(settings);
            });
            if (!received) {
                fail('Did not receive the dictionary');
            }
        });
    });

    // Stub the store.
    // Emulates chrome's local store.
    function stubStore() {
        let data = {};
        store.get = (keys: any, callback: (items: { [key: string]: any }) => void): void => {
            let result = {};
            if (Array.isArray(keys)) {
                keys.forEach((key: string) => {
                    result[key] = data[key];
                });
            } else {
                result[keys] = data[keys];
            }
            callback(result);
        };
        store.set = (items: Object, callback?: () => void): void => {
            Object.keys(items).forEach((key: string) => {
                data[key] = items[key];
            });
        };
    }
});
