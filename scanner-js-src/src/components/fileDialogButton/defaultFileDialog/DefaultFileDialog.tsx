import React from 'react';
import { Button } from 'primereact/button';
import FileUtils from "../../../lib/FileUtils";

export interface IDefaultFileDialogProps {
    onSelect(file: File|null): void;
}


export default function DefaultFileDialog(props: IDefaultFileDialogProps) {

    function onClick(){
        FileUtils.selectFile().then(props.onSelect)
    }


    return (<Button icon="pi pi-upload" iconPos={"top"} onClick={onClick} autoFocus />);
}