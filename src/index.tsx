/* Created by Hauntii under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
import manifest from '../manifest.json';

import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { bulk, filters } from 'enmity/metro';

import Settings from './components/Settings';
import { React } from 'enmity/metro/common';
import { getBoolean } from 'enmity/api/settings';

const [
   FolderUtils,
   UserSettingsProtoStore,
   FluxDispatcher
] = bulk(
   filters.byProps("isFolderExpanded"),
   filters.byProps("settings", "_dispatchToken"),
   filters.byProps(
      "_currentDispatchActionType",
      "_subscriptions",
      "_waitQueue"
   )
);

let collapseFolderEvent = ({ folderId: thisId }) => {
   if (!FolderUtils.isFolderExpanded(thisId)) return;
   UserSettingsProtoStore.settings.guildFolders.folders.filter(f => f.id && FolderUtils.isFolderExpanded(Number(f.id.value))).forEach((folder) => {
      if (Number(folder.id.value) == thisId) return;
      FluxDispatcher.dispatch({ type: 'TOGGLE_GUILD_FOLDER_EXPAND', folderId: Number(folder.id.value) });
   });
};

let channelSelectEvent = ({ guildId: thisId }) => {
   if (getBoolean('FolderCollapse', 'collapseOnDM', false)) {
      if (thisId === null) {
         UserSettingsProtoStore.settings.guildFolders.folders.filter(f => f.id && FolderUtils.isFolderExpanded(Number(f.id.value))).forEach((folder) => {
            FluxDispatcher.dispatch({ type: 'TOGGLE_GUILD_FOLDER_EXPAND', folderId: Number(folder.id.value) });
         });
      }
   }
};

const FolderCollapse: Plugin = {
   ...manifest,

   onStart() {
      FluxDispatcher.subscribe('TOGGLE_GUILD_FOLDER_EXPAND', collapseFolderEvent);
      FluxDispatcher.subscribe('CHANNEL_SELECT', channelSelectEvent);
   },

   onStop() {
      FluxDispatcher.unsubscribe('TOGGLE_GUILD_FOLDER_EXPAND', collapseFolderEvent);
      FluxDispatcher.unsubscribe('CHANNEL_SELECT', channelSelectEvent);
   },

   getSettingsPanel({ settings }) {
      return <Settings settings={settings} />;
   }
};

registerPlugin(FolderCollapse);