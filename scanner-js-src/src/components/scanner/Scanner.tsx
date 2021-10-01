/**
 * Coded By : aigenseer
 * Copyright 2019, https://github.com/aigenseer
 */
import React, { useEffect, useRef, useImperativeHandle }    from 'react';
import Quagga from 'quagga';
import "./Scanner.css";
import {BrowserQRCodeReader} from '@zxing/browser';
import FileUtils from "../../lib/FileUtils";


interface IScannerProps{
    deviceId: string;
    onFetchCode(code: string): any;
}
export type IScannerHandle = {
    close: () => void,
}


export class Scanner
{
    public static readers = ["ean_reader", "upc_reader"]
    public static isStarted = false;
    public static browserQRCodeReader = new BrowserQRCodeReader();
    public static currentConfig: any = {};

    public static stop()
    {
        if(Scanner.isStarted){
            Scanner.isStarted = false;
            Quagga.stop();
        }
    }

    public static start(config: any = null, cb?: Function)
    {
        if(config !== null){
            Scanner.currentConfig = config;
        }
        if(!Scanner.isStarted){
            Scanner.isStarted = true;
            Quagga.init(Scanner.currentConfig, (err: any) => {
                if (err) {
                    console.log(err, "error msg");
                }
                Quagga.start();
                if(cb !== undefined) cb();
                return () => {
                    Scanner.stop();
                }
            });
        }
    }

    public static onDetected(callback: Function)
    {
        Quagga.onDetected((result: any) => {
            if(result !== undefined && Scanner.isStarted){
                callback(result.codeResult.code)
            }
        });
    }

    public static scanBarcodeFromFile(file: File): Promise<string|null>
    {
        return new Promise((resolve: Function, reject: Function) => {
            Scanner.stop();
            try {
                Quagga.decodeSingle({
                    inputStream: {
                        size: 800,
                        singleChannel: false
                    },
                    locator: {
                        patchSize: "medium",
                        halfSample: true
                    },
                    decoder: {
                        readers: Scanner.readers
                    },
                    locate: true,
                    src: URL.createObjectURL(file)
                }, function(result: any){
                    if(result !== undefined && result.codeResult) {
                        resolve(result.codeResult.code);
                    } else {
                        resolve(null);
                    }
                    setTimeout(() => Scanner.start(), 250);
                });
            }catch (e){
                console.log(e)
                resolve(null);
            }
        });
    }

    public static scanQRCodeFromFile(file: File): Promise<string|null>
    {
        return new Promise((resolve: Function, reject: Function) => {
            FileUtils.readImageFromFile(file).then(image => {
                const browserQRCodeReader = new BrowserQRCodeReader();
                browserQRCodeReader.decodeFromImageElement(image).then(result => {
                    if(result !== undefined && result !== null){
                        resolve(result.getText());
                    }else resolve(null);
                }).catch(e => reject(e));
            }).catch(e => reject(e));
        });
    }

    public static scanCodeFromFile(file: File): Promise<string|null>
    {
        return new Promise(async (resolve: Function, reject: Function) => {
            try {
                let result = await Scanner.scanBarcodeFromFile(file);
                if(result === null){
                    result = await Scanner.scanQRCodeFromFile(file);
                }
                resolve(result);
            }catch (err){
                resolve(null);
            }
        });
    }

}



const JSXScanner: React.ForwardRefRenderFunction<IScannerHandle, IScannerProps> = (
    props,
    forwardedRef
) => {
    const ref = useRef<HTMLDivElement>(null);

    useImperativeHandle(forwardedRef, ()=>({
        close() {
            Scanner.stop();
        }
    }));

    function decodeQRCode(){
        if(ref.current !== null){
            Array.from(ref.current.getElementsByTagName("video")).forEach(
                function(element, index, array) {
                    Scanner.browserQRCodeReader.decodeFromVideoElement(element, result => {
                        if (result !== undefined && Scanner.isStarted) {
                            detected(result.getText());
                        }
                    })
                }
            );
        }
    }


    useEffect(() => {
        if(ref.current !== null){
            Scanner.stop();
            Scanner.start(
                {
                    inputStream: {
                        type: "LiveStream",
                        target: ref.current,
                        constraints: {
                            deviceId: { exact: props.deviceId }
                        }
                    },
                    locator: {
                        patchSize: "medium",
                        halfSample: true
                    },
                    numOfWorkers: 2,
                    frequency: 10,
                    decoder: {
                        readers: Scanner.readers
                    },
                    locate: true
                },
                () => {
                    decodeQRCode();
                }
            );

            //detecting boxes on stream
            Quagga.onProcessed((result: any) => {
                if(!Scanner.isStarted){
                    return;
                }
                let drawingCtx = Quagga.canvas.ctx.overlay,
                    drawingCanvas = Quagga.canvas.dom.overlay;

                if (result) {
                    if (result.boxes) {
                        drawingCtx.clearRect(
                            0,
                            0,
                            Number(drawingCanvas.getAttribute("width")),
                            Number(drawingCanvas.getAttribute("height"))
                        );
                        result.boxes
                            .filter(function(box: any) {
                                return box !== result.box;
                            })
                            .forEach(function(box: any) {
                                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                                    color: "green",
                                    lineWidth: 2
                                });
                            });
                    }

                    if (result.box) {
                        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
                            color: "#00F",
                            lineWidth: 2
                        });
                    }

                    if (result.codeResult && result.codeResult.code) {
                        Quagga.ImageDebug.drawPath(
                            result.line,
                            { x: "x", y: "y" },
                            drawingCtx,
                            { color: "red", lineWidth: 3 }
                        );
                    }
                }
            });

            Scanner.onDetected((result: any) => {
                detected(result);
            });
        }
    });

    function detected(code: any){
        Scanner.stop();
        props.onFetchCode(code);
    }


    return (
        <div id={"scannerRoot"} ref={ref} />
    );
}

export default React.forwardRef(JSXScanner);