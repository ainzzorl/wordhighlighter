## v1.7.1 (2021-08-22)

*  Update changelog [View](https://github.com/ainzzorl/wordhighlighter/commit/a24f05172b3f375881fb83223b94c8e50ad38680)
*  Fix minor typo and magic number in DAO [View](https://github.com/ainzzorl/wordhighlighter/commit/02cfeeebc1e8e43b9515abab7725558314a3a573)
*  Add missing type references [View](https://github.com/ainzzorl/wordhighlighter/commit/93ab0d0546c796b4e8f94c6ce51fe4beda1266da)
*  Fix spelling of 'Portuguese' [View](https://github.com/ainzzorl/wordhighlighter/commit/5aa17f32a94ac5d54993a159397960302f78f0a9)
*  Fix typo in 'tooltips' [View](https://github.com/ainzzorl/wordhighlighter/commit/9b793f7fbc58670b00c3bbb7b14d7bb9cc05c927)
*  Support blocking websites, globally or per group #86 [View](https://github.com/ainzzorl/wordhighlighter/commit/2320e4a47192d7eb807c8ad80c93af39cc64d24b)
*  Bring back tokenizer spec [View](https://github.com/ainzzorl/wordhighlighter/commit/ddbfa94a4710c72487eb8786331c432ba45e2cc1)
*  Support more diacritics #112 [View](https://github.com/ainzzorl/wordhighlighter/commit/9b9e253a6397f9187420f2522c4fe108c7a4fa41)
*  Add a description to manifest.json [View](https://github.com/ainzzorl/wordhighlighter/commit/1ccee4199486710fdcbf2d24eee16fa6b3a44101)
*  Fix allow/deny list width #86 [View](https://github.com/ainzzorl/wordhighlighter/commit/8f1eb6fcafee24a3c92ec99e91b0867e9712eec6)
*  Bump manifest version [View](https://github.com/ainzzorl/wordhighlighter/commit/14ac5019bba4dee20806073c04725d2ee358a4db)


## v1.7.0 (2021-08-11)

*  Update changelog [View](https://github.com/ainzzorl/wordhighlighter/commit/1e785c37ed1e94e31327e9a2a77288c9e58ea068)
*  Add UI and persistence for enabling/disabling smart matching per group and picking smart matching language; doesn't actually do anything yet #70 [View](https://github.com/ainzzorl/wordhighlighter/commit/f710b6acd86b15136031d6149b0fd7acd63a4d0c)
*  Apply smart matching settings #70 [View](https://github.com/ainzzorl/wordhighlighter/commit/34cf1c095d611bc2f980e88c5f6068f7a980d111)
*  Prettify "Words" tab a little: bigger "Add" button, no colons, well #47 [View](https://github.com/ainzzorl/wordhighlighter/commit/9986d003bf13432b7d0d45f01bcbfe0a2d885a7f)
*  Refactor objects to maps where possible #105 [View](https://github.com/ainzzorl/wordhighlighter/commit/09e7391f3234e666a1faf4ab488f1b1b134f17d8)
*  Extract caching stems into CachingStemmer #77 [View](https://github.com/ainzzorl/wordhighlighter/commit/cc8e50d5428aecb9934cd9b93bca4b012187be6f)
*  Switch MatchFinder.stemmers from object to map [View](https://github.com/ainzzorl/wordhighlighter/commit/701d93bdd3d600352c051c851169a27dfa8a3012)
*  Change default build target to watch-fast-build [View](https://github.com/ainzzorl/wordhighlighter/commit/104f885926bec594d224df8c7759e3fa71fd38ca)
*  Prettify Import/Export tab a little: remove colons, fix margins, better headers, label for format #48 [View](https://github.com/ainzzorl/wordhighlighter/commit/dae5005d27914f88b355a47759ae1430ccab56a8)
*  Remove colons from group forms [View](https://github.com/ainzzorl/wordhighlighter/commit/678ad09a0731de7c73b38411786a555fa49bd944)
*  'Settings' tab: remove colons, update wording #49 [View](https://github.com/ainzzorl/wordhighlighter/commit/5d08a0f5eff6098ad02c4a349b71be532609cde5)
*  Replace PhantomJS with Headless Chrome #71 [View](https://github.com/ainzzorl/wordhighlighter/commit/a3e63c9cff3063e6c276f1e06e5ed192ad0f211d)
*  Add setting for showing tooltip - doesn't do anything yet #84 [View](https://github.com/ainzzorl/wordhighlighter/commit/16bd330c6e8304507b426f61f4ac2b4bd97a0f03)
*  Respect Settings.showTooltip #84 [View](https://github.com/ainzzorl/wordhighlighter/commit/2dcd7e2d5e6ea11d7014e4c9c5eab66f558c4a44)
*  Fix styling in highlightGenerator.ts [View](https://github.com/ainzzorl/wordhighlighter/commit/699f0d82cc60db86f78543273bd032691e93f75c)
*  Fix broken stats display on StackOverflow #107 [View](https://github.com/ainzzorl/wordhighlighter/commit/30a098346b6847c99d61614e51d90a1ae6847eb0)
*  Make matching type and enum and use radio buttons to select it #106 [View](https://github.com/ainzzorl/wordhighlighter/commit/d7473be3c1f584efb4a0f3caea79cb0432e1f242)
*  Extract tokenizer to a separate file and support tokenizing Chinese and Japanese #75 [View](https://github.com/ainzzorl/wordhighlighter/commit/f11880cba7b02f3eb6a1683ba49e35a17bd0bf42)
*  Fix matching type selectors [View](https://github.com/ainzzorl/wordhighlighter/commit/5e8458d6cc999a7172fccfa9d7ba964fa657a628)
*  Fix languages in the selector [View](https://github.com/ainzzorl/wordhighlighter/commit/14e64d5c81d4e235c9b2e5e11e8d7aa73bb58be2)
*  Add Chinese, Japanese and Other to matching languages; support languages without stemmers [View](https://github.com/ainzzorl/wordhighlighter/commit/32c1beb642300b7a794bb6466c203498ad7247cb)
*  Don't disable language selector if matching is not SMART [View](https://github.com/ainzzorl/wordhighlighter/commit/7728bea86f6a1546fd051e9bdd1b8d8c970ece35)
*  Rename smartMatchingLanguage to matchingLanguage [View](https://github.com/ainzzorl/wordhighlighter/commit/1505c8e75bd37868ba1baf0804ca20b876569322)
*  Add the icon in more dimensions #85 [View](https://github.com/ainzzorl/wordhighlighter/commit/ec7b81a60eeb66e16a0c0032cc4c1c71e9abe01a)
*  Fix Spanish in the wrong place in the list [View](https://github.com/ainzzorl/wordhighlighter/commit/b7ef3237ab3354776c60be1ad76cae780a382f1a)
*  Make tooltip css selector a bit more specific [View](https://github.com/ainzzorl/wordhighlighter/commit/e3a42f0fe61fd776809849e9182070d8378ed63d)
*  Initialize website [View](https://github.com/ainzzorl/wordhighlighter/commit/00672fdccbe860e028084b22b5f309ea391433c6)
*  Move website to 'docs' [View](https://github.com/ainzzorl/wordhighlighter/commit/9f60587742538f57143b0c3a28cbf3c9cc7c12f4)
*  Move index.markdown to index.md [View](https://github.com/ainzzorl/wordhighlighter/commit/1ccbcbb9b069459365e05b3269da1d4e96397b1e)
*  Update website gems to work with GitHub pages [View](https://github.com/ainzzorl/wordhighlighter/commit/1d3a5180e57c58b5d7e42d9ea1cd7fa504f56da3)
*  Update website dependencies [View](https://github.com/ainzzorl/wordhighlighter/commit/980311dc245506e2de2b8181320ff7fd0b091690)
*  Configure url and baseurl for the website #100 [View](https://github.com/ainzzorl/wordhighlighter/commit/950fbf95c27ca626cabf4d2bebbdf625e4dd3625)
*  Add a paragraph about smart matching to README #98 [View](https://github.com/ainzzorl/wordhighlighter/commit/a8070484daa94685ca1117eb966e389c20e2878d)
*  Bump manifest version [View](https://github.com/ainzzorl/wordhighlighter/commit/a4d33328f75f2be798340edb0c512994c4582e99)


## v1.6.1 (2021-07-17)

*  Update CHANGELOG [View](https://github.com/ainzzorl/wordhighlighter/commit/fd8074fcd0e5c1b7eb8484b03d855da8e6da8d8d)
*  Fix export failing if the dictionary is too big #90 [View](https://github.com/ainzzorl/wordhighlighter/commit/05de9e789d3dbf799d24fe01d891a44405d4f04e)
*  Reduce line height in the stats tip a little [View](https://github.com/ainzzorl/wordhighlighter/commit/6e86ba31973a384f975561f8b20e39574520b48d)
*  Bump manifest version [View](https://github.com/ainzzorl/wordhighlighter/commit/8ed988e75a17b96a233ee6394c75f890063e03c0)


## v1.6.0 (2021-07-16)

*  Update changelog [View](https://github.com/ainzzorl/wordhighlighter/commit/4c830be20e56504273fdfe85ac4e4c92adcab8d1)
*  Remove workaround for the scroll bug - it's no longer needed #6 [View](https://github.com/ainzzorl/wordhighlighter/commit/8f71ed27b677398177c3e4a0e2ea8cd5b193b910)
*  Auto-save settings #78 [View](https://github.com/ainzzorl/wordhighlighter/commit/b8bbc660861c23936c80ba3dd87e0df1a8f69df4)
*  Remove pointless "optional" word from "Use strict match" label [View](https://github.com/ainzzorl/wordhighlighter/commit/749f9b6967744f9cb0dcb3aa70eb05c2d31dfda6)
*  Support multiple word groups #81 [View](https://github.com/ainzzorl/wordhighlighter/commit/5234295ffa35719b7bb6363c9f979790ac683547)
*  Highlight words on dynamically added nodes #11 #88 [View](https://github.com/ainzzorl/wordhighlighter/commit/4ae9714a6e101c7b62928162ecaf54b4d8bbdb43)
*  Initialize the default group's background color with the legacy setting; rename Settings.backgroundColor to legacyBackgroundColor [View](https://github.com/ainzzorl/wordhighlighter/commit/2eb6171775cc4ae1bf8759832ba1504533db536b)
*  Add backwards compatibility tests #80 [View](https://github.com/ainzzorl/wordhighlighter/commit/5526c05669df641e817bf7faed18a71552d4145a)
*  Increase z-index for page stats [View](https://github.com/ainzzorl/wordhighlighter/commit/915e5ceaf6fbfd3d99398a0b4a884a89c28220d0)
*  Achieve more consistent view of the stats highlight across pages [View](https://github.com/ainzzorl/wordhighlighter/commit/cf38b85ee993d46a97715c02a3e1462e83beed36)
*  Achieve more consistent view of tooltips [View](https://github.com/ainzzorl/wordhighlighter/commit/4df66c8e36ee788eeb8ba3c36d8d81ed41e0411a)
*  Prettify the Settings tab a little #49 [View](https://github.com/ainzzorl/wordhighlighter/commit/19c020d0b9668a75ac5eb000f8e2ea853f96513e)
*  Fix margins in the main dialog [View](https://github.com/ainzzorl/wordhighlighter/commit/c9fc1bd0b8a7cb850a558c3fd77d5c15a3062043)
*  Fix tab id in words-tab #92 [View](https://github.com/ainzzorl/wordhighlighter/commit/2fe345a3c79a399a2a9f952ac70e39e6bb5bc3cb)
*  Bump manifest version [View](https://github.com/ainzzorl/wordhighlighter/commit/189a890200d862e02df6d05c3c4ebd4a774baa97)


## v1.5.4 (2021-06-06)

*  Update README [View](https://github.com/ainzzorl/wordhighlighter/commit/0acc374c6cf5226ca5dbfb5e1b6ae0a4ab85283e)
*  Update the page about testing [View](https://github.com/ainzzorl/wordhighlighter/commit/3f348fb9babc7d08090913d14714892f4937504b)
*  Create codeql-analysis.yml [View](https://github.com/ainzzorl/wordhighlighter/commit/c1f1f4c921b2c0c677638d607e080aed55f4208d)
*  Add changelog [View](https://github.com/ainzzorl/wordhighlighter/commit/897231aeacf37774a8c8f0e0c0667a39662de34a)
*  Add diacritical character range [View](https://github.com/ainzzorl/wordhighlighter/commit/7f99742546a6afa6120984e47aa37ee4001430f6)
*  Bump manifest version [View](https://github.com/ainzzorl/wordhighlighter/commit/3997f56c311ce93fe8b2d990b269a59aee489f51)


## v1.5.3 (2021-05-25)

*  When there are multiple possible matches starting from a word, pick the longest #68 [View](https://github.com/ainzzorl/wordhighlighter/commit/e925bc439311706bb0fd39dbba53c8fde58d5440)
*  Bump manifest version [View](https://github.com/ainzzorl/wordhighlighter/commit/35c69e2f892b24152a2ea92499a7ecd30b0ed2a4)


## v1.5.2 (2021-05-24)

*  Fix broken tooltip margin [View](https://github.com/ainzzorl/wordhighlighter/commit/5f254569c77448dfc4f44512d50d4af91ffacdde)
*  Bump manifest version [View](https://github.com/ainzzorl/wordhighlighter/commit/02dd2c55f31913de2233449e85b540513f7874ad)


## v1.5.1 (2021-05-24)

*  Fix broken export due to unicode strings [View](https://github.com/ainzzorl/wordhighlighter/commit/b0b554dcc1ff959b1f84dc10647c5926c4780594)
*  Remove placeholder from export file name [View](https://github.com/ainzzorl/wordhighlighter/commit/eabba00fc0ed0c8affa8fc0b438dc486efcfab1f)
*  Bump manifest version [View](https://github.com/ainzzorl/wordhighlighter/commit/3f271955b7843bd5b07cc9adfaab3a75c27883a8)


## v1.5.0 (2021-05-24)

*  Upgrade gulp, TypeScript and natural [View](https://github.com/ainzzorl/wordhighlighter/commit/b28cc9d10fe8f4a8fa8c30d3204340a93a932f44)
*  Upgrade node version in .travis.yml [View](https://github.com/ainzzorl/wordhighlighter/commit/99c1d7b627b148a0e4504e16a75446ad73ad47bb)
*  Upgrade Angular [View](https://github.com/ainzzorl/wordhighlighter/commit/a8a4d8adaa4f372020351049ccaae1cb47578757)
*  Upgrade bootstrap [View](https://github.com/ainzzorl/wordhighlighter/commit/678408a1f600bca6af45ec05d9e0b52e0f16b7ad)
*  Replace tslint with eslint [View](https://github.com/ainzzorl/wordhighlighter/commit/f712480fd65570e6a9c48602144b58b0ac710349)
*  Configure prettier [View](https://github.com/ainzzorl/wordhighlighter/commit/16c3a4a0c7764c8649b529e40a28c746f4585fdf)
*  Run eslint on more files, but disable no-unused-vars [View](https://github.com/ainzzorl/wordhighlighter/commit/441f6e2c004dc975c4b1d3d0d94257355111f6bc)
*  Lint gulpfile, js and more ts [View](https://github.com/ainzzorl/wordhighlighter/commit/28045829f2cc22c7c4bc151631e2986e2f51a312)
*  Upgrade a couple of gulp helpers [View](https://github.com/ainzzorl/wordhighlighter/commit/214bcecfd7ff9070571207dc40084f45d81baac7)
*  Upgrade test dependencies [View](https://github.com/ainzzorl/wordhighlighter/commit/5ddeffbb8aeca1b0030b9997c21e47eca41ca644)
*  Remove dependency on run-sequence [View](https://github.com/ainzzorl/wordhighlighter/commit/60908498c7d508a56044a22beeea08666fd23d4d)
*  Remove dependency on wordnet-db [View](https://github.com/ainzzorl/wordhighlighter/commit/658e1a60410d764dfad2112dac80fb31f7303f05)
*  Remove zip file from the root [View](https://github.com/ainzzorl/wordhighlighter/commit/cc2b5f88d5dd074ebf06a99a02fe80f4fc13bb64)
*  Support multi-word phrases [View](https://github.com/ainzzorl/wordhighlighter/commit/347c96b0dd9378a4c3984d912a29d91415d4825e)
*  Add github workflow to build the app [View](https://github.com/ainzzorl/wordhighlighter/commit/e7caa71c580acb1784f0aa74ed53f757455be3b7)
*  Add explicit dependency on @babel/core [View](https://github.com/ainzzorl/wordhighlighter/commit/99fe3f2737f5509e00c9fc329f645e30746f54d3)
*  Remove travis config - redundant after configuring github actions [View](https://github.com/ainzzorl/wordhighlighter/commit/3da3b526d06f201662de6979c84deb603bf12768)
*  Upgrade browserify [View](https://github.com/ainzzorl/wordhighlighter/commit/2883310c3dc049f384bf8f982a9f130bcce90d29)
*  Revert "Upgrade browserify" [View](https://github.com/ainzzorl/wordhighlighter/commit/c57e9502dc3261aa1f0547c9b76ab00f39520164)
*  Upgrade browserify to 12.0.2 [View](https://github.com/ainzzorl/wordhighlighter/commit/9b95d0029d194e758905ae4887eea50d91f69edb)
*  Allow configuring background color [View](https://github.com/ainzzorl/wordhighlighter/commit/abe88ece188f66550b0466cf27eb714069e93387)
*  Add watch-fast-build task [View](https://github.com/ainzzorl/wordhighlighter/commit/b3bccd1978cb67b353cc848a5a5cb498772b8a89)
*  Format HTML [View](https://github.com/ainzzorl/wordhighlighter/commit/c618747d18abfd7ec7b96dc0c38b5f4640468c44)
*  Add export functionality; expact import to support json and csv [View](https://github.com/ainzzorl/wordhighlighter/commit/538822898248653bc643399272fb3afaf905e7bf)
*  Ignore ", to" suffix [View](https://github.com/ainzzorl/wordhighlighter/commit/916d545f041c235fcb0ef34cbe34d3fa2c2a9748)
*  Cleanup package.json [View](https://github.com/ainzzorl/wordhighlighter/commit/aa457b251e290f5137989e1de30d1aa861669c41)
*  Migrate DAO.getDictionary to promises [View](https://github.com/ainzzorl/wordhighlighter/commit/ce502fcbbae3d6125420090860ddcbd7b131dd50)
*  Migrate remaining DAO methods to promises [View](https://github.com/ainzzorl/wordhighlighter/commit/cc5c290a851b6bd5bc027064d3f8a6e27578d5ae)
*  Test backgroundColor in settingsControllerSpec [View](https://github.com/ainzzorl/wordhighlighter/commit/5faa499a2a2c3bff99fe2450e2f364323308c1f3)
*  Reset irrelevant properties in .highlighted-word-tooltip [View](https://github.com/ainzzorl/wordhighlighter/commit/e823c39216c9510c1d81f1229ae21e6363f3c814)
*  Set higher z-index for the popup [View](https://github.com/ainzzorl/wordhighlighter/commit/25357dddfd5f9a9d526880489b9d1943c8b3aaa6)
*  Set padding in the tooltip [View](https://github.com/ainzzorl/wordhighlighter/commit/dc6c9d3fbb58ca61f55d51e5402894442eca19c8)
*  Make color 'important' in .highlighted-word-tooltip css [View](https://github.com/ainzzorl/wordhighlighter/commit/e8c35a87090c6e57a9e55b23ace86e86cc6691e5)
*  Configure margin the tooltip [View](https://github.com/ainzzorl/wordhighlighter/commit/d8f0247de2a255727c038724e4e2f679a9ae07f2)
*  Bump manifest version [View](https://github.com/ainzzorl/wordhighlighter/commit/20ed50ebc4b0435e955eb592480433e2159622bb)


## v1.4.3 (2018-02-17)

*  Upgrade angular to 1.6.9 [View](https://github.com/ainzzorl/wordhighlighter/commit/67f7f31f895e05540efa0b6570a043f2b904504d)
*  Bump manifest version [View](https://github.com/ainzzorl/wordhighlighter/commit/cd13ac08512a219f6f1f075f33c88afc39adb5b4)


## v1.4.2 (2018-02-17)

*  Allow words shorter than 3 [View](https://github.com/ainzzorl/wordhighlighter/commit/f370af61e67ec6e037dd30bbf1075b7e02efac61)
*  Support Chinese, Japanese and Russian [View](https://github.com/ainzzorl/wordhighlighter/commit/e0c0e2577956bbad1834ce927a363dfdfc31974e)
*  Bump manifest version [View](https://github.com/ainzzorl/wordhighlighter/commit/f5dc1f5029f99f65ca32a3540c978c8dccf5aa08)


## v1.4.1 (2017-12-07)

*  Fix scrolling in chrome by removing height and max-height [View](https://github.com/ainzzorl/wordhighlighter/commit/81ca0d7b7d981bfd80b92005df529cd63485d2df)
*  Bump manifest version [View](https://github.com/ainzzorl/wordhighlighter/commit/df9c55d9b127842a79167481ee6bb4a8b3e48a4f)


## v1.4.0 (2017-12-06)

*  Fix gap between paragraphs in the popup by setting padding [View](https://github.com/ainzzorl/wordhighlighter/commit/0f8246620d39a3a28efc43842e4efd78893b340b)
*  Fix "Strict" checkbox by adding setter to strictMatch [View](https://github.com/ainzzorl/wordhighlighter/commit/f7dd5ee5affe657460afd3b8cf5568bd16ca1d45)
*  Collect highlighting log and add simplest "History" tab [View](https://github.com/ainzzorl/wordhighlighter/commit/be683ae16c333a6f77c53cdaae749483646b49dd)
*  Implement History tab [View](https://github.com/ainzzorl/wordhighlighter/commit/294cfd8a518bc36df5cab433bab8671b2b42188f)
*  Optimize gulpfile.js to not run the same tasks twice [View](https://github.com/ainzzorl/wordhighlighter/commit/b6cc4f75ae0fd440a799642f0225db6918f85796)
*  Don't build indexes if highlighting is disabled [View](https://github.com/ainzzorl/wordhighlighter/commit/751be58e50798887005b51963fd3e311ee6020ce)
*  Limit the number of entries in highlighting log [View](https://github.com/ainzzorl/wordhighlighter/commit/0e0f4295738a98605eb7338a81b23636d573c916)
*  Add margin to history tab [View](https://github.com/ainzzorl/wordhighlighter/commit/7c766f940e5be4db8fbe4897d3eaa1c1d864f2c8)
*  Remove unnecessary TODOs [View](https://github.com/ainzzorl/wordhighlighter/commit/ee61757f29faa4aef135eec083b46c1842add0b0)
*  Release memory consumed by the matcher [View](https://github.com/ainzzorl/wordhighlighter/commit/927dfb45bbc2c28c6cfc61841ea689254edee839)
*  Minor test cleanup [View](https://github.com/ainzzorl/wordhighlighter/commit/3c9fff973a3b1faa52754cf8d6a1290663474968)
*  Simplify tests by adding default values for dates in DictionaryEntry [View](https://github.com/ainzzorl/wordhighlighter/commit/a27737967f5ebd400e4032f8c83a68ad6c33790c)
*  Update README: remove comparison to Vocabulary Highlighter, add links to downloads, describe a sample use case [View](https://github.com/ainzzorl/wordhighlighter/commit/ead51d950b2835b421f98de455d71059a33b5790)
*  Fix tests broken by relying on date not changing within one test [View](https://github.com/ainzzorl/wordhighlighter/commit/3a6c2072cb902c41a08f78df2dd8a15231b74220)
*  Use bootstrap form-control in Settings tab [View](https://github.com/ainzzorl/wordhighlighter/commit/cae6176486e258e0556b9d62364cc72a8a1cd4a8)
*  Bump manifest version (1.4.0) [View](https://github.com/ainzzorl/wordhighlighter/commit/72e9198d4c4a32b405837804480b91191ca726a3)


## v1.3.1 (2017-08-27)

*  Upgrade angular to 1.6.6 [View](https://github.com/ainzzorl/wordhighlighter/commit/1d6ba0a3829ffd8fa3575c8d683ee092491e208e)
*  Bump manifest version [View](https://github.com/ainzzorl/wordhighlighter/commit/1265de86431005eae633785286e2dd5a3f3af76e)


## v1.3.0 (2017-08-27)

*  Replace public fields in DictionaryEntry with private with getters and setters [View](https://github.com/ainzzorl/wordhighlighter/commit/fef6851ff56b5fc567d95399a5ad3ce97c1c9744)
*  Unit test the dao [View](https://github.com/ainzzorl/wordhighlighter/commit/81516009ec9124e4d7ba260edbf3505bf335eee3)
*  Move "spec" to "test" so that is shows up below the main source [View](https://github.com/ainzzorl/wordhighlighter/commit/0cc349ea06adab4e2d1a2861cdbc766a5a8e0c24)
*  Extract default settings [View](https://github.com/ainzzorl/wordhighlighter/commit/87fd18455b58d0f28ff93504d5487847460b7925)
*  Cleanup the dao and its spec [View](https://github.com/ainzzorl/wordhighlighter/commit/d3adb3f8bb3b1112f9587709fdb1e7252b2a0d3c)
*  Remove an outdated commit from DictionaryEntry [View](https://github.com/ainzzorl/wordhighlighter/commit/7265c34260293cba6199f3513cc0a32eb0489a0c)
*  Cleanup DOM code [View](https://github.com/ainzzorl/wordhighlighter/commit/fc5e5acbaff2ee7713796d875fb7a42943649c7c)
*  Simplify match finding [View](https://github.com/ainzzorl/wordhighlighter/commit/e895176d5a31623f3f7a60aa163d30f8a1e32382)
*  Remove extra quote from page stats [View](https://github.com/ainzzorl/wordhighlighter/commit/0da9b2773b2e80a24ffa30e878ee160ea736010e)
*  Turn off scrolling hack in Chrome [View](https://github.com/ainzzorl/wordhighlighter/commit/b446413d91ff5673d739f2fb848dfbd1c3fca061)
*  Stop including unused boostrap js [View](https://github.com/ainzzorl/wordhighlighter/commit/74349fdb3e9a8e9250fa11b00a19465088b6a093)
*  Set border: none for page stats links [View](https://github.com/ainzzorl/wordhighlighter/commit/8d69f1f3f5d90605a103970716e2b6e163225919)
*  Use properties instead of getters and setters in pageStats [View](https://github.com/ainzzorl/wordhighlighter/commit/8caa8e5e076197221000d42a59ae8f46790e8c01)
*  Support words with digits [View](https://github.com/ainzzorl/wordhighlighter/commit/43620a7e5f7b8ac986db50bfc633a5cd8ca219ab)
*  Specify page stats font color [View](https://github.com/ainzzorl/wordhighlighter/commit/2d4c9dffb62235dbbbb168df4edafc15d3fff504)
*  Move page stats listeners from inline to content (Chrome blocks inline) [View](https://github.com/ainzzorl/wordhighlighter/commit/0849d1acfc44b1bdd506cf401d982df8de4ead9b)
*  Fix chrome view by setting height and max-height [View](https://github.com/ainzzorl/wordhighlighter/commit/fc94af149ff20986a398c2f3734b640f2be5603e)
*  Use "Strict" instead of "Strict Match" as a column name so it fits in one line in Chrome [View](https://github.com/ainzzorl/wordhighlighter/commit/b539ba0ffcf8316950c0744b0b1fa19ce50ac311)
*  Bump manifest version [View](https://github.com/ainzzorl/wordhighlighter/commit/4c0a97ce8a1a6994a4d7c34ec9953cf1b8622c6f)


## v1.2.0 (2017-05-14)

*  WIP [View](https://github.com/ainzzorl/wordhighlighter/commit/1092cd638312b8160edc270fa40252a34779d998)
*  Use sync storage by default [View](https://github.com/ainzzorl/wordhighlighter/commit/2057cb27710c153238f87d336a935671f537dfbd)
*  Specify page stats' link color [View](https://github.com/ainzzorl/wordhighlighter/commit/43879c678bc3523f67b02a8923cf48ae998739bd)
*  Unset link decorations in page stats [View](https://github.com/ainzzorl/wordhighlighter/commit/846fc989548874b9c747fbc8a216fe123a8ae8c9)
*  Specify page stats border width [View](https://github.com/ainzzorl/wordhighlighter/commit/a5083799ddcc57b5bbc1c45f4ab0432c506801e5)
*  Revert "Use sync storage by default" [View](https://github.com/ainzzorl/wordhighlighter/commit/5193bb13934fa4c4ccfc2afdd077fc1f52c7f270)
*  Revert "WIP" [View](https://github.com/ainzzorl/wordhighlighter/commit/416e4ac518984454ac0da0fe09fea10ff19cef84)
*  Reset font variant in the popup and in the page stats [View](https://github.com/ainzzorl/wordhighlighter/commit/519a04513cad7f22d875b035dd7575269bd5d25d)
*  Left-align page stats [View](https://github.com/ainzzorl/wordhighlighter/commit/2b41e977f92a41c8bdab7f9391bb7fd5226a5701)
*  Separate out main dialog spec [View](https://github.com/ainzzorl/wordhighlighter/commit/c1bfd9973de9a8d9c2b606622361cb9ea2316218)
*  Make dup detection in importController case-insensitive [View](https://github.com/ainzzorl/wordhighlighter/commit/b4a03d56f98f71e085ca4c7cf725c06b72b210be)
*  Show import confirmation as a warning [View](https://github.com/ainzzorl/wordhighlighter/commit/ea62342bb9b2c358883e826e8002a6ff5743af15)
*  Rephrase texts in the Import tab [View](https://github.com/ainzzorl/wordhighlighter/commit/12776d1ff3b01b0d39432f4091d2172131c386b3)
*  Shorten input box for timeouts [View](https://github.com/ainzzorl/wordhighlighter/commit/c60835e5b39146398a876cc2041e017190f75283)
*  Indicate setting saving by showing progress spinner [View](https://github.com/ainzzorl/wordhighlighter/commit/1a181e8e1bf8b42b6ae3688daea336a0c5025051)
*  Cleanup comments [View](https://github.com/ainzzorl/wordhighlighter/commit/5757e6e64b57a7659f0c4a2a7d94f6d4720a760b)
*  Make the left part of the settings tab bigger [View](https://github.com/ainzzorl/wordhighlighter/commit/970748cacbe0d4b25dd0c861f97afc7701f8582e)
*  Bump manifest version [View](https://github.com/ainzzorl/wordhighlighter/commit/5e46bb41379acc9fef91607c548453e584765014)


## v1.1.2 (2017-04-16)

*  Add missing curly brackets to app id [View](https://github.com/ainzzorl/wordhighlighter/commit/dfe72ca70ed57c1de716cce06fedce9bf4ab9709)
*  Bump manifest version [View](https://github.com/ainzzorl/wordhighlighter/commit/c54a960e8e6915f81b2ca997f1e5ab34b7da6666)


## v1.1.1 (2017-04-16)

*  Use the existing app id [View](https://github.com/ainzzorl/wordhighlighter/commit/8ae2eba68f0814cea2635e70a90eafcc1ae720a1)
*  Bump manifest version [View](https://github.com/ainzzorl/wordhighlighter/commit/8d02aab7c01ec067f55c4e32c33063fb3ffb0429)


## v1.1.0 (2017-04-16)

*  Add manual test plan [View](https://github.com/ainzzorl/wordhighlighter/commit/d4358617922f6e312e73bf858afbc9c7590e9193)
*  Improve some comments [View](https://github.com/ainzzorl/wordhighlighter/commit/da8ca2376b6d6d6797018d83f6fb69617b064dd4)
*  Move page stats line-height to a more specific location [View](https://github.com/ainzzorl/wordhighlighter/commit/47960ae9cc5bea9e9a6043acce13a0776f281952)
*  Bump manifest version [View](https://github.com/ainzzorl/wordhighlighter/commit/1c54b0bbd772ba920faf6ffdd326eb6b90c6355e)


## v1.0.2 (2017-04-07)

*  Reset margin-top as well as margin-bottom in page stats [View](https://github.com/ainzzorl/wordhighlighter/commit/bf60f0d3ffbb60f6b73a6db91a36a586beee3a41)
*  Turn aggregate counts on the stats info to links and make only them clickable [View](https://github.com/ainzzorl/wordhighlighter/commit/482743db5793b95b67ac91de081c38a0a904749e)
*  Hide page stats if screen width is less than 600px [View](https://github.com/ainzzorl/wordhighlighter/commit/5d8c82314f9ff2fdabb9e97df51062d9af801e56)
*  Bump manifest version [View](https://github.com/ainzzorl/wordhighlighter/commit/19b3b020a0df4caeb7c9769b8f6682a25d09109b)


## v1.0.1 (2017-04-05)

*  Check for dupes when adding words through the context menu [View](https://github.com/ainzzorl/wordhighlighter/commit/88cd9d7d559708d5dd2299f2b93fe6ca426ac59a)
*  Externalize tslint rules [View](https://github.com/ainzzorl/wordhighlighter/commit/b5070c43257b8622c0d04c0d9f6ef1541660c17e)
*  Add "align" rules to tslint config [View](https://github.com/ainzzorl/wordhighlighter/commit/91336cecb60434c6f747e4b3d70bff266ab8cf42)
*  Add "eofline" rules to tslint config [View](https://github.com/ainzzorl/wordhighlighter/commit/56913b0d4e0e669ccfc5fca54bcff2a49b763541)
*  Add "forin" rules to tslint config [View](https://github.com/ainzzorl/wordhighlighter/commit/2dad5443058d82f9f5c1fcca38eac356543f0f67)
*  Add "label-position" rules to tslint config [View](https://github.com/ainzzorl/wordhighlighter/commit/0ef99ed2694a01b66ad8d34aadd1da46b3dd38b5)
*  Add "max-line-length", "member-ordering" and "no-arg" rules to tslint config [View](https://github.com/ainzzorl/wordhighlighter/commit/2a27e80813f808a33b91050480e1e5a2c3b3243a)
*  Add a few more tslint rules [View](https://github.com/ainzzorl/wordhighlighter/commit/9cbe4fa029cecabeda94659d88363065c328d466)
*  Avoid inadvertent line breaks by making display=inline-block important [View](https://github.com/ainzzorl/wordhighlighter/commit/b3c2ca592ba03072dde652ebfaa63de63a7dbd9d)
*  Try showing the tooltip on top if parent's overflow=hidden [View](https://github.com/ainzzorl/wordhighlighter/commit/64afcf257f10151db29a349f13f20c5f0712678f)
*  Use default line-height in tooltips [View](https://github.com/ainzzorl/wordhighlighter/commit/7f7bb7e98912d9096db424220fe7878d4d335d56)
*  Use default font family in the tooltip [View](https://github.com/ainzzorl/wordhighlighter/commit/34595a4b7e3a1d6ae69f930e7809ddad0b977ced)
*  Extract text matching into a separate directory (not used yet) [View](https://github.com/ainzzorl/wordhighlighter/commit/36051db3efaa2c089f2c78e5d9e7c5704a731eb1)
*  Extract highlight generation into HighlightGenerator (not used yet) [View](https://github.com/ainzzorl/wordhighlighter/commit/0bf0707af5f3fdd88c6cd63fcd2d8434217a588a)
*  Extract highlight generation into a class (not used yet) [View](https://github.com/ainzzorl/wordhighlighter/commit/d94b965220cb6df80455e0e01bb2a47c556dbf10)
*  Extract text node traversal into a class (not used yet) [View](https://github.com/ainzzorl/wordhighlighter/commit/492219f62d14b4585784ecf1c02b3474f8dabd53)
*  Refactor Content to use the new classes [View](https://github.com/ainzzorl/wordhighlighter/commit/41721207b9acb28ba0a1ca41837b9fc47ce2da34)
*  Delete textNodeHandler: it is no longer used [View](https://github.com/ainzzorl/wordhighlighter/commit/56c6f8e6ccab27ef4674266646134b6ad82af59d)
*  Fix traversal going to wrong nodes [View](https://github.com/ainzzorl/wordhighlighter/commit/5e39bfa3944cb86335dc8c33a35c093cd23ca34f)
*  Add comments to DomTraversal and HighlightGenerator [View](https://github.com/ainzzorl/wordhighlighter/commit/32cc07af81e5ba514abda5614af59b8c269f45bc)
*  Rewrite content spec using fixtures [View](https://github.com/ainzzorl/wordhighlighter/commit/57ef3893d98dd28c6ebc121714f96cfaa99a2931)
*  Cleanup Content: make startTime private, add reference to settings [View](https://github.com/ainzzorl/wordhighlighter/commit/6b0831c9baca3ce3a75144501842f4b4e95c1e2a)
*  Add comments to HighlightInjector [View](https://github.com/ainzzorl/wordhighlighter/commit/aea4fa48a6004e5be274634e8b6b88a444f80d7b)
*  Make Content.isTimeout private [View](https://github.com/ainzzorl/wordhighlighter/commit/ef041a88e92561310c09cc5ead877e6d23cb3283)
*  Move several classes to "common" package [View](https://github.com/ainzzorl/wordhighlighter/commit/bdb09e338910879524e0f409a8a370f5ce05437b)
*  Implement PageStats [View](https://github.com/ainzzorl/wordhighlighter/commit/766967d00266079ea67a7aa5636872d50c827d18)
*  Show page stats infor in the right bottom corner of the page (nothing in it yet) [View](https://github.com/ainzzorl/wordhighlighter/commit/7cae9bcb9dfd910623d9a1f45e25ba814832423e)
*  Show number of matches and number of unique matching words in the stats info [View](https://github.com/ainzzorl/wordhighlighter/commit/9ad54772bcf895a44a589db2fdddf34a5f7b05d4)
*  Add border and background to page stats [View](https://github.com/ainzzorl/wordhighlighter/commit/b116e3406972ecdec937ad860df5e0485b5bf286)
*  Show word match details in the page stats [View](https://github.com/ainzzorl/wordhighlighter/commit/d97a8eb655c406c8dd29dd4b90ad50c3a8a12c2b)
*  Hide per-word details until aggregated stats is clicked [View](https://github.com/ainzzorl/wordhighlighter/commit/34612a3aa74dd2c9a88e56a20c30d720dbced13a)
*  Add a "close" button to the page stats [View](https://github.com/ainzzorl/wordhighlighter/commit/d4ee9aace7027f9bfbf9dcc1970f5949795a75b9)
*  Add a checkbox controlling page load stats display [View](https://github.com/ainzzorl/wordhighlighter/commit/925e8c04055fb7bbcce888ec30da2b043a9e69d9)
*  Hide page stats if nothing's highlighted [View](https://github.com/ainzzorl/wordhighlighter/commit/638b3c8d9e264721bdeec20f2d0d3585ed56bbe4)
*  Prettify page stats aggregates [View](https://github.com/ainzzorl/wordhighlighter/commit/d62196fe5315094871e94199f8d650f4f5c0fc43)
*  Fix page stats showing wrong number [View](https://github.com/ainzzorl/wordhighlighter/commit/64088f2f5686f0e0aaf1fb628179cd5b59048d65)
*  Add application id to the manifest [View](https://github.com/ainzzorl/wordhighlighter/commit/2de67bfbfabef7c95658b734af50627a38648d6b)
*  Layout page stats details [View](https://github.com/ainzzorl/wordhighlighter/commit/c762bc23fb7cad9a1cf0d8e8bfa3efe70eca362a)
*  Add a tip to the page stats [View](https://github.com/ainzzorl/wordhighlighter/commit/99394d998096320e3f76e9e2335bff7ad991bd67)
*  Bump manifest version [View](https://github.com/ainzzorl/wordhighlighter/commit/363929d020dc883dd1303ee2b72b8b685a4d4308)


