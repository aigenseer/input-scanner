/**
 * Coded By : aigenseer
 * Copyright 2020, https://github.com/aigenseer
 */
declare global {
    interface Window { qrscannerredirect: any; }
}

export default class Properties {

    private static data: any = {}
    
    public static getDefaultSettings(){
        return {
            dialogTitle: 'Input-Scanner',
            msgSuccessTitle: 'Success',
            msgSuccessBody: 'Code found.',
            msgFailedTitle: 'Failed to scan',
            msgFailedBody: 'No Code found.',
            noPermissionTitle: 'You have no Permission',
            noPermissionBody: 'Your browser has no rights to the camera.',
        }
    }

    public static init(props: any = {}){
        Properties.data = Object.assign({}, Properties.getDefaultSettings(), props);

    }

    public static getDialogTitle(): string
    {
        return Properties.data.dialogTitle;
    }

    public static getMsgSuccessTitle(): string
    {
        return Properties.data.msgSuccessTitle;
    }

    public static getMsgSuccessBody(): string
    {
        return Properties.data.msgSuccessBody;
    }

    public static getMsgFailedTitle(): string
    {
        return Properties.data.msgFailedTitle;
    }

    public static getMsgFailedBody(): string
    {
        return Properties.data.msgFailedBody;
    }

    public static getNoPermissionTitle(): string
    {
        return Properties.data.noPermissionTitle;
    }

    public static getNoPermissionBody(): string
    {
        return Properties.data.noPermissionBody;
    }



}