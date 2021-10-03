/// <reference types="react-scripts" />
import React                from 'react';
import ReactDOM             from 'react-dom';
import App, {IAppHandle}    from './components/app/App';
import Properties from "./lib/Properties";


declare global {
    interface Window {
        InputScanner:any;
    }
}

class InputScanner
{
    static appRef: IAppHandle|null = null;

    public static initInstance(props: any = {}){
        InputScanner.addEventListenerByQuerySelector([".input-scanner-open"]);
        InputScanner.addInputLabelByQuerySelector([".input-scanner-open-label"]);
        if(InputScanner.appRef === null){
            Properties.init(props);
            let div = document.createElement("div");
            document.getElementsByTagName("body")[0].append(div)
            InputScanner.render(div);
        }
    }

    public static addEventListenerByQuerySelector(classes: string[])
    {
        for (const c of classes) {
            [...document.querySelectorAll(c) as any].forEach((elm) => {
                elm.addEventListener("click", () => InputScanner.start(elm));
            });
        }
    }

    public static addInputLabelByQuerySelector(classes: string[])
    {
        for (const c of classes) {
            [...document.querySelectorAll(c) as any].forEach((elm) => {
                let wrapper = document.createElement("div");
                wrapper.className = "p-inputgroup";
                let parentElement = elm.parentElement;
                let span = document.createElement("span");
                span.className = "p-button p-component p-inputgroup-addon p-button-icon p-c pi pi-camera"
                span.addEventListener("click", () => InputScanner.start(elm));
                wrapper.append(elm);
                wrapper.append(span);
                parentElement?.append(wrapper);
            });
        }
    }

    public static start(elm: HTMLInputElement){
        if(InputScanner.appRef){
            InputScanner.appRef.start((code: string) => {
                console.log(code)
                elm.value = code;
            });
        }
    }

    private static render(rootElement: HTMLElement){
        ReactDOM.render(
            <React.StrictMode>
                <App ref={e => InputScanner.appRef = e} />
            </React.StrictMode>, rootElement
        );
    }
}

window.InputScanner = InputScanner

