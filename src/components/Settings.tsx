import { FormRow, FormSwitch } from 'enmity/components';
import { SettingsStore } from 'enmity/api/settings';
import { React } from 'enmity/metro/common';

interface SettingsProps {
    settings: SettingsStore;
}

export default ({ settings }: SettingsProps) => {
    return (
        <>
            <FormRow
                label='Collapse on selecting DMs'
                trailing={
                    <FormSwitch
                        value={settings.get('collapseOnDM', false)}
                        onValueChange={() => settings.toggle('collapseOnDM', false)}
                    />
                }
            />
        </>
    );
};