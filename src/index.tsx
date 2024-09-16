/* Created by Hauntii under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
// @ts-nocheck

import manifest from '../manifest.json';

import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { bulk, filters } from 'enmity/metro';

import Settings from './components/Settings';
import { Dispatcher, React } from 'enmity/metro/common';
import { getBoolean } from 'enmity/api/settings';

const [
   FolderUtils,
   UserSettingsProtoStore
] = bulk(
   filters.byProps("isFolderExpanded"),
   filters.byProps("settings", "_dispatchToken")
);

let collapseFolderEvent = ({ folderId: thisId }) => {
   if (!FolderUtils.isFolderExpanded(thisId)) return;
   UserSettingsProtoStore.settings.guildFolders.folders.filter(f => f.id && FolderUtils.isFolderExpanded(Number(f.id.value))).forEach((folder) => {
      if (Number(folder.id.value) == thisId) return;
      Dispatcher.dispatch({ type: 'TOGGLE_GUILD_FOLDER_EXPAND', folderId: Number(folder.id.value) });
   });
};

let channelSelectEvent = ({ guildId: thisId }) => {
   if (getBoolean('FolderCollapse', 'collapseOnDM', false)) {
      if (thisId === null) {
         UserSettingsProtoStore.settings.guildFolders.folders.filter(f => f.id && FolderUtils.isFolderExpanded(Number(f.id.value))).forEach((folder) => {
            Dispatcher.dispatch({ type: 'TOGGLE_GUILD_FOLDER_EXPAND', folderId: Number(folder.id.value) });
         });
      }
   }
};

const FolderCollapse: Plugin = {
   ...manifest,

   onStart() {
      Dispatcher.subscribe('TOGGLE_GUILD_FOLDER_EXPAND', collapseFolderEvent);
      Dispatcher.subscribe('CHANNEL_SELECT', channelSelectEvent);
   },

   onStop() {
      Dispatcher.unsubscribe('TOGGLE_GUILD_FOLDER_EXPAND', collapseFolderEvent);
      Dispatcher.unsubscribe('CHANNEL_SELECT', channelSelectEvent);
   },

   getSettingsPanel({ settings }) {
      return <Settings settings={settings} />;
   }
};

registerPlugin(FolderCollapse);