import React, {useState, useEffect} from 'react';
import WindowUtils from "../../lib/WindowUtils";
import IOSFileDialog from "./iosFileDialog/IOSFileDialog";
import DefaultFileDialog from "./defaultFileDialog/DefaultFileDialog";
import { Button } from 'primereact/button';
import "./FileDialogButton.css";

export interface IFileDialogProps {
    loading: boolean;
    onSelectFile(file: File|null): void;
}


export default function FileDialogButton(props: IFileDialogProps) {
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => setLoading(props.loading), [props.loading]);

    if(loading)
    return <Button loading />


    if(WindowUtils.isIOSMobile()){
        return <IOSFileDialog onSelectFile={props.onSelectFile} />
    }

    return (<DefaultFileDialog onSelect={props.onSelectFile}/>);
}
