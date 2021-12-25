import React, { useRef, useState, useImperativeHandle } from "react";
import Scanner , {IScannerHandle, Scanner as ScannerUtils} from "../scanner/Scanner";
import "./App.css"

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import FileDialogButton from "../fileDialogButton/FileDialogButton";
import MediaDevicesUtils, {IMediaDevices} from "../../lib/MediaDevicesUtils";
import {Dropdown, DropdownChangeParams} from 'primereact/dropdown';
import SettingsStorage from "../../lib/SettingsStorage";
import Properties from "../../lib/Properties";


export interface IAppProps{

}

export type IAppHandle = {
    start: (callback: Function) => void,
}

let callback: Function|null = null;

const App: React.ForwardRefRenderFunction<IAppHandle, IAppProps> = (
    props,
    forwardedRef
) => {
    const [open, setOpen] = useState<boolean>(false);
    const [devices, setDevices] = useState<IMediaDevices[]>([]);
    const [deviceId, setDeviceId] = useState<string|null>(null);
    const [scanFileLoading, setScanFileLoading] = useState<boolean>(false);
    const scannerRef =  useRef<IScannerHandle>(null)
    const toast = useRef<Toast>(null);


    useImperativeHandle(forwardedRef, ()=>({
        start(cb: Function) {
            MediaDevicesUtils.getPermission().then(granted => {
                if(granted){
                    MediaDevicesUtils.getVideoMediaDevices().then(devices => {
                        setDeviceId(SettingsStorage.getValueOrDefault("selected-device", devices[0].id));
                        setDevices(devices);
                        setOpen(true);
                        if(scannerRef.current !== null){
                            scannerRef.current.start();
                        }
                    });
                    callback = cb;
                }else{
                    noPermission();
                }
            });
        }
    }));

    function noPermission(){
        if(toast.current !== null){
            toast.current.clear();
            toast.current.show({severity:'error', summary: Properties.getNoPermissionTitle(), detail: Properties.getNoPermissionBody(), life: 6000});
        }
    }

    function onFetchCode(code: string){
        if(toast.current !== null){
            toast.current.clear();
            toast.current.show({severity:'success', summary: Properties.getMsgSuccessTitle(), detail: Properties.getMsgSuccessBody(), life: 3000});
        }
        if(callback !== null && code.length > 0){
            onHide();
            callback(code);
            callback = null;
        }
    }

    const onHide = () => {
        if(scannerRef.current !== null){
            scannerRef.current.close();
        }
        setDeviceId(null);
        setOpen(false);
    }

    function onSelectFile(file: File|null) {
        if(file !== null){
            setScanFileLoading(true);
            setTimeout(() => ScannerUtils.scanCodeFromFile(file).then(code => {
                setScanFileLoading(false);
                if(code === null){
                    if(toast.current !== null) toast.current.show({severity:'error', summary: Properties.getMsgFailedTitle(), detail: Properties.getMsgFailedBody(), life: 3000});
                }else{
                    onFetchCode(code)
                }
            }).catch(err => {
                console.warn(err);
            }), 500);
        }
    }

    function onSelectDevice(e: DropdownChangeParams){
        SettingsStorage.set("selected-device", e.value);
        setDeviceId(e.value);
        setTimeout(() =>{
            if(scannerRef.current !== null){
                scannerRef.current.change();
            }
        }, 1000);
    }

    function renderFooter(){
        return (
            <span className="p-buttonset scanner-dialog-footer">
                <FileDialogButton loading={scanFileLoading} onSelectFile={onSelectFile}  />
                <Dropdown value={deviceId} options={devices} onChange={onSelectDevice} optionValue="id" optionLabel="label" />
            </span>
        );
    }

    return <div className={"wp-input-scanner-root"} >
                <Toast ref={toast} />
                <Dialog header={Properties.getDialogTitle()} visible={open} style={{ width: '50vw' }} maximized={true} maximizable footer={renderFooter} onHide={onHide}>
                    <Scanner ref={scannerRef} deviceId={deviceId} onFetchCode={onFetchCode} />
                </Dialog>
            </div>
}

export default React.forwardRef(App);

